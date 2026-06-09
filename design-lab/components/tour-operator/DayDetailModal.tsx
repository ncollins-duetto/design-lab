'use client';

import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LockIcon from '@mui/icons-material/Lock';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { IconButton } from '@material-ui/core';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useCalendar } from '@/lib/tour-operator/context/CalendarContext';
import { HOTEL_CAPACITY } from '@/lib/tour-operator/data/calendarData';
import type { CellMetrics } from '@/lib/tour-operator/calendar/metrics';
import type { MetricKey } from '@/lib/tour-operator/data/calendarData';

type Props = {
  open: boolean;
  dateLabel: string;
  metrics: CellMetrics;
  selectedMetrics: MetricKey[];
  onClose: () => void;
};

type Row = { label: string; pct: number; rn: number; deltaPct: number; deltaVs: string; tone: 'hotel' | 'other' };

function progressColor() {
  return 'linear-gradient(90deg,#004948 0%,#007a75 56%,#52d9ce 92%,#8aeee8 100%)';
}

function MetricRow({ row }: { row: Row }) {
  const isPositive = row.deltaPct >= 0;
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '90px 1fr 60px',
        alignItems: 'center',
        gap: 1,
        py: 0.5,
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Box sx={{ width: 8, height: 8, bgcolor: row.tone === 'hotel' ? '#006461' : '#bdbdbd', borderRadius: '2px' }} />
        <Typography sx={{ fontSize: 11, color: '#1c1c1c' }}>{row.label}</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#1c1c1c' }}>
            {row.pct.toFixed(0)}%
          </Typography>
          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 700,
              color: isPositive ? '#388c3f' : '#d32f2f',
            }}
          >
            {isPositive ? '▲' : '▼'} {Math.abs(row.deltaPct).toFixed(1)}% vs {row.deltaVs}
          </Typography>
        </Box>
        <Box
          sx={{
            height: 6,
            bgcolor: '#dde1e2',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              width: `${Math.min(100, row.pct)}%`,
              height: '100%',
              background: progressColor(),
              borderRadius: '2px',
            }}
          />
        </Box>
      </Box>
      <Typography sx={{ fontSize: 11, color: '#1c1c1c', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
        {row.rn.toFixed(1)} RN
      </Typography>
    </Box>
  );
}

function Section({
  title,
  defaultOpen = true,
  rows,
}: {
  title: string;
  defaultOpen?: boolean;
  rows: Row[];
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Box sx={{ borderBottom: '1px solid #dde1e2', py: 1 }}>
      <Box
        component="button"
        type="button"
        onClick={() => setOpen((o) => !o)}
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          py: 0.5,
          px: 1.5,
          border: 'none',
          bgcolor: 'transparent',
          cursor: 'pointer',
          fontFamily: 'inherit',
          textAlign: 'left',
        }}
      >
        <KeyboardArrowDownIcon
          sx={{ fontSize: 20, color: '#1c1c1c', transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.15s' }}
        />
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#1c1c1c' }}>{title}</Typography>
      </Box>
      {open && (
        <Box sx={{ px: 1.5, display: 'flex', flexDirection: 'column' }}>
          {rows.map((r, i) => (
            <MetricRow key={i} row={r} />
          ))}
        </Box>
      )}
    </Box>
  );
}

export function DayDetailModal({ open, dateLabel, metrics, onClose }: Props) {
  const { setCloseOutOpen } = useCalendar();

  const occ: Row[] = [
    {
      label: 'Hotel Segments',
      pct: metrics.hotelOcc,
      rn: (metrics.hotelOcc * HOTEL_CAPACITY) / 100 / 10,
      deltaPct: 56,
      deltaVs: 'STLY',
      tone: 'hotel',
    },
    {
      label: 'Other Segments',
      pct: metrics.toOcc,
      rn: (metrics.toOcc * HOTEL_CAPACITY) / 100 / 10,
      deltaPct: 56,
      deltaVs: 'STLY',
      tone: 'other',
    },
    {
      label: 'Total Hotel Capacity',
      pct: Math.min(100, metrics.hotelOcc + metrics.toOcc),
      rn: ((metrics.hotelOcc + metrics.toOcc) * HOTEL_CAPACITY) / 100 / 10,
      deltaPct: 56,
      deltaVs: 'STLY',
      tone: 'other',
    },
  ];

  const adr: Row[] = [
    { label: 'TO', pct: 23.9, rn: 23.9, deltaPct: 56, deltaVs: 'STLY', tone: 'hotel' },
    { label: 'Hotel', pct: 23.9, rn: 23.9, deltaPct: 56, deltaVs: 'STLY', tone: 'other' },
  ];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 375,
          bgcolor: '#fff',
          fontFamily: 'Lato, sans-serif',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 1.5,
            py: 1.5,
            borderBottom: '1px solid #dde1e2',
            flexShrink: 0,
          }}
        >
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#1c1c1c' }}>{dateLabel}</Typography>
          <IconButton onClick={onClose} size="small" aria-label="Close">
            <CloseIcon style={{ fontSize: 20, color: '#1c1c1c' }} />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          <Section
            title="Close Outs"
            rows={[
              { label: 'Hotel Segments', pct: 0, rn: 0, deltaPct: 0, deltaVs: 'STLY', tone: 'hotel' },
              { label: 'Other Segments', pct: 0, rn: 0, deltaPct: 0, deltaVs: 'STLY', tone: 'other' },
              { label: 'Other Segments', pct: 0, rn: 0, deltaPct: 0, deltaVs: 'STLY', tone: 'other' },
            ]}
          />
          <Section title="Daily Segments" rows={occ} />
          <Section title="Occupancy" rows={occ} />
          <Section title="Online / Offline" rows={[
            { label: 'Online', pct: 23.9, rn: 23.9, deltaPct: 56, deltaVs: 'STLY', tone: 'hotel' },
            { label: 'Hotel', pct: 23.9, rn: 23.9, deltaPct: 56, deltaVs: 'STLY', tone: 'other' },
          ]} />
          <Section title="ADR" rows={adr} />
          <Section title="Revenue" rows={adr} />
          <Section title="More Metrics" defaultOpen={false} rows={[]} />
          <Section title="RN Sold" defaultOpen={false} rows={adr} />
          <Section title="RevPAR" defaultOpen={false} rows={adr} />
          <Section title="Pickup" defaultOpen={false} rows={adr} />
          <Section title="Avg Adults" defaultOpen={false} rows={adr} />
          <Section title="Avg Children" defaultOpen={false} rows={adr} />
          <Section title="Total Adults" defaultOpen={false} rows={adr} />
          <Section title="Total Children" defaultOpen={false} rows={adr} />
          <Section title="Avg LOS" defaultOpen={false} rows={adr} />
          <Section title="Lead Time" defaultOpen={false} rows={adr} />
          <Section title="Avail Rooms" defaultOpen={false} rows={[{ label: 'Avail', pct: 45, rn: 23.9, deltaPct: 0, deltaVs: 'STLY', tone: 'hotel' }]} />
          <Section title="Avail Guaranteed" defaultOpen={false} rows={[{ label: 'Avail', pct: 45, rn: 23.9, deltaPct: 0, deltaVs: 'STLY', tone: 'hotel' }]} />
          <Section title="Meal Plans" defaultOpen={false} rows={adr} />
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 1,
            p: 1.5,
            borderTop: '1px solid #dde1e2',
            flexShrink: 0,
          }}
        >
          <Box
            component="button"
            type="button"
            onClick={() => {
              onClose();
              setCloseOutOpen(true);
            }}
            sx={{
              flex: 1,
              height: 36,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              border: '1px solid #006461',
              borderRadius: '4px',
              bgcolor: '#fff',
              color: '#006461',
              fontFamily: 'inherit',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            <LockIcon sx={{ fontSize: 16 }} />
            Close Out
          </Box>
          <Box
            component="button"
            type="button"
            sx={{
              flex: 1,
              height: 36,
              border: 'none',
              borderRadius: '4px',
              bgcolor: '#006461',
              color: '#fff',
              fontFamily: 'inherit',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            View More Details
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}
