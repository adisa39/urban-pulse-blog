'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import {
  LayoutDashboard, FileText, PenSquare, BarChart2,
  Settings, Sun, Moon, Menu, X, ExternalLink, Tag
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/posts', label: 'All Posts', icon: FileText },
  { href: '/admin/new', label: 'New Post', icon: PenSquare },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/admin/tags', label: 'Tags & Categories', icon: Tag },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-5 flex items-center gap-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-serif font-bold text-white text-sm" style={{ background: 'var(--accent)' }}>M</div>
        <div>
          <p className="font-serif font-bold text-sm" style={{ color: 'var(--text-primary)' }}>The Meridian</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setSidebarOpen(false)}
            className={`admin-nav-item ${pathname === href ? 'active' : ''}`}
          >
            <Icon size={17} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 space-y-1" style={{ borderTop: '1px solid var(--border)' }}>
        <button onClick={toggleTheme} className="admin-nav-item w-full text-left">
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <Link href="/" target="_blank" className="admin-nav-item">
          <ExternalLink size={17} />
          View Site
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Desktop sidebar */}
      <aside className="admin-sidebar hidden lg:flex flex-col w-56 fixed top-0 left-0 h-screen z-40">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="admin-sidebar relative w-64 flex flex-col z-50">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4"
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">
        {/* Mobile topbar */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 h-14 nav-blur">
          <button onClick={() => setSidebarOpen(true)} style={{ color: 'var(--text-muted)' }}>
            <Menu size={22} />
          </button>
          <span className="font-serif font-bold" style={{ color: 'var(--text-primary)' }}>Admin</span>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
