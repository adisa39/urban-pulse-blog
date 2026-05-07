'use client';

import Link from 'next/link';
import { Rss, Mail, ArrowRight } from 'lucide-react';
import { TwitterIcon, LinkedinIcon, GithubIcon } from '@/components/SocialIcons';
import { useState } from 'react';

const categories = ['Technology', 'Design', 'Business', 'Science', 'Culture'];
const quickLinks = [
  { label: 'About', href: '/about' },
  { label: 'Write for Us', href: '/write' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms' },
  { label: 'Advertise', href: '/advertise' },
  { label: 'RSS Feed', href: '/rss' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); }
  };

  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
      {/* Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="newsletter-section p-8 sm:p-12 mb-12">
          <div className="max-w-2xl mx-auto text-center relative z-10">
            <p className="text-sm font-semibold uppercase tracking-widest opacity-80 mb-2">Newsletter</p>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3">
              Stay Ahead of the Curve
            </h3>
            <p className="opacity-80 mb-6 text-sm sm:text-base">
              Get our best stories delivered to your inbox every week. No spam, ever.
            </p>
            {subscribed ? (
              <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 px-6 py-3 rounded-full text-sm font-semibold">
                ✓ You&apos;re subscribed! Welcome aboard.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-medium outline-none"
                  style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
                />
                <button type="submit" className="px-6 py-3 bg-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition hover:bg-opacity-90" style={{ color: 'var(--accent)' }}>
                  Subscribe <ArrowRight size={15} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-serif font-bold text-sm text-white" style={{ background: 'var(--accent)' }}>M</div>
              <span className="font-serif text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Trend Axis</span>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>
              Thoughtful writing on technology, design, business, science and culture. Independent journalism since 2024.
            </p>
            <div className="flex items-center gap-3">
              {[
              { icon: TwitterIcon, href: 'https://twitter.com', label: 'Twitter' },
                { icon: LinkedinIcon, href: 'https://linkedin.com', label: 'LinkedIn' },
                { icon: GithubIcon, href: 'https://github.com', label: 'GitHub' },
                { icon: Rss, href: '/rss', label: 'RSS' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>Topics</h4>
            <ul className="space-y-2">
              {categories.map(cat => (
                <li key={cat}>
                  <Link
                    href={`/category/${cat.toLowerCase()}`}
                    className="text-sm transition-colors hover:underline"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--accent)')}
                    onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--text-secondary)')}
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>Company</h4>
            <ul className="space-y-2">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--accent)')}
                    onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--text-secondary)')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>Contact</h4>
            <a href="mailto:hello@meridian.blog" className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <Mail size={14} /> hello@meridian.blog
            </a>
            <div className="mt-4">
              <div className="ad-space h-24 rounded-lg">
                <span>Ad Space</span>
                <span className="text-xs opacity-60">125 × 125</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Trend Axis. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Built with Next.js & TypeScript
          </p>
        </div>
      </div>
    </footer>
  );
}
