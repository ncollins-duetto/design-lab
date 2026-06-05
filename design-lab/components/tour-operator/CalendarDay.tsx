'use client';

import { useState } from 'react';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import LockIcon from '@mui/icons-material/Lock';
import TodayIcon from '@mui/icons-material/Today';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import { useCalendar } from '@/lib/tour-operator/context/CalendarContext';
import {
  buildCellMetrics,
  buildMetricRows,
  dayKey,
  isToday,
} from '@/lib/tour-operator/calendar/metrics';
import {
  buildHeatmapDayData,
  getHeatmapCellClass,
  isStopSalesHeatmapActive,
} from '@/lib/tour-operator/calendar/heatmap';
import type { MetricKey } from '@/lib/tour-operator/data/calendarData';
import type { CompareMode } from '@/lib/tour-operator/calendar/metrics';
import { DayTooltip } from './DayTooltip';

type Props = {
  month: number;
  day: number;
  hasEvent: boolean;
  selectedMetrics: MetricKey[];
  selectMode: boolean;
  isSelected: boolean;
  compact: boolean;
  compare: CompareMode;
  onSelectDay: (iso: string) => void;
  onOpenDay: (month: number, day: number, label: string) => void;
  onGoToWeek: (month: number, day: number) => void;
};

const MONTH_NAMES = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function CalendarDay({
  month,
  day,
  hasEvent,
  selectedMetrics,
  selectMode,
  isSelected,
  compact,
  compare,
  onSelectDay,
  onOpenDay,
  onGoToWeek,
}: Props) {
  const { isLocked, isPartial, getFilteredOccupancy, heatmap } = useCalendar();
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);

  const key = dayKey(month, day);
  const locked = isLocked(key);
  const partial = isPartial(key);
  const { hotel, to } = getFilteredOccupancy(month, day);
  const metrics = buildCellMetrics(month, day);
  const rows = buildMetricRows(metrics, selectedMetrics, compare, month, day);
  const cmpActive = compare !== 'none';
  const iso = `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const today = isToday(month, day);
  const dateLabel = `${MONTH_NAMES[month]} ${day}, 2026`;

  const stopSalesHm = isStopSalesHeatmapActive(heatmap);
  const showCloseIndicators = !stopSalesHm;
  const hmData = buildHeatmapDayData(month, day, locked, partial, to);
  const hmClass = heatmap.enabled ? getHeatmapCellClass(hmData, heatmap) : '';

  const dayClasses = [
    'cal-day',
    showCloseIndicators && locked ? 'locked' : '',
    showCloseIndicators && partial ? 'cal-partial-close' : '',
    today ? 'today cal-day-today' : '',
    hmClass,
  ]
    .filter(Boolean)
    .join(' ');

  const metricRows = rows.map((r) => (
    <div
      key={`${r.shortLabel}-${r.tone}`}
      className={`cell-m-row ${r.tone === 'to' ? 'cell-m-to' : 'cell-m-hotel'}`}
    >
      <span className="cell-m-label">{r.shortLabel}</span>
      <span className="cell-m-val">{r.value}</span>
      {r.cmp ? (
        <span
          className="cell-m-cmp"
          style={{ color: r.cmp.positive ? '#388C3F' : '#D32F2F' }}
        >
          {r.cmp.positive ? (
            <ArrowUpwardIcon className="cell-m-cmp-arrow" sx={{ fontSize: 14 }} />
          ) : (
            <ArrowDownwardIcon className="cell-m-cmp-arrow" sx={{ fontSize: 14 }} />
          )}
          <span className="cell-m-cmp-amt">{r.cmp.diffStr}</span>
        </span>
      ) : null}
    </div>
  ));

  return (
    <>
      <div
        className={dayClasses}
        onMouseEnter={(e) => setHover({ x: e.clientX, y: e.clientY })}
        onMouseMove={(e) => hover && setHover({ x: e.clientX, y: e.clientY })}
        onMouseLeave={() => setHover(null)}
        onClick={(e) => {
          if (selectMode) return;
          const t = e.target as HTMLElement;
          if (t.closest('.mo-day-chk, .cell-eye-btn, .MuiCheckbox-root, .MuiIconButton-root, button, label')) {
            return;
          }
          onGoToWeek(month, day);
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onOpenDay(month, day, dateLabel);
        }}
      >
        <div className="cell-day-hdr">
          {selectMode ? (
            <Checkbox
              size="small"
              className="mo-day-chk"
              checked={isSelected}
              onChange={() => onSelectDay(iso)}
              onClick={(e) => e.stopPropagation()}
              color="primary"
            />
          ) : (
            <span />
          )}
          <span className="day-num">{day}</span>
          <span className="cell-hdr-spacer">
            <IconButton
              size="small"
              className={`cell-eye-btn${compact ? ' cell-eye' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onOpenDay(month, day, dateLabel);
              }}
              aria-label="Quick view"
            >
              <VisibilityIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </span>
        </div>

        {!compact && showCloseIndicators && (
          <div className="cell-close-slot">
            {locked && (
              <span className="cell-closed-label">
                Closed
                <LockIcon sx={{ fontSize: 15 }} />
              </span>
            )}
            {!locked && partial && (
              <span className="cell-partial-close-label">
                Partial
                <LockIcon sx={{ fontSize: 15 }} />
              </span>
            )}
          </div>
        )}

        {!compact && (
          <div className={`cell-content${cmpActive ? ' cmp-active' : ''}`}>
            {metricRows}
          </div>
        )}

        {hasEvent && !locked && !compact && (
          <TodayIcon className="day-event-icon" sx={{ fontSize: 18, color: 'primary.main' }} />
        )}
      </div>

      {hover && <DayTooltip x={hover.x} y={hover.y} hotelPct={hotel} toPct={to} />}
    </>
  );
}
