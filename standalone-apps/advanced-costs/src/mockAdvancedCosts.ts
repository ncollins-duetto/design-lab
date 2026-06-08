const STORAGE_KEY = 'duetto_advanced_costs_mock';

export type ScheduleType = 'continuous' | 'scheduled';

export type ScheduleDates = {
  startDate: string;
  endDate: string;
  days: boolean[];
};

export type RuleRow = {
  include: string;
  category: string;
  operator: string;
  value: string;
};

export type CostLineItem = {
  costType: string;
  amount: string;
  costBasis: string;
  description: string;
};

export type ExceptionRecord = {
  schedule: ScheduleDates;
  costs: CostLineItem[];
};

export type AdvancedCostRecord = {
  id: string;
  name: string;
  costType: string;
  affiliation: string;
  schedule: ScheduleType;
  scheduleDates: ScheduleDates;
  rules: RuleRow[];
  costs: CostLineItem[];
  exceptions: ExceptionRecord[];
  active: boolean;
  lastUpdated: string;
};

export type AdvancedCostInput = Omit<AdvancedCostRecord, 'id' | 'lastUpdated'>;

const SEED: AdvancedCostRecord[] = [
  {
    id: 'mock-1',
    name: 'OTA - Expedia',
    costType: 'guest_acquisition',
    affiliation: 'stay_date',
    schedule: 'continuous',
    scheduleDates: { startDate: '', endDate: '', days: Array(7).fill(false) },
    rules: [{ include: 'include', category: 'm', operator: 'equals', value: 'EXP' }],
    costs: [{ costType: 'pct_room', amount: '17', costBasis: 'per_night', description: 'OTA Commission' }],
    exceptions: [],
    active: true,
    lastUpdated: '2023-01-31',
  },
  {
    id: 'mock-2',
    name: 'OTA - Booking.com',
    costType: 'guest_acquisition',
    affiliation: 'stay_date',
    schedule: 'continuous',
    scheduleDates: { startDate: '', endDate: '', days: Array(7).fill(false) },
    rules: [{ include: 'include', category: 'm', operator: 'equals', value: 'BDC' }],
    costs: [{ costType: 'pct_room', amount: '15', costBasis: 'per_night', description: 'OTA Commission' }],
    exceptions: [],
    active: true,
    lastUpdated: '2023-01-31',
  },
  {
    id: 'mock-3',
    name: 'Agency - American Express',
    costType: 'guest_acquisition',
    affiliation: 'stay_date',
    schedule: 'continuous',
    scheduleDates: { startDate: '', endDate: '', days: Array(7).fill(false) },
    rules: [{ include: 'include', category: 'ta', operator: 'containing', value: 'AMEX' }],
    costs: [{ costType: 'fixed_amount', amount: '5', costBasis: 'per_booking', description: 'Agency fee' }],
    exceptions: [],
    active: true,
    lastUpdated: '2023-01-31',
  },
  {
    id: 'mock-4',
    name: 'Agency - Omega Travel',
    costType: 'guest_acquisition',
    affiliation: 'stay_date',
    schedule: 'continuous',
    scheduleDates: { startDate: '', endDate: '', days: Array(7).fill(false) },
    rules: [{ include: 'include', category: 'ta', operator: 'containing', value: 'OMEGA' }],
    costs: [{ costType: 'fixed_amount', amount: '4', costBasis: 'per_booking', description: 'Agency fee' }],
    exceptions: [],
    active: false,
    lastUpdated: '2023-01-31',
  },
  {
    id: 'mock-5',
    name: 'Room - Std Queen',
    costType: 'variable_room_cleaning',
    affiliation: 'arrival_date',
    schedule: 'continuous',
    scheduleDates: { startDate: '', endDate: '', days: Array(7).fill(false) },
    rules: [{ include: 'include', category: 'o', operator: 'equals', value: 'SQ' }],
    costs: [{ costType: 'fixed_amount', amount: '12', costBasis: 'per_night', description: 'Room cleaning' }],
    exceptions: [],
    active: true,
    lastUpdated: '2022-12-10',
  },
];

const generateId = () => `mock-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
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

export const getMockCosts = (): AdvancedCostRecord[] => load();
export const getMockCostById = (id: string) => load().find((r) => r.id === id);

export const saveMockCost = (input: AdvancedCostInput): AdvancedCostRecord => {
  const records = load();
  const newRecord: AdvancedCostRecord = { ...input, id: generateId(), lastUpdated: now() };
  persist([newRecord, ...records]);
  return newRecord;
};

export const updateMockCost = (id: string, input: AdvancedCostInput): AdvancedCostRecord => {
  const records = load();
  const updated: AdvancedCostRecord = { ...input, id, lastUpdated: now() };
  persist(records.map((r) => (r.id === id ? updated : r)));
  return updated;
};

export const toggleMockCostActive = (id: string) => {
  const records = load();
  persist(records.map((r) => (r.id === id ? { ...r, active: !r.active, lastUpdated: now() } : r)));
};

export const deleteMockCost = (id: string) => {
  persist(load().filter((r) => r.id !== id));
};
