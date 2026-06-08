/**
 * Separate localStorage-backed mock store for Channels.
 * Same shape as Advanced Costs so all form components work identically.
 */
import type { AdvancedCostRecord, AdvancedCostInput } from './mockAdvancedCosts';

// Version suffix forces a fresh seed when the shape changes
const STORAGE_KEY = 'duetto_channel_attribution_mock_v2';

// IDs match the static rows in ChannelAttributionPage so edit links resolve correctly
const SEED: AdvancedCostRecord[] = [
  { id: '1',  name: 'Direct Web',                  costType: 'ota_commission',         affiliation: 'stay_date', schedule: 'continuous', scheduleDates: { startDate: '', endDate: '', days: Array(7).fill(false) }, rules: [{ include: 'include', category: 'r', operator: 'containing', value: '123AB, 234BD, 345GH' }], costs: [], exceptions: [], active: true,  lastUpdated: '2024-03-01' },
  { id: '2',  name: 'Direct App',                  costType: 'ota_commission',         affiliation: 'stay_date', schedule: 'continuous', scheduleDates: { startDate: '', endDate: '', days: Array(7).fill(false) }, rules: [{ include: 'include', category: 'r', operator: 'containing', value: '' }],                  costs: [], exceptions: [], active: false, lastUpdated: '2024-03-01' },
  { id: '3',  name: 'Direct Phone',                costType: 'ota_commission',         affiliation: 'stay_date', schedule: 'continuous', scheduleDates: { startDate: '', endDate: '', days: Array(7).fill(false) }, rules: [{ include: 'include', category: 'r', operator: 'containing', value: '123AB, 234BD, 345GH' }], costs: [], exceptions: [], active: true,  lastUpdated: '2024-03-01' },
  { id: '4',  name: 'Direct Walk In',              costType: 'ota_commission',         affiliation: 'stay_date', schedule: 'continuous', scheduleDates: { startDate: '', endDate: '', days: Array(7).fill(false) }, rules: [{ include: 'include', category: 'r', operator: 'containing', value: '123AB, 234BD, 345GH' }], costs: [], exceptions: [], active: true,  lastUpdated: '2024-03-01' },
  { id: '5',  name: 'OTA Retail',                  costType: 'ota_commission',         affiliation: 'stay_date', schedule: 'continuous', scheduleDates: { startDate: '', endDate: '', days: Array(7).fill(false) }, rules: [{ include: 'include', category: 's', operator: 'containing', value: '456AP' }],               costs: [], exceptions: [], active: true,  lastUpdated: '2024-03-01' },
  { id: '6',  name: 'OTA Opaque',                  costType: 'ota_commission',         affiliation: 'stay_date', schedule: 'continuous', scheduleDates: { startDate: '', endDate: '', days: Array(7).fill(false) }, rules: [{ include: 'include', category: 's', operator: 'containing', value: 'opaque' }],              costs: [], exceptions: [], active: true,  lastUpdated: '2024-03-01' },
  { id: '7',  name: 'Metasearch',                  costType: 'metasearch_cost',        affiliation: 'stay_date', schedule: 'continuous', scheduleDates: { startDate: '', endDate: '', days: Array(7).fill(false) }, rules: [{ include: 'include', category: 's', operator: 'containing', value: 'metasearch' }],          costs: [], exceptions: [], active: true,  lastUpdated: '2024-03-01' },
  { id: '8',  name: 'Wholesale/Tour Operator',     costType: 'tour_operator_markup',   affiliation: 'stay_date', schedule: 'continuous', scheduleDates: { startDate: '', endDate: '', days: Array(7).fill(false) }, rules: [{ include: 'include', category: 's', operator: 'containing', value: 'wholesale' }],          costs: [], exceptions: [], active: true,  lastUpdated: '2024-03-01' },
  { id: '9',  name: 'GDS/Travel Agent',            costType: 'gds_commission',         affiliation: 'stay_date', schedule: 'continuous', scheduleDates: { startDate: '', endDate: '', days: Array(7).fill(false) }, rules: [{ include: 'include', category: 'r', operator: 'containing', value: '' }],                  costs: [], exceptions: [], active: false, lastUpdated: '2024-03-01' },
  { id: '10', name: 'Corporate Direct Portal/API', costType: 'connectivity_fee',       affiliation: 'stay_date', schedule: 'continuous', scheduleDates: { startDate: '', endDate: '', days: Array(7).fill(false) }, rules: [{ include: 'include', category: 'r', operator: 'containing', value: '' }],                  costs: [], exceptions: [], active: false, lastUpdated: '2024-03-01' },
  { id: '11', name: 'Group Direct',                costType: 'custom_cost_category',   affiliation: 'stay_date', schedule: 'continuous', scheduleDates: { startDate: '', endDate: '', days: Array(7).fill(false) }, rules: [{ include: 'include', category: 'r', operator: 'containing', value: 'Group Direct' }],       costs: [], exceptions: [], active: true,  lastUpdated: '2024-03-01' },
];

const generateId = () => `ch-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const now = () => new Date().toISOString().split('T')[0];

const load = (): AdvancedCostRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED;
    return JSON.parse(raw) as AdvancedCostRecord[];
  } catch {
    return SEED;
  }
};

const persist = (records: AdvancedCostRecord[]) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));

export const getChannelRecords = (): AdvancedCostRecord[] => load();

export const getChannelRecordById = (id: string) =>
  load().find((r) => r.id === id);

export const saveChannelRecord = (input: AdvancedCostInput): AdvancedCostRecord => {
  const records = load();
  const newRecord: AdvancedCostRecord = { ...input, id: generateId(), lastUpdated: now() };
  persist([newRecord, ...records]);
  return newRecord;
};

export const updateChannelRecord = (id: string, input: AdvancedCostInput): AdvancedCostRecord => {
  const records = load();
  const updated: AdvancedCostRecord = { ...input, id, lastUpdated: now() };
  persist(records.map((r) => (r.id === id ? updated : r)));
  return updated;
};

export const toggleChannelRecordActive = (id: string) => {
  const records = load();
  persist(records.map((r) => (r.id === id ? { ...r, active: !r.active, lastUpdated: now() } : r)));
};
