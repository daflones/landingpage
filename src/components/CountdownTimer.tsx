import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface CountdownTimerProps {
  targetDate: string
  className?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  className = '',
  size = 'md'
}) => {
  const { t } = useTranslation()
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [prevTimeLeft, setPrevTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    console.log('Iniciando contador...')
    console.log('Data alvo:', targetDate)
    
    const calculateTimeLeft = (): TimeLeft => {
      const now = new Date()
      const target = new Date(targetDate)
      const difference = target.getTime() - now.getTime()
      
      console.log('Data atual:', now.toISOString())
      console.log('Data alvo:', target.toISOString())
      console.log('Diferença (ms):', difference)
      
      if (difference > 0) {
        const timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        }
        console.log('Tempo restante calculado:', timeLeft)
        return timeLeft
      }
      
      console.log('Contador finalizado!')
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    // Atualiza o estado inicial imediatamente
    const initialTimeLeft = calculateTimeLeft()
    console.log('Tempo inicial:', initialTimeLeft)
    setTimeLeft(initialTimeLeft)
    
    // Configura o intervalo para atualizações
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = calculateTimeLeft()
        console.log('Atualizando tempo:', newTime)
        setPrevTimeLeft(prev)
        return newTime
      })
    }, 1000)

    return () => {
      console.log('Limpando intervalo do contador')
      clearInterval(timer)
    }
  }, [targetDate])

  const sizeClasses = {
    xs: {
      container: 'gap-1',
      digit: 'w-8 h-8 text-xs',
      label: 'text-[8px]'
    },
    sm: {
      container: 'gap-2',
      digit: 'w-12 h-12 text-lg',
      label: 'text-xs'
    },
    md: {
      container: 'gap-4',
      digit: 'w-16 h-16 text-2xl',
      label: 'text-sm'
    },
    lg: {
      container: 'gap-4 sm:gap-6',
      digit: 'w-16 h-16 sm:w-20 sm:h-20 text-2xl sm:text-3xl',
      label: 'text-xs sm:text-base'
    }
  }

  const DigitDisplay: React.FC<{ 
    value: number
    prevValue: number
    label: string 
  }> = ({ value, prevValue, label }) => {
    const hasChanged = value !== prevValue
    
    return (
      <div className="flex flex-col items-center">
        <div className={`countdown-digit ${sizeClasses[size].digit} flex items-center justify-center relative overflow-hidden`}>
          <AnimatePresence mode="wait">
            <motion.span
              key={value}
              className={`font-montserrat font-bold text-gold absolute inset-0 flex items-center justify-center ${hasChanged ? 'countdown-flip' : ''}`}
              initial={hasChanged ? { rotateX: -90, opacity: 0 } : false}
              animate={{ rotateX: 0, opacity: 1 }}
              exit={{ rotateX: 90, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              {value.toString().padStart(2, '0')}
            </motion.span>
          </AnimatePresence>
        </div>
        <span className={`${sizeClasses[size].label} text-gold-light font-inter font-medium mt-2 uppercase tracking-wider`}>
          {label}
        </span>
      </div>
    )
  }

  return (
    <motion.div
      className={`flex items-center justify-center ${sizeClasses[size].container} ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <DigitDisplay value={timeLeft.days} prevValue={prevTimeLeft.days} label={t('time.days')} />
      
      <div className="text-gold text-2xl font-bold animate-pulse">:</div>
      
      <DigitDisplay value={timeLeft.hours} prevValue={prevTimeLeft.hours} label={t('time.hours')} />
      
      <div className="text-gold text-2xl font-bold animate-pulse">:</div>
      
      <DigitDisplay value={timeLeft.minutes} prevValue={prevTimeLeft.minutes} label={t('time.minutes')} />
      
      <div className="text-gold text-2xl font-bold animate-pulse">:</div>
      
      <DigitDisplay value={timeLeft.seconds} prevValue={prevTimeLeft.seconds} label={t('time.seconds')} />
    </motion.div>
  )
}

export default CountdownTimer
