# AvaCertify Contracts (Foundry)

This folder contains a Foundry project for the AvaCertify smart contracts.

It provides:
- `src/CertificateNFT.sol` — ERC-721 contract implementing the ABI required by the frontend in `lib/contracts.ts`.
- `script/Deploy.s.sol` — Deployment script for Avalanche Fuji Testnet.
- `foundry.toml` — Project configuration and remappings.
- `ENV.sample` — Template for environment variables.

## Prerequisites

- Node.js (for the frontend)
- Foundry (for contracts)
- A wallet (Core or MetaMask) with Fuji test AVAX

Install Foundry:
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
forge --version
```

## Project Setup

From the repo root:
```bash
cd contracts
# Install OpenZeppelin contracts dependency
forge install OpenZeppelin/openzeppelin-contracts
```

Copy `ENV.sample` to `.env` and fill values:
```bash
cp ENV.sample .env
```

`.env` expected values:
```
PRIVATE_KEY=0xYOUR_PRIVATE_KEY              # Deployer private key (exported from Core/MetaMask)
FUJI_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
# Optional:
# SNOWTRACE_API_KEY=your_key               # For contract verification
```

> Tip: If the public Fuji RPC is unstable, try `https://rpc.ankr.com/avalanche_fuji`.

## Build

```bash
forge build
```

## Deploy to Avalanche Fuji (Testnet)

```bash
forge script script/Deploy.s.sol \
  --rpc-url $FUJI_RPC_URL \
  --broadcast \
  --legacy \
  -vvvv
```

- If you see a gas estimation warning, add a higher gas price:
```bash
forge script script/Deploy.s.sol \
  --rpc-url $FUJI_RPC_URL \
  --broadcast \
  --legacy \
  --with-gas-price 30gwei \
  -vvvv
```

The script logs the deployed address, e.g.:
```
CertificateNFT deployed at: 0xABC...123
```

## Update the Frontend

Edit `lib/contracts.ts` in the frontend:

1. Set the deployed address:
```ts
export const CERTIFICATE_CONTRACT_ADDRESS = "0xYourDeployedAddress";
```

2. Ensure the ABI matches the contract in `src/CertificateNFT.sol`. You can copy ABI from `contracts/out/CertificateNFT.sol/CertificateNFT.json` (the `abi` field) and paste into `lib/contracts.ts`:
```ts
export const CERTIFICATE_ABI = [ /* ...abi from build json... */ ] as const;
```

3. Start the frontend and test:
```bash
pnpm install
pnpm dev
```

- Use `/dashboard` to mint certificates
- Use `/verify` to verify by token ID

## Verifying on Snowtrace (Optional)

1. Get an API key from https://testnet.snowtrace.io/
2. Add to `.env`:
```
SNOWTRACE_API_KEY=your_key
```
3. Verify (adjust compiler version/args if you change constructor):
```bash
forge verify-contract \
  --chain 43113 \
  --watch \
  0xYourDeployedAddress \
  CertificateNFT \
  --etherscan-api-key $SNOWTRACE_API_KEY
```

If your constructor takes arguments, pass `--constructor-args` encoded with `cast abi-encode`.

## Using Core Wallet

- Export a deployer private key from Core to use with Foundry, or deploy via Core/Remix and only update the address/ABI in the frontend.
- If gas estimation fails when deploying via Core, increase gas limit (3–5M) and gas price (25–30 GWEI), and try again.

## Notes

- The contract is written against Solidity `0.8.20` and OpenZeppelin latest (v5) layout.
- `CertificateNFT.sol` implements the functions and events used by the frontend (`mintCertificate`, `batchMintCertificates`, `getCertificate`, `verifyCertificate`, `isAuthorizedIssuer`, `totalSupply`, and the required events).
