import { useState, useRef, useEffect } from 'react';

export const HOTELS = [
  'Hotel Barcelona',
  'Hotel London',
  'Hotel Paris',
  'Hotel New York',
  'Hotel Tokyo',
  'Hotel Dubai',
  'Hotel Sydney',
  'Hotel Rome',
  'Hotel Amsterdam',
  'Hotel Singapore',
  'Hotel Miami',
  'Hotel Berlin',
];

interface Props {
  value: string[];
  onChange: (values: string[]) => void;
  options?: string[];
  label?: string;
  width?: number;
}

export default function MultiSelectDropdown({
  value,
  onChange,
  options = HOTELS,
  label,
  width = 180,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const allSelected = value.length === options.length;
  const noneSelected = value.length === 0;

  const displayLabel = noneSelected
    ? 'Select hotels...'
    : allSelected
      ? 'All hotels'
      : `${value.length} hotel${value.length > 1 ? 's' : ''} selected`;

  const toggleAll = () => onChange(allSelected ? [] : [...options]);
  const toggleOne = (opt: string) =>
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);

  return (
    <div className="field-group" style={{ width }}>
      {label && <label className="field-label">{label}</label>}
      <div ref={ref} style={{ position: 'relative', width: '100%' }}>
        {/* Trigger */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          style={{
            width: '100%', height: 36,
            border: `1px solid ${open ? '#006461' : '#e0e0e0'}`,
            borderRadius: 5, padding: '0 8px 0 10px',
            fontSize: 14, fontFamily: 'inherit',
            color: noneSelected ? '#9e9e9e' : '#1c1c1c',
            background: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            outline: 'none',
          }}
        >
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
            {displayLabel}
          </span>
          <span className="material-icons" style={{ fontSize: 18, color: '#757575', flexShrink: 0, marginLeft: 2 }}>
            {open ? 'arrow_drop_up' : 'arrow_drop_down'}
          </span>
        </button>

        {/* Dropdown panel */}
        {open && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 2px)', left: 0, zIndex: 2000,
            background: '#fff', border: '1px solid #dde1e2', borderRadius: 4,
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)', width: 'max-content', minWidth: '100%',
            maxHeight: 260, overflowY: 'auto',
          }}>
            {/* Select all row */}
            <label style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 12px', cursor: 'pointer', fontSize: 14, fontWeight: 700,
              borderBottom: '1px solid #f0f0f0', color: '#1c1c1c',
              background: allSelected ? '#f5fafa' : undefined,
            }}>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                style={{ cursor: 'pointer', accentColor: '#006461' }}
              />
              Select all
            </label>

            {/* Individual options */}
            {options.map((opt) => (
              <label key={opt} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 12px', cursor: 'pointer', fontSize: 14, color: '#1c1c1c',
                background: value.includes(opt) ? '#f5fafa' : undefined,
              }}>
                <input
                  type="checkbox"
                  checked={value.includes(opt)}
                  onChange={() => toggleOne(opt)}
                  style={{ cursor: 'pointer', accentColor: '#006461' }}
                />
                {opt}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
