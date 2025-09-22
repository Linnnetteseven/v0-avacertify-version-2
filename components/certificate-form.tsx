"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Plus, X, Upload, Download, FileText, Award, Users } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

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

interface BatchCertificateData {
  recipientName: string
  recipientEmail: string
  recipientAddress: string
  grade?: string
}

interface CertificateFormProps {
  onSubmit: (data: CertificateData) => void
  onBatchSubmit?: (data: CertificateData[], batchData: BatchCertificateData[]) => void
  isLoading?: boolean
}

export function CertificateForm({ onSubmit, onBatchSubmit, isLoading }: CertificateFormProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("single")

  // Single certificate form data
  const [formData, setFormData] = useState<CertificateData>({
    recipientName: "",
    recipientEmail: "",
    recipientAddress: "",
    certificateTitle: "",
    description: "",
    issueDate: new Date(),
    expiryDate: undefined,
    certificateType: "",
    skills: [],
    grade: "",
  })

  // Batch certificate data
  const [batchTemplate, setBatchTemplate] = useState<
    Omit<CertificateData, "recipientName" | "recipientEmail" | "recipientAddress" | "grade">
  >({
    certificateTitle: "",
    description: "",
    issueDate: new Date(),
    expiryDate: undefined,
    certificateType: "",
    skills: [],
  })

  const [batchRecipients, setBatchRecipients] = useState<BatchCertificateData[]>([])
  const [csvFile, setCsvFile] = useState<File | null>(null)

  const [newSkill, setNewSkill] = useState("")

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (batchRecipients.length === 0) {
      toast({
        title: "No Recipients",
        description: "Please upload a CSV file with recipient data",
        variant: "destructive",
      })
      return
    }

    // Create individual certificate data for each recipient
    const certificates = batchRecipients.map((recipient) => ({
      ...batchTemplate,
      recipientName: recipient.recipientName,
      recipientEmail: recipient.recipientEmail,
      recipientAddress: recipient.recipientAddress,
      grade: recipient.grade || "",
    }))

    if (onBatchSubmit) {
      onBatchSubmit(certificates, batchRecipients)
    }
  }

  const addSkill = (isBatch = false) => {
    if (newSkill.trim()) {
      if (isBatch) {
        if (!batchTemplate.skills.includes(newSkill.trim())) {
          setBatchTemplate((prev) => ({
            ...prev,
            skills: [...prev.skills, newSkill.trim()],
          }))
        }
      } else {
        if (!formData.skills.includes(newSkill.trim())) {
          setFormData((prev) => ({
            ...prev,
            skills: [...prev.skills, newSkill.trim()],
          }))
        }
      }
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string, isBatch = false) => {
    if (isBatch) {
      setBatchTemplate((prev) => ({
        ...prev,
        skills: prev.skills.filter((skill) => skill !== skillToRemove),
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        skills: prev.skills.filter((skill) => skill !== skillToRemove),
      }))
    }
  }

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCsvFile(file)

    const reader = new FileReader()
    reader.onload = (event) => {
      const csv = event.target?.result as string
      const lines = csv.split("\n")
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())

      // Validate required headers
      const requiredHeaders = ["recipientname", "recipientemail", "recipientaddress"]
      const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h))

      if (missingHeaders.length > 0) {
        toast({
          title: "Invalid CSV Format",
          description: `Missing required columns: ${missingHeaders.join(", ")}`,
          variant: "destructive",
        })
        return
      }

      const recipients: BatchCertificateData[] = []

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        const values = line.split(",").map((v) => v.trim())
        const recipient: BatchCertificateData = {
          recipientName: values[headers.indexOf("recipientname")] || "",
          recipientEmail: values[headers.indexOf("recipientemail")] || "",
          recipientAddress: values[headers.indexOf("recipientaddress")] || "",
          grade: values[headers.indexOf("grade")] || "",
        }

        if (recipient.recipientName && recipient.recipientEmail && recipient.recipientAddress) {
          recipients.push(recipient)
        }
      }

      setBatchRecipients(recipients)
      toast({
        title: "CSV Uploaded Successfully",
        description: `Loaded ${recipients.length} recipients`,
      })
    }

    reader.readAsText(file)
  }

  const downloadCsvTemplate = () => {
    const csvContent =
      "recipientName,recipientEmail,recipientAddress,grade\nJohn Doe,john@example.com,0x1234567890123456789012345678901234567890,A+\nJane Smith,jane@example.com,0x0987654321098765432109876543210987654321,B+"
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "certificate_recipients_template.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto border-0 shadow-xl bg-card/50 backdrop-blur-sm">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
          <Award className="h-6 w-6 text-primary" />
          Issue Certificates
        </CardTitle>
        <CardDescription className="text-base">
          Create blockchain-verified certificates for recipients on Avalanche
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-muted/30 p-1 rounded-xl h-12">
            <TabsTrigger
              value="single"
              className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold transition-all duration-300 rounded-lg flex items-center gap-2"
            >
              <Award className="h-4 w-4" />
              Single Certificate
            </TabsTrigger>
            <TabsTrigger
              value="batch"
              className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold transition-all duration-300 rounded-lg flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Batch Certificates
            </TabsTrigger>
          </TabsList>

          {/* Single Certificate Tab */}
          <TabsContent value="single" className="space-y-0">
            <form onSubmit={handleSingleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <h3 className="text-lg font-semibold text-foreground">Recipient Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="recipientName" className="text-sm font-medium text-foreground">
                      Full Name
                    </Label>
                    <Input
                      id="recipientName"
                      value={formData.recipientName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, recipientName: e.target.value }))}
                      placeholder="John Doe"
                      className="bg-background/50 border-border/50 focus:border-primary transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipientEmail" className="text-sm font-medium text-foreground">
                      Email Address
                    </Label>
                    <Input
                      id="recipientEmail"
                      type="email"
                      value={formData.recipientEmail}
                      onChange={(e) => setFormData((prev) => ({ ...prev, recipientEmail: e.target.value }))}
                      placeholder="john@example.com"
                      className="bg-background/50 border-border/50 focus:border-primary transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipientAddress" className="text-sm font-medium text-foreground">
                    Wallet Address
                  </Label>
                  <Input
                    id="recipientAddress"
                    value={formData.recipientAddress}
                    onChange={(e) => setFormData((prev) => ({ ...prev, recipientAddress: e.target.value }))}
                    placeholder="0x..."
                    className="bg-background/50 border-border/50 focus:border-primary transition-colors font-mono text-sm"
                    required
                  />
                </div>
              </div>

              {/* Certificate Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <h3 className="text-lg font-semibold text-foreground">Certificate Details</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certificateTitle">Certificate Title</Label>
                  <Input
                    id="certificateTitle"
                    value={formData.certificateTitle}
                    onChange={(e) => setFormData((prev) => ({ ...prev, certificateTitle: e.target.value }))}
                    placeholder="Blockchain Development Certification"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="This certificate validates the completion of..."
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="certificateType">Certificate Type</Label>
                    <Select
                      value={formData.certificateType}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, certificateType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completion">Course Completion</SelectItem>
                        <SelectItem value="achievement">Achievement</SelectItem>
                        <SelectItem value="participation">Participation</SelectItem>
                        <SelectItem value="professional">Professional Certification</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade/Score (Optional)</Label>
                    <Input
                      id="grade"
                      value={formData.grade}
                      onChange={(e) => setFormData((prev) => ({ ...prev, grade: e.target.value }))}
                      placeholder="A+, 95%, Pass, etc."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Issue Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.issueDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.issueDate ? format(formData.issueDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.issueDate}
                          onSelect={(date) => setFormData((prev) => ({ ...prev, issueDate: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Expiry Date (Optional)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.expiryDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.expiryDate ? format(formData.expiryDate, "PPP") : "No expiry"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.expiryDate}
                          onSelect={(date) => setFormData((prev) => ({ ...prev, expiryDate: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Skills Section */}
                <div className="space-y-2">
                  <Label>Skills/Competencies</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    />
                    <Button type="button" onClick={() => addSkill()} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {skill}
                          <button type="button" onClick={() => removeSkill(skill)} className="hover:text-destructive">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                    Minting Certificate...
                  </>
                ) : (
                  <>
                    <Award className="h-5 w-5" />
                    Issue Certificate
                  </>
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="batch" className="space-y-0">
            <form onSubmit={handleBatchSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <h3 className="text-lg font-semibold text-foreground">Upload Recipients</h3>
                </div>

                <div className="border-2 border-dashed border-primary/30 rounded-xl p-8 bg-primary/5 hover:bg-primary/10 transition-colors">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <Label htmlFor="csvFile" className="cursor-pointer">
                        <span className="text-base font-semibold text-foreground hover:text-primary transition-colors">
                          Upload CSV file
                        </span>
                        <Input id="csvFile" type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
                      </Label>
                      <p className="text-sm text-muted-foreground mt-2">
                        CSV should contain: recipientName, recipientEmail, recipientAddress, grade (optional)
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={downloadCsvTemplate}
                      className="border-primary/30 hover:bg-primary/10 bg-transparent"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>
                  </div>
                </div>

                {csvFile && (
                  <div className="flex items-center gap-3 p-4 bg-accent/10 rounded-lg border border-accent/20">
                    <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-foreground">{csvFile.name}</span>
                      <p className="text-xs text-muted-foreground">{batchRecipients.length} recipients loaded</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Batch Template */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <h3 className="text-lg font-semibold text-foreground">Certificate Template</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="batchCertificateTitle">Certificate Title</Label>
                  <Input
                    id="batchCertificateTitle"
                    value={batchTemplate.certificateTitle}
                    onChange={(e) => setBatchTemplate((prev) => ({ ...prev, certificateTitle: e.target.value }))}
                    placeholder="Blockchain Development Certification"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="batchDescription">Description</Label>
                  <Textarea
                    id="batchDescription"
                    value={batchTemplate.description}
                    onChange={(e) => setBatchTemplate((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="This certificate validates the completion of..."
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="batchCertificateType">Certificate Type</Label>
                    <Select
                      value={batchTemplate.certificateType}
                      onValueChange={(value) => setBatchTemplate((prev) => ({ ...prev, certificateType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completion">Course Completion</SelectItem>
                        <SelectItem value="achievement">Achievement</SelectItem>
                        <SelectItem value="participation">Participation</SelectItem>
                        <SelectItem value="professional">Professional Certification</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Issue Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !batchTemplate.issueDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {batchTemplate.issueDate ? format(batchTemplate.issueDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={batchTemplate.issueDate}
                          onSelect={(date) => setBatchTemplate((prev) => ({ ...prev, issueDate: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Skills Section for Batch */}
                <div className="space-y-2">
                  <Label>Skills/Competencies</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill(true))}
                    />
                    <Button type="button" onClick={() => addSkill(true)} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {batchTemplate.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {batchTemplate.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill, true)}
                            className="hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                disabled={isLoading || batchRecipients.length === 0}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                    Minting Certificates...
                  </>
                ) : (
                  <>
                    <Users className="h-5 w-5" />
                    Issue {batchRecipients.length} Certificates
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
