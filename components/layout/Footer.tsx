import Link from "next/link"
import { Sprout, Github, Linkedin, Twitter, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Sprout className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">FarmConnect</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connecting farmers directly with businesses. Eliminate middlemen, ensure fair pricing, and promote sustainable agriculture.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-green-600">Platform</h3>
            <ul className="space-y-2.5">
              <li><Link href="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Browse Products</Link></li>
              <li><Link href="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Join as Farmer</Link></li>
              <li><Link href="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Join as Buyer</Link></li>
              <li><Link href="/orders" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Track Orders</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-green-600">Resources</h3>
            <ul className="space-y-2.5">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Farming Guide</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">API Docs</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Support</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-green-600">Legal</h3>
            <ul className="space-y-2.5">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Refund Policy</Link></li>
              <li>
                <a
                  href="https://www.linkedin.com/in/rahul-rawat01/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} FarmConnect. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-green-600 transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/rahul-rawat01/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-green-600 transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-green-600 transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="mailto:contact@farmconnect.in" className="text-muted-foreground hover:text-green-600 transition-colors">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
