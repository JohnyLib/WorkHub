'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { X, ChevronRight, ChevronLeft, Sparkles, HelpCircle } from 'lucide-react'

interface TourStep {
  selector: string
  title: string
  description: string
}

const HOME_STEPS: TourStep[] = [
  {
    selector: '', // Welcome step (center screen)
    title: 'Welcome to WorkBridge UK! 👷',
    description: 'Let\'s take a quick 1-minute tour to see how to find construction work or hire skilled workers fast with zero agency fees.',
  },
  {
    selector: '#hero-profession',
    title: 'Select Your Trade',
    description: 'Type or choose your profession (e.g. Bricklayer, Plumber, Electrician) to filter for matching jobs.',
  },
  {
    selector: '#hero-location',
    title: 'Set Your Location',
    description: 'Enter a UK city or postcode to see jobs in your desired area.',
  },
  {
    selector: 'form button[type="submit"]',
    title: 'Search Live Jobs',
    description: 'Click search to explore construction listings instantly matching your filters.',
  },
  {
    selector: 'a[href*="tab=register"]',
    title: 'Create Your Profile',
    description: 'Register a free account as a worker or employer to save listings, post jobs, and contact people directly.',
  },
]

const JOBS_STEPS: TourStep[] = [
  {
    selector: 'aside, #mobile-filter-btn', // Smart selector resolved in code
    title: 'Advanced Filters 🔍',
    description: 'Refine listings by minimum pay rate, pay type (daily/hourly), or search by custom keywords.',
  },
  {
    selector: 'select[class*="appearance-none"]',
    title: 'Sort Listings',
    description: 'Sort construction jobs by newest first, highest/lowest pay rates, or popularity views.',
  },
  {
    selector: 'button[aria-label*="Save job"]',
    title: 'Save Jobs for Later',
    description: 'Click the bookmark icon to save this job to your profile so you don\'t lose it.',
  },
  {
    selector: 'article a[href^="/jobs/"]',
    title: 'View & Apply',
    description: 'Click the view link to read full job specifications, start dates, and contact the employer directly.',
  },
]

export default function OnboardingTour() {
  const pathname = usePathname()
  const [active, setActive] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [rect, setRect] = useState<DOMRect | null>(null)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  
  const steps = pathname === '/jobs' ? JOBS_STEPS : pathname === '/' ? HOME_STEPS : []
  const step = steps[currentStepIndex]

  // Track window dimensions
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight })
      }
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Auto start tour if first time
  useEffect(() => {
    if (!steps.length) return

    const storageKey = pathname === '/' ? 'workbridge_tour_home_completed' : 'workbridge_tour_jobs_completed'
    const completed = localStorage.getItem(storageKey)

    if (!completed) {
      // Delay slightly for initial render transition animation
      const timer = setTimeout(() => {
        setActive(true)
        setCurrentStepIndex(0)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [pathname, steps.length])

  // Listen to manual start custom event
  useEffect(() => {
    const handleStartTour = () => {
      if (steps.length > 0) {
        setActive(true)
        setCurrentStepIndex(0)
      }
    }
    window.addEventListener('start-onboarding-tour', handleStartTour)
    return () => window.removeEventListener('start-onboarding-tour', handleStartTour)
  }, [steps.length])

  // Element coordinate tracker with scrolling & resizing support
  useEffect(() => {
    if (!active || !step) {
      setRect(null)
      return
    }

    if (!step.selector) {
      setRect(null)
      return
    }

    const getTargetElement = (): Element | null => {
      // Smart selector handling for mobile vs desktop filters
      if (step.selector === 'aside, #mobile-filter-btn') {
        const mobileBtn = document.getElementById('mobile-filter-btn')
        const desktopAside = document.querySelector('aside')
        if (mobileBtn && window.innerWidth < 1024) {
          return mobileBtn
        }
        return desktopAside
      }
      
      return document.querySelector(step.selector)
    }

    const updateCoordinates = () => {
      const el = getTargetElement()
      if (el) {
        setRect(el.getBoundingClientRect())
      } else {
        setRect(null)
      }
    }

    const el = getTargetElement()
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      // Add slight delay for smooth scrolling to finish
      const timer = setTimeout(updateCoordinates, 300)
      
      window.addEventListener('resize', updateCoordinates)
      window.addEventListener('scroll', updateCoordinates, { passive: true })
      
      return () => {
        clearTimeout(timer)
        window.removeEventListener('resize', updateCoordinates)
        window.removeEventListener('scroll', updateCoordinates)
      }
    } else {
      setRect(null)
    }
  }, [currentStepIndex, active, step?.selector, windowSize.width, pathname])

  if (!active || !step) return null

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1)
    }
  }

  const handleSkip = () => {
    handleComplete()
  }

  const handleComplete = () => {
    setActive(false)
    const storageKey = pathname === '/' ? 'workbridge_tour_home_completed' : 'workbridge_tour_jobs_completed'
    localStorage.setItem(storageKey, 'true')
  }

  // Spotlight variables
  const padding = 8
  const hasTarget = rect !== null
  const targetX = hasTarget ? rect.left : 0
  const targetY = hasTarget ? rect.top : 0
  const targetW = hasTarget ? rect.width : 0
  const targetH = hasTarget ? rect.height : 0

  // Calculate dynamic floating tooltip location
  const tooltipWidth = 320
  const tooltipHeight = 170
  let tooltipStyle: React.CSSProperties = {}

  if (hasTarget) {
    let top = targetY + targetH + 16
    let left = targetX + targetW / 2 - tooltipWidth / 2

    // Bounds checking
    if (left < 16) left = 16
    if (left + tooltipWidth > windowSize.width - 16) {
      left = windowSize.width - tooltipWidth - 16
    }

    // If overflows below screen, render above target
    if (top + tooltipHeight > windowSize.height - 16) {
      top = targetY - tooltipHeight - 16
    }
    
    // Safety check if it is still too high
    if (top < 16) top = 16

    tooltipStyle = {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      width: `${tooltipWidth}px`,
      zIndex: 10002,
    }
  } else {
    // Welcome step / Centered modal style
    tooltipStyle = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '350px',
      zIndex: 10002,
    }
  }

  return (
    <div className="relative animate-fade-in">
      {/* SVG Spotlight backdrop overlay */}
      <svg className="fixed inset-0 w-full h-full z-[10000] pointer-events-none">
        <defs>
          <mask id="onboarding-spotlight-mask">
            {/* Screen mask layer */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Spotlight cut-out */}
            {hasTarget && (
              <rect
                x={targetX - padding}
                y={targetY - padding}
                width={targetW + padding * 2}
                height={targetH + padding * 2}
                rx="12"
                fill="black"
              />
            )}
          </mask>
        </defs>

        {/* Masked Backdrop overlay */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(10, 15, 30, 0.72)"
          mask="url(#onboarding-spotlight-mask)"
          className="pointer-events-auto cursor-default"
        />

        {/* Premium glowing overlay outline border */}
        {hasTarget && (
          <rect
            x={targetX - padding}
            y={targetY - padding}
            width={targetW + padding * 2}
            height={targetH + padding * 2}
            rx="12"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2.5"
            className="transition-all duration-300 pointer-events-none"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.75))',
            }}
          />
        )}
      </svg>

      {/* Interactive Onboarding Tooltip Card */}
      <div
        style={tooltipStyle}
        className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.3)] border border-slate-100 p-5 flex flex-col gap-3.5 animate-fade-in-up"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm leading-tight">
              {step.title}
            </h3>
          </div>
          <button
            onClick={handleSkip}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 -mr-1 -mt-1 rounded-md"
            aria-label="Skip onboarding tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <p className="text-xs text-slate-600 leading-relaxed">
          {step.description}
        </p>

        {/* Footer controls */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-1">
          {/* Progress dots / bar */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-slate-400">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
            <div className="flex gap-1">
              {steps.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    idx === currentStepIndex ? 'w-4 bg-blue-600' : 'w-1 bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {currentStepIndex > 0 ? (
              <button
                onClick={handleBack}
                className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1 min-h-[30px]"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : (
              <button
                onClick={handleSkip}
                className="px-2.5 py-1.5 text-slate-400 hover:text-slate-600 font-semibold text-xs rounded-lg transition-colors min-h-[30px]"
              >
                Skip
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 min-h-[30px]"
            >
              {currentStepIndex === steps.length - 1 ? 'Finish' : 'Next'}{' '}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
