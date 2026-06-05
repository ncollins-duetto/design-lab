'use client';

import { useRef, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import GridViewIcon from '@mui/icons-material/GridView';
import LockIcon from '@mui/icons-material/Lock';
import TuneIcon from '@mui/icons-material/Tune';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CellMetricsPanel } from './CellMetricsPanel';
import { ComparePanel } from './ComparePanel';
import { FiltersDropdown } from './FiltersDropdown';
import type { FilterGroupId, FilterState } from '@/lib/tour-operator/data/filterOptions';
import type { MetricKey } from '@/lib/tour-operator/data/calendarData';
import type { SegmentKey } from '@/lib/tour-operator/data/metricTree';
import type { CompareMode } from '@/lib/tour-operator/calendar/metrics';
import { heatmapTypeLabel } from '@/lib/tour-operator/calendar/heatmap';
import type { HeatmapType } from '@/lib/tour-operator/data/heatmapTypes';

type Props = {
  selectMode: boolean;
  onToggleSelectMode: () => void;
  selectedCount: number;
  onOpenCloseOut: () => void;
  compare: CompareMode;
  compareSet: CompareMode[];
  onCompareToggle: (mode: CompareMode) => void;
  metricsOpen: boolean;
  onMetricsOpen: (open: boolean) => void;
  metricDraft: MetricKey[];
  segmentDraft: SegmentKey[];
  appliedMetrics: MetricKey[];
  onMetricToggle: (key: MetricKey) => void;
  onSegmentToggle: (key: SegmentKey) => void;
  onMetricsReset: () => void;
  onMetricsApply: () => void;
  filtersOpen: boolean;
  onFiltersOpen: (open: boolean) => void;
  filterDraft: FilterState;
  onFilterToggle: (id: FilterGroupId, value: string) => void;
  onFiltersReset: () => void;
  onFiltersApply: () => void;
  activeFilterCount: number;
  pickupDays: number;
  onPickupChange: (n: number) => void;
  heatmapOpen: boolean;
  onHeatmapOpen: () => void;
  heatmapActive: boolean;
  heatmapType: HeatmapType | '';
};

export function CalendarHeader({
  selectMode,
  onToggleSelectMode,
  selectedCount,
  onOpenCloseOut,
  compare: _compare,
  compareSet,
  onCompareToggle,
  metricsOpen,
  onMetricsOpen,
  metricDraft,
  segmentDraft,
  appliedMetrics: _appliedMetrics,
  onMetricToggle,
  onSegmentToggle,
  onMetricsReset,
  onMetricsApply,
  filtersOpen,
  onFiltersOpen,
  filterDraft,
  onFilterToggle,
  onFiltersReset,
  onFiltersApply,
  activeFilterCount,
  pickupDays,
  onPickupChange,
  heatmapOpen,
  onHeatmapOpen,
  heatmapActive,
  heatmapType,
}: Props) {
  const metricsRef = useRef<HTMLButtonElement>(null);
  const filtersRef = useRef<HTMLButtonElement>(null);
  const compareRef = useRef<HTMLButtonElement>(null);
  const [compareOpen, setCompareOpen] = useState(false);

  const compareNames: Record<string, string> = {
    ly: 'LY',
    stly: 'STLY',
    fcst: 'Forecast',
    budget: 'Budget',
  };
  const compareButtonLabel =
    compareSet.length === 0
      ? 'Compare'
      : `Compare (${compareSet.map((m) => compareNames[m]).filter(Boolean).join(', ')})`;

  return (
    <Box component="header" className="cal-header">
      <Typography component="h2" className="cal-title" variant="h6">
        Calendar
      </Typography>

      <Box className="cal-header-right">
        <Button
          className={`mo-select-dates-btn${selectMode ? ' active' : ''}`}
          onClick={onToggleSelectMode}
          color="inherit"
          disabled={selectMode}
        >
          {selectMode ? `Selecting (${selectedCount})` : 'Select Dates'}
        </Button>

        <Button
          className="wv-closeout-primary"
          variant="contained"
          color="primary"
          startIcon={<LockIcon sx={{ fontSize: 16 }} />}
          onClick={onOpenCloseOut}
        >
          Close/Re-Open
        </Button>

        <Button
          ref={metricsRef}
          className={`wv-topbar-text-btn${metricsOpen ? ' active' : ''}`}
          color="inherit"
          startIcon={<TuneIcon sx={{ fontSize: 16 }} />}
          endIcon={<ExpandMoreIcon sx={{ fontSize: 14, opacity: 0.65 }} />}
          onClick={() => onMetricsOpen(!metricsOpen)}
        >
          Cell Metrics
        </Button>
        <CellMetricsPanel
          open={metricsOpen}
          anchorEl={metricsRef.current}
          draft={metricDraft}
          segmentDraft={segmentDraft}
          onToggle={onMetricToggle}
          onSegmentToggle={onSegmentToggle}
          onClose={() => onMetricsOpen(false)}
          onReset={onMetricsReset}
          onApply={onMetricsApply}
        />

        <Button
          ref={compareRef}
          className={`wv-topbar-text-btn${compareOpen ? ' active' : ''}`}
          color="inherit"
          endIcon={<ExpandMoreIcon sx={{ fontSize: 14, opacity: 0.65 }} />}
          onClick={() => setCompareOpen((o) => !o)}
        >
          {compareButtonLabel}
        </Button>
        <ComparePanel
          open={compareOpen}
          anchorEl={compareRef.current}
          value={compareSet}
          onToggle={onCompareToggle}
          onClose={() => setCompareOpen(false)}
        />

        <Badge
          badgeContent={activeFilterCount}
          color="primary"
          invisible={activeFilterCount === 0}
          className="filter-badge-wrap"
        >
          <Button
            ref={filtersRef}
            className={`wv-topbar-text-btn${filtersOpen || activeFilterCount > 0 ? ' active' : ''}`}
            color="inherit"
            startIcon={<FilterListIcon sx={{ fontSize: 16 }} />}
            endIcon={<ExpandMoreIcon sx={{ fontSize: 14, opacity: 0.65 }} />}
            onClick={() => onFiltersOpen(!filtersOpen)}
          >
            Filters
          </Button>
        </Badge>
          <FiltersDropdown
            open={filtersOpen}
            anchorEl={filtersRef.current}
            draft={filterDraft}
            onToggle={onFilterToggle}
            onClose={() => onFiltersOpen(false)}
            onReset={onFiltersReset}
            onApply={onFiltersApply}
            pickupDays={pickupDays}
            onPickupChange={onPickupChange}
          />

        <Button
          className={`wv-topbar-text-btn${heatmapOpen || heatmapActive ? ' active' : ''}`}
          color="inherit"
          startIcon={<GridViewIcon sx={{ fontSize: 16 }} />}
          onClick={onHeatmapOpen}
        >
          {heatmapActive && heatmapType ? heatmapTypeLabel(heatmapType) : 'Heatmap'}
        </Button>

      </Box>
    </Box>
  );
}
