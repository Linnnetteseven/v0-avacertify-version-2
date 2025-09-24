import { base, baseSepolia } from "viem/chains"

export const privyConfig = {
  appId:
    process.env.NEXT_PUBLIC_PRIVY_APP_ID ||
    (() => {
      console.error("[v0] NEXT_PUBLIC_PRIVY_APP_ID environment variable is not set!")
      return "your-privy-app-id"
    })(),
  config: {
    loginMethods: ["wallet", "email"],
    appearance: {
      theme: "light",
      accentColor: "#FF6B35",
      logo: "/logo.png",
    },
    defaultChain: baseSepolia,
    supportedChains: [base, baseSepolia],
    embeddedWallets: {
      createOnLogin: "users-without-wallets",
    },
    legal: {
      termsAndConditionsUrl: undefined,
      privacyPolicyUrl: undefined,
    },
  },
}
