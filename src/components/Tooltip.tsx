// src/components/Tooltip.tsx
// Friendly tooltip that explains crypto jargon in plain English.
// The question mark icon signals to beginners that help is available
// without cluttering the UI for more experienced users.

import { useState } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip = ({ text, children }: TooltipProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}

      {/* Small question mark icon — universally understood as "help" */}
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
          transform: 'translateX(-50%)',
          backgroundColor: '#1e1e3e',
          border: '1px solid #4e4e8e',
          borderRadius: '12px',
          padding: '12px 16px',
          width: '240px',
          fontSize: '12px',
          lineHeight: '1.7',
          color: '#c8c8e8',
          zIndex: 100,
          pointerEvents: 'none',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>
          {text}
          {/* Triangle pointer */}
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