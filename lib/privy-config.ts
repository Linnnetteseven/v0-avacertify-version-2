import { avalanche, avalancheFuji } from "viem/chains"

export const privyConfig = {
  appId:
    process.env.NEXT_PUBLIC_PRIVY_APP_ID ||
    (() => {
      console.error("[v0] NEXT_PUBLIC_PRIVY_APP_ID environment variable is not set!")
      return "your-privy-app-id"
    })(),
  config: {
    loginMethods: ["email", "wallet"],
    appearance: {
      theme: "light",
      accentColor: "#8B5CF6",
      logo: "/images/avacertify-logo.png",
      landingHeader: "Welcome to AvaCertify",
      loginMessage: "Sign in to issue and verify certificates",
      showWalletLoginFirst: false,
    },
    defaultChain: avalancheFuji,
    supportedChains: [avalanche, avalancheFuji],
    embeddedWallets: {
      createOnLogin: "users-without-wallets",
      noPromptOnSignature: false,
    },
    legal: {
      termsAndConditionsUrl: undefined,
      privacyPolicyUrl: undefined,
    },
  },
}
