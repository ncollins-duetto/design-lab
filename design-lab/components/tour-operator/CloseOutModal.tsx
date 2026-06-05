'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { DuettoCheckbox } from '@/components/tour-operator/ui/DuettoCheckbox';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { createPortal } from 'react-dom';
import { useCalendar } from '@/lib/tour-operator/context/CalendarContext';
import { dayKey } from '@/lib/tour-operator/calendar/metrics';
import { Button, IconButton } from '@material-ui/core';

type CloseType = 'full' | 'los' | 'reopen';

type DateRange = { id: number; from: string; to: string };

type Props = {
  open: boolean;
  selectedDays: Set<string>;
  onClose: () => void;
  onComplete: () => void;
};

const OPERATORS = ['TUI Group', 'Thomas Cook', 'Sunwing', 'Club Med', 'Jet2 Holidays'];
const ROOM_TYPES = ['Standard Double', 'Superior Double', 'Junior Suite', 'Suite', 'Deluxe Ocean View'];
const BOARD_TYPES = ['All Inclusive', 'Full Board', 'Half Board', 'Bed & Breakfast', 'Room Only'];

let rangeIdSeq = 0;
let ruleIdSeq = 0;

function parseIsoRange(from: string, to: string): string[] {
  if (!from || !to) return [];
  const start = new Date(from);
  const end = new Date(to);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return [];
  const keys: string[] = [];
  const cur = new Date(start);
  while (cur <= end) {
    keys.push(
      `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`,
    );
    cur.setDate(cur.getDate() + 1);
  }
  return keys;
}

function isoToKey(iso: string) {
  const [, m, d] = iso.split('-').map(Number);
  return dayKey(m, d);
}

function fmtDisplay(iso: string) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${m}/${d}/${y}`;
}

type Rule = { id: number; ops: Set<string>; rooms: Set<string>; boards: Set<string> };

function MultiSelect({
  label,
  items,
  selected,
  onChange,
}: {
  label: string;
  items: string[];
  selected: Set<string>;
  onChange: (next: Set<string>) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const triggerText =
    selected.has('all') || selected.size === 0
      ? 'All'
      : selected.size === 1
        ? [...selected][0]
        : `${selected.size} selected`;

  const toggle = (val: string) => {
    if (val === 'all') {
      onChange(new Set(['all']));
      return;
    }
    const next = new Set([...selected].filter((v) => v !== 'all'));
    if (next.has(val)) next.delete(val);
    else next.add(val);
    onChange(next.size ? next : new Set(['all']));
  };

  const chips = [...selected].filter((v) => v !== 'all');

  return (
    <div className="co2-field-group">
      <span className="co2-field-label">{label}</span>
      <div ref={wrapRef} className="co2-ms-wrap">
        <button
          type="button"
          className={`co2-ms-trigger${open ? ' open' : ''}`}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="co2-ms-text">{triggerText}</span>
          <ExpandMoreIcon className="co2-select-arrow" />
        </button>
        <div className={`co2-ms-list${open ? ' open' : ''}`}>
          <button
            type="button"
            className="co2-ms-item"
            onClick={() => toggle('all')}
          >
            <DuettoCheckbox state={selected.has('all') || selected.size === 0 ? 'checked' : 'unchecked'} />
            <span>All</span>
          </button>
          {items.map((item) => {
            const isChecked = !selected.has('all') && selected.has(item);
            return (
              <button
                key={item}
                type="button"
                className="co2-ms-item"
                onClick={() => toggle(item)}
              >
                <DuettoCheckbox state={isChecked ? 'checked' : 'unchecked'} />
                <span>{item}</span>
              </button>
            );
          })}
        </div>
        {chips.length > 0 ? (
          <div className="co2-ms-chips">
            {chips.map((v) => (
              <span key={v} className="co2-ms-chip">
                {v}
                <button
                  type="button"
                  className="co2-ms-chip-x"
                  aria-label={`Remove ${v}`}
                  onClick={() => toggle(v)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function CloseOutModal({ open, selectedDays, onClose, onComplete }: Props) {
  const { lockDay, unlockDay, setPartial } = useCalendar();
  const titleId = useId();
  const [closeType, setCloseType] = useState<CloseType>('full');
  const [minNights, setMinNights] = useState(3);
  const [ranges, setRanges] = useState<DateRange[]>([
    { id: ++rangeIdSeq, from: '2026-03-01', to: '2026-03-07' },
  ]);
  const [rules, setRules] = useState<Rule[]>([
    { id: ++ruleIdSeq, ops: new Set(['all']), rooms: new Set(['all']), boards: new Set(['all']) },
  ]);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sendAction, setSendAction] = useState<'email' | 'internal' | 'both'>('email');

  const resetState = useCallback(() => {
    setCloseType('full');
    setMinNights(3);
    setRanges([{ id: ++rangeIdSeq, from: '2026-03-01', to: '2026-03-07' }]);
    setRules([{ id: ++ruleIdSeq, ops: new Set(['all']), rooms: new Set(['all']), boards: new Set(['all']) }]);
    setEmail('');
    setMessage('');
    setSendAction('email');
  }, []);

  useEffect(() => {
    if (!open) return;
    resetState();
    if (selectedDays.size > 0) {
      const sorted = [...selectedDays].sort();
      setRanges([{ id: ++rangeIdSeq, from: sorted[0], to: sorted[sorted.length - 1] }]);
    }
  }, [open, resetState, selectedDays]);

  const handleConfirm = () => {
    const keysFromRanges = ranges.flatMap((r) => parseIsoRange(r.from, r.to).map(isoToKey));
    const keysFromSelection = [...selectedDays].map((iso) => {
      const [, m, d] = iso.split('-').map(Number);
      return dayKey(m, d);
    });
    const keys = new Set([...keysFromRanges, ...keysFromSelection]);

    keys.forEach((key) => {
      if (closeType === 'reopen') {
        unlockDay(key);
        setPartial(key, false);
      } else if (closeType === 'full') {
        lockDay(key);
        setPartial(key, false);
      } else {
        unlockDay(key);
        setPartial(key, true);
      }
    });

    onComplete();
  };

  const closeOptions = [
    { type: 'full' as const, label: 'Close all day', Icon: LockIcon },
    { type: 'los' as const, label: 'Min Length of Stay', Icon: LockIcon },
    { type: 'reopen' as const, label: 'Re-open', Icon: LockOpenIcon },
  ];

  if (!open) return null;

  return createPortal(
    <div
      className="modal-overlay open"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="co2-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="co2-title-row">
          <span className="co2-title" id={titleId}>
            Close or re-open sales
          </span>
          <IconButton type="button" size="small" className="co2-close" onClick={onClose} aria-label="Close">
            <CloseIcon style={{ fontSize: 20 }} />
          </IconButton>
        </div>

        <div className="co2-body">
          <div className="co2-section">
            <div className="co2-type-row">
              {closeOptions.map((opt) => {
                const active = closeType === opt.type;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    className={`co2-type-card${active ? ' active' : ''}`}
                    onClick={() => setCloseType(opt.type)}
                  >
                    <span className="co2-radio">
                      <span className="co2-radio-dot" />
                    </span>
                    <opt.Icon className="co2-type-ico" />
                    <span className="co2-type-label">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {closeType === 'los' && (
            <div className="co2-section">
              <label className="co2-field-label" htmlFor="co-min-nights">
                Minimum Nights
              </label>
              <input
                id="co-min-nights"
                className="co2-input"
                type="number"
                min={1}
                max={30}
                value={minNights}
                onChange={(e) => setMinNights(Number(e.target.value))}
              />
            </div>
          )}

          <div className="co2-section">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ranges.map((r, idx) => (
                <div key={r.id} className="co2-dr-wrap">
                  <span className="co2-dr-label">Date range {idx + 1}</span>
                  <label className="co2-dr-trigger" style={{ position: 'relative', cursor: 'text' }}>
                    <CalendarTodayIcon className="co2-dr-cal-ico" />
                    <span className="co2-dr-text">
                      {`${fmtDisplay(r.from) || 'mm/dd/yyyy'} - ${fmtDisplay(r.to) || 'mm/dd/yyyy'}`}
                    </span>
                    <input
                      type="date"
                      value={r.from}
                      onChange={(e) =>
                        setRanges((prev) =>
                          prev.map((x) => (x.id === r.id ? { ...x, from: e.target.value } : x)),
                        )
                      }
                      aria-label={`Range ${idx + 1} start`}
                      style={{ position: 'absolute', inset: 0, opacity: 0, width: '50%', cursor: 'pointer' }}
                    />
                    <input
                      type="date"
                      value={r.to}
                      onChange={(e) =>
                        setRanges((prev) =>
                          prev.map((x) => (x.id === r.id ? { ...x, to: e.target.value } : x)),
                        )
                      }
                      aria-label={`Range ${idx + 1} end`}
                      style={{ position: 'absolute', inset: 0, left: '50%', opacity: 0, cursor: 'pointer' }}
                    />
                    {ranges.length > 1 ? (
                      <button
                        type="button"
                        className="co2-dr-remove"
                        aria-label="Remove range"
                        onClick={(e) => {
                          e.preventDefault();
                          setRanges((prev) => prev.filter((x) => x.id !== r.id));
                        }}
                        style={{ position: 'relative', zIndex: 1 }}
                      >
                        ×
                      </button>
                    ) : null}
                  </label>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="co2-add-btn"
              onClick={() => setRanges((prev) => [...prev, { id: ++rangeIdSeq, from: '', to: '' }])}
            >
              <AddIcon sx={{ fontSize: 16 }} />
              Add date range
            </button>
          </div>

          <div className="co2-section">
            <div className="co2-heading">Closing:</div>
            {rules.map((rule) => (
              <div key={rule.id} className="co2-strategy-group">
                <MultiSelect
                  label="Operators"
                  items={OPERATORS}
                  selected={rule.ops}
                  onChange={(ops) =>
                    setRules((prev) => prev.map((r) => (r.id === rule.id ? { ...r, ops } : r)))
                  }
                />
                <MultiSelect
                  label="Room Types"
                  items={ROOM_TYPES}
                  selected={rule.rooms}
                  onChange={(rooms) =>
                    setRules((prev) => prev.map((r) => (r.id === rule.id ? { ...r, rooms } : r)))
                  }
                />
                <MultiSelect
                  label="Meal Plans"
                  items={BOARD_TYPES}
                  selected={rule.boards}
                  onChange={(boards) =>
                    setRules((prev) => prev.map((r) => (r.id === rule.id ? { ...r, boards } : r)))
                  }
                />
              </div>
            ))}
            <button
              type="button"
              className="co2-add-btn"
              onClick={() =>
                setRules((prev) => [
                  ...prev,
                  {
                    id: ++ruleIdSeq,
                    ops: new Set(['all']),
                    rooms: new Set(['all']),
                    boards: new Set(['all']),
                  },
                ])
              }
            >
              <AddIcon sx={{ fontSize: 16 }} />
              Add
            </button>
          </div>

          <div className="co2-section">
            <div className="co2-heading">Contact sales team:</div>
            <div className="co2-field-group">
              <label className="co2-field-label" htmlFor="co-email">
                Email Address
              </label>
              <input
                id="co-email"
                className="co2-input"
                type="email"
                placeholder="Placeholder"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="co2-field-group">
              <label className="co2-field-label" htmlFor="co-message">
                Sales Messages
              </label>
              <textarea
                id="co-message"
                className="co2-textarea"
                placeholder="Placeholder"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>

          <div className="co2-section">
            <div className="co2-send-label">Send Action</div>
            <div className="co2-radio-group">
              {(
                [
                  ['email', 'Email Operators'],
                  ['internal', 'Internal Note'],
                  ['both', 'Both'],
                ] as const
              ).map(([value, label]) => (
                <label key={value} className="co2-radio-row">
                  <input
                    type="radio"
                    name="coSendAction"
                    className="co2-radio-input"
                    value={value}
                    checked={sendAction === value}
                    onChange={() => setSendAction(value)}
                  />
                  <span className="co2-radio-circle" />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="co2-footer">
          <div className="co2-footer-divider" />
          <div className="co2-footer-btns">
            <Button
              type="button"
              variant="outlined"
              color="primary"
              size="medium"
              className="co2-btn-cancel"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="contained"
              color="primary"
              size="medium"
              className="co2-btn-confirm"
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
