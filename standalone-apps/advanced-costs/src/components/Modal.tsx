import type { ReactNode } from 'react';

export default function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.48)',
        zIndex: 1000, display: 'flex', alignItems: 'flex-start',
        justifyContent: 'center', overflowY: 'auto', padding: '48px 24px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff', borderRadius: 4, width: 940,
          boxShadow: '0 8px 32px rgba(0,0,0,0.24)', flexShrink: 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px', borderBottom: '1px solid #e0e0e0',
          position: 'sticky', top: 0, background: '#fff', zIndex: 1,
          borderRadius: '4px 4px 0 0',
        }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 400, color: '#1c1c1c' }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#757575', display: 'flex', alignItems: 'center', padding: 4,
              borderRadius: 4,
            }}
          >
            <span className="material-icons" style={{ fontSize: 20 }}>close</span>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 24 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
