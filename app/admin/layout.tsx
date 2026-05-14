'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import {
  LayoutDashboard, FileText, PenSquare, Settings, Sun, Moon,
  Menu, X, ExternalLink, BarChart2, Globe, Tag, LogOut, User
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard',  href: '/admin',            icon: LayoutDashboard },
  { label: 'All Posts',  href: '/admin/posts',       icon: FileText },
  { label: 'New Post',   href: '/admin/new',         icon: PenSquare },
  { label: 'Analytics', href: '/admin/analytics',   icon: BarChart2 },
  { label: 'Tags',       href: '/admin/tags',        icon: Tag },
  { label: 'Settings',  href: '/admin/settings',    icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; avatar?: string | null } | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.user) setUser(data.user); })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 h-16 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="w-7 h-7 rounded-full flex items-center justify-center font-serif font-bold text-xs text-white" style={{ background: 'var(--accent)' }}>
          M
        </div>
        <div>
          <p className="font-serif font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Trend Axis</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
          return (
            <Link key={href} href={href} onClick={() => setSidebarOpen(false)} className={`admin-nav-item ${active ? 'active' : ''}`}>
              <Icon size={16} /> {label}
            </Link>
          );
        })}
      </nav>

      {/* User + bottom */}
      <div className="px-3 py-4 space-y-1 flex-shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
        {user && (
          <div className="flex items-center gap-2 px-3 py-2 mb-2 rounded-lg" style={{ background: 'var(--accent-light)' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent)', color: '#fff', fontSize: 12 }}>
              {user.name?.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
              <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
            </div>
          </div>
        )}
        <button onClick={toggleTheme} className="admin-nav-item w-full">
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <Link href="/" target="_blank" className="admin-nav-item">
          <Globe size={16} /> View Site <ExternalLink size={11} className="ml-auto opacity-40" />
        </Link>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="admin-nav-item w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOut size={16} /> {loggingOut ? 'Signing out…' : 'Sign Out'}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Desktop sidebar */}
      <aside className="admin-sidebar hidden lg:flex flex-col w-60 fixed top-0 left-0 bottom-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-black/50" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside className={`admin-sidebar fixed top-0 left-0 bottom-0 z-50 w-64 flex flex-col lg:hidden transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-5 h-16 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          <span className="font-serif font-bold" style={{ color: 'var(--text-primary)' }}>Admin</span>
          <button onClick={() => setSidebarOpen(false)} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 flex items-center gap-4 px-4 sm:px-6 h-16" style={{ background: 'var(--nav-bg)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>
          <button className="lg:hidden p-1.5 rounded-lg" style={{ color: 'var(--text-muted)' }} onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <Link href="/admin/new" className="btn-primary py-1.5 px-3 text-sm hidden sm:inline-flex">
              <PenSquare size={14} /> New Post
            </Link>
            {user && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'var(--accent)' }}>
                {user.name?.charAt(0)}
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
