'use client';

import { useState } from 'react';
import { Link2, Check, Mail } from 'lucide-react';
import { TwitterIcon, LinkedinIcon, FacebookIcon, WhatsappIcon } from '@/components/SocialIcons';

interface ShareButtonsProps {
  url: string;
  title: string;
  excerpt?: string;
  compact?: boolean;
}

export default function ShareButtons({ url, title, excerpt = '', compact = false }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const encoded = {
    url: encodeURIComponent(url),
    title: encodeURIComponent(title),
    text: encodeURIComponent(excerpt ? `${title} — ${excerpt}` : title),
  };

  const shareLinks = [
    {
      label: 'Twitter / X',
      className: 'share-btn share-twitter',
      href: `https://twitter.com/intent/tweet?text=${encoded.title}&url=${encoded.url}`,
      icon: <TwitterIcon size={14} />,
    },
    {
      label: 'Facebook',
      className: 'share-btn share-facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded.url}`,
      icon: <FacebookIcon size={14} />,
    },
    {
      label: 'LinkedIn',
      className: 'share-btn share-linkedin',
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encoded.url}&title=${encoded.title}`,
      icon: <LinkedinIcon size={14} />,
    },
    {
      label: 'WhatsApp',
      className: 'share-btn share-whatsapp',
      href: `https://api.whatsapp.com/send?text=${encoded.text}%20${encoded.url}`,
      icon: <WhatsappIcon size={14} />,
    },
    {
      label: 'Email',
      className: 'share-btn share-copy',
      href: `mailto:?subject=${encoded.title}&body=${encoded.text}%0A%0A${encoded.url}`,
      icon: <Mail size={14} />,
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement('input');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openShare = (href: string) => window.open(href, '_blank', 'width=600,height=450,scrollbars=yes,noopener,noreferrer');

  if (compact) {
    return (
      <div className="relative">
        <button onClick={() => setShowAll(v => !v)} className="share-btn share-copy flex items-center gap-2" aria-label="Share">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          Share
        </button>
        {showAll && (
          <div className="absolute bottom-full left-0 mb-2 flex flex-col gap-1 p-2 rounded-xl shadow-xl z-50" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', minWidth: 170 }}>
            {shareLinks.map(({ label, className, href, icon }) => (
              <button key={label} onClick={() => { openShare(href); setShowAll(false); }} className={`share-btn ${className} w-full justify-start text-xs`}>
                {icon} {label}
              </button>
            ))}
            <button onClick={() => { copyLink(); setShowAll(false); }} className="share-btn share-copy w-full justify-start text-xs">
              {copied ? <Check size={13} /> : <Link2 size={13} />}
              {copied ? 'Copied!' : 'Copy link'}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
        Share this article
      </p>
      <div className="flex flex-wrap gap-2">
        {shareLinks.map(({ label, className, href, icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
            aria-label={`Share on ${label}`}
            onClick={e => {
              if (href.startsWith('mailto')) return; // let default handle
              e.preventDefault();
              window.open(href, '_blank', 'width=600,height=450,scrollbars=yes');
            }}
          >
            {icon}
            <span className="hidden sm:inline">{label}</span>
          </a>
        ))}

        {/* Copy link */}
        <button
          onClick={copyLink}
          className="share-btn share-copy"
          aria-label="Copy link"
        >
          {copied ? <Check size={14} /> : <Link2 size={14} />}
          <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Link'}</span>
        </button>
      </div>
    </div>
  );
}
