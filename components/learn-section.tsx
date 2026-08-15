'use client'

import {
  AudioLines,
  Captions,
  Hand,
  Pause,
  Play,
  Type,
  Volume2,
} from 'lucide-react'
import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

const TRANSCRIPT = [
  { time: '00:03', text: 'Welcome to Module 3: Building an Accessible Career.' },
  { time: '00:11', text: 'Today we cover how to present your skills with confidence.' },
  { time: '00:19', text: 'Every lesson is available in the format that suits you best.' },
]

function PlayerChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-navy shadow-lg">
      <div className="flex items-center gap-1.5 border-b border-navy-foreground/10 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-orange" aria-hidden="true" />
        <span
          className="h-3 w-3 rounded-full bg-navy-foreground/30"
          aria-hidden="true"
        />
        <span
          className="h-3 w-3 rounded-full bg-navy-foreground/30"
          aria-hidden="true"
        />
      </div>
      {children}
    </div>
  )
}

export function LearnSection() {
  const [playing, setPlaying] = useState(false)

  return (
    <section id="learn" className="bg-mint">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Learn at Your Pace
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-mint-foreground">
            Switch any lesson between sign language, audio-first, or text-only.
            You control how you learn.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl">
          <Tabs defaultValue="video">
            <TabsList className="mb-6 grid h-auto w-full grid-cols-1 gap-1 bg-background/70 p-1 sm:grid-cols-3">
              <TabsTrigger value="video" className="gap-2 py-2.5">
                <Hand className="h-4 w-4" aria-hidden="true" />
                Video with Sign Language
              </TabsTrigger>
              <TabsTrigger value="audio" className="gap-2 py-2.5">
                <AudioLines className="h-4 w-4" aria-hidden="true" />
                Audio-First
              </TabsTrigger>
              <TabsTrigger value="text" className="gap-2 py-2.5">
                <Type className="h-4 w-4" aria-hidden="true" />
                Text-Only
              </TabsTrigger>
            </TabsList>

            {/* Video with sign language */}
            <TabsContent value="video">
              <PlayerChrome>
                <div className="relative aspect-video bg-gradient-to-br from-slate-700 to-navy">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setPlaying((p) => !p)}
                      aria-label={playing ? 'Pause lesson' : 'Play lesson'}
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-orange text-orange-foreground shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-foreground"
                    >
                      {playing ? (
                        <Pause className="h-7 w-7" aria-hidden="true" />
                      ) : (
                        <Play className="h-7 w-7 pl-1" aria-hidden="true" />
                      )}
                    </button>
                  </div>

                  {/* PIP sign language interpreter */}
                  <div className="absolute bottom-4 right-4 flex h-28 w-40 flex-col items-center justify-center gap-2 rounded-lg border-2 border-orange bg-navy/90 text-navy-foreground">
                    <Hand className="h-8 w-8 text-orange" aria-hidden="true" />
                    <span className="text-xs font-medium">
                      Sign Interpreter
                    </span>
                  </div>

                  {/* Captions */}
                  <div className="absolute bottom-4 left-4 max-w-[55%] rounded-md bg-black/80 px-3 py-2">
                    <span className="text-sm font-medium text-white">
                      &ldquo;Every lesson adapts to how you learn best.&rdquo;
                    </span>
                  </div>
                </div>
              </PlayerChrome>

              {/* Synchronized transcript */}
              <div className="mt-4 rounded-xl border border-border bg-background p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Captions className="h-4 w-4 text-orange" aria-hidden="true" />
                  Synchronized transcript
                </div>
                <ul className="flex flex-col gap-2">
                  {TRANSCRIPT.map((line) => (
                    <li key={line.time} className="flex gap-3 text-sm">
                      <span className="font-mono text-muted-foreground">
                        {line.time}
                      </span>
                      <span className="text-foreground">{line.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            {/* Audio-first */}
            <TabsContent value="audio">
              <div className="rounded-xl border border-border bg-background p-6">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setPlaying((p) => !p)}
                    aria-label={playing ? 'Pause audio lesson' : 'Play audio lesson'}
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange text-orange-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {playing ? (
                      <Pause className="h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Play className="h-6 w-6 pl-0.5" aria-hidden="true" />
                    )}
                  </button>
                  <div className="flex-1">
                    <p className="font-display font-semibold text-foreground">
                      Module 3 · Building an Accessible Career
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                      <Volume2 className="h-4 w-4" aria-hidden="true" />
                      <div
                        className="h-2 flex-1 overflow-hidden rounded-full bg-muted"
                        role="progressbar"
                        aria-valuenow={35}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label="Audio progress"
                      >
                        <div className="h-full w-[35%] rounded-full bg-orange" />
                      </div>
                      <span className="font-mono text-xs">02:10</span>
                    </div>
                  </div>
                </div>
                <p className="mt-4 rounded-lg bg-muted p-4 text-sm leading-relaxed text-muted-foreground">
                  Optimized for screen readers with full keyboard control and
                  spoken descriptions of every on-screen element.
                </p>
              </div>
            </TabsContent>

            {/* Text-only */}
            <TabsContent value="text">
              <article className="rounded-xl border border-border bg-background p-6">
                <h3 className="font-display text-xl font-bold text-foreground">
                  Module 3 · Building an Accessible Career
                </h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  In this text-only module, you can read at your own pace with
                  adjustable text size and high-contrast support. Each section
                  is structured with clear headings for easy screen-reader
                  navigation.
                </p>
                <h4 className="mt-6 font-display font-semibold text-foreground">
                  Key takeaways
                </h4>
                <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 leading-relaxed text-muted-foreground">
                  <li>Present your strengths with confidence.</li>
                  <li>Request accommodations that set you up to succeed.</li>
                  <li>Match your skills to inclusive employers.</li>
                </ul>
              </article>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}
