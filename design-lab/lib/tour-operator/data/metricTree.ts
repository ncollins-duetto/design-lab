/** Metric keys — cell display + picker selection */
export type MetricKey =
  | 'hocc'
  | 'tocc'
  | 'hadr'
  | 'tadr'
  | 'hrev'
  | 'trev'
  | 'hrn'
  | 'trn'
  | 'hrevpar'
  | 'trevpar'
  | 'hpickup'
  | 'tpickup'
  | 'havgLos'
  | 'tavgLos'
  | 'hleadTime'
  | 'tleadTime'
  | 'havgAdults'
  | 'tavgAdults'
  | 'havgChildren'
  | 'tavgChildren'
  | 'htotalGuests'
  | 'ttotalGuests'
  | 'havailRooms'
  | 'tavailGuaranteed'
  | 'toMixPct'
  | 'directMixPct'
  | 'otaMixPct'
  | 'toContractRate'
  | 'promotionPct'
  | 'baseSegmentRate';

export type MetricUnit = '$' | '%' | 'RN';

export type MetricLeaf = {
  type: 'leaf';
  key: MetricKey;
  label: string;
  unit: MetricUnit;
};

export type MetricGroup = {
  type: 'group';
  id: string;
  label: string;
  defaultExpanded?: boolean;
  children: MetricTreeNode[];
};

export type MetricTreeNode = MetricGroup | MetricLeaf;

export const METRIC_TREE: MetricTreeNode[] = [
  {
    type: 'group',
    id: 'occupancy',
    label: 'Occupancy',
    defaultExpanded: true,
    children: [
      { type: 'leaf', key: 'hocc', label: 'Hotel', unit: '%' },
      { type: 'leaf', key: 'tocc', label: 'Tour Operator', unit: '%' },
    ],
  },
  {
    type: 'group',
    id: 'adr',
    label: 'ADR',
    defaultExpanded: true,
    children: [
      { type: 'leaf', key: 'hadr', label: 'Hotel', unit: '$' },
      { type: 'leaf', key: 'tadr', label: 'Tour Operator', unit: '$' },
    ],
  },
  {
    type: 'group',
    id: 'revenue',
    label: 'Revenue',
    children: [
      { type: 'leaf', key: 'hrev', label: 'Hotel', unit: '$' },
      { type: 'leaf', key: 'trev', label: 'Tour Operator', unit: '$' },
    ],
  },
  {
    type: 'group',
    id: 'rn-sold',
    label: 'RN Sold',
    children: [
      { type: 'leaf', key: 'hrn', label: 'Hotel', unit: 'RN' },
      { type: 'leaf', key: 'trn', label: 'Tour Operator', unit: 'RN' },
    ],
  },
  {
    type: 'group',
    id: 'revpar',
    label: 'RevPAR',
    children: [
      { type: 'leaf', key: 'hrevpar', label: 'Hotel', unit: '$' },
      { type: 'leaf', key: 'trevpar', label: 'Tour Operator', unit: '$' },
    ],
  },
  {
    type: 'group',
    id: 'other-metrics',
    label: 'Other Metrics',
    children: [
      {
        type: 'group',
        id: 'other-hotel',
        label: 'Hotel',
        children: [
          { type: 'leaf', key: 'hpickup', label: 'Pickup', unit: 'RN' },
          { type: 'leaf', key: 'havgLos', label: 'Avg LOS', unit: 'RN' },
          { type: 'leaf', key: 'hleadTime', label: 'Lead Time', unit: 'RN' },
          { type: 'leaf', key: 'havgAdults', label: 'Avg Adults', unit: 'RN' },
          { type: 'leaf', key: 'havgChildren', label: 'Avg Children', unit: 'RN' },
          { type: 'leaf', key: 'htotalGuests', label: 'Total Guests', unit: 'RN' },
        ],
      },
      {
        type: 'group',
        id: 'other-to',
        label: 'Tour Operator',
        children: [
          { type: 'leaf', key: 'tpickup', label: 'Pickup', unit: 'RN' },
          { type: 'leaf', key: 'tavgLos', label: 'Avg LOS', unit: 'RN' },
          { type: 'leaf', key: 'tleadTime', label: 'Lead Time', unit: 'RN' },
          { type: 'leaf', key: 'tavgAdults', label: 'Avg Adults', unit: 'RN' },
          { type: 'leaf', key: 'tavgChildren', label: 'Avg Children', unit: 'RN' },
          { type: 'leaf', key: 'ttotalGuests', label: 'Total Guests', unit: 'RN' },
        ],
      },
    ],
  },
  {
    type: 'group',
    id: 'availability',
    label: 'Availability',
    children: [
      {
        type: 'group',
        id: 'avail-hotel',
        label: 'Hotel',
        children: [{ type: 'leaf', key: 'havailRooms', label: 'Avail Rooms', unit: 'RN' }],
      },
      {
        type: 'group',
        id: 'avail-to',
        label: 'Tour Operator',
        children: [{ type: 'leaf', key: 'tavailGuaranteed', label: 'Avail Guaranteed', unit: 'RN' }],
      },
    ],
  },
  {
    type: 'group',
    id: 'business-mix',
    label: 'Business Mix',
    children: [
      { type: 'leaf', key: 'toMixPct', label: 'Tour Operator Mix %', unit: '%' },
      { type: 'leaf', key: 'directMixPct', label: 'Direct Mix %', unit: '%' },
      { type: 'leaf', key: 'otaMixPct', label: 'OTA Mix %', unit: '%' },
    ],
  },
  {
    type: 'group',
    id: 'selling-rates',
    label: 'Selling Rates',
    children: [
      { type: 'leaf', key: 'toContractRate', label: 'Tour Operator Contract Rate', unit: '$' },
      { type: 'leaf', key: 'promotionPct', label: 'Promotion %', unit: '%' },
      { type: 'leaf', key: 'baseSegmentRate', label: 'Base Segment Rate', unit: '$' },
    ],
  },
];

export type SegmentKey = 'all' | 'staticFit' | 'operatorDynamic' | 'tourSeries';

export const SEGMENT_OPTIONS: {
  key: SegmentKey;
  label: string;
  color?: string;
}[] = [
  { key: 'all', label: 'All' },
  { key: 'staticFit', label: 'Static FIT Rates', color: '#47c5bc' },
  { key: 'operatorDynamic', label: 'Operator Dynamic', color: '#7459ee' },
  { key: 'tourSeries', label: 'Tour Series', color: '#ffb90f' },
];

export const DEFAULT_SEGMENTS: SegmentKey[] = ['all', 'staticFit', 'operatorDynamic', 'tourSeries'];

export function flattenMetricLeaves(nodes: MetricTreeNode[]): MetricLeaf[] {
  const out: MetricLeaf[] = [];
  for (const n of nodes) {
    if (n.type === 'leaf') out.push(n);
    else out.push(...flattenMetricLeaves(n.children));
  }
  return out;
}

export const ALL_METRIC_LEAVES = flattenMetricLeaves(METRIC_TREE);

export function metricLeafByKey(key: MetricKey): MetricLeaf | undefined {
  return ALL_METRIC_LEAVES.find((l) => l.key === key);
}

export function metricGroupLabelForKey(key: MetricKey): string {
  const walk = (nodes: MetricTreeNode[], parents: string[]): string | undefined => {
    for (const n of nodes) {
      if (n.type === 'leaf' && n.key === key) return parents[parents.length - 1];
      if (n.type === 'group') {
        const found = walk(n.children, [...parents, n.label]);
        if (found) return found;
      }
    }
    return undefined;
  };
  return walk(METRIC_TREE, []) ?? 'Metrics';
}
