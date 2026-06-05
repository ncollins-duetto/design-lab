'use client';

import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import HotelIcon from '@mui/icons-material/Hotel';
import LockIcon from '@mui/icons-material/Lock';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { SvgIconComponent } from '@mui/icons-material';
import {
  HEATMAP_TYPE_OPTIONS,
  HM_METRIC_COLORS,
  HM_STOP_SALES_COLORS,
  ROOM_TYPE_OPTIONS,
  type HeatmapState,
  type HeatmapType,
} from '@/lib/tour-operator/data/heatmapTypes';

const TYPE_ICONS: Record<HeatmapType, SvgIconComponent> = {
  stopsales: LockIcon,
  hotelocc: HotelIcon,
  remaining: MeetingRoomIcon,
  mealplan: RestaurantIcon,
  toforecast: TrendingUpIcon,
};

type Props = {
  open: boolean;
  draft: HeatmapState;
  onChange: (next: HeatmapState) => void;
  onClose: () => void;
  onReset: () => void;
  onApply: () => void;
};

type ThresholdRowDef = {
  key: 'grey' | 'blue' | 'green';
  color: string;
  boldLabel?: string;
  desc?: string;
  inputLabel?: string;
  which?: 'grey' | 'green';
  unitOptions?: string[];
  suffix?: string;
};

function RadioCard({
  selected,
  Icon,
  label,
  onClick,
}: {
  selected: boolean;
  Icon: SvgIconComponent;
  label: string;
  onClick: () => void;
}) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        flex: '1 0 0',
        minWidth: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: '10px',
        borderRadius: '4px',
        border: '1px solid',
        borderColor: '#DDE1E2',
        bgcolor: '#fff',
        cursor: 'pointer',
        fontFamily: 'inherit',
        textAlign: 'left',
        '&:hover': { borderColor: '#DDE1E2' },
      }}
    >
      <Box
        sx={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          border: '2px solid',
          borderColor: selected ? '#006461' : '#4f5b60',
          bgcolor: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {selected && <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#006461' }} />}
      </Box>
      <Icon sx={{ fontSize: 18, color: '#006461' }} />
      <Typography
        sx={{ fontSize: 14, fontWeight: 700, color: '#1c1c1c', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {label}
      </Typography>
    </Box>
  );
}

function thresholdsFor(type: HeatmapType): ThresholdRowDef[] {
  switch (type) {
    case 'stopsales':
      return [
        { key: 'grey', color: HM_STOP_SALES_COLORS.closed, boldLabel: 'Closed', desc: 'Full close out day' },
        { key: 'blue', color: HM_STOP_SALES_COLORS.partial, boldLabel: 'Partial', desc: 'At least 1 partial close out' },
        { key: 'green', color: HM_STOP_SALES_COLORS.open, boldLabel: 'Open', desc: 'No stop sale' },
      ];
    case 'hotelocc':
      return [
        { key: 'grey', color: HM_METRIC_COLORS.grey, inputLabel: 'Occupancy above (%)', which: 'grey' },
        { key: 'blue', color: HM_METRIC_COLORS.blue, desc: 'Between Grey & Green thresholds' },
        { key: 'green', color: HM_METRIC_COLORS.green, inputLabel: 'Occupancy below (%)', which: 'green' },
      ];
    case 'remaining':
      return [
        { key: 'grey', color: HM_METRIC_COLORS.grey, inputLabel: 'Remaining rooms less than', which: 'grey', unitOptions: ['RN', '%'] },
        { key: 'blue', color: HM_METRIC_COLORS.blue, desc: 'Between Grey & Green thresholds' },
        { key: 'green', color: HM_METRIC_COLORS.green, inputLabel: 'Remaining rooms more than', which: 'green', unitOptions: ['RN', '%'] },
      ];
    case 'mealplan':
      return [
        { key: 'grey', color: HM_METRIC_COLORS.grey, inputLabel: 'Total guests above', which: 'grey', suffix: 'guests' },
        { key: 'blue', color: HM_METRIC_COLORS.blue, desc: 'Between Grey & Green thresholds' },
        { key: 'green', color: HM_METRIC_COLORS.green, inputLabel: 'Total guests below', which: 'green', suffix: 'guests' },
      ];
    case 'toforecast':
      return [
        { key: 'grey', color: HM_METRIC_COLORS.grey, boldLabel: 'Above Forecast', desc: 'OTB exceeds the forecast by', which: 'grey', inputLabel: '', unitOptions: ['RN', '%'] },
        { key: 'blue', color: HM_METRIC_COLORS.blue, boldLabel: 'Within Range', desc: 'OTB within forecast variance' },
        { key: 'green', color: HM_METRIC_COLORS.green, boldLabel: 'Below Forecast', desc: 'OTB is below the forecast by', which: 'green', inputLabel: '', unitOptions: ['RN', '%'] },
      ];
  }
}

export function HeatmapModal({ open, draft, onChange, onClose, onReset: _onReset, onApply }: Props) {
  void _onReset;
  const [units, setUnits] = useState<Record<string, string>>({ grey: 'RN', green: 'RN' });

  const isStop = draft.type === 'stopsales';
  const setType = (type: HeatmapType) => onChange({ ...draft, type });

  const setThreshold = (which: 'grey' | 'green', val: number) => {
    if (which === 'grey') onChange({ ...draft, greyThreshold: val });
    else onChange({ ...draft, greenThreshold: val });
  };

  const setColor = (key: 'grey' | 'blue' | 'green', hex: string) => {
    onChange({ ...draft, colors: { ...draft.colors, [key]: hex } });
  };

  const rows: ThresholdRowDef[] = draft.type ? thresholdsFor(draft.type) : [];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            bgcolor: '#fafafa',
            borderRadius: '4px',
            boxShadow: '0 4px 4px rgba(0,0,0,0.25)',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 1,
          p: 3,
          pb: 0,
          fontSize: 20,
          fontWeight: 400,
          color: '#1c1c1c',
        }}
      >
        Heatmap
        <IconButton aria-label="Close" onClick={onClose} size="small" sx={{ p: 0, color: '#1c1c1c' }}>
          <CloseIcon sx={{ fontSize: 24 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, pt: 0, mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#000' }}>
          Select a heatmap type, then configure each colour threshold
        </Typography>

        <Typography sx={{ fontSize: 14, color: '#4f5b60', mt: -1 }}>Please select</Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '13px' }}>
          {HEATMAP_TYPE_OPTIONS.slice(0, 3).map((opt) => (
            <RadioCard
              key={opt.key}
              selected={draft.type === opt.key}
              Icon={TYPE_ICONS[opt.key]}
              label={opt.label}
              onClick={() => setType(opt.key)}
            />
          ))}
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '13px', width: 'calc(66.66% - 4px)' }}>
          {HEATMAP_TYPE_OPTIONS.slice(3).map((opt) => (
            <RadioCard
              key={opt.key}
              selected={draft.type === opt.key}
              Icon={TYPE_ICONS[opt.key]}
              label={opt.label}
              onClick={() => setType(opt.key)}
            />
          ))}
        </Box>

        {draft.type && (
          <>
            <Typography sx={{ fontSize: 14, color: '#4f5b60', mt: 1 }}>Colour Thresholds</Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {rows.map((row) => {
                const swatch = draft.colors[row.key] ?? row.color;
                const value = row.which === 'grey' ? draft.greyThreshold : row.which === 'green' ? draft.greenThreshold : null;
                const hasInput = row.which != null;
                return (
                  <Box
                    key={row.key}
                    sx={{
                      display: 'flex',
                      gap: 3,
                      alignItems: 'center',
                      p: 2.5,
                      border: '1px solid #dde1e2',
                      borderRadius: '8px',
                      bgcolor: '#fff',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 0.5,
                        flexShrink: 0,
                        width: 88,
                      }}
                    >
                      <Box sx={{ position: 'relative', width: 40, height: 40 }}>
                        <Box
                          component="input"
                          type="color"
                          value={swatch}
                          onChange={(e) => setColor(row.key, e.target.value)}
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            opacity: 0,
                            cursor: 'pointer',
                          }}
                        />
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: swatch,
                            border: '1px solid #dde1e2',
                          }}
                        />
                      </Box>
                      <Typography sx={{ fontSize: 12, color: '#006461', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        Change colour
                      </Typography>
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {row.boldLabel && (
                        <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#1c1c1c' }}>
                          {row.boldLabel}
                        </Typography>
                      )}
                      {row.desc && (
                        <Typography sx={{ fontSize: 14, color: '#4f5b60' }}>{row.desc}</Typography>
                      )}
                      {hasInput && row.inputLabel !== '' && row.inputLabel != null && !row.boldLabel && (
                        <Typography sx={{ fontSize: 14, color: '#1c1c1c' }}>{row.inputLabel}</Typography>
                      )}
                      {hasInput && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <TextField
                            type="number"
                            size="small"
                            value={value ?? 0}
                            onChange={(e) => setThreshold(row.which!, Number(e.target.value))}
                            sx={{
                              width: 180,
                              '& .MuiOutlinedInput-root': {
                                fontSize: 14,
                                bgcolor: '#fff',
                                height: 36,
                              },
                              '& fieldset': { borderColor: '#dde1e2' },
                            }}
                          />
                          {row.unitOptions && (
                            <FormControl size="small">
                              <Select
                                value={units[row.key] ?? row.unitOptions[0]}
                                onChange={(e) => setUnits((u) => ({ ...u, [row.key]: e.target.value as string }))}
                                sx={{
                                  width: 88,
                                  height: 36,
                                  fontSize: 14,
                                  bgcolor: '#fff',
                                  '& fieldset': { borderColor: '#dde1e2' },
                                }}
                              >
                                {row.unitOptions.map((u) => (
                                  <MenuItem key={u} value={u}>
                                    {u}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          )}
                          {row.suffix && (
                            <Typography sx={{ fontSize: 14, color: '#4f5b60' }}>{row.suffix}</Typography>
                          )}
                        </Box>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>

            {isStop && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px', width: 215 }}>
                <Typography sx={{ fontSize: 14, color: '#585858' }}>Room Type</Typography>
                <FormControl size="small">
                  <Select
                    multiple
                    displayEmpty
                    value={draft.stopSalesRoomTypes}
                    onChange={(e) => {
                      const val = e.target.value as string[];
                      onChange({ ...draft, stopSalesRoomTypes: val });
                    }}
                    renderValue={(sel) => ((sel as string[]).length ? (sel as string[]).join(', ') : 'Value')}
                    sx={{
                      fontSize: 14,
                      bgcolor: '#fff',
                      height: 34,
                      '& fieldset': { borderColor: '#e0e0e0' },
                    }}
                  >
                    {ROOM_TYPE_OPTIONS.map((rt) => (
                      <MenuItem key={rt} value={rt}>
                        {rt}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}

            {!isStop && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={draft.condition.enabled}
                    onChange={(e) =>
                      onChange({
                        ...draft,
                        condition: { ...draft.condition, enabled: e.target.checked },
                      })
                    }
                    sx={{ p: 0.5 }}
                  />
                }
                label={<Typography sx={{ fontSize: 14, color: '#1c1c1c' }}>Add Condition</Typography>}
                sx={{ ml: 0, mt: 0 }}
              />
            )}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ flexDirection: 'column', alignItems: 'stretch', gap: 3, p: 3, pt: 0 }}>
        <Divider sx={{ borderColor: '#dde1e2' }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            onClick={onClose}
            sx={{
              height: 36,
              px: 2,
              color: '#006461',
              fontSize: 14,
              textTransform: 'none',
              fontWeight: 400,
              borderRadius: '4px',
              '&:hover': { bgcolor: '#f0fdf9' },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!draft.type}
            onClick={onApply}
            sx={{
              height: 36,
              px: 2,
              bgcolor: '#006461',
              color: '#fff',
              fontSize: 14,
              fontWeight: 400,
              textTransform: 'none',
              borderRadius: '4px',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#004d4a', boxShadow: 'none' },
            }}
          >
            Confirm
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
