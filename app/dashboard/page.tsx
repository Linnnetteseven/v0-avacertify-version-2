"use client"

import { useState, useEffect } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { Navigation } from "@/components/navigation"
import { CertificateForm } from "@/components/certificate-form"
import { CertificateList } from "@/components/certificate-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Award, Users, TrendingUp, Plus, List } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCertificateMinting } from "@/hooks/use-certificate-minting"
import { useToast } from "@/hooks/use-toast"

interface Certificate {
  id: string
  tokenId?: number
  recipientName: string
  recipientAddress: string
  certificateTitle: string
  certificateType: string
  issueDate: Date
  status: "pending" | "minted" | "failed"
  transactionHash?: string
  grade?: string
}

export default function DashboardPage() {
  const { ready, authenticated, user } = usePrivy()
  const router = useRouter()
  const { mintCertificate, mintBatchCertificates, isMinting } = useCertificateMinting()
  const { toast } = useToast()
  const [certificates, setCertificates] = useState<Certificate[]>([])

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/")
    }
  }, [ready, authenticated, router])

  const handleCertificateSubmit = async (data: any) => {
    try {
      // Create a new certificate entry with pending status
      const newCertificate: Certificate = {
        id: Date.now().toString(),
        recipientName: data.recipientName,
        recipientAddress: data.recipientAddress,
        certificateTitle: data.certificateTitle,
        certificateType: data.certificateType,
        issueDate: data.issueDate || new Date(),
        status: "pending" as const,
        grade: data.grade,
      }

      setCertificates((prev) => [newCertificate, ...prev])

      const result = await mintCertificate(data)

      if (result.success) {
        // Update certificate with minted status
        setCertificates((prev) =>
          prev.map((cert) =>
            cert.id === newCertificate.id
              ? {
                  ...cert,
                  status: "minted" as const,
                  tokenId: result.tokenId,
                  transactionHash: result.transactionHash,
                }
              : cert,
          ),
        )

        toast({
          title: "Certificate Minted Successfully!",
          description: `NFT has been minted and sent to ${data.recipientAddress}`,
        })
      } else {
        // Update certificate with failed status
        setCertificates((prev) =>
          prev.map((cert) =>
            cert.id === newCertificate.id
              ? {
                  ...cert,
                  status: "failed" as const,
                }
              : cert,
          ),
        )

        toast({
          title: "Minting Failed",
          description: result.error || "Failed to mint certificate",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Error creating certificate:", error)
      toast({
        title: "Error",
        description: "Failed to create certificate",
        variant: "destructive",
      })
    }
  }

  const handleBatchCertificateSubmit = async (certificates: any[], recipients: any[]) => {
    try {
      toast({
        title: "Batch Processing Started",
        description: `Processing ${certificates.length} certificates...`,
      })

      // Create pending certificates for all recipients
      const newCertificates: Certificate[] = certificates.map((cert, index) => ({
        id: `${Date.now()}-${index}`,
        recipientName: cert.recipientName,
        recipientAddress: cert.recipientAddress,
        certificateTitle: cert.certificateTitle,
        certificateType: cert.certificateType,
        issueDate: cert.issueDate || new Date(),
        status: "pending" as const,
        grade: cert.grade,
      }))

      setCertificates((prev) => [...newCertificates, ...prev])

      // Use enhanced batch minting
      const batchResult = await mintBatchCertificates(certificates, (current, total) => {
        // Update progress in real-time
        console.log(`[v0] Batch progress: ${current}/${total}`)
      })

      // Update certificate statuses based on results
      batchResult.results.forEach((result, index) => {
        const certId = newCertificates[index].id

        setCertificates((prev) =>
          prev.map((c) =>
            c.id === certId
              ? {
                  ...c,
                  status: result.success ? ("minted" as const) : ("failed" as const),
                  tokenId: result.tokenId,
                  transactionHash: result.transactionHash,
                }
              : c,
          ),
        )
      })

      toast({
        title: "Batch Processing Complete",
        description: `${batchResult.successCount} certificates minted successfully, ${batchResult.failureCount} failed`,
        variant: batchResult.failureCount > 0 ? "destructive" : "default",
      })
    } catch (error: any) {
      console.error("Error processing batch certificates:", error)
      toast({
        title: "Batch Processing Error",
        description: "Failed to process batch certificates",
        variant: "destructive",
      })
    }
  }

  const handleRetryCertificate = async (certificate: Certificate) => {
    try {
      // Update status to pending
      setCertificates((prev) =>
        prev.map((cert) => (cert.id === certificate.id ? { ...cert, status: "pending" as const } : cert)),
      )

      // Retry minting
      const result = await mintCertificate({
        recipientName: certificate.recipientName,
        recipientEmail: "", // We don't store email in the certificate list
        recipientAddress: certificate.recipientAddress,
        certificateTitle: certificate.certificateTitle,
        description: "", // We don't store description in the certificate list
        issueDate: certificate.issueDate,
        expiryDate: undefined,
        certificateType: certificate.certificateType,
        skills: [],
        grade: certificate.grade || "",
      })

      // Update certificate status
      setCertificates((prev) =>
        prev.map((cert) =>
          cert.id === certificate.id
            ? {
                ...cert,
                status: result.success ? ("minted" as const) : ("failed" as const),
                tokenId: result.tokenId,
                transactionHash: result.transactionHash,
              }
            : cert,
        ),
      )

      toast({
        title: result.success ? "Certificate Minted Successfully!" : "Retry Failed",
        description: result.success
          ? `Certificate has been minted and sent to ${certificate.recipientAddress}`
          : result.error || "Failed to mint certificate",
        variant: result.success ? "default" : "destructive",
      })
    } catch (error: any) {
      console.error("Error retrying certificate:", error)
      toast({
        title: "Retry Error",
        description: "Failed to retry certificate minting",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCertificate = (certificate: Certificate) => {
    setCertificates((prev) => prev.filter((cert) => cert.id !== certificate.id))

    toast({
      title: "Certificate Deleted",
      description: `Certificate for ${certificate.recipientName} has been removed`,
    })
  }

  const handleViewCertificate = (certificate: Certificate) => {
    console.log("[v0] Viewing certificate:", certificate)
    // Navigate to certificate view page
    if (certificate.tokenId) {
      router.push(`/certificate/${certificate.tokenId}`)
    }
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground font-medium">
                Welcome back,{" "}
                <span className="font-mono bg-muted/50 px-2 py-1 rounded-md text-primary">
                  {user?.wallet?.address?.slice(0, 6)}...{user?.wallet?.address?.slice(-4)}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="feature-card-hover border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Certificates</CardTitle>
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Award className="h-4 w-4 icon-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{certificates.length}</div>
              <p className="text-xs text-muted-foreground">
                +{certificates.filter((c) => c.status === "minted").length} minted
              </p>
            </CardContent>
          </Card>

          <Card className="feature-card-hover border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Recipients</CardTitle>
              <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 icon-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {new Set(certificates.map((c) => c.recipientAddress)).size}
              </div>
              <p className="text-xs text-muted-foreground">Unique addresses</p>
            </CardContent>
          </Card>

          <Card className="feature-card-hover border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 icon-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {certificates.length > 0
                  ? Math.round((certificates.filter((c) => c.status === "minted").length / certificates.length) * 100)
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">Minting success</p>
            </CardContent>
          </Card>

          <Card className="feature-card-hover border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Blockchain</CardTitle>
              <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 icon-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">Avalanche</div>
              <p className="text-xs text-muted-foreground">Fuji Testnet</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="issue" className="space-y-6">
          <TabsList className="bg-muted/30 p-1 rounded-xl h-12">
            <TabsTrigger
              value="issue"
              className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold transition-all duration-300 rounded-lg flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Issue Certificate
            </TabsTrigger>
            <TabsTrigger
              value="manage"
              className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold transition-all duration-300 rounded-lg flex items-center gap-2"
            >
              <List className="h-4 w-4" />
              Manage Certificates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="issue" className="space-y-6">
            <CertificateForm
              onSubmit={handleCertificateSubmit}
              onBatchSubmit={handleBatchCertificateSubmit}
              isLoading={isMinting}
            />
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <CertificateList
              certificates={certificates}
              onView={handleViewCertificate}
              onRetry={handleRetryCertificate}
              onDelete={handleDeleteCertificate}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
