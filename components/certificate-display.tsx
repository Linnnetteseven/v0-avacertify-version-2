"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { QRCodeGenerator } from "@/components/qr-code-generator"
import { Shield, Calendar, User, Award, ExternalLink, Download } from "lucide-react"
import { format } from "date-fns"

interface CertificateDisplayProps {
  certificateData: {
    recipientName: string
    recipientEmail?: string
    certificateTitle: string
    description: string
    certificateType: string
    issueDate: string
    expiryDate?: string
    skills: string[]
    grade?: string
    issuer: string
  }
  recipient: string
  issuer: string
  timestamp: bigint
  tokenId: number
  transactionHash?: string
  isValid: boolean
}

export function CertificateDisplay({
  certificateData,
  recipient,
  issuer,
  timestamp,
  tokenId,
  transactionHash,
  isValid,
}: CertificateDisplayProps) {
  const issueDate = new Date(certificateData.issueDate)
  const expiryDate = certificateData.expiryDate ? new Date(certificateData.expiryDate) : null
  const blockchainTimestamp = new Date(Number(timestamp) * 1000)

  // Check if certificate is expired
  const isExpired = expiryDate && expiryDate < new Date()

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Verification Status */}
      <Card
        className={`border-2 ${isValid && !isExpired ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}`}
      >
        <CardContent className="flex items-center gap-4 p-6">
          <div className={`p-3 rounded-full ${isValid && !isExpired ? "bg-green-100" : "bg-red-100"}`}>
            <Shield className={`h-8 w-8 ${isValid && !isExpired ? "text-green-600" : "text-red-600"}`} />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${isValid && !isExpired ? "text-green-800" : "text-red-800"}`}>
              {isValid && !isExpired
                ? "Certificate Verified"
                : isExpired
                  ? "Certificate Expired"
                  : "Certificate Invalid"}
            </h2>
            <p className={`${isValid && !isExpired ? "text-green-600" : "text-red-600"}`}>
              {isValid && !isExpired
                ? "This certificate is authentic and verified on the Avalanche blockchain"
                : isExpired
                  ? "This certificate has expired and is no longer valid"
                  : "This certificate could not be verified or does not exist"}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Certificate Details */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{certificateData.certificateTitle}</CardTitle>
                  <p className="text-primary-foreground/90">Token ID: #{tokenId}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {certificateData.certificateType}
                  </Badge>
                  {isExpired && (
                    <Badge variant="destructive" className="bg-red-500 text-white">
                      Expired
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8 space-y-6">
              {/* Recipient Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Recipient</p>
                      <p className="font-semibold">{certificateData.recipientName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Issue Date</p>
                      <p className="font-semibold">{format(issueDate, "PPP")}</p>
                    </div>
                  </div>

                  {expiryDate && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Expiry Date</p>
                        <p className={`font-semibold ${isExpired ? "text-red-600" : ""}`}>
                          {format(expiryDate, "PPP")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Recipient Address</p>
                    <p className="font-mono text-sm break-all">{recipient}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Issuer Address</p>
                    <p className="font-mono text-sm break-all">{issuer}</p>
                  </div>

                  {certificateData.grade && (
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Grade</p>
                        <p className="font-semibold">{certificateData.grade}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{certificateData.description}</p>
              </div>

              {/* Skills */}
              {certificateData.skills && certificateData.skills.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Skills & Competencies</h3>
                  <div className="flex flex-wrap gap-2">
                    {certificateData.skills.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Blockchain Information */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">Blockchain Verification</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Blockchain</p>
                    <p className="font-semibold">Avalanche Fuji Testnet</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Minted On</p>
                    <p className="font-semibold">{format(blockchainTimestamp, "PPP p")}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                {transactionHash && (
                  <Button variant="outline" asChild>
                    <a
                      href={`https://testnet.snowtrace.io/tx/${transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on Explorer
                    </a>
                  </Button>
                )}
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Certificate
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* QR Code and Additional Info */}
        <div className="space-y-6">
          <QRCodeGenerator tokenId={tokenId} certificateTitle={certificateData.certificateTitle} />

          {/* Additional Security Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Security Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Verification Method</p>
                <p className="font-semibold">Blockchain-based</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tamper Protection</p>
                <p className="font-semibold">Immutable</p>
              </div>
              <div>
                <p className="text-muted-foreground">Network</p>
                <p className="font-semibold">Avalanche Fuji</p>
              </div>
              <div>
                <p className="text-muted-foreground">Standard</p>
                <p className="font-semibold">ERC-721 NFT</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
