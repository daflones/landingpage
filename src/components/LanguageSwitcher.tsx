import React from 'react'
import { useTranslation } from 'react-i18next'
// Using inline SVG for crisper rendering on Windows/low-DPI displays

interface LanguageSwitcherProps {
  className?: string
  ariaLabel?: string
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '', ariaLabel = 'Language' }) => {
  const { t, i18n } = useTranslation()
  const currentLang = (i18n.language || 'pt').split('-')[0]

  const onChange = (value: string) => {
    i18n.changeLanguage(value)
    try {
      localStorage.setItem('i18nextLng', value)
    } catch {}
    if (typeof document !== 'undefined') {
      document.documentElement.lang = value
    }
  }

  return (
    <div className="relative inline-flex items-center">
      <svg
        className="absolute left-2 top-1/2 -translate-y-1/2 text-gold-light pointer-events-none"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ shapeRendering: 'geometricPrecision' }}
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <path d="M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" stroke="currentColor" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
        <path d="M3 12h18M5 8c4.5 1.5 9.5 1.5 14 0M5 16c4.5-1.5 9.5-1.5 14 0" stroke="currentColor" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
      </svg>
      <select
        className={`bg-black/40 border border-white/20 text-text-light text-sm rounded-md pl-8 pr-2 py-1 focus:outline-none focus:ring-2 focus:ring-gold/60 ${className || ''}`}
        value={currentLang}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
      >
        <option value="pt">{t('languages.pt')}</option>
        <option value="en">{t('languages.en')}</option>
        <option value="es">{t('languages.es')}</option>
      </select>
    </div>
  )
}

export default LanguageSwitcher
