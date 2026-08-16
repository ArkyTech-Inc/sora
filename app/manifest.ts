import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sora — Inclusive Jobs & Adaptive Skills for PWDs in Nigeria',
    short_name: 'Sora',
    description: 'Sora is an inclusive job-matching and adaptive skills platform for Persons with Disabilities in Nigeria. From disability-aware profiling to matched job placement—build a career that fits you.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}