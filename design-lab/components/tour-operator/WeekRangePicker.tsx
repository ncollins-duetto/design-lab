'use client';

import { useMemo, useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { Button, IconButton } from '@material-ui/core';

const TEAL = '#006461';
const RANGE_BG = 'rgba(0, 100, 97, 0.13)';
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

type Props = {
  open: boolean;
  anchorEl: HTMLElement | null;
  startDate: Date;
  endDate: Date;
  onClose: () => void;
  onApply: (start: Date, end: Date) => void;
  onCancel: () => void;
};

function startOfMonth(year: number, month: number) {
  return new Date(year, month, 1);
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isBetween(d: Date, start: Date, end: Date) {
  const t = d.getTime();
  const lo = Math.min(start.getTime(), end.getTime());
  const hi = Math.max(start.getTime(), end.getTime());
  return t > lo && t < hi;
}

function formatDate(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${m}/${day}/${d.getFullYear()}`;
}

function MonthGrid({
  year,
  month,
  start,
  end,
  hover,
  picking,
  onClick,
  onHover,
}: {
  year: number;
  month: number;
  start: Date | null;
  end: Date | null;
  hover: Date | null;
  picking: boolean;
  onClick: (d: Date) => void;
  onHover: (d: Date | null) => void;
}) {
  const firstDay = startOfMonth(year, month).getDay();
  const total = daysInMonth(year, month);
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i += 1) cells.push(null);
  for (let d = 1; d <= total; d += 1) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const lo = start && end && start <= end ? start : end;
  const hi = start && end && start <= end ? end : start;
  const previewEnd = picking && start && hover ? hover : null;
  const previewLo = previewEnd && start && start <= previewEnd ? start : previewEnd;
  const previewHi = previewEnd && start && start <= previewEnd ? previewEnd : start;

  return (
    <Box sx={{ flex: 1, px: 2, py: 2 }}>
      <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1c1c1c', textAlign: 'center', mb: 2 }}>
        {MONTH_NAMES[month]} {year}
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0 }}>
        {DOW.map((d) => (
          <Box
            key={d}
            sx={{
              textAlign: 'center',
              fontSize: 12,
              color: '#4f5b60',
              fontWeight: 400,
              py: 0.5,
            }}
          >
            {d}
          </Box>
        ))}

        {cells.map((d, idx) => {
          if (d === null) return <Box key={`empty-${idx}`} sx={{ height: 32 }} />;

          const date = new Date(year, month, d);
          const isStart = (lo && isSameDay(date, lo)) || (previewLo && isSameDay(date, previewLo));
          const isEnd = (hi && isSameDay(date, hi)) || (previewHi && isSameDay(date, previewHi));
          const inRange =
            (lo && hi && isBetween(date, lo, hi)) ||
            (previewLo && previewHi && isBetween(date, previewLo, previewHi));

          return (
            <Box
              key={`d-${d}`}
              onClick={() => onClick(date)}
              onMouseEnter={() => onHover(date)}
              onMouseLeave={() => onHover(null)}
              sx={{
                position: 'relative',
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {inRange && !isStart && !isEnd && (
                <Box
                  sx={{
                    position: 'absolute',
                    inset: '4px 0',
                    bgcolor: RANGE_BG,
                  }}
                />
              )}
              {(isStart || isEnd) && (
                <Box
                  sx={{
                    position: 'absolute',
                    inset: '4px 0',
                    bgcolor: RANGE_BG,
                    ...(isStart && !isEnd ? { left: '50%' } : {}),
                    ...(isEnd && !isStart ? { right: '50%' } : {}),
                  }}
                />
              )}
              {(isStart || isEnd) && (
                <Box
                  sx={{
                    position: 'absolute',
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    bgcolor: TEAL,
                  }}
                />
              )}
              <Typography
                sx={{
                  position: 'relative',
                  fontSize: 13,
                  fontWeight: isStart || isEnd ? 600 : 400,
                  color: isStart || isEnd ? '#fff' : '#1c1c1c',
                }}
              >
                {d}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export function WeekRangePicker({ open, anchorEl, startDate, endDate, onClose, onApply, onCancel }: Props) {
  const [leftMonth, setLeftMonth] = useState(() => ({
    year: startDate.getFullYear(),
    month: startDate.getMonth(),
  }));
  const [start, setStart] = useState<Date | null>(startDate);
  const [end, setEnd] = useState<Date | null>(endDate);
  const [hover, setHover] = useState<Date | null>(null);
  const [picking, setPicking] = useState(false);

  const rightMonth = useMemo(() => {
    const m = leftMonth.month + 1;
    if (m > 11) return { year: leftMonth.year + 1, month: 0 };
    return { year: leftMonth.year, month: m };
  }, [leftMonth]);

  const shiftLeft = (months: number) => {
    setLeftMonth((prev) => {
      let m = prev.month + months;
      let y = prev.year;
      while (m < 0) { m += 12; y -= 1; }
      while (m > 11) { m -= 12; y += 1; }
      return { year: y, month: m };
    });
  };

  const handleDayClick = (d: Date) => {
    if (!picking) {
      setStart(d);
      setEnd(null);
      setPicking(true);
    } else {
      if (start && d < start) {
        setEnd(start);
        setStart(d);
      } else {
        setEnd(d);
      }
      setPicking(false);
    }
  };

  const footerLabel = useMemo(() => {
    if (start && end) return `${formatDate(start)} - ${formatDate(end)}`;
    if (start) return `${formatDate(start)} - (select end)`;
    return 'Select a date range';
  }, [start, end]);

  const ready = Boolean(start && end);

  return (
    <Popover
      open={open && Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      PaperProps={{
        sx: {
          mt: 0.5,
          bgcolor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
        },
      }}
    >
      <Box sx={{ width: 648 }}>
        {/* Header with nav arrows */}
        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pt: 2 }}>
          <IconButton size="small" onClick={() => shiftLeft(-12)} aria-label="Previous year">
            <KeyboardDoubleArrowLeftIcon style={{ fontSize: 18 }} />
          </IconButton>
          <IconButton size="small" onClick={() => shiftLeft(-1)} aria-label="Previous month">
            <ChevronLeftIcon style={{ fontSize: 18 }} />
          </IconButton>
          <Box sx={{ flex: 1 }} />
          <IconButton size="small" onClick={() => shiftLeft(1)} aria-label="Next month">
            <ChevronRightIcon style={{ fontSize: 18 }} />
          </IconButton>
          <IconButton size="small" onClick={() => shiftLeft(12)} aria-label="Next year">
            <KeyboardDoubleArrowRightIcon style={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* Two-month grid */}
        <Box sx={{ display: 'flex' }}>
          <MonthGrid
            year={leftMonth.year}
            month={leftMonth.month}
            start={start}
            end={end}
            hover={hover}
            picking={picking}
            onClick={handleDayClick}
            onHover={setHover}
          />
          <MonthGrid
            year={rightMonth.year}
            month={rightMonth.month}
            start={start}
            end={end}
            hover={hover}
            picking={picking}
            onClick={handleDayClick}
            onHover={setHover}
          />
        </Box>

        {/* Footer */}
        <Box
          sx={{
            borderTop: '1px solid #dde1e2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1.5,
          }}
        >
          <Typography sx={{ fontSize: 13, color: '#4f5b60' }}>{footerLabel}</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" color="primary" size="medium" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              disabled={!ready}
              onClick={() => {
                if (start && end) onApply(start, end);
              }}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Box>
    </Popover>
  );
}
