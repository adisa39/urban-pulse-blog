'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { Save, Sun, Moon, Globe, Bell, Shield, Palette, Check, Loader } from 'lucide-react';

export default function AdminSettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState({
    siteName: 'Trend Axis',
    siteUrl: 'https://meridian.blog',
    siteDescription: 'Thoughtful writing on technology, design, business, science and culture.',
    postsPerPage: '12',
    twitterHandle: '@meridian',
    googleAnalyticsId: '',
    adSensePublisherId: '',
    enableComments: 'true',
    enableNewsletter: 'true',
    enableRSS: 'true',
    moderateComments: 'true',
    allowGuestComments: 'false',
    notifyOnComment: 'true',
    notifyOnNewSubscriber: 'true',
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        setSettings(prev => ({ ...prev, ...data }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const update = (key: string, value: string) => setSettings(prev => ({ ...prev, [key]: value }));
  const toggle = (key: string) => update(key, settings[key as keyof typeof settings] === 'true' ? 'false' : 'true');
  const bool = (key: string) => settings[key as keyof typeof settings] === 'true';

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const Section = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
    <div className="card p-6 mb-6">
      <div className="flex items-center gap-2 mb-5 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <Icon size={16} style={{ color: 'var(--accent)' }} />
        <h2 className="font-serif font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
      </div>
      {children}
    </div>
  );

  const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
    <div className="mb-4">
      <label className="form-label">{label}</label>
      {children}
      {hint && <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{hint}</p>}
    </div>
  );

  const Toggle = ({ label, desc, k }: { label: string; desc: string; k: string }) => (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--border)' }}>
      <div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</p>
      </div>
      <label className="toggle flex-shrink-0">
        <input type="checkbox" checked={bool(k)} onChange={() => toggle(k)} />
        <span className="toggle-slider" />
      </label>
    </div>
  );

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
    </div>
  );

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Settings</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Configure your blog</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? <Loader size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
          {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      <Section title="General" icon={Globe}>
        <Field label="Site Name">
          <input type="text" value={settings.siteName} onChange={e => update('siteName', e.target.value)} className="form-input" />
        </Field>
        <Field label="Site URL" hint="The public URL of your blog">
          <input type="url" value={settings.siteUrl} onChange={e => update('siteUrl', e.target.value)} className="form-input" />
        </Field>
        <Field label="Site Description" hint="Used in SEO meta tags (150–160 chars)">
          <textarea value={settings.siteDescription} onChange={e => update('siteDescription', e.target.value)} rows={3} className="form-input resize-none" />
          <p className="text-xs mt-0.5" style={{ color: settings.siteDescription.length > 160 ? '#ef4444' : 'var(--text-muted)' }}>{settings.siteDescription.length}/160</p>
        </Field>
        <Field label="Posts Per Page">
          <select value={settings.postsPerPage} onChange={e => update('postsPerPage', e.target.value)} className="form-input">
            {['6', '9', '12', '15', '18', '24'].map(n => <option key={n} value={n}>{n} posts</option>)}
          </select>
        </Field>
      </Section>

      <Section title="Appearance" icon={Palette}>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Color Theme</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Currently: {theme === 'dark' ? 'Dark mode' : 'Light mode'}</p>
          </div>
          <button onClick={toggleTheme} className="btn-secondary py-1.5 px-3 text-sm flex items-center gap-2">
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          </button>
        </div>
      </Section>

      <Section title="Social & Analytics" icon={Globe}>
        <Field label="Twitter / X Handle" hint="Used for Twitter Card meta tags">
          <input type="text" value={settings.twitterHandle} onChange={e => update('twitterHandle', e.target.value)} placeholder="@yourblog" className="form-input" />
        </Field>
        <Field label="Google Analytics ID" hint="e.g. G-XXXXXXXXXX — paste into layout.tsx to activate">
          <input type="text" value={settings.googleAnalyticsId} onChange={e => update('googleAnalyticsId', e.target.value)} placeholder="G-XXXXXXXXXX" className="form-input" />
        </Field>
        <Field label="Google AdSense Publisher ID" hint="e.g. ca-pub-XXXXXXXXXXXXXXXX — activates ad slots across the site">
          <input type="text" value={settings.adSensePublisherId} onChange={e => update('adSensePublisherId', e.target.value)} placeholder="ca-pub-XXXXXXXXXXXXXXXX" className="form-input" />
        </Field>
      </Section>

      <Section title="Features" icon={Shield}>
        <Toggle label="Comments" desc="Allow readers to comment on articles" k="enableComments" />
        <Toggle label="Newsletter signup" desc="Show newsletter subscription forms" k="enableNewsletter" />
        <Toggle label="RSS Feed" desc="Enable /rss endpoint for feed readers" k="enableRSS" />
        <Toggle label="Moderate comments" desc="Review comments before they go live" k="moderateComments" />
        <Toggle label="Guest comments" desc="Allow comments without an account" k="allowGuestComments" />
      </Section>

      <Section title="Notifications" icon={Bell}>
        <Toggle label="New comments" desc="Email when a reader leaves a comment" k="notifyOnComment" />
        <Toggle label="New subscribers" desc="Email when someone subscribes" k="notifyOnNewSubscriber" />
      </Section>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? <Loader size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
          {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
