"use client"

import { usePrivy } from "@privy-io/react-auth"
import { Button } from "@/components/ui/button"
import { Wallet, LogOut } from "lucide-react"

export function WalletConnectButton() {
  const { ready, authenticated, user, login, logout } = usePrivy()

  console.log("[v0] Privy state:", { ready, authenticated, hasUser: !!user })

  if (!ready) {
    return (
      <Button disabled variant="outline" size="sm" className="border-primary/20 text-muted-foreground bg-transparent">
        Loading...
      </Button>
    )
  }

  if (authenticated) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground hidden sm:inline font-mono bg-muted/50 px-2 py-1 rounded-md">
          {user?.wallet?.address?.slice(0, 6)}...{user?.wallet?.address?.slice(-4)}
        </span>
        <Button
          onClick={logout}
          variant="outline"
          size="sm"
          className="border-destructive/20 text-destructive hover:bg-destructive/10 hover:border-destructive/40 interactive-hover bg-transparent"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={login}
      size="sm"
      className="btn-primary text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <Wallet className="h-4 w-4 mr-2" />
      Connect Wallet
    </Button>
  )
}
