import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PME Assistant - Gestion Administrative IA',
  description: 'Centralisez et automatisez votre gestion administrative grâce à l\'IA',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="bg-slate-50">
        {children}
      </body>
    </html>
  )
}
