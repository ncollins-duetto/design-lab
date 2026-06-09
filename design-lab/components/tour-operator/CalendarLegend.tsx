'use client';

import LockIcon from '@mui/icons-material/Lock';
import TodayIcon from '@mui/icons-material/Today';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export function CalendarLegend() {
  return (
    <Stack direction="row" className="cal-legend" spacing={2} useFlexGap sx={{ flexWrap: 'wrap' }}>
      <Box className="leg-item" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <VisibilityIcon sx={{ fontSize: 12 }} />
        <Typography variant="body2">Hover cell for quick view</Typography>
      </Box>
      <Box className="leg-item" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <LockIcon sx={{ fontSize: 12, color: '#dc2626' }} />
        <Typography variant="body2">Full close out</Typography>
      </Box>
      <Box className="leg-item" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <LockIcon sx={{ fontSize: 12, color: '#ea580c' }} />
        <Typography variant="body2">Partial close out</Typography>
      </Box>
      <Box className="leg-item leg-item-event" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <TodayIcon sx={{ fontSize: 14, color: 'primary.main' }} />
        <Typography variant="body2">Event</Typography>
      </Box>
      <Box className="leg-item" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Box className="leg-color-swatch" sx={{ bgcolor: '#1C1C1C', width: 10, height: 10 }} />
        <Typography variant="body2">Hotel</Typography>
      </Box>
      <Box className="leg-item" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Box className="leg-color-swatch" sx={{ bgcolor: '#47c5bc', width: 10, height: 10 }} />
        <Typography variant="body2">Tour Operator</Typography>
      </Box>
    </Stack>
  );
}
