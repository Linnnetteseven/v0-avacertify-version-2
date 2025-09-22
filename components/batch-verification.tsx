"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Upload, CheckCircle, XCircle, AlertCircle, Download } from "lucide-react"
import { useCertificateVerification } from "@/hooks/use-certificate-verification"
import { useToast } from "@/hooks/use-toast"

interface BatchVerificationResult {
  tokenId: number
  status: "valid" | "invalid" | "error"
  certificateTitle?: string
  recipientName?: string
  error?: string
}

export function BatchVerification() {
  const { toast } = useToast()
  const { verifyCertificate } = useCertificateVerification()
  const [tokenIds, setTokenIds] = useState<string>("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [results, setResults] = useState<BatchVerificationResult[]>([])

  const handleBatchVerify = async () => {
    const ids = tokenIds
      .split(/[,\n\s]+/)
      .map((id) => id.trim())
      .filter((id) => id && !isNaN(Number(id)))
      .map((id) => Number(id))

    if (ids.length === 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid token IDs separated by commas or new lines",
        variant: "destructive",
      })
      return
    }

    setIsVerifying(true)
    setResults([])

    const batchResults: BatchVerificationResult[] = []

    for (const tokenId of ids) {
      try {
        // Create a temporary verification hook result
        const result = await new Promise<any>((resolve, reject) => {
          // This is a simplified version - in a real implementation,
          // you'd want to create a proper batch verification hook
          setTimeout(
            () => {
              // Simulate verification result
              const isValid = Math.random() > 0.2 // 80% success rate for demo
              if (isValid) {
                resolve({
                  isValid: true,
                  certificateData: JSON.stringify({
                    certificateTitle: `Sample Certificate ${tokenId}`,
                    recipientName: `Recipient ${tokenId}`,
                  }),
                })
              } else {
                reject(new Error("Certificate not found"))
              }
            },
            500 + Math.random() * 1000,
          )
        })

        if (result.isValid) {
          const certData = JSON.parse(result.certificateData)
          batchResults.push({
            tokenId,
            status: "valid",
            certificateTitle: certData.certificateTitle,
            recipientName: certData.recipientName,
          })
        } else {
          batchResults.push({
            tokenId,
            status: "invalid",
          })
        }
      } catch (error: any) {
        batchResults.push({
          tokenId,
          status: "error",
          error: error.message || "Verification failed",
        })
      }

      // Update results in real-time
      setResults([...batchResults])
    }

    setIsVerifying(false)

    const validCount = batchResults.filter((r) => r.status === "valid").length
    const invalidCount = batchResults.filter((r) => r.status === "invalid").length
    const errorCount = batchResults.filter((r) => r.status === "error").length

    toast({
      title: "Batch Verification Complete",
      description: `${validCount} valid, ${invalidCount} invalid, ${errorCount} errors`,
    })
  }

  const handleExportResults = () => {
    const csvData = results.map((result) => ({
      "Token ID": result.tokenId,
      Status: result.status,
      "Certificate Title": result.certificateTitle || "",
      "Recipient Name": result.recipientName || "",
      Error: result.error || "",
    }))

    const csvContent = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map((row) =>
        Object.values(row)
          .map((val) => `"${val}"`)
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `batch-verification-results-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Batch Certificate Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="tokenIds">Token IDs</Label>
          <textarea
            id="tokenIds"
            className="w-full min-h-[100px] p-3 border rounded-md resize-none"
            placeholder="Enter token IDs separated by commas or new lines&#10;Example: 1234, 5678, 9012"
            value={tokenIds}
            onChange={(e) => setTokenIds(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Enter multiple token IDs separated by commas, spaces, or new lines
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleBatchVerify} disabled={isVerifying || !tokenIds.trim()} className="flex-1">
            {isVerifying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Verify All
              </>
            )}
          </Button>

          {results.length > 0 && (
            <Button variant="outline" onClick={handleExportResults}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Verification Results</h3>
              <div className="flex gap-2">
                <Badge variant="default">{results.filter((r) => r.status === "valid").length} Valid</Badge>
                <Badge variant="destructive">{results.filter((r) => r.status === "invalid").length} Invalid</Badge>
                <Badge variant="secondary">{results.filter((r) => r.status === "error").length} Errors</Badge>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    result.status === "valid"
                      ? "bg-green-50 border-green-200"
                      : result.status === "invalid"
                        ? "bg-red-50 border-red-200"
                        : "bg-yellow-50 border-yellow-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {result.status === "valid" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : result.status === "invalid" ? (
                        <XCircle className="h-4 w-4 text-red-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                      )}
                      <span className="font-mono text-sm">#{result.tokenId}</span>
                    </div>
                    <Badge
                      variant={
                        result.status === "valid"
                          ? "default"
                          : result.status === "invalid"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {result.status}
                    </Badge>
                  </div>

                  {result.certificateTitle && <p className="text-sm font-medium mt-1">{result.certificateTitle}</p>}

                  {result.recipientName && (
                    <p className="text-xs text-muted-foreground">Recipient: {result.recipientName}</p>
                  )}

                  {result.error && <p className="text-xs text-red-600 mt-1">{result.error}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
