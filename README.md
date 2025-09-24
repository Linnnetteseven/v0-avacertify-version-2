# 🎓 AvaCertify - Blockchain Certificate Management Platform

> **Secure, tamper-proof digital certificates on Base Sepolia testnet**

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/mugwanjalk-gmailcoms-projects/v0-avacertify-version-2)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/Wa86yiI2BRl)
[![Base Sepolia](https://img.shields.io/badge/Network-Base%20Sepolia-blue?style=for-the-badge)](https://sepolia.basescan.org/address/0x76783BbfCdD7d72224eFb5Cbd44822b8827384ba)

## 🌟 Overview

AvaCertify is a modern Web3 application for creating, managing, and verifying digital certificates on the blockchain. Built with Next.js 15 and deployed on Base Sepolia testnet, it provides a secure, transparent, and tamper-proof solution for digital credential management.

### ✨ Key Features

- 🎯 **Certificate Minting**: Create single or batch certificates as NFTs
- 🔍 **Instant Verification**: Verify certificates by Token ID
- 👤 **User Dashboard**: Manage certificates and profile
- 🔐 **Wallet Authentication**: Secure login with Privy
- 🌐 **Blockchain Storage**: Immutable certificate records
- 📱 **Responsive Design**: Modern UI with glassmorphism effects

## 🏗️ Architecture

### Frontend Stack
- **Framework**: Next.js 15.2.4 with TypeScript
- **UI Library**: Tailwind CSS + shadcn/ui + Radix UI
- **Authentication**: Privy (wallet-based)
- **Blockchain**: Viem + Base network
- **Package Manager**: pnpm

### Smart Contract
- **Contract**: `CertificateNFT.sol` (ERC-721 with URI storage)
- **Network**: Base Sepolia Testnet
- **Address**: [`0x76783BbfCdD7d72224eFb5Cbd44822b8827384ba`](https://sepolia.basescan.org/address/0x76783BbfCdD7d72224eFb5Cbd44822b8827384ba)
- **Framework**: Foundry + OpenZeppelin v5

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm
- MetaMask or compatible wallet
- Base Sepolia ETH ([Get testnet ETH](https://faucet.quicknode.com/base/sepolia))

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/v0-avacertify-version-2.git
cd v0-avacertify-version-2

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Environment Setup

Create a `.env.local` file:
```env
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
```

## 📱 Application Pages

### 🏠 Home (`/`)
- Landing page with feature overview
- Connect wallet functionality
- Platform introduction

### 📊 Dashboard (`/dashboard`)
- Certificate creation interface
- Single and batch minting options
- User certificate management
- *Requires wallet authentication*

### 🔍 Verify (`/verify`)
- Certificate verification by Token ID
- Public verification interface
- Certificate details display

### 👤 Profile (`/profile`)
- User profile management
- Wallet connection status
- Account settings

## 🔧 Smart Contract Details

### Contract Features
- **Authorized Issuers**: Role-based minting permissions
- **Batch Minting**: Efficient bulk certificate creation
- **Certificate Verification**: Public verification by Token ID
- **Immutable Storage**: Tamper-proof certificate data
- **Event Logging**: Complete audit trail

### Key Functions
```solidity
// Single certificate minting
function mintCertificate(address recipient, string tokenURI, string certificateData) 
    external returns (uint256)

// Batch certificate minting
function batchMintCertificates(address[] recipients, string[] tokenURIs, string[] certificateDataArray) 
    external returns (uint256[] memory)

// Certificate verification
function verifyCertificate(uint256 tokenId) 
    external view returns (bool)

// Get certificate details
function getCertificate(uint256 tokenId) 
    external view returns (address recipient, address issuer, string tokenURI, string certificateData, uint256 timestamp)
```

## 🛠️ Development

### Project Structure
```
├── app/                    # Next.js app directory
│   ├── dashboard/         # Certificate management
│   ├── verify/           # Certificate verification
│   └── profile/          # User profile
├── components/           # Reusable UI components
├── lib/                 # Utilities and configurations
│   ├── contracts.ts     # Contract ABI and address
│   └── privy-config.ts  # Privy configuration
├── contracts/           # Foundry smart contract project
│   ├── src/             # Solidity contracts
│   ├── script/          # Deployment scripts
│   └── README.md        # Contract documentation
└── public/              # Static assets
```

### Available Scripts
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Smart Contract Development
```bash
cd contracts

# Install dependencies
forge install

# Build contracts
forge build

# Deploy to Base Sepolia
forge script script/Deploy.s.sol --rpc-url https://sepolia.base.org --broadcast
```

## 🌐 Deployment

### Frontend Deployment
The application is automatically deployed to Vercel and synced with v0.app:
- **Live URL**: [Vercel Deployment](https://vercel.com/mugwanjalk-gmailcoms-projects/v0-avacertify-version-2)
- **v0.app Project**: [Continue Building](https://v0.app/chat/projects/Wa86yiI2BRl)

### Smart Contract Deployment
- **Network**: Base Sepolia Testnet
- **Contract Address**: `0x76783BbfCdD7d72224eFb5Cbd44822b8827384ba`
- **Explorer**: [View on BaseScan](https://sepolia.basescan.org/address/0x76783BbfCdD7d72224eFb5Cbd44822b8827384ba)

## 🔐 Security Features

- **Wallet-based Authentication**: Secure login with Privy
- **Role-based Access Control**: Authorized issuer system
- **Input Validation**: Comprehensive data validation
- **Immutable Records**: Blockchain-based certificate storage
- **Event Logging**: Complete audit trail on-chain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/contracts/README.md` for smart contract details
- **Issues**: Report bugs via GitHub Issues
- **Community**: Join our discussions

## 🙏 Acknowledgments

- Built with [v0.app](https://v0.app) for rapid development
- Powered by [Base](https://base.org) for fast, low-cost transactions
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Authentication by [Privy](https://privy.io)

---

**Made with ❤️ for the Web3 community**
