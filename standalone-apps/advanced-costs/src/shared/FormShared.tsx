import { useFieldArray, Controller, useFormContext, useWatch } from 'react-hook-form';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const COST_TYPES = [
  { value: 'ota_commission', label: 'OTA commission' },
  { value: 'wholesaler_margin', label: 'Wholesaler margin' },
  { value: 'brand_contribution_fee', label: 'Brand contribution fee' },
  { value: 'gds_commission', label: 'GDS commission' },
  { value: 'tour_operator_markup', label: 'Tour operator markup' },
  { value: 'metasearch_cost', label: 'Metasearch cost' },
  { value: 'crs_fee', label: 'CRS fee' },
  { value: 'channel_manager_fee', label: 'Channel manager fee' },
  { value: 'gds_per_reservation_fee', label: 'GDS per-reservation fee' },
  { value: 'gds_per_night_fee', label: 'GDS per-night fee' },
  { value: 'payment_processing_fee', label: 'Payment processing fee' },
  { value: 'connectivity_fee', label: 'Connectivity fee' },
  { value: 'loyalty_program_cost', label: 'Loyalty program cost' },
  { value: 'call_center_labor_cost', label: 'Call center labor cost' },
  { value: 'manual_handling_cost', label: 'Manual handling cost' },
  { value: 'marketing_acquisition_cost', label: 'Marketing acquisition cost' },
  { value: 'custom_cost_category', label: 'Custom cost category' },
];
export const AFFILIATIONS = [
  { value: 'stay_date', label: 'By stay date' },
  { value: 'booking_date', label: 'By booking date' },
  { value: 'arrival_date', label: 'By arrival date' },
];
export const INCLUDES = [{ value: 'include', label: 'Include' }, { value: 'exclude', label: 'Exclude' }];
export const CATEGORIES = [
  { value: 'r', label: 'Rate Code' }, { value: 'rid', label: 'Rate Code Id' },
  { value: 'm', label: 'Market Code' }, { value: 'mid', label: 'Market Code Id' },
  { value: 'b', label: 'Block Code' }, { value: 'u', label: 'Raw Status' },
  { value: 's', label: 'Source Code' }, { value: 'o', label: 'Room Type Code' },
  { value: 'g', label: 'Source Geo' }, { value: 'i', label: 'IATA Code' },
  { value: 'mp', label: 'Meal plan' }, { value: 'ac', label: 'Allotment code' },
  { value: 'tab', label: 'Travel Agent Branch' }, { value: 'ta', label: 'Travel agent' },
  { value: 'taid', label: 'Travel agent Id' }, { value: 'cb', label: 'Company branch' },
  { value: 'qco', label: 'Company' }, { value: 'qcoid', label: 'Company Id' },
  { value: 'wpt', label: 'Reward Program Type' }, { value: 'lid', label: 'Loyalty ID' },
  { value: 'pid', label: 'Guest Profile ID' }, { value: 'py', label: 'Play ID' },
  { value: 'pe', label: 'Play Enabled' }, { value: 'xbb', label: 'Room Type Booked' },
  { value: 'xbbid', label: 'Room Type Booked Id' }, { value: 'xup', label: 'Room Type Upsell' },
  { value: 'smc', label: 'Sub Market Code' }, { value: 'iw', label: 'Is Walkin' },
  { value: 'ipr', label: 'Is Guest Count per Room' }, { value: 'crc', label: 'Loyalty Rate Code' },
  { value: 'du', label: 'Day Use' }, { value: 'pks', label: 'Package Codes' },
  { value: 'rpl', label: 'Reward Program Level' }, { value: 'gpid', label: 'Group Profile ID' },
  { value: 'spid', label: 'Source Profile ID' }, { value: 'orig', label: 'Origin' },
  { value: 'cct', label: 'Credit Card Type' }, { value: 'canc', label: 'Cancellation Code' },
  { value: 'promo', label: 'Promotion Code' }, { value: 'cas', label: 'Child Ages' },
  { value: 'asi', label: 'General purpose Reference Id' }, { value: 'rcc', label: 'Rate Category' },
  { value: 'rtt', label: 'Reservation Type' }, { value: 'sig', label: 'Should ignore' },
  { value: 'pcrs', label: 'Pre-Cancel Raw Status' },
];
export const OPERATORS = [
  { value: 'equals', label: 'Equals' }, { value: 'containing', label: 'Containing' },
  { value: 'starts_with', label: 'Starts with' }, { value: 'ends_with', label: 'Ends with' },
];
export const LINE_TYPES = [{ value: 'pct_room', label: '% of room' }, { value: 'fixed_amount', label: 'Fixed amount' }];
export const COST_BASES = [
  { value: 'per_night', label: 'per night' }, { value: 'per_booking', label: 'per booking' },
  { value: 'per_stay', label: 'per stay' },
];

export type RuleRow = { include: string; category: string; operator: string; value: string };
export type CostRow = { costType: string; amount: string; costBasis: string; description: string };
export type ExceptionData = { schedule: { startDate: string; endDate: string; days: boolean[] }; costs: CostRow[] };
export type FormValues = {
  name: string; costType: string; affiliation: string; hotels: string[]; schedule: string;
  scheduleDates: { startDate: string; endDate: string; days: boolean[] };
  rules: RuleRow[]; costs: CostRow[]; exceptions: ExceptionData[];
};

export const DEFAULT_RULE: RuleRow = { include: 'include', category: 'r', operator: 'containing', value: '' };
export const DEFAULT_COST: CostRow = { costType: 'pct_room', amount: '', costBasis: 'per_night', description: '' };
export const DEFAULT_EXCEPTION: ExceptionData = {
  schedule: { startDate: '', endDate: '', days: Array(7).fill(false) }, costs: [{ ...DEFAULT_COST }],
};

const CURRENCY = 'USD';

// ── ControlledSelect ──────────────────────────────────────────────────
export function ControlledSelect({ name, label, width, options }: {
  name: string; label?: string; width?: number; options: { value: string; label: string }[];
}) {
  const { control } = useFormContext();
  return (
    <div className="field-group" style={width ? { width } : {}}>
      {label && <label className="field-label">{label}</label>}
      <Controller name={name} control={control} render={({ field }) => (
        <select className="form-select" style={width ? { width } : {}} {...field}>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      )} />
    </div>
  );
}

// ── ScheduledPanel ────────────────────────────────────────────────────
export function ScheduledPanel({ namePrefix }: { namePrefix: string }) {
  const { control } = useFormContext();
  return (
    <div className="scheduled-panel">
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
        <div className="field-group">
          <label className="field-label">Start Date</label>
          <Controller name={`${namePrefix}.startDate` as any} control={control} defaultValue=""
            render={({ field }) => <input type="date" className="form-input" style={{ width: 150 }} {...field} />} />
        </div>
        <div className="field-group">
          <label className="field-label">End Date</label>
          <Controller name={`${namePrefix}.endDate` as any} control={control} defaultValue=""
            render={({ field }) => <input type="date" className="form-input" style={{ width: 150 }} {...field} />} />
        </div>
      </div>
      <div className="day-checkboxes">
        {DAYS.map((day, i) => (
          <div key={day} className="day-col">
            <span className="day-label-text">{day}</span>
            <Controller name={`${namePrefix}.days.${i}` as any} control={control} defaultValue={false}
              render={({ field }) => (
                <input type="checkbox" checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} />
              )} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SortableItem — generic drag-handle row wrapper ─────────────────────
function SortableItem({
  id,
  alignItems,
  children,
}: {
  id: string;
  alignItems?: string;
  children: (handleRef: (el: HTMLElement | null) => void, handleProps: Record<string, unknown>) => React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        display: 'flex',
        alignItems: alignItems ?? 'center',
        gap: 8,
        marginBottom: 8,
      }}
    >
      {children(setActivatorNodeRef, { ...listeners, ...attributes })}
    </div>
  );
}

// ── Single cost row (own component so useWatch obeys hooks rules) ───────
function CostRow({
  namePrefix,
  index,
  showLabels,
  onRemove,
  handleRef,
  handleProps,
}: {
  namePrefix: string;
  index: number;
  showLabels: boolean;
  onRemove: () => void;
  handleRef: (el: HTMLElement | null) => void;
  handleProps: Record<string, unknown>;
}) {
  const { control } = useFormContext<FormValues>();
  const costTypeVal = useWatch({ control, name: `${namePrefix}.${index}.costType` as any });
  const suffix = costTypeVal === 'fixed_amount' ? CURRENCY : '%';

  return (
    <>
      {/* Drag handle — only this element activates the drag */}
      <span
        ref={handleRef}
        {...handleProps}
        style={{ cursor: 'grab', color: '#bdbdbd', padding: 4, fontSize: 18, touchAction: 'none', userSelect: 'none' }}
        title="Drag to reorder"
      >⠿</span>
      <div className="field-group">
        {showLabels && <label className="field-label">Type</label>}
        <Controller name={`${namePrefix}.${index}.costType` as any} control={control}
          render={({ field: f }) => (
            <select className="form-select" style={{ width: 148 }} {...f}>
              {LINE_TYPES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          )} />
      </div>
      <div className="field-group">
        {showLabels && <label className="field-label">Amount</label>}
        <div className="amount-wrap">
          <Controller name={`${namePrefix}.${index}.amount` as any} control={control}
            render={({ field: f }) => <input className="form-input" placeholder="0" {...f} />} />
          <span className="amount-suffix">{suffix}</span>
        </div>
      </div>
      <div className="field-group">
        {showLabels && <label className="field-label">Cost Basis</label>}
        <Controller name={`${namePrefix}.${index}.costBasis` as any} control={control}
          render={({ field: f }) => (
            <select className="form-select" style={{ width: 148 }} {...f}>
              {COST_BASES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          )} />
      </div>
      <div className="field-group">
        {showLabels && <label className="field-label">Description</label>}
        <Controller name={`${namePrefix}.${index}.description` as any} control={control}
          render={({ field: f }) => <input className="form-input" style={{ width: 200 }} placeholder="Description" {...f} />} />
      </div>
      <button type="button" className="btn-del" onClick={onRemove} title="Remove">✕</button>
    </>
  );
}

// ── CostLineItems ─────────────────────────────────────────────────────
export function CostLineItems({ namePrefix }: { namePrefix: string }) {
  const { control } = useFormContext<FormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: namePrefix as 'costs' });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = fields.findIndex((f) => f.id === active.id);
      const newIdx = fields.findIndex((f) => f.id === over.id);
      move(oldIdx, newIdx);
    }
  };

  return (
    <div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          {fields.map((field, index) => (
            <SortableItem key={field.id} id={field.id} alignItems="flex-end">
              {(handleRef, handleProps) => (
                <CostRow
                  namePrefix={namePrefix}
                  index={index}
                  showLabels={index === 0}
                  onRemove={() => remove(index)}
                  handleRef={handleRef}
                  handleProps={handleProps}
                />
              )}
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
      <button type="button" className="btn btn-outlined" onClick={() => append({ ...DEFAULT_COST })} style={{ marginTop: 4 }}>
        Add line item cost
      </button>
    </div>
  );
}

// ── RuleRows — sortable rule definition list (shared by New + Edit) ────
export function RuleRows({
  control,
  fields,
  append,
  remove,
  move,
}: {
  control: any;
  fields: { id: string }[];
  append: (v: RuleRow) => void;
  remove: (i: number) => void;
  move: (from: number, to: number) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = fields.findIndex((f) => f.id === active.id);
      const newIdx = fields.findIndex((f) => f.id === over.id);
      move(oldIdx, newIdx);
    }
  };

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          {fields.map((field, index) => (
            <SortableItem key={field.id} id={field.id} alignItems="center">
              {(handleRef, handleProps) => (
                <>
                  <span
                    ref={handleRef}
                    {...handleProps}
                    style={{ cursor: 'grab', color: '#bdbdbd', padding: 4, fontSize: 18, touchAction: 'none', userSelect: 'none' }}
                    title="Drag to reorder"
                  >⠿</span>
                  <Controller name={`rules.${index}.include` as const} control={control}
                    render={({ field: f }) => (
                      <select className="form-select" style={{ width: 120 }} {...f}>
                        {INCLUDES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    )} />
                  <Controller name={`rules.${index}.category` as const} control={control}
                    render={({ field: f }) => (
                      <select className="form-select" style={{ width: 180 }} {...f}>
                        {CATEGORIES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    )} />
                  <Controller name={`rules.${index}.operator` as const} control={control}
                    render={({ field: f }) => (
                      <select className="form-select" style={{ width: 160 }} {...f}>
                        {OPERATORS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    )} />
                  <Controller name={`rules.${index}.value` as const} control={control}
                    render={({ field: f }) => (
                      <input className="form-input" style={{ width: 200 }} placeholder="Value(s), comma separated" {...f} />
                    )} />
                  <button type="button" className="btn-del" onClick={() => remove(index)} disabled={fields.length === 1}>✕</button>
                </>
              )}
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
      <div className="rule-actions">
        <button type="button" className="btn btn-outlined" onClick={() => append({ ...DEFAULT_RULE })}>Add rule</button>
        <button type="button" className="btn-text" style={{ color: '#006461' }}>Test Rule Definition ⓘ</button>
      </div>
    </>
  );
}

// ── ExceptionBlock ────────────────────────────────────────────────────
export function ExceptionBlock({ index, onRemove }: { index: number; onRemove: () => void }) {
  return (
    <div className="exception-wrapper">
      <div className="exception-card">
        <ScheduledPanel namePrefix={`exceptions.${index}.schedule`} />
        <CostLineItems namePrefix={`exceptions.${index}.costs` as 'costs'} />
      </div>
      <button type="button" className="btn-del" onClick={onRemove} style={{ marginTop: 8 }} title="Remove exception">✕</button>
    </div>
  );
}
