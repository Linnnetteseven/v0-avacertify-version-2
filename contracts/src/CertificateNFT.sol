// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";
import "openzeppelin-contracts/contracts/utils/introspection/ERC165.sol";

contract CertificateNFT is ERC721, ERC721URIStorage, Ownable {
    // token supply counter
    uint256 private _tokenIds;

    struct Certificate {
        address recipient;
        address issuer;
        string certificateData;
        uint256 timestamp;
    }

    // storage
    mapping(uint256 => Certificate) private certificates;
    mapping(address => bool) public authorizedIssuers;
    mapping(uint256 => bool) private _existsMap;

    // events (match frontend ABI expectations)
    event CertificateIssued(
        address indexed recipient,
        address indexed issuer,
        uint256 indexed tokenId,
        string certificateData,
        uint256 timestamp
    );

    event BatchCertificatesIssued(
        address indexed issuer,
        uint256 count,
        uint256 timestamp
    );

    constructor() ERC721("AvaCertify", "CERT") Ownable(msg.sender) {
        authorizedIssuers[msg.sender] = true;
    }

    // admin
    function addAuthorizedIssuer(address issuer) external onlyOwner {
        require(issuer != address(0), "Invalid issuer address");
        authorizedIssuers[issuer] = true;
    }

    function removeAuthorizedIssuer(address issuer) external onlyOwner {
        authorizedIssuers[issuer] = false;
    }

    // core mint (ABI-compatible signature)
    function mintCertificate(
        address recipient,
        string memory tokenURI_,
        string memory certificateData
    ) external returns (uint256) {
        require(authorizedIssuers[msg.sender], "Not authorized");
        require(recipient != address(0), "Invalid recipient");

        unchecked { _tokenIds += 1; }
        uint256 tokenId = _tokenIds;

        certificates[tokenId] = Certificate({
            recipient: recipient,
            issuer: msg.sender,
            certificateData: certificateData,
            timestamp: block.timestamp
        });

        _safeMint(recipient, tokenId);
        // store per-token URI for compatibility
        _setTokenURI(tokenId, tokenURI_);

        _existsMap[tokenId] = true;

        emit CertificateIssued(recipient, msg.sender, tokenId, certificateData, block.timestamp);
        return tokenId;
    }

    function batchMintCertificates(
        address[] memory recipients,
        string[] memory tokenURIs,
        string[] memory certificateDataArray
    ) external returns (uint256[] memory tokenIds) {
        require(authorizedIssuers[msg.sender], "Not authorized");
        require(
            recipients.length == tokenURIs.length &&
            recipients.length == certificateDataArray.length,
            "Array length mismatch"
        );

        uint256 len = recipients.length;
        tokenIds = new uint256[](len);

        for (uint256 i = 0; i < len; i++) {
            require(recipients[i] != address(0), "Invalid recipient");

            unchecked { _tokenIds += 1; }
            uint256 tokenId = _tokenIds;
            tokenIds[i] = tokenId;

            certificates[tokenId] = Certificate({
                recipient: recipients[i],
                issuer: msg.sender,
                certificateData: certificateDataArray[i],
                timestamp: block.timestamp
            });

            _safeMint(recipients[i], tokenId);
            _setTokenURI(tokenId, tokenURIs[i]);

            _existsMap[tokenId] = true;

            emit CertificateIssued(recipients[i], msg.sender, tokenId, certificateDataArray[i], block.timestamp);
        }

        emit BatchCertificatesIssued(msg.sender, len, block.timestamp);
    }

    // views (ABI-compatible)
    function getCertificate(uint256 tokenId) external view returns (
        address recipient,
        address issuer,
        string memory tokenURIString,
        string memory certificateData,
        uint256 timestamp
    ) {
        require(_existsMap[tokenId], "Certificate does not exist");
        Certificate memory cert = certificates[tokenId];
        return (
            cert.recipient,
            cert.issuer,
            tokenURI(tokenId),
            cert.certificateData,
            cert.timestamp
        );
    }

    function verifyCertificate(uint256 tokenId) external view returns (bool) {
        return _existsMap[tokenId];
    }

    function isAuthorizedIssuer(address issuer) external view returns (bool) {
        return authorizedIssuers[issuer];
    }

    function totalSupply() external view returns (uint256) {
        return _tokenIds;
    }

    // overrides required by Solidity (ERC721 + URIStorage)
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return ERC721URIStorage.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721)
        returns (address)
    {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to == address(0)) {
            // This is a burn operation
            if (_existsMap[tokenId]) {
                _existsMap[tokenId] = false;
            }
        }
        return super._update(to, tokenId, auth);
    }
}
