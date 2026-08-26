/* The brand mark: a thin gold ring around a serif "N", standing in
   for a wax seal / hotel-monogram rather than a generic tech icon.
   Used everywhere the wordmark appears so the identity stays singular. */
export function NovaMark({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="14.5" stroke="var(--color-nova)" strokeWidth="1.1" />
      <text
        x="16"
        y="21.5"
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontSize="15"
        fontStyle="italic"
        fill="var(--color-nova)"
      >
        N
      </text>
    </svg>
  );
}

export function NovaWordmark({ size = 20, className = "" }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <NovaMark size={size} />
      <span className="font-display italic font-medium tracking-tight">Nova</span>
    </span>
  );
}

/* Brand-mark icons for outbound contact links. Kept as inline SVG rather
   than imported from lucide-react: lucide dropped trademarked brand
   icons (Github, Linkedin, etc.) in newer releases, so importing them
   by name breaks the build depending on the installed version. */
export function GithubIcon({ size = 15, strokeWidth = 1.75 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
    </svg>
  );
}

export function LinkedinIcon({ size = 15, strokeWidth = 1.75 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
