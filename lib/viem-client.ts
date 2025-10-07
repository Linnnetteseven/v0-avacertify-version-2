import { createWalletClient, custom, createPublicClient, http } from "viem"
import { avalancheFuji } from "viem/chains"

export function createViemWalletClient(provider: any) {
  try {
    if (!provider) {
      throw new Error("No provider available")
    }

    return createWalletClient({
      chain: avalancheFuji,
      transport: custom(provider),
    })
  } catch (error) {
    console.error("[v0] Error creating wallet client:", error)
    throw error
  }
}

export const publicClient = createPublicClient({
  chain: avalancheFuji,
  transport: http(),
})
