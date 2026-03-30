// src/components/Tooltip.tsx
// Updated to support both hover (desktop) and tap (mobile).
// On touchscreens there is no hover event so we use onClick to toggle
// the tooltip visibility instead — works for both platforms.

import { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip = ({ text, children }: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const tooltipRef = useRef<HTMLSpanElement>(null);

  // Close tooltip when user taps anywhere outside of it
  // This is important on mobile where there's no mouseLeave event
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  return (
    <span
      ref={tooltipRef}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
      // Desktop: hover to show
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}

      {/* Tap on mobile to toggle, click on desktop as backup */}
      <span
        onClick={() => setVisible(v => !v)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          backgroundColor: '#3e3e6e',
          color: '#a0a0c0',
          fontSize: '9px',
          fontWeight: 700,
          cursor: 'pointer',
          flexShrink: 0,
          // Larger tap target on mobile without changing visual size
          padding: '8px',
          margin: '-8px',
        }}
      >
        ?
      </span>

      {visible && (
        <div style={{
          position: 'absolute',
          bottom: '130%',
          // On mobile keep tooltip within screen bounds
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#1e1e3e',
          border: '1px solid #4e4e8e',
          borderRadius: '12px',
          padding: '12px 16px',
          // Narrower on mobile
          width: 'min(240px, 70vw)',
          fontSize: '12px',
          lineHeight: '1.7',
          color: '#c8c8e8',
          zIndex: 100,
          pointerEvents: 'none',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>
          {text}
          <div style={{
            position: 'absolute',
            bottom: '-6px',
            left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: '10px',
            height: '10px',
            backgroundColor: '#1e1e3e',
            borderRight: '1px solid #4e4e8e',
            borderBottom: '1px solid #4e4e8e',
          }} />
        </div>
      )}
    </span>
  );
};

export default Tooltip;