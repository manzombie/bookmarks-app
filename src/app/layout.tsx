import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bookmarks',
  description: 'Your personal bookmark manager',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  )
}
