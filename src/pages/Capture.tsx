import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { User, MessageCircle, Flame, ChevronDown, Globe } from 'lucide-react'
import ParticleBackground from '../components/ParticleBackground'
import GlowButton from '../components/GlowButton'
import { countries, Country, formatPhoneNumber } from '../utils/countries'
import { savePreOrder } from '../lib/supabase'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../components/LanguageSwitcher'
import RevealSections from './RevealSections'

interface FormData {
  name: string
  whatsapp: string
  country: string
}

const Capture: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [peopleCount, setPeopleCount] = useState(1000)
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]) // Default to Brazil
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [isPlayerReady, setIsPlayerReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasStartedPlayback, setHasStartedPlayback] = useState(false)
  const [autoPlayRequested, setAutoPlayRequested] = useState(false)
  const [isUiLoading, setIsUiLoading] = useState(false)
  const playerRef = useRef<any>(null)
  const playerContainerRef = useRef<HTMLDivElement | null>(null)
  const youtubeVideoId = 'pZNP5DBnolI'
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      country: 'BR'
    }
  })

  const handleVipClick = () => {
    const name = (userData?.name || 'Usuário').trim()
    const message = encodeURIComponent(`Olá! Quero participar do Grupo VIP Multi Crypto, meu nome é ${name}.`)
    window.open(`https://wa.me/5512982689483?text=${message}`, '_blank')
  }

  const watchedName = watch('name', '')
  const watchedWhatsapp = watch('whatsapp', '')

  // Load and persist people counter
  useEffect(() => {
    const savedCount = localStorage.getItem('multicrypto_people_count')
    const savedTimestamp = localStorage.getItem('multicrypto_last_update')
    
    if (savedCount && savedTimestamp) {
      const lastUpdate = parseInt(savedTimestamp)
      const now = Date.now()
      const secondsPassed = Math.floor((now - lastUpdate) / 1000)
      const incrementsPassed = Math.floor(secondsPassed / 10) // Every 10 seconds
      const newCount = parseInt(savedCount) + (incrementsPassed * 2)
      setPeopleCount(newCount)
      localStorage.setItem('multicrypto_people_count', newCount.toString())
      localStorage.setItem('multicrypto_last_update', now.toString())
    } else {
      const initialCount = 1000
      setPeopleCount(initialCount)
      localStorage.setItem('multicrypto_people_count', initialCount.toString())
      localStorage.setItem('multicrypto_last_update', Date.now().toString())
    }

    // Dynamic people counter - increases by 2 every 10 seconds
    const interval = setInterval(() => {
      setPeopleCount(prev => {
        const newCount = prev + 2
        localStorage.setItem('multicrypto_people_count', newCount.toString())
        localStorage.setItem('multicrypto_last_update', Date.now().toString())
        return newCount
      })
    }, 10000) // 10000ms = 10 seconds

    return () => clearInterval(interval)
  }, [])

  // Carregar YouTube IFrame API e preparar player (vertical 9:16)
  useEffect(() => {
    // Só inicializa o player quando o formulário foi enviado e o container existe
    if (!formSubmitted || !playerContainerRef.current) return

    const ensureYouTubeApi = () => new Promise<void>((resolve) => {
      if ((window as any).YT && (window as any).YT.Player) return resolve()
      const tagId = 'youtube-iframe-api'
      if (!document.getElementById(tagId)) {
        const tag = document.createElement('script')
        tag.id = tagId
        tag.src = 'https://www.youtube.com/iframe_api'
        document.body.appendChild(tag)
      }
      ;(window as any).onYouTubeIframeAPIReady = () => resolve()
    })

    let cancelled = false
    ensureYouTubeApi().then(() => {
      if (cancelled || !playerContainerRef.current || playerRef.current) return
      const YT = (window as any).YT
      console.log('[YT] Creating player in container', playerContainerRef.current)
      playerRef.current = new YT.Player(playerContainerRef.current, {
        videoId: youtubeVideoId,
        width: '100%',
        height: '100%',
        playerVars: {
          // After form submit we can request autoplay
          autoplay: 1,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          fs: 0,
          disablekb: 1,
          playsinline: 1,
          enablejsapi: 1,
          origin: window.location.origin
        },
        events: {
          onReady: () => {
            try {
              if (autoPlayRequested && playerRef.current) {
                console.log('[YT] onReady: autoplay requested, loading and playing')
                try { playerRef.current.mute() } catch {}
                playerRef.current.loadVideoById({ videoId: youtubeVideoId })
              } else {
                console.log('[YT] onReady: cue video only')
                playerRef.current?.cueVideoById({ videoId: youtubeVideoId })
              }
            } catch {}
            setIsPlayerReady(true)
            if (autoPlayRequested && playerRef.current) {
              try { setIsUiLoading(true); playerRef.current.playVideo() } catch {}
            }
          },
          onStateChange: (e: any) => {
            const YTState = (window as any).YT.PlayerState
            if (e.data === YTState.PLAYING) {
              setIsPlaying(true)
              setHasStartedPlayback(true)
              setIsUiLoading(false)
            } else if (e.data === YTState.PAUSED || e.data === YTState.ENDED) {
              setIsPlaying(false)
            }
          }
        }
      })
      // Fallback: if onReady takes too long, try to load video after 1500ms
      setTimeout(() => {
        if (!cancelled && playerRef.current && !isPlayerReady) {
          console.log('[YT] Fallback: forcing loadVideoById')
          try { playerRef.current.mute() } catch {}
          try { playerRef.current.loadVideoById({ videoId: youtubeVideoId }) } catch {}
        }
      }, 1500)
    })

    return () => {
      cancelled = true
      try { if (playerRef.current && playerRef.current.destroy) playerRef.current.destroy() } catch {}
    }
  }, [formSubmitted])

  // Após submeter, iniciar reprodução quando player estiver pronto
  useEffect(() => {
    if (formSubmitted && isPlayerReady && playerRef.current) {
      setIsUiLoading(true)
      setTimeout(() => {
        try { playerRef.current.mute() } catch {}
        try { playerRef.current.playVideo() } catch {}
      }, 50)
    }
  }, [formSubmitted, isPlayerReady])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isCountryDropdownOpen && !target.closest('.country-selector')) {
        setIsCountryDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isCountryDropdownOpen])

  const handleCountrySelect = (country: Country, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    console.log('Selecting country:', country.name, country.code)
    
    setSelectedCountry(country)
    setValue('country', country.code)
    setValue('whatsapp', '') // Clear the phone input when country changes
    setIsCountryDropdownOpen(false)
  }

  const toggleCountryDropdown = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsCountryDropdownOpen(!isCountryDropdownOpen)
  }

  const onSubmit = async (data: FormData) => {
    console.log('Formulário submetido com dados:', data)
    setIsSubmitting(true)
    
    try {
      // Format phone number with country code and remove non-numeric characters
      const formattedPhone = formatPhoneNumber(data.whatsapp, selectedCountry)
      // Remove todos os caracteres não numéricos, exceto o + no início
      const cleanPhone = formattedPhone.replace(/[^0-9+]/g, '')
      console.log('Telefone formatado e limpo:', cleanPhone)
      
      // Save to Supabase pre_order table
      const preOrderData = {
        nome: data.name.trim(),
        telefone: cleanPhone
      }
      console.log('Dados a serem salvos no Supabase:', preOrderData)
      
      const savedData = await savePreOrder(preOrderData)
      console.log('Resposta do savePreOrder:', savedData)
      
      if (savedData) {
        const stored = {
          name: preOrderData.nome,
          whatsapp: preOrderData.telefone,
          id: savedData.id
        }
        localStorage.setItem('multicrypto_user', JSON.stringify(stored))
        setUserData(stored)
        setFormSubmitted(true)
        // Mark autoplay requested due to user's click
        setAutoPlayRequested(true)
        // Try to play immediately if player is ready
        if (isPlayerReady && playerRef.current) {
          try { playerRef.current.mute() } catch {}
          try { setIsUiLoading(true); playerRef.current.playVideo() } catch {}
        }
      } else {
        throw new Error('Failed to save pre-order data')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert(t('capture.saveError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateWhatsApp = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    const countryDigits = selectedCountry.dialCode.replace(/\D/g, '')
    
    // Remove country code if present for validation
    let phoneDigits = cleaned
    if (cleaned.startsWith(countryDigits)) {
      phoneDigits = cleaned.substring(countryDigits.length)
    }
    
    // Country-specific validation
    switch (selectedCountry.code) {
      case 'BR':
        return phoneDigits.length === 11 ? true : t('capture.phoneError.br')
      case 'US':
      case 'CA':
        return phoneDigits.length === 10 ? true : t('capture.phoneError.usca')
      case 'GB':
        return phoneDigits.length >= 10 && phoneDigits.length <= 11 ? true : t('capture.phoneError.gb')
      default:
        return phoneDigits.length >= 8 && phoneDigits.length <= 12 ? true : t('capture.phoneError.default')
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground />
      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Glassmorphism Container */}
          <div className="glassmorphism p-8 relative">
            {/* Logo */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-3xl font-montserrat font-bold text-gradient-gold text-shadow-gold mb-2">
                Multi Crypto
              </h1>
              <div className="w-16 h-1 bg-gradient-gold mx-auto rounded-full glow-gold"></div>
            </motion.div>

            {/* Headlines */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl font-montserrat font-bold text-text-light mb-4 leading-tight">
                {t('capture.title')}
              </h2>
              <p className="text-gold-light font-inter text-sm leading-relaxed">
                {t('capture.subtitle')}
              </p>
            </motion.div>

            {/* Form or Video */}
            {!formSubmitted ? (
              <motion.form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
              {/* Name Field */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-light">
                  <User size={20} />
                </div>
                <input
                  {...register('name', {
                    required: t('capture.nameRequired'),
                    minLength: {
                      value: 3,
                      message: t('capture.nameMin')
                    }
                  })}
                  type="text"
                  placeholder={t('capture.namePlaceholder')}
                  className={`
                    w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl
                    text-text-light placeholder-text-light/60 font-inter
                    focus:outline-none input-glow transition-all duration-300
                    ${errors.name ? 'border-red-500' : watchedName ? 'border-gold/50' : ''}
                  `}
                />
                {errors.name && (
                  <motion.p
                    className="text-red-400 text-xs mt-1 font-inter"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.name.message}
                  </motion.p>
                )}
              </div>

              {/* WhatsApp Field with Country Selector */}
              <div className="relative">
                <div className="flex">
                  {/* Country Selector */}
                  <div className="relative country-selector">
                    <button
                      type="button"
                      onClick={toggleCountryDropdown}
                      className="flex items-center gap-2 px-3 py-3 bg-white/5 border border-white/20 rounded-l-xl border-r-0 text-text-light hover:bg-white/10 transition-all duration-300"
                    >
                      <Globe size={16} className="text-gold-light" />
                      <span className="text-sm">{selectedCountry.flag}</span>
                      <span className="text-xs text-gold-light">{selectedCountry.dialCode}</span>
                      <ChevronDown size={14} className={`text-gold-light transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Country Dropdown */}
                    {isCountryDropdownOpen && (
                      <motion.div
                        className="absolute top-full left-0 w-80 z-50 mt-1 bg-dark-purple/95 backdrop-blur-md border border-gold/30 rounded-xl max-h-60 overflow-y-auto shadow-2xl"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {countries.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={(e) => handleCountrySelect(country, e)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gold/20 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                              selectedCountry.code === country.code ? 'bg-gold/10' : ''
                            }`}
                          >
                            <span className="text-lg">{country.flag}</span>
                            <div className="flex-1">
                              <div className="text-sm text-text-light font-medium">{country.name}</div>
                              <div className="text-xs text-gold-light">{country.dialCode}</div>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Phone Input */}
                  <div className="flex-1 relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-light">
                      <MessageCircle size={20} />
                    </div>
                    <input
                      key={selectedCountry.code} // Force re-render when country changes
                      type="tel"
                      placeholder={selectedCountry.placeholder}
                      className={`
                        w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-r-xl border-l-0
                        text-text-light placeholder-text-light/60 font-inter
                        focus:outline-none input-glow transition-all duration-300
                        ${errors.whatsapp ? 'border-red-500' : watchedWhatsapp ? 'border-gold/50' : ''}
                      `}
                      {...register('whatsapp', {
                        required: t('capture.phoneRequired'),
                        validate: validateWhatsApp
                      })}
                    />
                  </div>
                </div>
                
                {errors.whatsapp && (
                  <motion.p
                    className="text-red-400 text-xs mt-1 font-inter"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.whatsapp.message}
                  </motion.p>
                )}
              </div>

              {/* Submit Button */}
              <GlowButton
                type="submit"
                disabled={!isValid || isSubmitting}
                loading={isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? t('capture.submitProcessing') : t('capture.submitCta')}
              </GlowButton>
              {/* Scroll hint below the form */}
              <motion.div
                className="text-center mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <p className="text-gold-light text-sm font-inter">
                  Role para baixo para obter mais informações
                </p>
              </motion.div>
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="relative w-full aspect-[9/16] bg-black">
                  <div ref={playerContainerRef} className="absolute inset-0" />
                  {/* Área inteira para toggle play/pause */}
                  <button
                    aria-label="Alternar reprodução"
                    onClick={() => {
                      setAutoPlayRequested(true)
                      if (!playerRef.current) return
                      try {
                        if (isPlaying) { playerRef.current.pauseVideo() }
                        else {
                          setIsUiLoading(true)
                          setTimeout(() => {
                            try { playerRef.current.mute() } catch {}
                            try { playerRef.current.playVideo() } catch {}
                          }, 50)
                        }
                      } catch {}
                    }}
                    className="absolute inset-0 z-10 cursor-pointer bg-transparent"
                  />
                  {/* Overlay de play inicial minimalista + loading */}
                  {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.45)] flex items-center justify-center text-black text-3xl font-bold">
                        ►
                      </div>
                      {isUiLoading && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-gold-light text-sm">
                          <div className="w-2 h-2 rounded-full bg-gold animate-bounce" />
                          <div className="w-2 h-2 rounded-full bg-gold animate-bounce [animation-delay:120ms]" />
                          <div className="w-2 h-2 rounded-full bg-gold animate-bounce [animation-delay:240ms]" />
                          <span className="ml-2">Carregando...</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Floating button moved to portal (outside transform/overflow contexts) */}

            {/* People Counter */}
            <motion.div
              className="text-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="flex items-center justify-center gap-2 text-gold-light font-inter text-sm">
                <Flame className="text-gold animate-pulse" size={16} />
                <span>
                  <span className="font-semibold text-gold">{peopleCount.toLocaleString()}</span>
                  {' '}{t('capture.peopleCountText')}
                </span>
              </div>
            </motion.div>

            {/* Security Badge */}
            <motion.div
              className="text-center mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs font-inter">{t('capture.secureData')}</span>
              </div>
            </motion.div>
          </div>

          {/* Bottom Text */}
          {/* Mobile Language Switcher */}
          <div className="sm:hidden mt-5 flex justify-center">
            <LanguageSwitcher />
          </div>
          <motion.p
            className="text-center text-text-light/60 text-xs font-inter mt-4 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            {t('capture.bottom.prefix')}{' '}
            <span className="text-gold hover:text-gold-light cursor-pointer">{t('capture.bottom.terms')}</span>
            {' '} {t('capture.bottom.and')}{' '}
            <span className="text-gold hover:text-gold-light cursor-pointer">{t('capture.bottom.privacy')}</span>
          </motion.p>
        </motion.div>
      </div>
      {/* Reveal sections appended below to keep all info on one page */}
      <div className="relative z-10 mt-8">
        <RevealSections onVipClick={handleVipClick} compact />
      </div>

      {/* Portal: floating VIP button attached to document.body (follows page scroll) */}
      {formSubmitted && hasStartedPlayback && createPortal(
        (
          <motion.div
            className="fixed bottom-8 right-8 z-50"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <GlowButton onClick={handleVipClick} className="rounded-full p-4 shadow-2xl" size="lg">
              <MessageCircle className="w-6 h-6 mr-2" />
              {t('cta.vipGroup')}
            </GlowButton>
          </motion.div>
        ),
        document.body
      )}
    </div>
  )
}

export default Capture
