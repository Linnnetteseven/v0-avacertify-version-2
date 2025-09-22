"use client"

import { useState } from "react"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { createViemWalletClient, publicClient } from "@/lib/viem-client"
import { CERTIFICATE_CONTRACT_ADDRESS, CERTIFICATE_ABI } from "@/lib/contracts"
import { avalancheFuji } from "viem/chains"
import { decodeEventLog } from "viem"

interface CertificateData {
  recipientName: string
  recipientEmail: string
  recipientAddress: string
  certificateTitle: string
  description: string
  issueDate: Date | undefined
  expiryDate: Date | undefined
  certificateType: string
  skills: string[]
  grade: string
}

interface MintResult {
  success: boolean
  transactionHash?: string
  tokenId?: number
  error?: string
}

interface BatchMintResult {
  success: boolean
  results: MintResult[]
  successCount: number
  failureCount: number
  totalProcessed: number
}

export function useCertificateMinting() {
  const { ready, authenticated, user } = usePrivy()
  const { wallets } = useWallets()
  const [isMinting, setIsMinting] = useState(false)
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 })

  const createCertificateMetadata = (certificateData: CertificateData) => {
    const metadata = {
      name: certificateData.certificateTitle,
      description: certificateData.description,
      image: `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(certificateData.recipientName)}`,
      external_url: `${window.location.origin}/verify`,
      background_color: "ffffff",
      attributes: [
        {
          trait_type: "Recipient",
          value: certificateData.recipientName,
        },
        {
          trait_type: "Certificate Type",
          value: certificateData.certificateType,
        },
        {
          trait_type: "Issue Date",
          value: certificateData.issueDate?.toISOString().split("T")[0] || new Date().toISOString().split("T")[0],
        },
        {
          trait_type: "Issuer",
          value: user?.wallet?.address || "Unknown",
        },
        ...(certificateData.grade
          ? [
              {
                trait_type: "Grade",
                value: certificateData.grade,
              },
            ]
          : []),
        ...(certificateData.expiryDate
          ? [
              {
                trait_type: "Expiry Date",
                value: certificateData.expiryDate.toISOString().split("T")[0],
              },
            ]
          : []),
        ...certificateData.skills.map((skill, index) => ({
          trait_type: `Skill ${index + 1}`,
          value: skill,
        })),
      ],
      properties: {
        category: "Certificate",
        blockchain: "Avalanche",
        network: "Fuji Testnet",
        standard: "ERC721",
      },
    }

    return metadata
  }

  const extractTokenIdFromLogs = (logs: any[]): number | undefined => {
    try {
      for (const log of logs) {
        try {
          // Try to decode as Transfer event
          const decoded = decodeEventLog({
            abi: CERTIFICATE_ABI,
            data: log.data,
            topics: log.topics,
          })

          if (decoded.eventName === "Transfer" && decoded.args) {
            const tokenId = decoded.args.tokenId
            return typeof tokenId === "bigint" ? Number(tokenId) : tokenId
          }

          // Try to decode as CertificateIssued event
          if (decoded.eventName === "CertificateIssued" && decoded.args) {
            const tokenId = decoded.args.tokenId
            return typeof tokenId === "bigint" ? Number(tokenId) : tokenId
          }
        } catch (decodeError) {
          // Continue to next log if this one can't be decoded
          continue
        }
      }
    } catch (error) {
      console.warn("[v0] Error extracting token ID from logs:", error)
    }
    return undefined
  }

  const mintCertificate = async (certificateData: CertificateData): Promise<MintResult> => {
    if (!ready || !authenticated || !user) {
      return { success: false, error: "User not authenticated" }
    }

    const wallet = wallets.find((w) => w.walletClientType === "privy")
    if (!wallet) {
      return { success: false, error: "No wallet connected" }
    }

    try {
      // Switch to Avalanche Fuji if needed
      await wallet.switchChain(avalancheFuji.id)

      // Get the EIP1193 provider
      const provider = await wallet.getEthereumProvider()

      // Create Viem wallet client
      const walletClient = createViemWalletClient(provider)

      // Create metadata for the NFT
      const metadata = createCertificateMetadata(certificateData)

      // In a real implementation, you would upload this metadata to IPFS
      // For now, we'll create a data URI
      const metadataJson = JSON.stringify(metadata)
      const tokenURI = `data:application/json;base64,${btoa(metadataJson)}`

      // Prepare certificate data for the contract
      const certificateDataString = JSON.stringify({
        recipientName: certificateData.recipientName,
        recipientEmail: certificateData.recipientEmail,
        certificateTitle: certificateData.certificateTitle,
        description: certificateData.description,
        certificateType: certificateData.certificateType,
        issueDate: certificateData.issueDate?.toISOString(),
        expiryDate: certificateData.expiryDate?.toISOString(),
        skills: certificateData.skills,
        grade: certificateData.grade,
        issuer: user.wallet?.address,
        timestamp: new Date().toISOString(),
      })

      console.log("[v0] Minting certificate with data:", {
        recipient: certificateData.recipientAddress,
        tokenURI: tokenURI.substring(0, 100) + "...",
        certificateData: certificateDataString.substring(0, 100) + "...",
      })

      // Get the user's address
      const [address] = await walletClient.getAddresses()

      // Call the mint function on the contract
      const hash = await walletClient.writeContract({
        address: CERTIFICATE_CONTRACT_ADDRESS as `0x${string}`,
        abi: CERTIFICATE_ABI,
        functionName: "mintCertificate",
        args: [certificateData.recipientAddress as `0x${string}`, tokenURI, certificateDataString],
        account: address,
      })

      console.log("[v0] Transaction hash:", hash)

      // Wait for transaction confirmation
      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
        timeout: 60_000, // 60 second timeout
      })

      console.log("[v0] Transaction confirmed:", receipt)

      // Extract token ID from logs
      const tokenId = extractTokenIdFromLogs(receipt.logs)

      return {
        success: true,
        transactionHash: hash,
        tokenId,
      }
    } catch (error: any) {
      console.error("[v0] Minting error:", error)

      let errorMessage = "Failed to mint certificate"

      if (error.message?.includes("User rejected")) {
        errorMessage = "Transaction was rejected by user"
      } else if (error.message?.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for transaction"
      } else if (error.message?.includes("network")) {
        errorMessage = "Network error - please try again"
      } else if (error.message?.includes("timeout")) {
        errorMessage = "Transaction timeout - please check blockchain explorer"
      } else if (error.shortMessage) {
        errorMessage = error.shortMessage
      } else if (error.message) {
        errorMessage = error.message
      }

      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  const mintBatchCertificates = async (
    certificates: CertificateData[],
    onProgress?: (current: number, total: number) => void,
  ): Promise<BatchMintResult> => {
    if (!ready || !authenticated || !user) {
      return {
        success: false,
        results: [],
        successCount: 0,
        failureCount: certificates.length,
        totalProcessed: 0,
      }
    }

    setIsMinting(true)
    setBatchProgress({ current: 0, total: certificates.length })

    const results: MintResult[] = []
    let successCount = 0
    let failureCount = 0

    try {
      // Process certificates with controlled concurrency (max 3 at a time)
      const batchSize = 3
      const batches = []

      for (let i = 0; i < certificates.length; i += batchSize) {
        batches.push(certificates.slice(i, i + batchSize))
      }

      for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const batch = batches[batchIndex]

        // Process batch concurrently
        const batchPromises = batch.map(async (cert, index) => {
          const globalIndex = batchIndex * batchSize + index

          try {
            const result = await mintCertificate(cert)

            // Update progress
            setBatchProgress({ current: globalIndex + 1, total: certificates.length })
            onProgress?.(globalIndex + 1, certificates.length)

            if (result.success) {
              successCount++
            } else {
              failureCount++
            }

            return result
          } catch (error: any) {
            failureCount++
            setBatchProgress({ current: globalIndex + 1, total: certificates.length })
            onProgress?.(globalIndex + 1, certificates.length)

            return {
              success: false,
              error: error.message || "Failed to mint certificate",
            }
          }
        })

        const batchResults = await Promise.all(batchPromises)
        results.push(...batchResults)

        // Add delay between batches to avoid overwhelming the network
        if (batchIndex < batches.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      }

      return {
        success: successCount > 0,
        results,
        successCount,
        failureCount,
        totalProcessed: certificates.length,
      }
    } catch (error: any) {
      console.error("[v0] Batch minting error:", error)

      return {
        success: false,
        results,
        successCount,
        failureCount: certificates.length - successCount,
        totalProcessed: results.length,
      }
    } finally {
      setIsMinting(false)
      setBatchProgress({ current: 0, total: 0 })
    }
  }

  return {
    mintCertificate,
    mintBatchCertificates,
    isMinting,
    batchProgress,
  }
}
