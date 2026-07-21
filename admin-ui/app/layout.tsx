import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HB Chain Finance Admin',
  description: 'Multi-signature and Maintenance Panel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
