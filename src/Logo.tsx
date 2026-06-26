import logoUrl from './cornerstone-logo.webp'

export function LogoAnimated({ size = 22 }: { size?: number }) {
  return (
    <div 
      className="brand-logo-wrapper"
      style={{
        position: 'relative',
        display: 'block',
        flexShrink: 0,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        pointerEvents: 'none',
      }}
    >
      <img
        className="brand-logo-img brand-logo-animated"
        src={logoUrl}
        alt="Casper State Logo"
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        style={{
          height: size * 2.0,
          width: 'auto',
          display: 'block',
          borderRadius: '8px',
          boxShadow: '0 0 15px rgba(251, 146, 60, 0.25)',
        }}
      />
      <div className="logo-glow-ring" />
    </div>
  )
}

export default function Logo({ size = 22 }: { size?: number }) {
  return (
    <img
      className="brand-logo-img"
      src={logoUrl}
      alt="Casper State Logo"
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      style={{
        height: size * 2.0,
        width: 'auto',
        display: 'block',
        flexShrink: 0,
        borderRadius: '8px',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        pointerEvents: 'none',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      }}
    />
  )
}
