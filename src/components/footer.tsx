import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-background py-12 border-t">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col">
            <div className="text-xl font-bold mb-4">Death Note</div>
            <p className="text-muted-foreground mb-6">
              A secure, thoughtful way to share your final messages<br />
              with loved ones only when needed.
            </p>
            <div className="mt-auto">
              <p className="text-sm text-muted-foreground">© 2025 Death Note. All rights reserved.</p>
              <p className="mt-2 text-sm text-muted-foreground">Thoughtfully designed with privacy in mind.</p>
            </div>
          </div>
          <div>
            <p className="font-semibold mb-4">Navigation</p>
            <ul className="space-y-2">
              <li><Link href="/" className="text-muted-foreground hover:text-foreground">Home</Link></li>
              <li><Link href="/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</Link></li>
              <li><Link href="/editor" className="text-muted-foreground hover:text-foreground">Note Editor</Link></li>
              <li><Link href="/contacts" className="text-muted-foreground hover:text-foreground">Manage Contacts</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-4">Legal</p>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact Us</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
} 