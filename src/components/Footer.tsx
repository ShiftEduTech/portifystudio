'use client';

import Link from 'next/link';
import { Send } from 'lucide-react';

// Custom Brand Icons as SVG components since Lucide version in this project is outdated (1.7.0)
const Instagram = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Twitter = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-1 2.17-2.75 3.85c1.17 6.26-3.88 11.15-11.25 11.15-4.47 0-7.75-2.65-7.75-2.65 4.54.19 7.11-2.91 7.11-2.91-4-.14-5.27-4.23-5.27-4.23.49.13 1.16.15 1.16.15-4.14-.94-4.85-4.48-4.85-4.48.51.52 1.34.46 1.34.46-3.32-2.31-2.35-4.32-2.35-4.32a9.3 9.3 0 0 0 7.07 4.14C6.15 1.76 10.05.5 12.55.5a4.4 4.4 0 0 1 4.5 4.4c0 .35-.04.69-.11 1.01A10.1 10.1 0 0 0 22 4z" />
  </svg>
);

const Github = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-4.51-2-7-2" />
  </svg>
);

const Youtube = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 2-2h15a2 2 0 0 1 2 2 24.12 24.12 0 0 1 0 10 2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2z" /><path d="m10 15 5-3-5-3z" />
  </svg>
);

const Linkedin = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
  </svg>
);


const socialLinks = [
  { icon: Instagram, href: 'https://www.instagram.com/portifystudio', label: 'Instagram' },
  { icon: Twitter, href: 'https://x.com/PortifyStudio', label: 'Twitter' },
  { icon: Github, href: 'https://github.com/portifystudio', label: 'GitHub' },
  { icon: Youtube, href: 'https://www.youtube.com/@PortifyStudio', label: 'YouTube' },
  { icon: Linkedin, href: 'https://www.linkedin.com/company/portifystudio', label: 'LinkedIn' },
];

export default function Footer() {
  return (
    <footer className="relative bg-transparent pt-24 pb-12 overflow-hidden border-t border-white/[0.05]">
      {/* Background Decorative Element */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gradient-to-t from-blue-500/10 to-transparent blur-3xl pointer-events-none opacity-50"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-12 lg:gap-8 mb-20">
          {/* Brand & Newsletter Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Link href="/" className="flex items-center w-fit hover:opacity-90 transition-opacity">
                <img
                  src="/PortifyStudio_logo.png"
                  alt="Portify Studio"
                  className="h-14 w-auto md:h-16 object-contain drop-shadow-md"
                />
              </Link>
              <p className="text-gray-500 max-w-sm leading-relaxed">
                Empowering developers to build world-class portfolios in minutes. Start your career journey with the right first impression.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white uppercase tracking-widest">Stay Updated</h4>
              <div className="relative max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 pr-12 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-400 transition-colors">
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-widest">Product</h4>
            <div className="flex flex-col gap-3">
              <Link href="/templates" className="text-sm text-gray-500 hover:text-white transition-colors">Templates</Link>
              <Link href="/pricing" className="text-sm text-gray-500 hover:text-white transition-colors">Pricing</Link>
              <Link href="/showcase" className="text-sm text-gray-500 hover:text-white transition-colors">Showcase</Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-widest">Resources</h4>
            <div className="flex flex-col gap-3">
              <Link href="/developer-guide" className="text-sm text-gray-500 hover:text-white transition-colors">Developer Guide</Link>
              <Link href="/blog" className="text-sm text-gray-500 hover:text-white transition-colors">Blog</Link>
              <Link href="/community" className="text-sm text-gray-500 hover:text-white transition-colors">Community</Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-widest">Company</h4>
            <div className="flex flex-col gap-3">
              <Link href="/about" className="text-sm text-gray-500 hover:text-white transition-colors">About Us</Link>
              <Link href="/careers" className="text-sm text-gray-500 hover:text-white transition-colors">Careers</Link>
              <Link href="/contact" className="text-sm text-gray-500 hover:text-white transition-colors">Contact</Link>
            </div>
          </div>

        </div>

        {/* Brand Mark background */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full overflow-hidden pointer-events-none select-none opacity-[0.03] flex justify-center">
          <h2 className="text-[18vw] font-black text-white leading-none whitespace-nowrap tracking-tighter">
            PORTIFY
          </h2>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-colors"
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-gray-600 text-xs font-medium uppercase tracking-widest">
              © Portify Studio by ShiftEduTech
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
