import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Eye, CheckCircle, Clock, Users, Award } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="hero-gradient text-white py-20 lg:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance heading-gradient">
            Join the Future of Credentialing with AvaCertify
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-3xl mx-auto text-pretty font-medium">
            Experience secure, tamper-proof and verifiable digital credentials on Avalanche.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="btn-primary text-white font-semibold px-8 py-3">
              <Link href="/dashboard">Get Started</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="btn-secondary font-semibold px-8 py-3 bg-transparent"
            >
              <Link href="/verify">Verify Certificate</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Key Features</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="feature-card-hover border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-2 ring-primary/20">
                  <Shield className="h-8 w-8 icon-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Secure</h3>
                <p className="text-muted-foreground text-pretty leading-relaxed">
                  Leverage blockchain technology for tamper-proof and tamper-evident certificate storage.
                </p>
              </CardContent>
            </Card>

            <Card className="feature-card-hover border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-2 ring-accent/20">
                  <Eye className="h-8 w-8 icon-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Transparent</h3>
                <p className="text-muted-foreground text-pretty leading-relaxed">
                  Public verification with full transparency and immutable audit trails.
                </p>
              </CardContent>
            </Card>

            <Card className="feature-card-hover border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-2 ring-primary/20">
                  <CheckCircle className="h-8 w-8 icon-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Verifiable</h3>
                <p className="text-muted-foreground text-pretty leading-relaxed">
                  Instant verification without relying on issuing institutions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Problem We Solve */}
      <section className="py-20 hero-gradient text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 heading-gradient">The Problem We Solve</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Time-Consuming Verification</h3>
                <p className="text-white/90 text-pretty leading-relaxed">
                  Manual verification processes are slow and resource-intensive.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Lack of Trust</h3>
                <p className="text-white/90 text-pretty leading-relaxed">
                  Traditional systems are vulnerable to fraud and manipulation.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Counterfeit Certificates</h3>
                <p className="text-white/90 text-pretty leading-relaxed">
                  Fraudulent certificates undermine the value of genuine credentials.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8 text-pretty leading-relaxed">
            Join the future of secure, efficient certificate management and verification.
          </p>
          <Button asChild size="lg" className="btn-primary text-white font-semibold px-8 py-3">
            <Link href="/dashboard">Create Certificate</Link>
          </Button>
        </div>
      </section>

      <footer className="bg-secondary text-secondary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4 text-white">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/features" className="hover:text-primary interactive-hover transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-primary interactive-hover transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-primary interactive-hover transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="hover:text-primary interactive-hover transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-primary interactive-hover transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary interactive-hover transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/docs" className="hover:text-primary interactive-hover transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-primary interactive-hover transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-primary interactive-hover transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Connect</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-primary interactive-hover transition-colors">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary interactive-hover transition-colors">
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary interactive-hover transition-colors">
                    GitHub
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 AvaCertify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
