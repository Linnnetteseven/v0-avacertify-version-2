"use client"

import { useState } from "react"
import { publicClient } from "@/lib/viem-client"
import { CERTIFICATE_CONTRACT_ADDRESS, CERTIFICATE_ABI } from "@/lib/contracts"

interface CertificateInfo {
  recipient: string
  issuer: string
  tokenURI: string
  certificateData: string
  timestamp: bigint
  isValid: boolean
}

export function useCertificateVerification() {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<CertificateInfo | null>(null)
  const [error, setError] = useState<string | null>(null)

  const verifyCertificate = async (tokenId: number) => {
    setIsVerifying(true)
    setError(null)
    setVerificationResult(null)

    try {
      console.log("[v0] Verifying certificate with token ID:", tokenId)

      // First, verify the certificate exists and is valid
      const isValid = (await publicClient.readContract({
        address: CERTIFICATE_CONTRACT_ADDRESS as `0x${string}`,
        abi: CERTIFICATE_ABI,
        functionName: "verifyCertificate",
        args: [BigInt(tokenId)],
      })) as boolean

      if (!isValid) {
        throw new Error("Certificate not found or invalid")
      }

      // Get certificate details
      const certificateInfo = (await publicClient.readContract({
        address: CERTIFICATE_CONTRACT_ADDRESS as `0x${string}`,
        abi: CERTIFICATE_ABI,
        functionName: "getCertificate",
        args: [BigInt(tokenId)],
      })) as [string, string, string, string, bigint]

      const [recipient, issuer, tokenURI, certificateData, timestamp] = certificateInfo

      const result: CertificateInfo = {
        recipient,
        issuer,
        tokenURI,
        certificateData,
        timestamp,
        isValid: true,
      }

      console.log("[v0] Certificate verification result:", result)
      setVerificationResult(result)
    } catch (error: any) {
      console.error("[v0] Verification error:", error)
      setError(error.message || "Failed to verify certificate")
    } finally {
      setIsVerifying(false)
    }
  }

  const reset = () => {
    setVerificationResult(null)
    setError(null)
  }

  return {
    verifyCertificate,
    isVerifying,
    verificationResult,
    error,
    reset,
  }
}
