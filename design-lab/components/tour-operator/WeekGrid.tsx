'use client';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import TodayIcon from '@mui/icons-material/Today';
import Checkbox from '@mui/material/Checkbox';
import { type Dispatch, type ReactNode, type SetStateAction, useMemo } from 'react';
import { EVENT_DAYS } from '@/lib/tour-operator/data/calendarData';
import { useCalendar } from '@/lib/tour-operator/context/CalendarContext';
import type { CompareMode } from '@/lib/tour-operator/calendar/metrics';
import { dayKey } from '@/lib/tour-operator/calendar/metrics';
import { renderSectCell, renderSubCell, renderTopCell } from '@/lib/tour-operator/calendar/weekGridCells';
import {
  buildWbRows,
  buildWeekDayData,
  getWeekDays,
  isRowHidden,
} from '@/lib/tour-operator/calendar/weekGridData';

const DOW_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TODAY = { month: 3, day: 9 };

type Props = {
  month: number;
  startDay: number;
  compare: CompareMode;
  compareModes: CompareMode[];
  collapsed: Record<string, boolean>;
  onCollapsedChange: Dispatch<SetStateAction<Record<string, boolean>>>;
  selectMode: boolean;
  selectedDays: Set<string>;
  onSelectDay: (iso: string) => void;
};

export function WeekGrid({ month, startDay, compare: _compare, compareModes, collapsed, onCollapsedChange, selectMode, selectedDays, onSelectDay }: Props) {
  void _compare;
  const { isLocked, isPartial } = useCalendar();
  const rows = useMemo(() => buildWbRows(), []);
  const rowMap = useMemo(() => new Map(rows.map((r) => [r.id, r])), [rows]);

  const days = useMemo(() => getWeekDays(2026, month, startDay), [month, startDay]);
  const dayData = useMemo(
    () => days.map((dv) => buildWeekDayData(dv.month, dv.day)),
    [days],
  );

  const toggle = (id: string) => {
    onCollapsedChange((c) => ({ ...c, [id]: !c[id] }));
  };

  const chev = (open: boolean) =>
    open ? <ExpandLessIcon sx={{ fontSize: 18 }} /> : <ExpandMoreIcon sx={{ fontSize: 18 }} />;

  return (
    <div className="wb-layout cal-week-grid">
      <div className="wb-row wb-hdr-row">
        <div className="wb-label-cell wb-hdr-label-cell" />
        {days.map((dv) => {
          const dt = new Date(dv.year, dv.month - 1, dv.day);
          const dow = DOW_SHORT[dt.getDay()];
          const key = dayKey(dv.month, dv.day);
          const locked = isLocked(key);
          const partial = isPartial(key);
          const isActive = dv.month === month && dv.day === startDay;
          const isToday = dv.month === TODAY.month && dv.day === TODAY.day;
          const dba = Math.round((dt.getTime() - new Date(2026, 2, 9).getTime()) / 86400000);
          const dbaStr = dba === 0 ? 'Today' : dba > 0 ? `${dba} DBA` : '';
          const hasEvent = EVENT_DAYS.has(key);
          const iso = `${dv.year}-${String(dv.month).padStart(2, '0')}-${String(dv.day).padStart(2, '0')}`;
          const isSelected = selectedDays.has(iso);

          return (
            <div
              key={`${dv.month}-${dv.day}`}
              className={[
                'wb-data-cell',
                'wb-hdr-cell',
                isActive ? 'wb-hdr-active' : '',
                isToday ? 'wb-hdr-today' : '',
                selectMode ? 'wb-hdr-selectable' : '',
                isSelected ? 'wb-hdr-selected' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={selectMode ? () => onSelectDay(iso) : undefined}
              style={selectMode ? { cursor: 'pointer' } : undefined}
            >
              <Checkbox
                size="small"
                className="wb-hdr-check"
                sx={{
                  p: 0,
                  color: 'rgba(255,255,255,0.7)',
                  '&.Mui-checked': { color: '#c4ff45' },
                  display: selectMode ? 'inline-flex' : 'none',
                }}
                checked={isSelected}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectDay(iso);
                }}
                onChange={() => {}}
              />
              <span className="wb-hdr-dow">{dow}</span>
              <span className="wb-hdr-date">
                {dv.day}/{dv.month}
              </span>
              {hasEvent ? (
                <TodayIcon sx={{ fontSize: 14, color: '#c4ff45' }} aria-hidden />
              ) : null}
              {dbaStr ? (
                <span
                  style={{
                    fontSize: 10,
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: 3,
                    padding: '0 4px',
                    color: '#fff',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {dbaStr}
                </span>
              ) : null}
              {locked ? (
                <span className="wb-hdr-lock-icon" title="Closed out">
                  <LockIcon sx={{ fontSize: 13, color: '#fca5a5' }} />
                </span>
              ) : partial ? (
                <span className="wb-hdr-lock-icon" title="Partially closed out">
                  <LockOpenIcon sx={{ fontSize: 13, color: '#fde68a' }} />
                </span>
              ) : null}
            </div>
          );
        })}
      </div>

      {rows.map((row) => {
        if (isRowHidden(row, collapsed, rowMap)) return null;
        const isCollapsed = Boolean(collapsed[row.id]);
        const rowCls = `wb-row wb-row-${row.type}${row.parent && collapsed[row.parent] ? ' wb-row-hidden' : ''}`;

        return (
          <div key={row.id} className={rowCls} data-wb-id={row.id}>
            {row.type === 'top' ? (
              <button
                type="button"
                className="wb-label-cell wb-grp-hdr"
                onClick={() => toggle(row.id)}
              >
                <span className="wb-chev">{chev(!isCollapsed)}</span>
                <span className="wb-grp-label">{row.label}</span>
              </button>
            ) : row.type === 'sect' ? (
              <button
                type="button"
                className="wb-label-cell wb-sect-lbl"
                onClick={() => toggle(row.id)}
              >
                <span className="wb-chev">{chev(!isCollapsed)}</span>
                <span className="wb-sect-label">{row.label}</span>
              </button>
            ) : (
              <div className="wb-label-cell wb-sub-lbl-cell">
                {row.dot ? (
                  <span className="wb-sub-dot" style={{ background: row.dot }} />
                ) : null}
                <span className={`wb-sub-label${row.isRem ? ' wb-sub-lbl-rem' : ''}`}>{row.label}</span>
              </div>
            )}

            {dayData.map((d, i) => {
              const dv = days[i];
              const key = dayKey(dv.month, dv.day);
              const locked = isLocked(key);
              const partial = isPartial(key);
              const dayLocked = locked;

              let content: ReactNode = null;
              if (row.type === 'top') {
                content = renderTopCell(row, d, isCollapsed, locked, partial);
              } else if (row.type === 'sect') {
                content = renderSectCell(row, d, compareModes);
              } else {
                content = renderSubCell(row, d, locked, partial, compareModes);
              }

              return (
                <div
                  key={`${row.id}-${dv.month}-${dv.day}`}
                  className={`wb-data-cell wb-${row.type}-cell${dayLocked ? ' wb-col-locked' : ''}`}
                >
                  {content}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
