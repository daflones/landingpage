import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Shield, Zap, Star, Lock, TrendingUp, Users, Award } from 'lucide-react'
import CountdownTimer from '../components/CountdownTimer'
import GlowButton from '../components/GlowButton'
import ParticleBackground from '../components/ParticleBackground'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../components/LanguageSwitcher'

const Reveal: React.FC = () => {
  const [userData, setUserData] = useState<any>(null)
  const { t } = useTranslation()
  // Data de lançamento: 20 de agosto de 2025, 00:00:00 (horário de Brasília)
  const launchDate = "2025-08-20T00:00:00-03:00"
  const youtubeVideoId = "dQw4w9WgXcQ" // Replace with actual video ID

  useEffect(() => {
    // Get user data from localStorage (in real app, this would come from Supabase)
    const storedUser = localStorage.getItem('multicrypto_user')
    if (storedUser) {
      setUserData(JSON.parse(storedUser))
    }
  }, [])

  const benefits = [
    {
      icon: <Lock className="w-8 h-8" />,
      title: t('benefits.security.title'),
      description: t('benefits.security.desc')
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: t('benefits.speed.title'),
      description: t('benefits.speed.desc')
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: t('benefits.innovation.title'),
      description: t('benefits.innovation.desc')
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: t('benefits.profit.title'),
      description: t('benefits.profit.desc')
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: t('benefits.community.title'),
      description: t('benefits.community.desc')
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: t('benefits.awarded.title'),
      description: t('benefits.awarded.desc')
    }
  ]

  const handleWhatsAppClick = () => {
    const name = (userData?.name || 'Usuário').trim()
    const message = encodeURIComponent(`Olá! Quero participar do Grupo VIP Multi Crypto, meu nome é ${name}.`)
    // WhatsApp oficial: +55 (43) 9919-6721 → formato wa.me: 554399196721
    window.open(`https://wa.me/554399196721?text=${message}`, '_blank')
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-dark-purple via-dark-blue to-primary-purple">
      <ParticleBackground />
      
      {/* Fixed Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 glassmorphism border-b border-white/10 backdrop-blur-sm"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-montserrat font-bold text-gradient-gold">
              Multi Crypto
            </h1>
            {userData && (
              <span className="text-gold-light text-sm">
                {t('header.welcome', { name: userData.name.split(' ')[0] })}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <CountdownTimer targetDate={launchDate} size="sm" />
            </div>
            <div className="sm:hidden">
              <CountdownTimer targetDate={launchDate} size="xs" />
            </div>
            <div className="ml-3">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="pt-24 relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 py-12 crypto-grid">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold text-text-light mb-6 text-shadow px-4">
              {t('countdown.launchIn')}
            </h2>
            <div className="mb-8 sm:mb-12">
              <CountdownTimer targetDate={launchDate} size="lg" />
            </div>
          </motion.div>

          {/* YouTube Video */}
          <motion.div
            className="w-full max-w-4xl mx-auto aspect-video rounded-lg sm:rounded-xl overflow-hidden border border-gold/20 sm:border-2 border-gold/30 shadow-lg shadow-gold/10"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: 'spring' }}
          >
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=0&controls=1&showinfo=0&rel=0`}
              title="Multi Crypto - Lançamento"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </motion.div>

          {/* Floating WhatsApp Button */}
          <motion.div
            className="fixed bottom-8 right-8 z-50"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <GlowButton
              onClick={handleWhatsAppClick}
              className="rounded-full p-4 shadow-2xl"
              size="lg"
            >
              <MessageCircle className="w-6 h-6 mr-2" />
              {t('cta.vipGroup')}
            </GlowButton>
          </motion.div>

          {/* Main CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <GlowButton
              onClick={handleWhatsAppClick}
              size="lg"
              className="text-xl px-12 py-6"
            >
              <MessageCircle className="w-6 h-6 mr-3" />
              {t('cta.enterVipNow')}
            </GlowButton>
          </motion.div>
        </section>

        {/* About Section */}
        <section className="py-12 sm:py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-4xl font-montserrat font-bold text-text-light mb-6">
                {t('about.title')}
              </h3>
              <p className="text-xl text-gold-light max-w-3xl mx-auto leading-relaxed">
                {t('about.text')}
              </p>
            </motion.div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="glassmorphism p-4 sm:p-6 rounded-lg border border-white/10 hover:border-gold/50 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div className="text-gold mb-3 sm:mb-4">
                    {React.cloneElement(benefit.icon, { className: 'w-6 h-6 sm:w-8 sm:h-8' })}
                  </div>
                  <h3 className="text-lg sm:text-xl font-montserrat font-bold text-text-light mb-1 sm:mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm sm:text-base text-text-light/80">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Different Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-dark-purple/50 to-primary-purple/50">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-4xl font-montserrat font-bold text-text-light mb-8">
                {t('why.title')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div className="glassmorphism p-8">
                  <h4 className="text-2xl font-montserrat font-semibold text-gold mb-4">
                    {t('why.aiTitle')}
                  </h4>
                  <p className="text-gold-light font-inter leading-relaxed">
                    {t('why.aiText')}
                  </p>
                </div>
                
                <div className="glassmorphism p-8">
                  <h4 className="text-2xl font-montserrat font-semibold text-gold mb-4">
                    {t('why.globalTitle')}
                  </h4>
                  <p className="text-gold-light font-inter leading-relaxed">
                    {t('why.globalText')}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Plans & Yields Section (Examples) */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-4xl font-montserrat font-bold text-text-light mb-4">
                {t('plans.title')}
              </h3>
              <p className="text-gold-light font-inter max-w-3xl mx-auto">
                {t('plans.subtitle')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'Crypto Starter', invest: 40, daily: 2, roi: 150, limit: '0/3' },
                { name: 'Bitcoin Bronze', invest: 100, daily: 5, roi: 150, limit: '0/3' },
                { name: 'Ethereum Silver', invest: 250, daily: 15, roi: 180, limit: '1/3' },
                { name: 'DeFi Basic', invest: 500, daily: 30, roi: 180, limit: '0/3' },
                { name: 'Bitcoin Gold', invest: 750, daily: 50, roi: 200, limit: '0/2' },
                { name: 'Ethereum Platinum', invest: 1000, daily: 80, roi: 240, limit: '0/2' },
                { name: 'DeFi Advanced', invest: 1500, daily: 150, roi: 300, limit: '0/2' },
                { name: 'Crypto Master', invest: 2500, daily: 300, roi: 360, limit: '0/2' }
              ].map((p, idx) => (
                <motion.div
                  key={p.name}
                  className="glassmorphism p-6 rounded-xl border border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xl font-montserrat font-semibold text-text-light">{p.name}</h4>
                    <span className="text-xs px-2 py-1 rounded-full bg-gold/10 text-gold">{t('plans.duration')}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-text-light/70">{t('plans.labels.investment')}</div>
                      <div className="text-text-light font-bold">{
                        p.invest.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                      }</div>
                    </div>
                    <div>
                      <div className="text-text-light/70">{t('plans.labels.daily')}</div>
                      <div className="text-text-light font-bold">~ {
                        p.daily.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                      }</div>
                    </div>
                    <div>
                      <div className="text-text-light/70">{t('plans.labels.totalEarnings')}</div>
                      <div className="text-text-light font-bold">{
                        (p.daily * 30).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                      }</div>
                    </div>
                    <div>
                      <div className="text-text-light/70">{t('plans.labels.totalReturn')}</div>
                      <div className="text-text-light font-bold">{
                        (p.invest + p.daily * 30).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                      }</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gold to-yellow-400"
                        style={{ width: `${Math.min(p.roi, 400)}%` }}
                      />
                    </div>
                    <div className="text-right text-gold-light text-xs mt-1">{t('plans.labels.roi')}: {p.roi}%</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-4xl font-montserrat font-bold text-text-light mb-8">
                {t('technology.title')}
              </h3>
              
              <div className="glassmorphism p-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-6xl mb-4">⚡</div>
                    <h4 className="text-xl font-montserrat font-semibold text-gold mb-2">
                      Lightning Network
                    </h4>
                    <p className="text-gold-light font-inter">
                      {t('technology.lightning')}
                    </p>
                  </div>
                  
                  <div>
                    <div className="text-6xl mb-4">🔐</div>
                    <h4 className="text-xl font-montserrat font-semibold text-gold mb-2">
                      Multi-Signature
                    </h4>
                    <p className="text-gold-light font-inter">
                      {t('technology.multisig')}
                    </p>
                  </div>
                  
                  <div>
                    <div className="text-6xl mb-4">🌐</div>
                    <h4 className="text-xl font-montserrat font-semibold text-gold mb-2">
                      Cross-Chain
                    </h4>
                    <p className="text-gold-light font-inter">
                      {t('technology.crosschain')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Security Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-primary-purple/50 to-dark-blue/50">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-4xl font-montserrat font-bold text-text-light mb-8">
                {t('security.title')}
              </h3>
              
              <div className="glassmorphism p-12">
                <div className="flex items-center justify-center mb-8">
                  <Shield className="w-24 h-24 text-gold" />
                </div>
                
                <p className="text-xl text-gold-light font-inter leading-relaxed mb-8">
                  {t('security.p1')}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-gold-light font-inter">{t('security.iso')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-gold-light font-inter">{t('security.audit')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-gold-light font-inter">{t('security.insurance')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-gold-light font-inter">{t('security.gdpr')}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 px-4 text-center">
          <motion.div
            className="container mx-auto max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-4xl font-montserrat font-bold text-text-light mb-6">
              {t('cta.finalTitle')}
            </h3>
            <p className="text-xl text-gold-light font-inter mb-8 leading-relaxed">
              {t('cta.finalText')}
            </p>
            
            <GlowButton
              onClick={handleWhatsAppClick}
              size="lg"
              className="text-xl px-12 py-6"
            >
              <MessageCircle className="w-6 h-6 mr-3" />
              {t('cta.guaranteeVip')}
            </GlowButton>
          </motion.div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <p className="text-text-light/60 font-inter text-sm mb-4">
            {t('footer.rights')}
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-xs text-gold-light">
            <a href="#" className="hover:text-gold transition-colors">{t('footer.terms')}</a>
            <a href="#" className="hover:text-gold transition-colors">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-gold transition-colors">{t('footer.disclaimer')}</a>
            <a href="#" className="hover:text-gold transition-colors">{t('footer.contact')}</a>
          </div>
          {/* Mobile Language Switcher */}
          <div className="sm:hidden mt-5 flex justify-center">
            <LanguageSwitcher />
          </div>
          <p className="text-text-light/40 font-inter text-xs mt-4 leading-relaxed">
            {t('footer.risk')}
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Reveal
