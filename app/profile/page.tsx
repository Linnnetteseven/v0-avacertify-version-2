"use client"

import { useState, useEffect } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Wallet, Shield, Settings, Copy } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { ready, authenticated, user, logout } = usePrivy()
  const router = useRouter()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    displayName: "",
    bio: "",
    organization: "",
    website: "",
  })

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/")
    }
  }, [ready, authenticated, router])

  const handleCopyAddress = () => {
    if (user?.wallet?.address) {
      navigator.clipboard.writeText(user.wallet.address)
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  const handleSaveProfile = () => {
    // In a real app, this would save to a database
    setIsEditing(false)
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully",
    })
  }

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground font-medium">Loading profile...</p>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Profile</h1>
              <p className="text-muted-foreground font-medium">Manage your account settings and preferences</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Account Information */}
          <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Account Information
              </CardTitle>
              <CardDescription>Your blockchain identity and wallet details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Wallet Address</Label>
                  <div className="flex items-center gap-2">
                    <Input value={user?.wallet?.address || ""} readOnly className="font-mono text-sm bg-muted/50" />
                    <Button variant="outline" size="sm" onClick={handleCopyAddress} className="shrink-0 bg-transparent">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user?.email?.address || "No email connected"}</span>
                    {user?.email?.address && (
                      <Badge variant="secondary" className="text-xs">
                        {user.email.verified ? "Verified" : "Unverified"}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Wallet Type</Label>
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm capitalize">{user?.wallet?.walletClientType || "Unknown"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Settings */}
          <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Profile Settings
                  </CardTitle>
                  <CardDescription>Customize your public profile information</CardDescription>
                </div>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                  className={isEditing ? "bg-primary hover:bg-primary/90" : ""}
                >
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={profileData.displayName}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, displayName: e.target.value }))}
                    placeholder="Your display name"
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted/50" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    value={profileData.organization}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, organization: e.target.value }))}
                    placeholder="Your organization or company"
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted/50" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={profileData.website}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, website: e.target.value }))}
                    placeholder="https://yourwebsite.com"
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted/50" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted/50" : ""}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible and destructive actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                <div>
                  <h3 className="font-medium text-foreground">Sign Out</h3>
                  <p className="text-sm text-muted-foreground">Sign out of your current session</p>
                </div>
                <Button variant="destructive" onClick={handleLogout}>
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
