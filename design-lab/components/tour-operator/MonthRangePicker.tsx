'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import { IconButton, Button } from '@material-ui/core';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { ALL_MONTHS } from '@/lib/tour-operator/data/calendarData';

const MONTH_ABBR = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

type Props = {
  open: boolean;
  anchorEl: HTMLElement | null;
  appliedStartIdx: number;
  appliedEndIdx: number;
  onClose: () => void;
  onApply: (startIdx: number, endIdx: number) => void;
  onCancel: () => void;
};

type PickPhase = 0 | 1 | 2;

function monthIndexForYear(year: number, month1Based: number) {
  return ALL_MONTHS.findIndex((m) => m.year === year && m.month === month1Based);
}

function clampIdx(idx: number) {
  return Math.max(0, Math.min(ALL_MONTHS.length - 1, idx));
}

function YearMonthGrid({
  year,
  bounds,
  onMonthClick,
  onMonthHover,
  onMonthHoverOut,
}: {
  year: number;
  bounds: { lo: number; hi: number } | null;
  onMonthClick: (idx: number) => void;
  onMonthHover: (idx: number) => void;
  onMonthHoverOut: () => void;
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gridAutoRows: '34px',
        rowGap: '2px',
        width: '100%',
      }}
    >
      {MONTH_ABBR.map((abbr, mi) => {
        const idx = monthIndexForYear(year, mi + 1);
        const inData = idx >= 0;
        const lo = bounds?.lo ?? -1;
        const hi = bounds?.hi ?? -1;
        const inRange = inData && bounds && idx >= lo && idx <= hi;
        const isStart = inRange && idx === lo;
        const isEnd = inRange && idx === hi;
        const isMid = inRange && !isStart && !isEnd;
        const prevInRange = inData && bounds && idx > lo && idx - 1 >= lo;
        const nextInRange = inData && bounds && idx < hi && idx + 1 <= hi;

        const Cell = inData ? 'button' : 'div';
        const isEdge = inRange && (!prevInRange || !nextInRange);

        return (
          <Box
            key={`${year}-${abbr}`}
            component={Cell as 'button'}
            type={inData ? 'button' : undefined}
            onClick={inData ? () => onMonthClick(idx) : undefined}
            onMouseEnter={inData ? () => onMonthHover(idx) : undefined}
            onMouseLeave={inData ? onMonthHoverOut : undefined}
            sx={{
              position: 'relative',
              height: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              cursor: inData ? 'pointer' : 'default',
              opacity: inData ? 1 : 0.35,
              pointerEvents: inData ? 'auto' : 'none',
              background: 'transparent',
              border: 'none',
              padding: 0,
              fontFamily: 'inherit',
            }}
          >
            {/* Range fill background — 28px tall, edges left/right open */}
            {isMid && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 3,
                  bottom: 3,
                  left: 0,
                  right: 0,
                  bgcolor: 'rgba(0,100,97,0.13)',
                }}
              />
            )}
            {isStart && !isEnd && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 3,
                  bottom: 3,
                  left: '50%',
                  right: 0,
                  bgcolor: 'rgba(0,100,97,0.13)',
                }}
              />
            )}
            {isEnd && !isStart && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 3,
                  bottom: 3,
                  left: 0,
                  right: '50%',
                  bgcolor: 'rgba(0,100,97,0.13)',
                }}
              />
            )}
            {/* Pill for start/end */}
            {(isStart || isEnd) && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 3,
                  height: 28,
                  width: 42,
                  borderRadius: '14px',
                  bgcolor: '#006461',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 1,
                }}
              />
            )}
            <Typography
              sx={{
                position: 'relative',
                zIndex: 2,
                fontSize: 12,
                lineHeight: '12px',
                fontWeight: isStart || isEnd ? 700 : 400,
                color: isStart || isEnd ? '#fff' : '#1c1c1c',
                fontFamily: 'Lato, sans-serif',
              }}
            >
              {abbr}
            </Typography>
            {/* Hover bg */}
            {inData && !inRange && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  bgcolor: 'transparent',
                  '*:hover > &': { bgcolor: '#f5f5f5' },
                }}
              />
            )}
            {/* Mark edges with rounded ends for the bg fill */}
            {isEdge && isMid && null}
          </Box>
        );
      })}
    </Box>
  );
}

function PresetItem({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        width: '100%',
        textAlign: 'left',
        px: 1,
        py: '5px',
        border: 'none',
        bgcolor: 'transparent',
        cursor: 'pointer',
        borderRadius: '4px',
        color: '#006461',
        fontSize: 13,
        lineHeight: '18.59px',
        fontFamily: 'Lato, sans-serif',
        '&:hover': { bgcolor: '#f5f5f5' },
      }}
    >
      {label}
    </Box>
  );
}

function PresetLabel({ children }: { children: string }) {
  return (
    <Box sx={{ px: '4px', pt: '3.5px', pb: '1.8px', width: '100%' }}>
      <Typography
        sx={{
          fontSize: 10,
          lineHeight: '14.3px',
          fontWeight: 700,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          color: '#9ca3af',
          fontFamily: 'Lato, sans-serif',
        }}
      >
        {children}
      </Typography>
    </Box>
  );
}

export function MonthRangePicker({
  open,
  anchorEl,
  appliedStartIdx,
  appliedEndIdx,
  onClose,
  onApply,
  onCancel,
}: Props) {
  const [leftYear, setLeftYear] = useState(ALL_MONTHS[appliedStartIdx]?.year ?? 2026);
  const [startIdx, setStartIdx] = useState<number | null>(appliedStartIdx);
  const [endIdx, setEndIdx] = useState<number | null>(appliedEndIdx);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [phase, setPhase] = useState<PickPhase>(2);

  const resetFromApplied = useCallback(() => {
    const lo = Math.min(appliedStartIdx, appliedEndIdx);
    const hi = Math.max(appliedStartIdx, appliedEndIdx);
    setStartIdx(lo);
    setEndIdx(hi);
    setHoverIdx(null);
    setPhase(2);
    setLeftYear(ALL_MONTHS[lo]?.year ?? 2026);
  }, [appliedStartIdx, appliedEndIdx]);

  useEffect(() => {
    if (!open) return;
    resetFromApplied();
  }, [open, resetFromApplied]);

  const bounds = useMemo(() => {
    if (startIdx === null) return null;
    if (phase === 2 && endIdx !== null) {
      return { lo: Math.min(startIdx, endIdx), hi: Math.max(startIdx, endIdx) };
    }
    if (phase === 1) {
      const hover = hoverIdx ?? startIdx;
      return { lo: Math.min(startIdx, hover), hi: Math.max(startIdx, hover) };
    }
    return { lo: startIdx, hi: startIdx };
  }, [startIdx, endIdx, hoverIdx, phase]);

  const handleMonthClick = (idx: number) => {
    if (phase === 1 && startIdx !== null) {
      let end = idx;
      let start = startIdx;
      if (end < start) [start, end] = [end, start];
      setStartIdx(start);
      setEndIdx(end);
      setHoverIdx(null);
      setPhase(2);
      return;
    }
    setStartIdx(idx);
    setEndIdx(null);
    setHoverIdx(null);
    setPhase(1);
  };

  const applyRange = (lo: number, hi: number) => {
    const l = clampIdx(Math.min(lo, hi));
    const h = clampIdx(Math.max(lo, hi));
    setStartIdx(l);
    setEndIdx(h);
    setPhase(2);
    setHoverIdx(null);
    setLeftYear(ALL_MONTHS[l]?.year ?? 2026);
  };

  // Presets relative to today (2026-06-04)
  const TODAY = { year: 2026, month: 6 };
  const todayIdx = clampIdx(monthIndexForYear(TODAY.year, TODAY.month));

  const presetThisMonth = () => applyRange(todayIdx, todayIdx);
  const presetNextMonth = () => applyRange(todayIdx + 1, todayIdx + 1);
  const presetQuarter = () => {
    const q = Math.floor((TODAY.month - 1) / 3);
    const startM = q * 3 + 1;
    applyRange(monthIndexForYear(TODAY.year, startM), monthIndexForYear(TODAY.year, startM + 2));
  };
  const presetYear = () => applyRange(monthIndexForYear(TODAY.year, 1), monthIndexForYear(TODAY.year, 12));
  const presetNextN = (n: number) => applyRange(todayIdx + 1, todayIdx + n);

  const footerLabel = useMemo(() => {
    if (phase === 0 || startIdx === null) return 'Select a start month';
    const lo = bounds?.lo ?? startIdx;
    const hi = bounds?.hi ?? startIdx;
    const startM = ALL_MONTHS[lo];
    const endM = ALL_MONTHS[hi];
    if (phase === 1) {
      if (startM && endM && lo !== hi) return `${startM.name} – ${endM.name}`;
      return `${startM?.name ?? ''} – ? (select end month)`;
    }
    return `${startM?.name ?? ''} – ${endM?.name ?? ''}`;
  }, [bounds, phase, startIdx]);

  const ready = phase === 2 && startIdx !== null && endIdx !== null;

  return (
    <Popover
      open={open && Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        sx: {
          mt: 0.5,
          maxWidth: '95vw',
          bgcolor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
          overflow: 'hidden',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 720 }}>
        <Box sx={{ display: 'flex', alignItems: 'stretch' }}>
          {/* Left year */}
          <Box sx={{ flex: 1, py: '16px', pt: '20px', px: '20px', display: 'flex', flexDirection: 'column' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                pr: '105px',
                pb: '10px',
                height: 28,
              }}
            >
              <IconButton
                size="small"
                onClick={() => setLeftYear((y) => y - 1)}
                aria-label="Previous year"
                style={{ width: 24, height: 24, color: '#585858' }}
              >
                <ChevronLeftIcon style={{ fontSize: 18 }} />
              </IconButton>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                  lineHeight: '20px',
                  color: '#1c1c1c',
                  fontFamily: 'Lato, sans-serif',
                }}
              >
                {leftYear}
              </Typography>
            </Box>
            <YearMonthGrid
              year={leftYear}
              bounds={bounds}
              onMonthClick={handleMonthClick}
              onMonthHover={(idx) => {
                if (phase === 1) setHoverIdx(idx);
              }}
              onMonthHoverOut={() => {
                if (phase === 1) setHoverIdx(null);
              }}
            />
          </Box>


          {/* Right year */}
          <Box sx={{ flex: 1, py: '16px', pt: '20px', px: '20px', display: 'flex', flexDirection: 'column' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                pl: '105px',
                pb: '10px',
                height: 28,
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                  lineHeight: '20px',
                  color: '#1c1c1c',
                  fontFamily: 'Lato, sans-serif',
                }}
              >
                {leftYear + 1}
              </Typography>
              <IconButton
                size="small"
                onClick={() => setLeftYear((y) => y + 1)}
                aria-label="Next year"
                style={{ width: 24, height: 24, color: '#585858' }}
              >
                <ChevronRightIcon style={{ fontSize: 18 }} />
              </IconButton>
            </Box>
            <YearMonthGrid
              year={leftYear + 1}
              bounds={bounds}
              onMonthClick={handleMonthClick}
              onMonthHover={(idx) => {
                if (phase === 1) setHoverIdx(idx);
              }}
              onMonthHoverOut={() => {
                if (phase === 1) setHoverIdx(null);
              }}
            />
          </Box>

          {/* Presets sidebar */}
          <Box
            sx={{
              width: 106,
              borderLeft: '1px solid #dde1e2',
              pl: '11px',
              pr: '10px',
              py: '16px',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            <PresetItem label="This Month" onClick={presetThisMonth} />
            <PresetItem label="Next Month" onClick={presetNextMonth} />
            <Box sx={{ py: '6px', width: '100%' }}>
              <Box sx={{ height: 1, bgcolor: '#dde1e2', width: '100%' }} />
            </Box>
            <PresetLabel>Current</PresetLabel>
            <PresetItem label="Quarter" onClick={presetQuarter} />
            <PresetItem label="Year" onClick={presetYear} />
            <Box sx={{ py: '6px', width: '100%' }}>
              <Box sx={{ height: 1, bgcolor: '#dde1e2', width: '100%' }} />
            </Box>
            <PresetLabel>Next</PresetLabel>
            <PresetItem label="3 Months" onClick={() => presetNextN(3)} />
            <PresetItem label="6 Months" onClick={() => presetNextN(6)} />
            <PresetItem label="12 Months" onClick={() => presetNextN(12)} />
          </Box>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            borderTop: '1px solid #dde1e2',
            height: 52,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: '20px',
          }}
        >
          <Typography
            sx={{
              fontSize: 13,
              lineHeight: '18.59px',
              color: '#4f5b60',
              fontFamily: 'Lato, sans-serif',
            }}
          >
            {footerLabel}
          </Typography>
          <Box sx={{ display: 'flex', gap: '8px' }}>
            <Button
              type="button"
              variant="outlined"
              color="primary"
              size="medium"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="contained"
              color="primary"
              size="medium"
              disabled={!ready}
              onClick={() => {
                if (!ready || startIdx === null || endIdx === null) return;
                onApply(Math.min(startIdx, endIdx), Math.max(startIdx, endIdx));
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
