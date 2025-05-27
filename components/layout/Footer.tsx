import Link from "next/link"
import { Sprout } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row md:gap-0">
        <div className="flex items-center gap-2">
          <Sprout className="h-6 w-6 text-green-600" />
          <span className="text-xl font-bold">AgriConnect</span>
        </div>
        <nav className="flex gap-4 sm:gap-6">
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">Terms</Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">Privacy</Link>
          <a
            href="https://www.linkedin.com/in/rahul-rawat01/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Contact
          </a>
        </nav>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} AgriConnect. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
