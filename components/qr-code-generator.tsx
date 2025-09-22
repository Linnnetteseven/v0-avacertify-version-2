"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QrCode, Download, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QRCodeGeneratorProps {
  tokenId: number
  certificateTitle: string
}

export function QRCodeGenerator({ tokenId, certificateTitle }: QRCodeGeneratorProps) {
  const { toast } = useToast()
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")

  const verificationUrl = `${window.location.origin}/certificate/${tokenId}`

  useEffect(() => {
    // Generate QR code using a public API
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(verificationUrl)}`
    setQrCodeUrl(qrApiUrl)
  }, [verificationUrl])

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(verificationUrl)
    toast({
      title: "URL Copied",
      description: "Verification URL copied to clipboard",
    })
  }

  const handleDownloadQR = () => {
    const link = document.createElement("a")
    link.href = qrCodeUrl
    link.download = `certificate-${tokenId}-qr.png`
    link.click()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          QR Code for Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          {qrCodeUrl && (
            <img
              src={qrCodeUrl || "/placeholder.svg"}
              alt={`QR Code for ${certificateTitle}`}
              className="mx-auto border rounded-lg"
              width={200}
              height={200}
            />
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Verification URL:</p>
          <p className="text-xs font-mono bg-muted p-2 rounded break-all">{verificationUrl}</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyUrl}>
            <Copy className="h-4 w-4 mr-2" />
            Copy URL
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadQR}>
            <Download className="h-4 w-4 mr-2" />
            Download QR
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
