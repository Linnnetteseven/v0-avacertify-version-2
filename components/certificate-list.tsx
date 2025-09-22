"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ExternalLink,
  Eye,
  Download,
  Search,
  Filter,
  Calendar,
  User,
  Award,
  MoreHorizontal,
  Copy,
  RefreshCw,
  Trash2,
} from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

interface CertificateListProps {
  certificates: Certificate[]
  onView: (certificate: Certificate) => void
  onRetry?: (certificate: Certificate) => void
  onDelete?: (certificate: Certificate) => void
}

export function CertificateList({ certificates, onView, onRetry, onDelete }: CertificateListProps) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [selectedCertificates, setSelectedCertificates] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string>("date-desc")

  // Filter and sort certificates
  const filteredAndSortedCertificates = useMemo(() => {
    const filtered = certificates.filter((cert) => {
      const matchesSearch =
        cert.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.certificateTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.recipientAddress.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || cert.status === statusFilter
      const matchesType = typeFilter === "all" || cert.certificateType === typeFilter

      return matchesSearch && matchesStatus && matchesType
    })

    // Sort certificates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
        case "date-asc":
          return new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime()
        case "name-asc":
          return a.recipientName.localeCompare(b.recipientName)
        case "name-desc":
          return b.recipientName.localeCompare(a.recipientName)
        case "title-asc":
          return a.certificateTitle.localeCompare(b.certificateTitle)
        case "title-desc":
          return b.certificateTitle.localeCompare(a.certificateTitle)
        default:
          return 0
      }
    })

    return filtered
  }, [certificates, searchTerm, statusFilter, typeFilter, sortBy])

  // Get unique certificate types for filter
  const certificateTypes = useMemo(() => {
    const types = new Set(certificates.map((cert) => cert.certificateType))
    return Array.from(types)
  }, [certificates])

  // Statistics
  const stats = useMemo(() => {
    const total = certificates.length
    const minted = certificates.filter((c) => c.status === "minted").length
    const pending = certificates.filter((c) => c.status === "pending").length
    const failed = certificates.filter((c) => c.status === "failed").length
    const uniqueRecipients = new Set(certificates.map((c) => c.recipientAddress)).size

    return { total, minted, pending, failed, uniqueRecipients }
  }, [certificates])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCertificates(filteredAndSortedCertificates.map((cert) => cert.id))
    } else {
      setSelectedCertificates([])
    }
  }

  const handleSelectCertificate = (certificateId: string, checked: boolean) => {
    if (checked) {
      setSelectedCertificates((prev) => [...prev, certificateId])
    } else {
      setSelectedCertificates((prev) => prev.filter((id) => id !== certificateId))
    }
  }

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    })
  }

  const handleBulkAction = (action: string) => {
    const selectedCerts = certificates.filter((cert) => selectedCertificates.includes(cert.id))

    switch (action) {
      case "retry":
        selectedCerts
          .filter((cert) => cert.status === "failed")
          .forEach((cert) => {
            onRetry?.(cert)
          })
        break
      case "delete":
        selectedCerts.forEach((cert) => {
          onDelete?.(cert)
        })
        break
      case "export":
        // Export selected certificates as CSV
        const csvData = selectedCerts.map((cert) => ({
          "Certificate Title": cert.certificateTitle,
          "Recipient Name": cert.recipientName,
          "Recipient Address": cert.recipientAddress,
          Type: cert.certificateType,
          Status: cert.status,
          "Issue Date": format(cert.issueDate, "yyyy-MM-dd"),
          Grade: cert.grade || "",
          "Token ID": cert.tokenId || "",
          "Transaction Hash": cert.transactionHash || "",
        }))

        const csvContent = [
          Object.keys(csvData[0]).join(","),
          ...csvData.map((row) => Object.values(row).join(",")),
        ].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `certificates-${format(new Date(), "yyyy-MM-dd")}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
        break
    }

    setSelectedCertificates([])
  }

  if (certificates.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-muted-foreground text-center">
            <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No certificates issued yet</h3>
            <p>Start by creating your first certificate above.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.minted}</div>
            <p className="text-xs text-muted-foreground">Minted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            <p className="text-xs text-muted-foreground">Failed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.uniqueRecipients}</div>
            <p className="text-xs text-muted-foreground">Recipients</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Certificate Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, title, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="minted">Minted</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {certificateTypes.map((type) => (
                  <SelectItem key={type} value={type} className="capitalize">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="name-asc">Name A-Z</SelectItem>
                <SelectItem value="name-desc">Name Z-A</SelectItem>
                <SelectItem value="title-asc">Title A-Z</SelectItem>
                <SelectItem value="title-desc">Title Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedCertificates.length > 0 && (
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <span className="text-sm font-medium">{selectedCertificates.length} selected</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("retry")}
                  disabled={!certificates.some((c) => selectedCertificates.includes(c.id) && c.status === "failed")}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry Failed
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("export")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("delete")}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Certificate List */}
      <div className="space-y-4">
        {/* Select All */}
        <div className="flex items-center gap-2">
          <Checkbox
            checked={
              selectedCertificates.length === filteredAndSortedCertificates.length &&
              filteredAndSortedCertificates.length > 0
            }
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm text-muted-foreground">
            Select all ({filteredAndSortedCertificates.length} certificates)
          </span>
        </div>

        {/* Certificate Cards */}
        <div className="grid gap-4">
          {filteredAndSortedCertificates.map((certificate) => (
            <Card key={certificate.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedCertificates.includes(certificate.id)}
                      onCheckedChange={(checked) => handleSelectCertificate(certificate.id, checked as boolean)}
                    />
                    <div>
                      <CardTitle className="text-lg">{certificate.certificateTitle}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {certificate.recipientName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(certificate.issueDate, "PPP")}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        certificate.status === "minted"
                          ? "default"
                          : certificate.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {certificate.status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onView(certificate)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCopyAddress(certificate.recipientAddress)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Address
                        </DropdownMenuItem>
                        {certificate.status === "failed" && onRetry && (
                          <DropdownMenuItem onClick={() => onRetry(certificate)}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Retry Minting
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {onDelete && (
                          <DropdownMenuItem onClick={() => onDelete(certificate)} className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Recipient Address</p>
                    <p className="font-mono text-sm">
                      {certificate.recipientAddress.slice(0, 6)}...{certificate.recipientAddress.slice(-4)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="text-sm capitalize">{certificate.certificateType}</p>
                  </div>
                  {certificate.grade && (
                    <div>
                      <p className="text-sm text-muted-foreground">Grade</p>
                      <p className="text-sm">{certificate.grade}</p>
                    </div>
                  )}
                  {certificate.tokenId && (
                    <div>
                      <p className="text-sm text-muted-foreground">Token ID</p>
                      <p className="text-sm">#{certificate.tokenId}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onView(certificate)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>

                  {certificate.transactionHash && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={`https://testnet.snowtrace.io/tx/${certificate.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Explorer
                      </a>
                    </Button>
                  )}

                  <Button variant="outline" size="sm" disabled={certificate.status !== "minted"}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAndSortedCertificates.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-muted-foreground text-center">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No certificates found</h3>
                <p>Try adjusting your search or filter criteria.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
