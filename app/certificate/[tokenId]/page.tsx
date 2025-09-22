"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { CertificateDisplay } from "@/components/certificate-display"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useCertificateVerification } from "@/hooks/use-certificate-verification"

export default function CertificatePage() {
  const params = useParams()
  const tokenId = params.tokenId as string
  const { verifyCertificate, isVerifying, verificationResult, error } = useCertificateVerification()

  useEffect(() => {
    if (tokenId) {
      const id = Number.parseInt(tokenId)
      if (!isNaN(id)) {
        verifyCertificate(id)
      }
    }
  }, [tokenId, verifyCertificate])

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold mb-2">Verifying Certificate</h2>
              <p className="text-muted-foreground">Checking blockchain for Token ID #{tokenId}...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  if (!verificationResult) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Certificate Not Found</h1>
            <p className="text-muted-foreground">No certificate found with Token ID #{tokenId}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CertificateDisplay
          certificateData={JSON.parse(verificationResult.certificateData)}
          recipient={verificationResult.recipient}
          issuer={verificationResult.issuer}
          timestamp={verificationResult.timestamp}
          tokenId={Number.parseInt(tokenId)}
          isValid={verificationResult.isValid}
        />
      </div>
    </div>
  )
}
