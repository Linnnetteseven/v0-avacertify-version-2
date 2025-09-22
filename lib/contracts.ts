export const CERTIFICATE_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890" // Replace with actual deployed contract address

export const CERTIFICATE_ABI = [
  {
    inputs: [
      { name: "recipient", type: "address" },
      { name: "tokenURI", type: "string" },
      { name: "certificateData", type: "string" },
    ],
    name: "mintCertificate",
    outputs: [{ name: "tokenId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "recipients", type: "address[]" },
      { name: "tokenURIs", type: "string[]" },
      { name: "certificateDataArray", type: "string[]" },
    ],
    name: "batchMintCertificates",
    outputs: [{ name: "tokenIds", type: "uint256[]" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "getCertificate",
    outputs: [
      { name: "recipient", type: "address" },
      { name: "issuer", type: "address" },
      { name: "tokenURI", type: "string" },
      { name: "certificateData", type: "string" },
      { name: "timestamp", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "verifyCertificate",
    outputs: [{ name: "isValid", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ name: "owner", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ name: "uri", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "supply", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "issuer", type: "address" }],
    name: "isAuthorizedIssuer",
    outputs: [{ name: "authorized", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: true, name: "tokenId", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "recipient", type: "address" },
      { indexed: true, name: "issuer", type: "address" },
      { indexed: true, name: "tokenId", type: "uint256" },
      { indexed: false, name: "certificateData", type: "string" },
      { indexed: false, name: "timestamp", type: "uint256" },
    ],
    name: "CertificateIssued",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "issuer", type: "address" },
      { indexed: false, name: "count", type: "uint256" },
      { indexed: false, name: "timestamp", type: "uint256" },
    ],
    name: "BatchCertificatesIssued",
    type: "event",
  },
] as const
