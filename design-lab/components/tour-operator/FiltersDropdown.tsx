'use client';

import { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SearchIcon from '@mui/icons-material/Search';
import Popover from '@mui/material/Popover';
import { FILTER_SECTIONS, type FilterGroupId, type FilterState } from '@/lib/tour-operator/data/filterOptions';
import { DuettoCheckbox, type DuettoCheckboxState } from '@/components/tour-operator/ui/DuettoCheckbox';

type Props = {
  open: boolean;
  anchorEl: HTMLElement | null;
  draft: FilterState;
  onToggle: (id: FilterGroupId, value: string) => void;
  onClose: () => void;
  onReset: () => void;
  onApply: () => void;
  pickupDays: number;
  onPickupChange: (n: number) => void;
};

type CheckState = DuettoCheckboxState;
const partialAsIndeterminate = (s: 'checked' | 'unchecked' | 'partial'): CheckState =>
  s === 'partial' ? 'indeterminate' : s;

export function FiltersDropdown({
  open,
  anchorEl,
  draft,
  onToggle,
  onClose,
  onReset,
  onApply,
  pickupDays,
  onPickupChange,
}: Props) {
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const matches = (s: string) => !search.trim() || s.toLowerCase().includes(search.trim().toLowerCase());

  const groupState = (id: FilterGroupId): CheckState => {
    const values = draft[id];
    if (values.includes('all')) return 'checked';
    const options = FILTER_SECTIONS.find((s) => s.id === id)!.options.filter((o) => o.value !== 'all');
    const sel = options.filter((o) => values.includes(o.value));
    if (sel.length === 0) return 'unchecked';
    if (sel.length === options.length) return 'checked';
    return partialAsIndeterminate('partial');
  };

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
            width: 318,
            maxHeight: 460,
            border: '1px solid #DDE1E2',
            borderRadius: '5px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            bgcolor: '#fff',
          },
        },
      }}
    >
      {/* Search */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          height: 52,
          padding: '0 8px',
          borderBottom: '1px solid #e0e0e0',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flex: 1,
            height: 36,
            padding: '0 8px',
            border: '1px solid #dde1e2',
            borderRadius: 4,
            background: '#fff',
          }}
        >
          <SearchIcon sx={{ fontSize: 18, color: '#aeb4ba' }} />
          <input
            type="search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              flex: 1,
              fontSize: 14,
              fontFamily: 'inherit',
              background: 'transparent',
            }}
          />
        </div>
      </div>

      {/* Tree */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
        {FILTER_SECTIONS.map((section) => {
          if (section.id === 'pickup') return null;
          const isCollapsed = collapsed[section.id];
          const headerOption = section.options.find((o) => o.value === 'all');
          const childOptions = section.options.filter((o) => o.value !== 'all').filter((o) => matches(o.label));
          if (!headerOption) return null;
          if (search.trim() && childOptions.length === 0 && !matches(headerOption.label)) return null;
          const state = groupState(section.id);
          return (
            <div key={section.id}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 8px',
                  cursor: 'pointer',
                }}
              >
                <button
                  type="button"
                  onClick={() => setCollapsed((c) => ({ ...c, [section.id]: !c[section.id] }))}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    padding: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  aria-label={isCollapsed ? 'Expand' : 'Collapse'}
                >
                  {isCollapsed ? (
                    <KeyboardArrowRightIcon sx={{ fontSize: 16, color: '#1c1c1c' }} />
                  ) : (
                    <KeyboardArrowDownIcon sx={{ fontSize: 16, color: '#1c1c1c' }} />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => onToggle(section.id, 'all')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    textAlign: 'left',
                  }}
                >
                  <DuettoCheckbox state={state} />
                  <span style={{ fontSize: 14, color: '#1c1c1c' }}>{headerOption.label}</span>
                </button>
              </div>
              {!isCollapsed &&
                childOptions.map((opt) => {
                  const checked = draft[section.id].includes(opt.value) && !draft[section.id].includes('all');
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onToggle(section.id, opt.value)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        width: '100%',
                        padding: '4px 8px 4px 56px',
                        background: checked ? 'transparent' : 'transparent',
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
            </div>
          );
        })}

        <div style={{ padding: '8px 12px', borderTop: '1px solid #e0e0e0', marginTop: 4 }}>
          <div style={{ fontSize: 12, color: '#585858', marginBottom: 4 }}>
            Pickup window:{' '}
            <span style={{ color: '#006461', fontWeight: 600 }}>
              {pickupDays >= 365 ? 'All time' : `${pickupDays}d`}
            </span>
          </div>
          <input
            type="number"
            min={1}
            max={365}
            value={pickupDays}
            onChange={(e) => onPickupChange(Math.max(1, Number(e.target.value) || 1))}
            style={{
              width: '100%',
              height: 32,
              padding: '4px 8px',
              border: '1px solid #dde1e2',
              borderRadius: 4,
              fontSize: 14,
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '11px 12px 10px',
          borderTop: '1px solid #e5e7eb',
          flexShrink: 0,
          background: '#fff',
        }}
      >
        <button
          type="button"
          onClick={onReset}
          style={{
            height: 32,
            padding: '0 12px',
            border: 'none',
            background: 'transparent',
            color: '#006461',
            fontSize: 12,
            fontFamily: 'inherit',
            cursor: 'pointer',
            borderRadius: 4,
          }}
        >
          Reset
        </button>
        <button
          type="button"
          onClick={onApply}
          style={{
            height: 32,
            minWidth: 110,
            padding: '0 12px',
            border: 'none',
            borderRadius: 4,
            background: '#006461',
            color: '#fff',
            fontSize: 12,
            fontFamily: 'inherit',
            cursor: 'pointer',
          }}
        >
          Apply
        </button>
      </div>
    </Popover>
  );
}
