import type { ContactType, SectionIcon } from '../models/portfolio'

export function ContactIcon({ type }: { type: ContactType }) {
  return (
    <b className={`contact-icon contact-${type}`} aria-hidden="true">
      {type === 'email' && (
        <svg viewBox="0 0 24 24">
          <path d="M4 6h16v12H4z" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      )}
      {type === 'github' && (
        <svg viewBox="0 0 24 24">
          <path d="M12 2.8a9.2 9.2 0 0 0-2.9 17.9c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.6 1.1 1.6 1.1.9 1.6 2.4 1.1 2.9.8.1-.7.4-1.1.7-1.4-2.2-.3-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7 3.6 3.6 0 0 1 .1-2.6s.9-.3 2.8 1a9.7 9.7 0 0 1 5.2 0c1.9-1.3 2.8-1 2.8-1 .5 1.3.2 2.3.1 2.6a3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.7-4.6 5 .4.3.7 1 .7 2v2.5c0 .3.2.6.7.5A9.2 9.2 0 0 0 12 2.8Z" />
        </svg>
      )}
      {type === 'linkedin' && (
        <svg viewBox="0 0 24 24">
          <path d="M5.2 9.1h3.1v9.7H5.2zM6.8 5.2a1.8 1.8 0 1 1 0 3.5 1.8 1.8 0 0 1 0-3.5ZM10.4 9.1h3v1.3c.4-.8 1.5-1.6 3-1.6 3.2 0 3.8 2.1 3.8 4.8v5.2h-3.1v-4.6c0-1.1 0-2.5-1.5-2.5s-1.8 1.2-1.8 2.4v4.7h-3.1V9.1Z" />
        </svg>
      )}
      {type === 'whatsapp' && (
        <svg viewBox="0 0 24 24">
          <path d="M12 3.4a8.4 8.4 0 0 0-7.1 12.9L4 20.6l4.4-1A8.4 8.4 0 1 0 12 3.4Z" />
          <path d="M9.3 8.2c-.2-.4-.4-.4-.7-.4h-.5c-.2 0-.5.1-.8.4-.3.4-1 1-1 2.3s1 2.7 1.1 2.9c.1.2 2 3.2 4.9 4.3 2.4.9 2.9.7 3.4.7.5 0 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4s-.2-.2-.5-.4l-1.8-.9c-.3-.1-.5-.2-.7.2l-.7.9c-.1.2-.3.2-.6.1-.3-.2-1.2-.4-2.3-1.4-.8-.8-1.4-1.7-1.6-2-.2-.3 0-.4.1-.6l.5-.6c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5Z" />
        </svg>
      )}
      {type === 'instagram' && (
        <svg viewBox="0 0 24 24">
          <rect x="4" y="4" width="16" height="16" rx="5" />
          <circle cx="12" cy="12" r="3.5" />
          <circle cx="16.8" cy="7.2" r=".8" />
        </svg>
      )}
      {type === 'x' && (
        <svg viewBox="0 0 24 24">
          <path d="M4.5 4.5h4.2l4.1 5.6 4.9-5.6h1.9l-5.9 6.8 6.1 8.2h-4.2l-4.5-6.1-5.4 6.1H3.8l6.4-7.3Z" />
        </svg>
      )}
      {type === 'portfolio' && (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8.5" />
          <path d="M3.8 12h16.4M12 3.5c2 2.2 3.1 5 3.1 8.5S14 18.3 12 20.5c-2-2.2-3.1-5-3.1-8.5S10 5.7 12 3.5Z" />
        </svg>
      )}
    </b>
  )
}

export function DesktopShortcutIcon({ icon }: { icon: SectionIcon }) {
  return <SectionIconGlyph desktop icon={icon} />
}

export function DesktopEmptyState({ message }: { message: string }) {
  return (
    <div className="desktop-empty-state">
      <span aria-hidden="true">i</span>
      <p>{message}</p>
    </div>
  )
}

export function SectionIconGlyph({ desktop = false, icon }: { desktop?: boolean; icon: SectionIcon }) {
  const iconClass = icon === 'home' ? 'icon-computer' : icon === 'code' ? 'icon-stack' : `icon-${icon}`
  const className = `${desktop ? 'section-icon-glyph desktop-site-icon-art' : 'section-icon-glyph'} ${iconClass}`

  if (icon === 'folder' || icon === 'mail' || icon === 'home' || icon === 'user' || icon === 'briefcase' || icon === 'message' || icon === 'link') {
    return <span className={className} aria-hidden="true"><i /><b /></span>
  }

  if (icon === 'code') {
    return <span className={className} aria-hidden="true"><i /><i /><i /></span>
  }

  if (icon === 'calendar') {
    return <span className={className} aria-hidden="true"><b>26</b></span>
  }

  if (icon === 'award') {
    return <span className={className} aria-hidden="true"><i /><b>1</b></span>
  }

  if (icon === 'terminal') {
    return <span className={className} aria-hidden="true"><b>&gt;_</b></span>
  }

  return <span className={className} aria-hidden="true"><i /><i /><i /></span>
}
