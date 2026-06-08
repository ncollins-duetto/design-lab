import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider, useFieldArray, Controller } from 'react-hook-form';
import { getChannelRecordById, updateChannelRecord } from '../mockChannelAttribution';
import { DEFAULT_COST, DEFAULT_RULE, RuleRows } from '../shared/FormShared';
import type { FormValues } from '../shared/FormShared';
import Modal from '../components/Modal';
import MultiSelectDropdown from '../components/MultiSelectDropdown';

const CHANNEL_URL = '/channel-attribution';

export default function EditChannelPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [saved, setSaved] = useState(false);
  const record = getChannelRecordById(id!);

  const methods = useForm<FormValues>({
    defaultValues: record
      ? { name: record.name, costType: record.costType, affiliation: record.affiliation,
          hotels: (record as any).hotels ?? [],
          schedule: record.schedule, scheduleDates: record.scheduleDates,
          rules: record.rules, costs: record.costs, exceptions: record.exceptions }
      : { name: '', costType: '', affiliation: 'stay_date', hotels: [], schedule: 'continuous',
          scheduleDates: { startDate: '', endDate: '', days: Array(7).fill(false) },
          rules: [{ ...DEFAULT_RULE }], costs: [{ ...DEFAULT_COST }], exceptions: [] },
  });

  const { control, handleSubmit } = methods;
  const { fields: ruleFields, append: appendRule, remove: removeRule, move: moveRule } =
    useFieldArray({ control, name: 'rules' });

  if (!record) { navigate(CHANNEL_URL); return null; }

  const onSubmit = (v: FormValues) => {
    updateChannelRecord(id!, { ...v, schedule: record.schedule, active: record.active });
    setSaved(true);
    setTimeout(() => navigate(CHANNEL_URL), 1500);
  };

  return (
    <Modal title={record.name} onClose={() => navigate(CHANNEL_URL)}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Hotels */}
          <div className="form-row">
            <Controller name="hotels" control={control} render={({ field }) => (
              <MultiSelectDropdown label="Hotels" value={field.value} onChange={field.onChange} width={180} />
            )} />
          </div>

          {/* Rule Definition */}
          <div style={{ marginBottom: 24 }}>
            <p className="section-label">Rule Definition</p>
            <RuleRows control={control} fields={ruleFields} append={appendRule} remove={removeRule} move={moveRule} />
          </div>

          <hr className="divider" />

          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-lg">Save</button>
            <button type="button" className="btn-cancel" onClick={() => navigate(CHANNEL_URL)}>Cancel</button>
          </div>
        </form>
      </FormProvider>
      {saved && <div className="snackbar">✓ Channel updated successfully</div>}
    </Modal>
  );
}
