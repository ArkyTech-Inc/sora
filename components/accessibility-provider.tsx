'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

type TextSize = 'normal' | 'large' | 'xlarge'

type AccessibilityContextValue = {
  highContrast: boolean
  toggleHighContrast: () => void
  textSize: TextSize
  setTextSize: (size: TextSize) => void
  cycleTextSize: () => void
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(
  null,
)

const TEXT_SIZE_SCALE: Record<TextSize, string> = {
  normal: '100%',
  large: '112.5%',
  xlarge: '125%',
}

const TEXT_SIZE_ORDER: TextSize[] = ['normal', 'large', 'xlarge']

export function AccessibilityProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [highContrast, setHighContrast] = useState(false)
  const [textSize, setTextSizeState] = useState<TextSize>('normal')

  // Restore saved preferences
  useEffect(() => {
    const savedContrast = localStorage.getItem('sora-high-contrast') === 'true'
    const savedSize =
      (localStorage.getItem('sora-text-size') as TextSize | null) ?? 'normal'
    setHighContrast(savedContrast)
    setTextSizeState(savedSize)
  }, [])

  // Apply high contrast class
  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', highContrast)
    localStorage.setItem('sora-high-contrast', String(highContrast))
  }, [highContrast])

  // Apply text size to root font size
  useEffect(() => {
    document.documentElement.style.fontSize = TEXT_SIZE_SCALE[textSize]
    localStorage.setItem('sora-text-size', textSize)
  }, [textSize])

  const toggleHighContrast = useCallback(
    () => setHighContrast((prev) => !prev),
    [],
  )

  const setTextSize = useCallback((size: TextSize) => setTextSizeState(size), [])

  const cycleTextSize = useCallback(() => {
    setTextSizeState((prev) => {
      const idx = TEXT_SIZE_ORDER.indexOf(prev)
      return TEXT_SIZE_ORDER[(idx + 1) % TEXT_SIZE_ORDER.length]
    })
  }, [])

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        toggleHighContrast,
        textSize,
        setTextSize,
        cycleTextSize,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext)
  if (!ctx) {
    throw new Error(
      'useAccessibility must be used within an AccessibilityProvider',
    )
  }
  return ctx
}
