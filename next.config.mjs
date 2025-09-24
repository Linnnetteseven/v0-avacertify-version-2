/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://auth.privy.io https://*.privy.io https://cdn.jsdelivr.net https://www.googletagmanager.com https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://auth.privy.io https://*.privy.io https://api.privy.io wss://*.privy.io https://sepolia.base.org https://base-sepolia.g.alchemy.com https://explorer-api.walletconnect.com https://*.walletconnect.com https://*.walletconnect.org",
              "frame-src 'self' https://auth.privy.io https://*.privy.io https://verify.walletconnect.com",
              "frame-ancestors 'self'"
            ].join('; ')
          }
        ]
      }
    ]
  }
}

export default nextConfig
