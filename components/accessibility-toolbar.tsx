'use client'

import { useState } from 'react'
import { Accessibility, Contrast, Type, X } from 'lucide-react'
import { useAccessibility } from '@/components/accessibility-provider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

const TEXT_SIZE_LABELS = {
  normal: 'Normal',
  large: 'Large',
  xlarge: 'Extra Large',
} as const

export function AccessibilityToolbar() {
  const [open, setOpen] = useState(false)
  const { highContrast, toggleHighContrast, textSize, setTextSize } =
    useAccessibility()

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          role="dialog"
          aria-label="Accessibility settings"
          className="w-72 rounded-2xl border border-border bg-popover p-5 text-popover-foreground shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold">
              Accessibility Settings
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close accessibility settings"
              className="rounded-md p-1 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <Label
              htmlFor="high-contrast-toggle"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Contrast className="h-4 w-4" aria-hidden="true" />
              High Contrast
            </Label>
            <Switch
              id="high-contrast-toggle"
              checked={highContrast}
              onCheckedChange={toggleHighContrast}
            />
          </div>

          <div className="mt-5">
            <span className="flex items-center gap-2 text-sm font-medium">
              <Type className="h-4 w-4" aria-hidden="true" />
              Text Size
            </span>
            <div
              className="mt-3 grid grid-cols-3 gap-2"
              role="group"
              aria-label="Text size"
            >
              {(['normal', 'large', 'xlarge'] as const).map((size) => {
                const active = textSize === size
                return (
                  <button
                    key={size}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setTextSize(size)}
                    className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                      active
                        ? 'border-orange bg-orange text-orange-foreground'
                        : 'border-border bg-background hover:bg-muted'
                    }`}
                  >
                    {TEXT_SIZE_LABELS[size]}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="Accessibility tools"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-orange text-orange-foreground shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <Accessibility className="h-7 w-7" aria-hidden="true" />
      </button>
    </div>
  )
}
