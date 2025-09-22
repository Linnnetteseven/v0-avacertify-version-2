"use client"

import type React from "react"
import { PrivyProvider } from "@privy-io/react-auth"
import { privyConfig } from "@/lib/privy-config"

export function PrivyProviders({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider appId={privyConfig.appId} config={privyConfig.config}>
      {children}
    </PrivyProvider>
  )
}
