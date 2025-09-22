import { createWalletClient, custom, createPublicClient, http } from "viem"
import { avalancheFuji } from "viem/chains"

export function createViemWalletClient(provider: any) {
  return createWalletClient({
    chain: avalancheFuji,
    transport: custom(provider),
  })
}

export const publicClient = createPublicClient({
  chain: avalancheFuji,
  transport: http(),
})
