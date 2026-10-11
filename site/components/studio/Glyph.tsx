// Role glyphs come from the catalog (original 24x24 stroke drawings).
export function Glyph({ d, color, size = 22, title }: { d: string; color: string; size?: number; title?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path d={d} />
    </svg>
  )
}
