import type { Metadata, Viewport } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { NavbarWrapper } from '@/components/layout/NavbarWrapper'
import { Footer } from '@/components/layout/Footer'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'

const inter = Inter({ subsets:['latin'], variable:'--font-inter', display:'swap' })
const poppins = Poppins({ subsets:['latin'], weight:['600','700','800'], variable:'--font-poppins', display:'swap' })

export const metadata: Metadata = {
  title: { default:"AutoPartsPro — Kenya's #1 Auto Parts Marketplace", template:'%s | AutoPartsPro' },
  description:'Find genuine vehicle parts for Toyota, Nissan, Subaru and more. Over 50,000 parts with nationwide delivery across Kenya.',
  keywords:['auto parts','car parts','Kenya','Toyota parts','Nairobi'],
  openGraph: { type:'website', locale:'en_KE', url:'https://autopartspro.co.ke', siteName:'AutoPartsPro', title:'AutoPartsPro — Genuine Vehicle Parts in Kenya', description:'Over 50,000 parts with nationwide delivery.' },
  robots: { index:true, follow:true },
}

export const viewport: Viewport = { width:'device-width', initialScale:1, themeColor:'#0F172A' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="bg-slate-50 font-sans antialiased min-h-screen flex flex-col">
        <NavbarWrapper />
        <main className="flex-1 pb-16 lg:pb-0">{children}</main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  )
}
