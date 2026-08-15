export function SoraLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      role="img"
    >
      <rect width="32" height="32" rx="9" fill="currentColor" />
      <circle cx="16" cy="10" r="3" fill="var(--background)" />
      <path
        d="M10 23c0-3.3 2.7-6 6-6s6 2.7 6 6"
        stroke="var(--background)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M16 17v-3"
        stroke="var(--background)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
