'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import { Sun, Moon, Menu, X, Search, Rss } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Technology', href: '/category/technology' },
  { label: 'Design', href: '/category/design' },
  { label: 'Business', href: '/category/business' },
  { label: 'Science', href: '/category/science' },
  { label: 'Culture', href: '/category/culture' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
  }, [mobileOpen]);

  return (
    <>
      <nav
        className="nav-blur fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{ boxShadow: scrolled ? '0 4px 20px var(--shadow)' : 'none' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-serif font-bold text-sm text-white"
                style={{ background: 'var(--accent)' }}
              >
                t.a
              </div>
              <span
                className="font-serif text-xl font-bold tracking-tight hidden sm:block"
                style={{ color: 'var(--text-primary)' }}
              >
                Trend Axis
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={e => {
                    (e.target as HTMLElement).style.background = 'var(--accent-light)';
                    (e.target as HTMLElement).style.color = 'var(--accent)';
                  }}
                  onMouseLeave={e => {
                    (e.target as HTMLElement).style.background = 'transparent';
                    (e.target as HTMLElement).style.color = 'var(--text-secondary)';
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              {searchOpen ? (
                <div className="flex items-center gap-2 animate-fade-in">
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                      }
                      if (e.key === 'Escape') setSearchOpen(false);
                    }}
                    placeholder="Search articles..."
                    className="form-input w-48 sm:w-64 py-1.5 text-sm"
                  />
                  <button onClick={() => setSearchOpen(false)} className="p-1.5 rounded-lg" style={{ color: 'var(--text-muted)' }}>
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-lg transition-all"
                  style={{ color: 'var(--text-muted)' }}
                  aria-label="Search"
                >
                  <Search size={18} />
                </button>
              )}

              {/* RSS */}
              <Link
                href="/rss"
                className="p-2 rounded-lg hidden sm:flex"
                style={{ color: 'var(--text-muted)' }}
                aria-label="RSS Feed"
              >
                <Rss size={17} />
              </Link>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg transition-all"
                style={{ color: 'var(--text-muted)' }}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Admin */}
              {/* <Link
                href="/admin"
                className="btn-primary hidden sm:inline-flex py-1.5 px-3 text-sm"
              >
                Admin
              </Link> */}

              {/* Mobile hamburger */}
              <button
                className="p-2 lg:hidden"
                style={{ color: 'var(--text-muted)' }}
                onClick={() => setMobileOpen(true)}
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <span className="font-serif text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Trend Axis</span>
          <button onClick={() => setMobileOpen(false)} style={{ color: 'var(--text-muted)' }}>
            <X size={24} />
          </button>
        </div>
        <div className="p-4 flex flex-col gap-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="admin-nav-item text-base py-3"
            >
              {link.label}
            </Link>
          ))}
          {/* <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
            <Link href="/admin" onClick={() => setMobileOpen(false)} className="btn-primary w-full justify-center">
              Admin Dashboard
            </Link>
          </div> */}
        </div>
      </div>
    </>
  );
}
