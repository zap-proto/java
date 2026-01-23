import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cap\'n Proto Java',
  description: 'Java implementation of Cap\'n Proto serialization',
}

const navItems = [
  { href: '/capnp-java/', label: 'Home' },
  { href: '/capnp-java/getting-started/', label: 'Getting Started' },
  { href: '/capnp-java/api/', label: 'API Reference' },
  { href: '/capnp-java/plugin/', label: 'Compiler Plugin' },
  { href: '/capnp-java/examples/', label: 'Examples' },
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/capnp-java/" className="text-xl font-bold">
              Cap'n Proto Java
            </a>
            <nav className="flex gap-6">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-muted hover:text-foreground transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-border mt-16">
          <div className="max-w-6xl mx-auto px-4 py-8 text-center text-muted">
            <p>Cap'n Proto Java - MIT License</p>
            <p className="mt-2">
              <a href="https://github.com/zap-protocol/capnp-java" className="text-primary hover:underline">
                GitHub
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
