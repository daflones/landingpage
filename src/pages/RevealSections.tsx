import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Shield, Award, Users, TrendingUp, MessageCircle } from 'lucide-react'
import GlowButton from '../components/GlowButton'

interface RevealSectionsProps {
  onVipClick: () => void
  compact?: boolean
}

const RevealSections: React.FC<RevealSectionsProps> = ({ onVipClick, compact = false }) => {
  const { t } = useTranslation()

  return (
    <div className="relative">
      {/* Benefits Grid Section (uses existing keys in locales) */}
      <section className={`px-4 ${compact ? 'pt-8 pb-10' : 'py-16'}`}>
        <div className="container mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: t('benefits.security.title'), desc: t('benefits.security.desc') },
            { title: t('benefits.speed.title'), desc: t('benefits.speed.desc') },
            { title: t('benefits.innovation.title'), desc: t('benefits.innovation.desc') },
            { title: t('benefits.profit.title'), desc: t('benefits.profit.desc') },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="glassmorphism p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center mb-3">
                <TrendingUp className="w-10 h-10 text-gold" />
              </div>
              <h4 className="text-xl font-montserrat font-bold text-text-light mb-2">{item.title}</h4>
              <p className="text-gold-light font-inter text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Awards Section (map to benefits.awarded) */}
      <section className={`px-4 ${compact ? 'py-10' : 'py-16'}`}>
        <motion.div
          className="container mx-auto max-w-4xl text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center mb-6">
            <Award className="w-20 h-20 text-gold" />
          </div>
          <h3 className="text-3xl font-montserrat font-bold text-text-light mb-4">{t('benefits.awarded.title')}</h3>
          <p className="text-gold-light font-inter text-base leading-relaxed">{t('benefits.awarded.desc')}</p>
        </motion.div>
      </section>

      {/* Community Section (single clean card) */}
      <section className={`px-4 ${compact ? 'py-10' : 'py-16'}`}>
        <motion.div
          className="container mx-auto max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="glassmorphism p-6 md:p-8 rounded-2xl">
            <div className="flex items-center gap-4 mb-3">
              <Users className="w-10 h-10 text-gold" />
              <h3 className="text-2xl md:text-3xl font-montserrat font-bold text-text-light">{t('benefits.community.title')}</h3>
            </div>
            <p className="text-gold-light font-inter leading-relaxed mb-4">{t('benefits.community.desc')}</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 rounded-full bg-white/5 text-gold-light text-sm border border-white/10">
                {t('why.globalText')}
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Plans & Yields Section (match Reveal page layout/data) */}
      <section className={`px-4 ${compact ? 'py-10' : 'py-16'}`}>
        <motion.div
          className="container mx-auto max-w-5xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-10">
            <h3 className="text-3xl md:text-4xl font-montserrat font-bold text-text-light mb-4">{t('plans.title')}</h3>
            <p className="text-gold-light font-inter max-w-3xl mx-auto leading-relaxed">{t('plans.subtitle')}</p>
          </div>
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
                    <div className="text-text-light font-semibold">${p.invest}</div>
                  </div>
                  <div>
                    <div className="text-text-light/70">{t('plans.labels.daily')}</div>
                    <div className="text-text-light font-semibold">{p.daily}%</div>
                  </div>
                  <div>
                    <div className="text-text-light/70">{t('plans.labels.roi')}</div>
                    <div className="text-text-light font-semibold">{p.roi}%</div>
                  </div>
                  <div>
                    <div className="text-text-light/70">{t('plans.labels.limit')}</div>
                    <div className="text-text-light font-semibold">{p.limit}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FAQ Section (fallback texts to avoid raw keys) */}
      <section className={`px-4 ${compact ? 'py-10' : 'py-16'}`}>
        <motion.div
          className="container mx-auto max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-montserrat font-bold text-text-light mb-6 text-center">{t('why.title')}</h3>
          <div className="space-y-4">
            {[
              { q: t('why.aiTitle'), a: t('why.aiText') },
              { q: t('why.globalTitle'), a: t('why.globalText') },
              { q: t('technology.title'), a: t('technology.lightning') },
              { q: t('plans.title'), a: t('plans.subtitle') },
            ].map((item, i) => (
              <div key={i} className="glassmorphism p-5">
                <p className="text-text-light font-montserrat font-semibold mb-1">{item.q}</p>
                <p className="text-gold-light font-inter">{item.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Security Section */}
      <section className={`px-4 ${compact ? 'py-10' : 'py-16'}`}>
        <motion.div
          className="container mx-auto max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-montserrat font-bold text-text-light mb-6 text-center">
            {t('security.title')}
          </h3>
          <div className="glassmorphism p-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <Shield className="w-20 h-20 text-gold" />
            </div>
            <p className="text-gold-light font-inter text-base leading-relaxed mb-6">
              {t('security.p1')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
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
      </section>

      {/* Final CTA */}
      <section className={`px-4 text-center ${compact ? 'py-10' : 'py-16'}`}>
        <motion.div
          className="container mx-auto max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-montserrat font-bold text-text-light mb-4">
            {t('cta.finalTitle')}
          </h3>
          <p className="text-gold-light font-inter mb-6 leading-relaxed">
            {t('cta.finalText')}
          </p>
          <GlowButton onClick={onVipClick} size="lg" className="text-lg px-10 py-5">
            <MessageCircle className="w-6 h-6 mr-3" />
            {t('cta.guaranteeVip')}
          </GlowButton>
        </motion.div>
      </section>
    </div>
  )
}

export default RevealSections
