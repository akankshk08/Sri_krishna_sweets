/** Peacock-feather mark: Krishna's mor pankh, drawn in the brand palette. */
export function FeatherMark({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size * 1.25}
      viewBox="0 0 40 50"
      aria-hidden="true"
      className="feather"
    >
      <path
        d="M21 48C19 38 19 30 21.5 21"
        stroke="#C6A15B"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M21.5 22C11 20 7 12 11 6c3-4.5 10-5.5 15-2 6 4.3 5.6 13-4.5 18Z"
        fill="#FFFDF7"
        stroke="#C6A15B"
        strokeWidth="1.2"
      />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path
          key={i}
          d={`M21.5 21.5 ${10 + i * 3.6} ${4 + Math.abs(2.5 - i) * 1.6}`}
          stroke="#C6A15B"
          strokeWidth=".5"
          opacity=".7"
        />
      ))}
      <ellipse cx="19.5" cy="12" rx="6.2" ry="5.4" fill="#244D3A" />
      <ellipse cx="19.3" cy="12.4" rx="3.8" ry="3.4" fill="#C6A15B" />
      <ellipse cx="19.1" cy="12.8" rx="2" ry="1.9" fill="#493528" />
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`logo${compact ? ' logo--compact' : ''}`}>
      <FeatherMark size={compact ? 26 : 32} />
      <span className="logo__text">
        <span className="logo__name">Shri Krishna</span>
        <span className="logo__sub">
          <i aria-hidden="true" />
          Sweets
          <i aria-hidden="true" />
        </span>
      </span>
    </span>
  );
}

/** Small gold lotus-and-line divider used under section headings. */
export function Ornament() {
  return (
    <svg className="ornament" width="132" height="16" viewBox="0 0 132 16" aria-hidden="true">
      <path d="M2 8h44M86 8h44" stroke="#C6A15B" strokeWidth="1" />
      <circle cx="50" cy="8" r="1.6" fill="#C6A15B" />
      <circle cx="82" cy="8" r="1.6" fill="#C6A15B" />
      <path d="M66 2c3 3 3 9 0 12-3-3-3-9 0-12Z" fill="none" stroke="#C6A15B" />
      <path
        d="M66 14c-4-1-8-3-9-7 4 0 7 2 9 7Zm0 0c4-1 8-3 9-7-4 0-7 2-9 7Z"
        fill="none"
        stroke="#C6A15B"
      />
    </svg>
  );
}
