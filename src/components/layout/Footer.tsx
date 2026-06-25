import Link from 'next/link'
import { Car, Facebook, Twitter, Instagram, MessageCircle, Phone, Mail, MapPin } from 'lucide-react'

const FOOTER_LINKS = {
  Categories: [
    { label:'Engine Parts',   href:'/shop?category=engine-parts'   },
    { label:'Service Parts',  href:'/shop?category=service-parts'  },
    { label:'Body Parts',     href:'/shop?category=body-parts'     },
    { label:'Electrical',     href:'/shop?category=efc-components' },
    { label:'Sound Systems',  href:'/shop?category=sound-systems'  },
  ],
  Company: [
    { label:'About Us',       href:'/about'   },
    { label:'Contact',        href:'/contact' },
    { label:'Careers',        href:'/careers' },
    { label:'Trade / Bulk',   href:'/trade'   },
  ],
  Support: [
    { label:'Track Order',    href:'/account/orders' },
    { label:'Returns Policy', href:'/returns'        },
    { label:'Privacy Policy', href:'/privacy'        },
    { label:'FAQ',            href:'/faq'            },
  ],
}

const SOCIAL = [
  { icon:Facebook,      label:'Facebook',   href:'https://facebook.com'        },
  { icon:Twitter,       label:'Twitter/X',  href:'https://x.com'              },
  { icon:Instagram,     label:'Instagram',  href:'https://instagram.com'      },
  { icon:MessageCircle, label:'WhatsApp',   href:'https://wa.me/254700123456' },
]

export function Footer() {
  return (
    <footer className="bg-navy text-white/60" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="w-7 h-7 bg-brand-blue rounded-lg flex items-center justify-center"><Car size={16} className="text-white" aria-hidden /></div>
            <span className="text-white font-bold text-base font-display">AutoParts<span className="text-brand-orange">Pro</span></span>
          </Link>
          <p className="text-xs leading-relaxed text-white/50 max-w-xs">Kenya's most trusted auto parts marketplace. 50,000+ genuine parts with nationwide delivery.</p>
          <div className="space-y-2">
            {[
              { icon:Phone, text:'+254 700 123 456',          href:'tel:+254700123456' },
              { icon:Mail,  text:'hello@autopartspro.co.ke',  href:'mailto:hello@autopartspro.co.ke' },
              { icon:MapPin,text:'Mombasa Road, Nairobi',     href:'#' },
            ].map(({ icon:Icon, text, href }) => (
              <a key={text} href={href} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
                <Icon size={13} className="flex-shrink-0" aria-hidden /><span className="text-xs">{text}</span>
              </a>
            ))}
          </div>
        </div>

        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <div key={heading}>
            <h3 className="text-[11px] font-bold text-white uppercase tracking-widest mb-4">{heading}</h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}><Link href={link.href} className="text-xs text-white/50 hover:text-white transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-4">
          <p className="text-[11px] text-white/30">© {new Date().getFullYear()} AutoPartsPro. All rights reserved. Registered in Kenya.</p>
          <div className="flex items-center gap-2">
            {SOCIAL.map(({ icon:Icon, label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="w-7 h-7 bg-white/8 rounded-lg flex items-center justify-center text-white/50 hover:bg-brand-blue hover:text-white transition-all">
                <Icon size={13} aria-hidden />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
