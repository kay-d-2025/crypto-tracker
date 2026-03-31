// src/components/Tooltip.tsx

import { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const TOOLTIP_WIDTH = 240;
const SCREEN_PADDING = 12;

const Tooltip = ({ text, children }: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const anchorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!visible || !anchorRef.current) return;

    const rect = anchorRef.current.getBoundingClientRect();
    const tooltipLeft = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
    const tooltipRight = tooltipLeft + TOOLTIP_WIDTH;

    let shift = 0;
    if (tooltipLeft < SCREEN_PADDING) {
      shift = SCREEN_PADDING - tooltipLeft;
    } else if (tooltipRight > window.innerWidth - SCREEN_PADDING) {
      shift = window.innerWidth - SCREEN_PADDING - tooltipRight;
    }
    setOffsetX(shift);
  }, [visible]);

  return (
    <span
      ref={anchorRef}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onTouchStart={() => setVisible(v => !v)}
    >
      {children}

      <span style={{
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
        cursor: 'help',
        flexShrink: 0,
      }}>
        ?
      </span>

      {visible && (
        <div style={{
          position: 'absolute',
          bottom: '130%',
          left: '50%',
          transform: `translateX(calc(-50% + ${offsetX}px))`,
          backgroundColor: '#1e1e3e',
          border: '1px solid #4e4e8e',
          borderRadius: '12px',
          padding: '12px 16px',
          width: `${TOOLTIP_WIDTH}px`,
          fontSize: '12px',
          lineHeight: '1.7',
          color: '#c8c8e8',
          zIndex: 1000,
          pointerEvents: 'none',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>
          {text}
          <div style={{
            position: 'absolute',
            bottom: '-6px',
            left: `calc(50% - ${offsetX}px)`,
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