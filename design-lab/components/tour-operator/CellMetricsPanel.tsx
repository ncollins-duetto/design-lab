'use client';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SearchIcon from '@mui/icons-material/Search';
import Popover from '@mui/material/Popover';
import { Button } from '@material-ui/core';
import { useEffect, useMemo, useState } from 'react';
import {
  METRIC_TREE,
  SEGMENT_OPTIONS,
  type MetricKey,
  type MetricTreeNode,
  type SegmentKey,
} from '@/lib/tour-operator/data/metricTree';
import { metricLabelForKeys } from '@/lib/tour-operator/calendar/metrics';

const MAX = 4;

type Props = {
  open: boolean;
  anchorEl: HTMLElement | null;
  draft: MetricKey[];
  segmentDraft: SegmentKey[];
  onToggle: (key: MetricKey) => void;
  onSegmentToggle: (key: SegmentKey) => void;
  onClose: () => void;
  onReset: () => void;
  onApply: () => void;
};

function defaultExpandedState(): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  const walk = (nodes: MetricTreeNode[]) => {
    for (const n of nodes) {
      if (n.type === 'group') {
        if (n.defaultExpanded) out[n.id] = true;
        walk(n.children);
      }
    }
  };
  walk(METRIC_TREE);
  return out;
}

function nodeMatchesSearch(node: MetricTreeNode, q: string): boolean {
  if (!q) return true;
  const lower = q.toLowerCase();
  if (node.type === 'leaf') return node.label.toLowerCase().includes(lower);
  return node.label.toLowerCase().includes(lower) || node.children.some((c) => nodeMatchesSearch(c, q));
}

function MetricsTree({
  nodes,
  depth,
  draft,
  atMax,
  expanded,
  search,
  onToggleExpand,
  onToggleMetric,
}: {
  nodes: MetricTreeNode[];
  depth: number;
  draft: MetricKey[];
  atMax: boolean;
  expanded: Record<string, boolean>;
  search: string;
  onToggleExpand: (id: string) => void;
  onToggleMetric: (key: MetricKey) => void;
}) {
  return (
    <>
      {nodes.map((node) => {
        if (!nodeMatchesSearch(node, search)) return null;

        if (node.type === 'group') {
          const isOpen = search ? true : expanded[node.id] ?? false;
          const pad = 8 + depth * 22;
          return (
            <div key={node.id}>
              <button
                type="button"
                className="cal-metrics-row cal-metrics-row--group"
                style={{ paddingLeft: pad }}
                onClick={() => onToggleExpand(node.id)}
              >
                <span className={`cal-metrics-chevron${isOpen ? ' cal-metrics-chevron--open' : ''}`}>
                  <ChevronRightIcon sx={{ fontSize: 20 }} />
                </span>
                <span className="cal-metrics-label">{node.label}</span>
              </button>
              {isOpen ? (
                <MetricsTree
                  nodes={node.children}
                  depth={depth + 1}
                  draft={draft}
                  atMax={atMax}
                  expanded={expanded}
                  search={search}
                  onToggleExpand={onToggleExpand}
                  onToggleMetric={onToggleMetric}
                />
              ) : null}
            </div>
          );
        }

        const checked = draft.includes(node.key);
        const disabled = !checked && atMax;
        const pad = 30 + depth * 22;
        return (
          <label
            key={node.key}
            className={`cal-metrics-row cal-metrics-row--leaf${disabled ? ' cal-metrics-row--disabled' : ''}`}
            style={{ paddingLeft: pad }}
          >
            <input
              type="checkbox"
              className="cal-metrics-check"
              checked={checked}
              disabled={disabled}
              onChange={() => onToggleMetric(node.key)}
            />
            <span className="cal-metrics-check-ui" aria-hidden />
            <span className="cal-metrics-label">{node.label}</span>
            <span className="cal-metrics-unit">{node.unit}</span>
          </label>
        );
      })}
    </>
  );
}

export function CellMetricsPanel({
  open,
  anchorEl,
  draft,
  segmentDraft,
  onToggle,
  onSegmentToggle,
  onClose,
  onReset,
  onApply,
}: Props) {
  const atMax = draft.length >= MAX;
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(defaultExpandedState);

  useEffect(() => {
    if (!open) setSearch('');
  }, [open]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allSegmentKeys = useMemo(() => SEGMENT_OPTIONS.map((s) => s.key), []);
  const allSegmentsOn = allSegmentKeys.every((k) => segmentDraft.includes(k));

  const handleAllSegments = () => onSegmentToggle('all');

  return (
    <Popover
      open={open && Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      PaperProps={{
        className: 'cal-metrics-dropdown',
        sx: {
          width: 298,
          maxHeight: 'min(560px, 85vh)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          p: 0,
          boxShadow: 'none',
          border: '1px solid #DDE1E2',
          borderRadius: '8px',
        },
      }}
    >
      <div className="cal-metrics-panel">
        <section className="cal-metrics-segments">
          <p className="cal-metrics-title">Segments to show</p>
          <label className="cal-metrics-seg-row">
            <input
              type="checkbox"
              className="cal-metrics-check"
              checked={allSegmentsOn}
              onChange={handleAllSegments}
            />
            <span className="cal-metrics-check-ui" aria-hidden />
            <span className="cal-metrics-label">All</span>
          </label>
          {SEGMENT_OPTIONS.filter((s) => s.key !== 'all').map((seg) => (
            <label key={seg.key} className="cal-metrics-seg-row">
              <input
                type="checkbox"
                className="cal-metrics-check"
                checked={segmentDraft.includes(seg.key)}
                onChange={() => onSegmentToggle(seg.key)}
              />
              <span className="cal-metrics-check-ui" aria-hidden />
              {seg.color ? (
                <span className="cal-metrics-seg-swatch" style={{ background: seg.color }} />
              ) : null}
              <span className="cal-metrics-label">{seg.label}</span>
            </label>
          ))}
        </section>

        <section className="cal-metrics-body">
          <div className="cal-metrics-body-head">
            <p className="cal-metrics-title">Select {MAX} metrics</p>
            <div className="cal-metrics-search">
              <SearchIcon className="cal-metrics-search-icon" sx={{ fontSize: 18 }} />
              <input
                type="search"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search metrics"
              />
            </div>
          </div>

          <div className="cal-metrics-tree">
            <MetricsTree
              nodes={METRIC_TREE}
              depth={0}
              draft={draft}
              atMax={atMax}
              expanded={expanded}
              search={search.trim()}
              onToggleExpand={toggleExpand}
              onToggleMetric={onToggle}
            />
          </div>
        </section>

        <footer className="cal-filters-footer cal-metrics-footer">
          <Button
            type="button"
            variant="text"
            color="primary"
            size="medium"
            className="cal-metrics-reset"
            onClick={onReset}
          >
            Reset
          </Button>
          <Button
            type="button"
            variant="contained"
            color="primary"
            size="medium"
            className="cal-filter-apply"
            onClick={onApply}
          >
            Apply
          </Button>
        </footer>
      </div>
    </Popover>
  );
}

export function cellMetricsButtonLabel(keys: MetricKey[]) {
  return metricLabelForKeys(keys) || 'Cell Metrics';
}

export { MAX as METRICS_MAX };
