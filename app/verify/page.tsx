"use client"

import type React from "react"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { CertificateDisplay } from "@/components/certificate-display"
import { BatchVerification } from "@/components/batch-verification"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, AlertCircle, CheckCircle, Upload, Shield, FileSearch, Users } from "lucide-react"
import { useCertificateVerification } from "@/hooks/use-certificate-verification"

export default function VerifyPage() {
  const [tokenId, setTokenId] = useState("")
  const { verifyCertificate, isVerifying, verificationResult, error, reset } = useCertificateVerification()

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tokenId.trim()) return

    const id = Number.parseInt(tokenId.trim())
    if (isNaN(id)) {
      return
    }

    await verifyCertificate(id)
  }

  const handleReset = () => {
    setTokenId("")
    reset()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Verify Certificate</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enter a certificate Token ID to verify its authenticity on the Avalanche blockchain
          </p>
        </div>

        <Tabs defaultValue="single" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 bg-muted/30 p-1 rounded-xl h-12 mb-8">
            <TabsTrigger
              value="single"
              className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold transition-all duration-300 rounded-lg flex items-center gap-2"
            >
              <FileSearch className="h-4 w-4" />
              Single Verification
            </TabsTrigger>
            <TabsTrigger
              value="batch"
              className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold transition-all duration-300 rounded-lg flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Batch Verification
            </TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-8">
            {!verificationResult && (
              <Card className="max-w-md mx-auto border-0 shadow-xl bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2 text-xl">
                    <Search className="h-5 w-5 text-primary" />
                    Certificate Lookup
                  </CardTitle>
                  <CardDescription className="text-base">
                    Enter the Token ID found on the certificate to verify its authenticity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleVerify} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="tokenId" className="text-sm font-medium text-foreground">
                        Token ID
                      </Label>
                      <Input
                        id="tokenId"
                        type="number"
                        value={tokenId}
                        onChange={(e) => setTokenId(e.target.value)}
                        placeholder="Enter Token ID (e.g., 1234)"
                        className="bg-background/50 border-border/50 focus:border-primary transition-colors text-center text-lg font-mono"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={isVerifying || !tokenId.trim()}
                    >
                      {isVerifying ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-2"></div>
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Search className="h-5 w-5 mr-2" />
                          Verify Certificate
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {error && (
              <Alert variant="destructive" className="max-w-2xl mx-auto border-destructive/50 bg-destructive/10">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="font-medium">{error}</AlertDescription>
              </Alert>
            )}

            {/* Verification Result */}
            {verificationResult && (
              <div className="space-y-6">
                <CertificateDisplay
                  certificateData={JSON.parse(verificationResult.certificateData)}
                  recipient={verificationResult.recipient}
                  issuer={verificationResult.issuer}
                  timestamp={verificationResult.timestamp}
                  tokenId={Number.parseInt(tokenId)}
                  isValid={verificationResult.isValid}
                />

                <div className="text-center">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="border-primary/30 hover:bg-primary/10 bg-transparent"
                  >
                    Verify Another Certificate
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="batch" className="space-y-8">
            <BatchVerification />
          </TabsContent>
        </Tabs>

        {/* How it Works */}
        {!verificationResult && (
          <div className="max-w-4xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">How Certificate Verification Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">1. Enter Token ID</h3>
                  <p className="text-sm text-muted-foreground">
                    Input the unique Token ID found on the certificate you want to verify
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">2. Blockchain Lookup</h3>
                  <p className="text-sm text-muted-foreground">
                    Our system queries the Avalanche blockchain to verify the certificate's authenticity
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">3. View Results</h3>
                  <p className="text-sm text-muted-foreground">
                    Get instant verification results with complete certificate details and blockchain proof
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
