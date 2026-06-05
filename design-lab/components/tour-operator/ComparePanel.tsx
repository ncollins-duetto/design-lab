'use client';

import Popover from '@mui/material/Popover';
import type { CompareMode } from '@/lib/tour-operator/calendar/metrics';
import { DuettoCheckbox } from '@/components/tour-operator/ui/DuettoCheckbox';

type Props = {
  open: boolean;
  anchorEl: HTMLElement | null;
  value: CompareMode[];
  onToggle: (mode: CompareMode) => void;
  onClose: () => void;
};

const OPTIONS: { value: CompareMode; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'stly', label: 'STLY' },
  { value: 'ly', label: 'LY' },
  { value: 'fcst', label: 'Forecast' },
  { value: 'budget', label: 'Budget' },
];

export function ComparePanel({ open, anchorEl, value, onToggle, onClose }: Props) {
  return (
    <Popover
      open={open && Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      slotProps={{
        paper: {
          sx: {
            minWidth: 180,
            border: '1px solid #DDE1E2',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            overflow: 'hidden',
            bgcolor: '#fff',
            py: 0.5,
          },
        },
      }}
    >
      {OPTIONS.map((opt) => {
        const checked = opt.value === 'none' ? value.length === 0 : value.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onToggle(opt.value)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              width: '100%',
              padding: '4px 8px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#d7f7ed')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <DuettoCheckbox state={checked ? 'checked' : 'unchecked'} />
            <span style={{ fontSize: 14, color: '#1c1c1c' }}>{opt.label}</span>
          </button>
        );
      })}
    </Popover>
  );
}
