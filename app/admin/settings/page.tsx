'use client';

import { useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { Save, Sun, Moon, Globe, Bell, Shield, Palette, Check } from 'lucide-react';

export default function AdminSettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    siteName: 'The Meridian',
    siteUrl: 'https://meridian.blog',
    siteDescription: 'Thoughtful writing on technology, design, business, science and culture.',
    postsPerPage: '12',
    twitterHandle: '@meridian',
    googleAnalytics: '',
    adSenseId: '',
    enableComments: true,
    enableNewsletter: true,
    enableRSS: true,
    moderateComments: true,
    allowGuestComments: false,
    notifyOnComment: true,
    notifyOnNewSubscriber: true,
  });

  const update = (key: string, value: string | boolean) =>
    setSettings(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    // In production: persist to DB / environment
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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

  const Toggle = ({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) => (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--border)' }}>
      <div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</p>
      </div>
      <label className="toggle flex-shrink-0">
        <input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} />
        <span className="toggle-slider" />
      </label>
    </div>
  );

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Settings</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Configure your blog settings</p>
        </div>
        <button onClick={handleSave} className="btn-primary">
          {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
        </button>
      </div>

      {/* General */}
      <Section title="General" icon={Globe}>
        <Field label="Site Name">
          <input type="text" value={settings.siteName} onChange={e => update('siteName', e.target.value)} className="form-input" />
        </Field>
        <Field label="Site URL" hint="The public URL of your blog">
          <input type="url" value={settings.siteUrl} onChange={e => update('siteUrl', e.target.value)} className="form-input" />
        </Field>
        <Field label="Site Description" hint="Used in SEO meta tags and social shares">
          <textarea
            value={settings.siteDescription}
            onChange={e => update('siteDescription', e.target.value)}
            rows={3}
            className="form-input resize-none"
          />
        </Field>
        <Field label="Posts Per Page">
          <select value={settings.postsPerPage} onChange={e => update('postsPerPage', e.target.value)} className="form-input">
            {['6', '9', '12', '15', '18', '24'].map(n => (
              <option key={n} value={n}>{n} posts</option>
            ))}
          </select>
        </Field>
      </Section>

      {/* Appearance */}
      <Section title="Appearance" icon={Palette}>
        <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Color Theme</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Currently: {theme === 'dark' ? 'Dark mode' : 'Light mode'}</p>
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 btn-secondary py-1.5 px-3 text-sm"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          </button>
        </div>
      </Section>

      {/* Social & Analytics */}
      <Section title="Social & Analytics" icon={Globe}>
        <Field label="Twitter / X Handle" hint="Used for Twitter card meta tags">
          <input type="text" value={settings.twitterHandle} onChange={e => update('twitterHandle', e.target.value)} placeholder="@yourblog" className="form-input" />
        </Field>
        <Field label="Google Analytics ID" hint="e.g. G-XXXXXXXXXX">
          <input type="text" value={settings.googleAnalytics} onChange={e => update('googleAnalytics', e.target.value)} placeholder="G-XXXXXXXXXX" className="form-input" />
        </Field>
        <Field label="Google AdSense Publisher ID" hint="e.g. ca-pub-XXXXXXXXXXXXXXXX — activates ad slots across the site">
          <input type="text" value={settings.adSenseId} onChange={e => update('adSenseId', e.target.value)} placeholder="ca-pub-XXXXXXXXXXXXXXXX" className="form-input" />
        </Field>
      </Section>

      {/* Features */}
      <Section title="Features" icon={Shield}>
        <Toggle label="Comments" desc="Allow readers to comment on articles" value={settings.enableComments} onChange={v => update('enableComments', v)} />
        <Toggle label="Newsletter signup" desc="Show newsletter subscription forms" value={settings.enableNewsletter} onChange={v => update('enableNewsletter', v)} />
        <Toggle label="RSS Feed" desc="Enable /rss endpoint for feed readers" value={settings.enableRSS} onChange={v => update('enableRSS', v)} />
        <Toggle label="Moderate comments" desc="Review comments before they go live" value={settings.moderateComments} onChange={v => update('moderateComments', v)} />
        <Toggle label="Guest comments" desc="Allow comments without an account" value={settings.allowGuestComments} onChange={v => update('allowGuestComments', v)} />
      </Section>

      {/* Notifications */}
      <Section title="Notifications" icon={Bell}>
        <Toggle label="New comments" desc="Email me when a reader leaves a comment" value={settings.notifyOnComment} onChange={v => update('notifyOnComment', v)} />
        <Toggle label="New subscribers" desc="Email me when someone subscribes to the newsletter" value={settings.notifyOnNewSubscriber} onChange={v => update('notifyOnNewSubscriber', v)} />
      </Section>

      <div className="flex justify-end">
        <button onClick={handleSave} className="btn-primary">
          {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
        </button>
      </div>
    </div>
  );
}
