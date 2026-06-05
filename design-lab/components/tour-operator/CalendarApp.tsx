'use client';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { IconButton, Button } from '@material-ui/core';
import Paper from '@mui/material/Paper';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CompareMode } from '@/lib/tour-operator/calendar/metrics';
import { ALL_MONTHS, type MetricKey } from '@/lib/tour-operator/data/calendarData';
import { DEFAULT_SEGMENTS, SEGMENT_OPTIONS, type SegmentKey } from '@/lib/tour-operator/data/metricTree';
import { useCalendar } from '@/lib/tour-operator/context/CalendarContext';
import { buildCellMetrics } from '@/lib/tour-operator/calendar/metrics';
import {
  buildWbRows,
  defaultWbCollapsed,
  getWeekDays,
  shiftWeekAnchor,
  wbSetAllCollapsed,
  weekRangeLabel,
} from '@/lib/tour-operator/calendar/weekGridData';
import { heatmapCssVars } from '@/lib/tour-operator/calendar/heatmap';
import type { FilterGroupId } from '@/lib/tour-operator/data/filterOptions';
import { toggleFilterValue } from '@/lib/tour-operator/data/filterOptions';
import { CalendarHeader } from './CalendarHeader';
import { CalendarLegend } from './CalendarLegend';
import { CalendarMonth } from './CalendarMonth';
import { CalendarTabBar, type CalendarViewTab } from './CalendarTabBar';
import { CloseOutModal } from './CloseOutModal';
import { DayDetailModal } from './DayDetailModal';
import { HeatmapModal } from './HeatmapModal';
import { MonthRangePicker } from './MonthRangePicker';
import { SelectDatesFooter } from './SelectDatesFooter';
import { WeeklyView } from './WeeklyView';
import DateRangeIcon from '@mui/icons-material/DateRange';

const DEFAULT_METRICS: MetricKey[] = ['hocc', 'tocc'];

const MONTH_NAMES = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

type DayModal = { month: number; day: number; label: string };

function rangeLabel(startIdx: number, count: number) {
  const visible = ALL_MONTHS.slice(startIdx, startIdx + count);
  if (visible.length === 0) return '';
  if (visible.length <= 2) return visible[0].name;
  return `${visible[0].name.split(' ')[0]} – ${visible[visible.length - 1].name}`;
}

function fullDateRangeLabel(start: number, end: number) {
  const a = ALL_MONTHS[start];
  const b = ALL_MONTHS[end];
  if (!a || !b) return 'Jan 2026 – Dec 2026';
  return `${a.name.split(' ')[0]} ${a.year} – ${b.name.split(' ')[0]} ${b.year}`;
}

export function CalendarApp() {
  const {
    filterDraft,
    setFilterDraft,
    applyFilters,
    resetFilters,
    activeFilterCount,
    heatmap,
    heatmapDraft,
    setHeatmapDraft,
    applyHeatmap,
    resetHeatmap,
    closeOutOpen,
    setCloseOutOpen,
    openWeekView,
    weekAnchor,
    setWeekAnchor,
  } = useCalendar();

  const [viewMode, setViewMode] = useState<CalendarViewTab>('monthly');
  const [startIdx, setStartIdx] = useState(0);
  const [rangeStartIdx, setRangeStartIdx] = useState(0);
  const [rangeEndIdx, setRangeEndIdx] = useState(1);
  const [displayView, setDisplayView] = useState(2);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [dateAnchor, setDateAnchor] = useState<HTMLElement | null>(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedDays, setSelectedDays] = useState<Set<string>>(() => new Set());
  const [appliedMetrics, setAppliedMetrics] = useState<MetricKey[]>(DEFAULT_METRICS);
  const [metricDraft, setMetricDraft] = useState<MetricKey[]>(DEFAULT_METRICS);
  const [segmentDraft, setSegmentDraft] = useState<SegmentKey[]>(DEFAULT_SEGMENTS);
  const [metricsOpen, setMetricsOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [heatmapModalOpen, setHeatmapModalOpen] = useState(false);
  const [pickupDays, setPickupDays] = useState(365);
  const [compareSet, setCompareSet] = useState<CompareMode[]>([]);
  const compare: CompareMode = compareSet[0] ?? 'none';
  const toggleCompare = (mode: CompareMode) => {
    if (mode === 'none') {
      setCompareSet([]);
      return;
    }
    setCompareSet((prev) => (prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]));
  };
  const [cmpVisible, setCmpVisible] = useState(false);
  const [dayModal, setDayModal] = useState<DayModal | null>(null);
  const wbRows = useMemo(() => buildWbRows(), []);
  const [wbCollapsed, setWbCollapsed] = useState(() => defaultWbCollapsed(wbRows));
  const gridRef = useRef<HTMLDivElement>(null);

  const isCompact = displayView >= 3;
  const isSingleMonth = displayView === 1;

  const visibleMonths = useMemo(
    () => ALL_MONTHS.slice(startIdx, startIdx + displayView),
    [startIdx, displayView],
  );
  void rangeLabel;
  const dateLabel = fullDateRangeLabel(rangeStartIdx, rangeEndIdx);
  const hmVars = heatmapCssVars(heatmap);

  const clampStart = useCallback(
    (idx: number) => Math.max(0, Math.min(idx, ALL_MONTHS.length - displayView)),
    [displayView],
  );

  const handlePrev = () => {
    const step = displayView >= 6 ? displayView : 1;
    setStartIdx((i) => clampStart(i - step));
  };

  const handleNext = () => {
    const step = displayView >= 6 ? displayView : 1;
    setStartIdx((i) => clampStart(i + step));
  };

  const shiftWeek = (delta: number) => {
    setWeekAnchor(shiftWeekAnchor(weekAnchor.month, weekAnchor.day, delta));
  };

  const handleTabChange = (tab: CalendarViewTab) => {
    if (tab === 'weekly') {
      openWeekView(weekAnchor.month || 3, weekAnchor.day || 9);
    }
    setViewMode(tab);
  };

  const handleSelectDay = (iso: string) => {
    setSelectedDays((prev) => {
      const next = new Set(prev);
      if (next.has(iso)) next.delete(iso);
      else next.add(iso);
      return next;
    });
  };

  const handleOpenDay = (month: number, day: number, label: string) => {
    setDayModal({ month, day, label });
  };

  const handleGoToWeek = (month: number, day: number) => {
    if (displayView >= 6) {
      handleOpenDay(month, day, `${MONTH_NAMES[month]} ${day}, 2026`);
      return;
    }
    openWeekView(month, day);
    setViewMode('weekly');
  };

  const handleMetricToggle = (key: MetricKey) => {
    setMetricDraft((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key);
      if (prev.length >= 4) return prev;
      return [...prev, key];
    });
  };

  const handleSegmentToggle = (key: SegmentKey) => {
    const allKeys = SEGMENT_OPTIONS.map((s) => s.key);
    setSegmentDraft((prev) => {
      if (key === 'all') {
        const allOn = allKeys.every((k) => prev.includes(k));
        return allOn ? [] : [...allKeys];
      }
      return prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
    });
  };

  const exitSelectMode = () => {
    setSelectMode(false);
    setSelectedDays(new Set());
  };

  const handleRangeApply = (start: number, end: number) => {
    const lo = Math.min(start, end);
    const hi = Math.max(start, end);
    const viewLen = hi - lo + 1;
    setRangeStartIdx(lo);
    setRangeEndIdx(hi);
    setDisplayView(viewLen);
    setStartIdx(clampStart(lo));
    setDatePickerOpen(false);
  };

  useEffect(() => {
    const root = document.querySelector('.calendar-page');
    root?.classList.toggle('mo-select-active', selectMode);
    return () => root?.classList.remove('mo-select-active');
  }, [selectMode]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || isCompact || compare === 'none') {
      setCmpVisible(false);
      return;
    }

    const sync = () => {
      const cell = grid.querySelector('.cal-day:not(.cal-day-empty):not(.empty)');
      const w = cell?.getBoundingClientRect().width ?? 0;
      setCmpVisible(w >= 108);
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(grid);
    window.addEventListener('resize', sync);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', sync);
    };
  }, [compare, isCompact, displayView, startIdx]);

  const modalMetrics = dayModal ? buildCellMetrics(dayModal.month, dayModal.day) : null;

  const gridClass = [
    'cal-months-grid',
    isCompact ? 'cal-compact' : '',
    isSingleMonth ? 'cal-single-month' : '',
    `cal-view-${displayView}`,
    displayView === 12 ? 'cal-12m' : '',
    cmpVisible && compare !== 'none' ? 'cal-cmp-visible' : '',
    heatmap.enabled ? ' hm-view' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const gridCols = isSingleMonth
    ? 1
    : isCompact
      ? Math.min(displayView, 3)
      : displayView;

  const gridStyle = {
    ...hmVars,
    gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
  };

  const weekNavLabel = weekRangeLabel(getWeekDays(2026, weekAnchor.month, weekAnchor.day));

  const datePickerTrigger = (
    <Button
      ref={setDateAnchor as any}
      variant="text"
      color="primary"
      size="small"
      className="wv-date-trigger-btn"
      startIcon={<DateRangeIcon style={{ fontSize: 18, color: '#4f5b60' }} />}
      onClick={(e) => {
        e.stopPropagation();
        setDatePickerOpen((o) => !o);
      }}
    >
      {viewMode === 'monthly' ? dateLabel : weekNavLabel}
    </Button>
  );

  const weekDatePicker = (
    <TextField
      type="date"
      size="small"
      variant="outlined"
      defaultValue={`2026-${String(weekAnchor.month).padStart(2, '0')}-${String(weekAnchor.day).padStart(2, '0')}`}
      onChange={(e) => {
        const [year, month, day] = e.target.value.split('-').map(Number);
        if (year && month && day) {
          shiftWeekAnchor(month, day);
        }
      }}
      sx={{
        width: 140,
        '& input': {
          fontSize: 14,
          padding: '8px 12px',
        },
      }}
    />
  );

  const dateShuffler = viewMode === 'monthly' ? (
    <Box className="wv-date-shuffler">
      <IconButton
        className="wv-nav-btn"
        onClick={handlePrev}
        aria-label="Previous months"
        size="small"
      >
        <ChevronLeftIcon />
      </IconButton>
      {datePickerTrigger}
      <IconButton
        className="wv-nav-btn"
        onClick={handleNext}
        aria-label="Next months"
        size="small"
      >
        <ChevronRightIcon />
      </IconButton>
    </Box>
  ) : (
    <Box className="wv-date-shuffler">
      <IconButton className="wv-nav-btn" onClick={() => shiftWeek(-1)} aria-label="Previous day" size="small">
        <ChevronLeftIcon />
      </IconButton>
      {weekDatePicker}
      <IconButton className="wv-nav-btn" onClick={() => shiftWeek(1)} aria-label="Next day" size="small">
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );

  const tabBarTrailing =
    viewMode === 'weekly' ? (
      <Box className="ds-tab-bar__trailing-inner">
        {dateShuffler}
        <div className="wv-date-acc-controls">
          <Button
            type="button"
            variant="text"
            color="primary"
            size="small"
            className="wv-acc-action-btn"
            startIcon={<UnfoldLessIcon style={{ fontSize: 18 }} aria-hidden />}
            onClick={() => setWbCollapsed(wbSetAllCollapsed(wbRows, true))}
          >
            Close All
          </Button>
          <Button
            type="button"
            variant="text"
            color="primary"
            size="small"
            className="wv-acc-action-btn"
            startIcon={<UnfoldMoreIcon style={{ fontSize: 18 }} aria-hidden />}
            onClick={() => setWbCollapsed(wbSetAllCollapsed(wbRows, false))}
          >
            Open All
          </Button>
        </div>
      </Box>
    ) : (
      dateShuffler
    );

  return (
    <>
      <Paper component="article" className="section-card" id="demand-calendar" elevation={0}>
        <CalendarHeader
          selectMode={selectMode}
          onToggleSelectMode={() => {
            if (selectMode) exitSelectMode();
            else setSelectMode(true);
          }}
          selectedCount={selectedDays.size}
          onOpenCloseOut={() => setCloseOutOpen(true)}
          compare={compare}
          compareSet={compareSet}
          onCompareToggle={toggleCompare}
          metricsOpen={metricsOpen}
          onMetricsOpen={setMetricsOpen}
          metricDraft={metricDraft}
          segmentDraft={segmentDraft}
          appliedMetrics={appliedMetrics}
          onMetricToggle={handleMetricToggle}
          onSegmentToggle={handleSegmentToggle}
          onMetricsReset={() => {
            setMetricDraft(DEFAULT_METRICS);
            setSegmentDraft(DEFAULT_SEGMENTS);
          }}
          onMetricsApply={() => {
            setAppliedMetrics(metricDraft);
            setMetricsOpen(false);
          }}
          filtersOpen={filtersOpen}
          onFiltersOpen={setFiltersOpen}
          filterDraft={filterDraft}
          onFilterToggle={(id: FilterGroupId, value) =>
            setFilterDraft((f) => ({ ...f, [id]: toggleFilterValue(f[id], value) }))
          }
          onFiltersReset={() => {
            resetFilters();
            setFiltersOpen(false);
          }}
          onFiltersApply={() => {
            applyFilters();
            setFiltersOpen(false);
          }}
          activeFilterCount={activeFilterCount}
          pickupDays={pickupDays}
          onPickupChange={setPickupDays}
          heatmapOpen={heatmapModalOpen}
          onHeatmapOpen={() => {
            setHeatmapDraft(heatmap);
            setHeatmapModalOpen(true);
          }}
          heatmapActive={heatmap.enabled}
          heatmapType={heatmap.type}
        />

        <CalendarTabBar value={viewMode} onChange={handleTabChange} trailing={tabBarTrailing} />
        <MonthRangePicker
          open={datePickerOpen}
          anchorEl={dateAnchor}
          appliedStartIdx={rangeStartIdx}
          appliedEndIdx={rangeEndIdx}
          onClose={() => setDatePickerOpen(false)}
          onApply={(start, end) => {
            handleRangeApply(start, end);
            setDatePickerOpen(false);
          }}
          onCancel={() => setDatePickerOpen(false)}
        />

        {viewMode === 'monthly' ? (
          <Box
            role="tabpanel"
            id="cal-tabpanel-monthly"
            aria-labelledby="cal-tab-monthly"
          >
            <CalendarLegend />
            <Box ref={gridRef} className={gridClass} style={gridStyle}>
              {visibleMonths.map((m) => (
                <CalendarMonth
                  key={m.month}
                  month={m}
                  selectedMetrics={appliedMetrics}
                  selectMode={selectMode}
                  selectedDays={selectedDays}
                  compact={isCompact}
                  compare={compare}
                  onSelectDay={handleSelectDay}
                  onOpenDay={handleOpenDay}
                  onGoToWeek={handleGoToWeek}
                />
              ))}
            </Box>
          </Box>
        ) : (
          <WeeklyView
            month={weekAnchor.month}
            startDay={weekAnchor.day}
            compare={compare}
            compareModes={compareSet}
            selectedMetrics={appliedMetrics}
            collapsed={wbCollapsed}
            onCollapsedChange={setWbCollapsed}
            selectMode={selectMode}
            selectedDays={selectedDays}
            onSelectDay={handleSelectDay}
          />
        )}
      </Paper>

      <SelectDatesFooter
        visible={selectMode}
        selectedCount={selectedDays.size}
        onCancel={exitSelectMode}
        onConfirm={() => {
          setCloseOutOpen(true);
          setSelectMode(false);
        }}
      />

      {dayModal && modalMetrics && (
        <DayDetailModal
          open={Boolean(dayModal)}
          dateLabel={dayModal.label}
          metrics={modalMetrics}
          selectedMetrics={appliedMetrics}
          onClose={() => setDayModal(null)}
        />
      )}

      <CloseOutModal
        open={closeOutOpen}
        selectedDays={selectedDays}
        onClose={() => {
          setCloseOutOpen(false);
          setSelectedDays(new Set());
        }}
        onComplete={() => {
          setCloseOutOpen(false);
          exitSelectMode();
        }}
      />

      <HeatmapModal
        open={heatmapModalOpen}
        draft={heatmapDraft}
        onChange={setHeatmapDraft}
        onClose={() => setHeatmapModalOpen(false)}
        onReset={() => {
          resetHeatmap();
          setHeatmapModalOpen(false);
        }}
        onApply={() => {
          applyHeatmap();
          setHeatmapModalOpen(false);
        }}
      />
    </>
  );
}
