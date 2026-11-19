/** Representação estática usada sem WebGL ou enquanto o modelo 3D carrega. */
export function ToothFallback({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 400" className={className} role="img" aria-label="Ilustração de um dente molar com coroa e raízes">
      <defs>
        <radialGradient id="tf-enamel" cx="40%" cy="28%" r="75%">
          <stop offset="0" stopColor="#fbf9f4" />
          <stop offset="0.55" stopColor="#ece5d8" />
          <stop offset="1" stopColor="#b9ad98" />
        </radialGradient>
        <linearGradient id="tf-root" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9dcc4" stopOpacity="0" />
          <stop offset="0.5" stopColor="#d9c6a6" stopOpacity="0.55" />
          <stop offset="1" stopColor="#c4ad88" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="tf-rim" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#a4c4b2" stopOpacity="0.55" />
          <stop offset="0.4" stopColor="#a4c4b2" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        id="tf-shape"
        d="M96 196c-12-14-19-36-17-58 1-20 4-36 12-50 7-14 22-26 35-24 9 2 15 12 24 14 9 2 16-10 28-14 15-4 31 6 39 22 8 15 9 33 8 50-2 22-8 44-21 60-4 18-5 44-9 74-4 30-9 56-21 62-10 4-15-16-17-44-2-24-6-48-14-54-8 6-12 30-15 56-3 28-8 46-19 42-12-5-16-32-19-62-3-30-0-48-5-68z"
        fill="url(#tf-enamel)"
      />
      <use href="#tf-shape" fill="url(#tf-root)" />
      <use href="#tf-shape" fill="url(#tf-rim)" />
      <ellipse cx="128" cy="104" rx="20" ry="9" fill="#fff" opacity="0.55" transform="rotate(-18 128 104)" />
      <path d="M118 96c10 8 22 10 32 6 10-4 20-4 30 4" fill="none" stroke="#b9ad98" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}
