import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider, useFieldArray, Controller } from 'react-hook-form';
import { saveMockCost } from '../mockAdvancedCosts';
import {
  AFFILIATIONS, COST_TYPES, DEFAULT_COST, DEFAULT_EXCEPTION, DEFAULT_RULE,
  ControlledSelect, ScheduledPanel, CostLineItems, ExceptionBlock, RuleRows,
} from '../shared/FormShared';
import type { FormValues } from '../shared/FormShared';
import Modal from '../components/Modal';
import MultiSelectDropdown from '../components/MultiSelectDropdown';

export default function NewPage() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const methods = useForm<FormValues>({
    defaultValues: {
      name: '', costType: 'ota_commission', affiliation: 'stay_date', hotels: [], schedule: 'continuous',
      scheduleDates: { startDate: '', endDate: '', days: Array(7).fill(false) },
      rules: [{ ...DEFAULT_RULE }], costs: [{ ...DEFAULT_COST }], exceptions: [],
    },
  });
  const { control, handleSubmit, watch } = methods;
  const schedule = watch('schedule');
  const name = watch('name');
  const { fields: ruleFields, append: appendRule, remove: removeRule, move: moveRule } = useFieldArray({ control, name: 'rules' });
  const { fields: exFields, append: appendEx, remove: removeEx } = useFieldArray({ control, name: 'exceptions' });

  const onSubmit = (v: FormValues) => {
    saveMockCost({ ...v, schedule: v.schedule as 'continuous' | 'scheduled', active: true });
    setSaved(true);
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <Modal title="New Cost" onClose={() => navigate('/')}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Name / Cost Type / Affiliation */}
          <div className="form-row">
            <div className="field-group">
              <label className="field-label">Name</label>
              <Controller name="name" control={control}
                render={({ field }) => <input className="form-input" style={{ width: 240 }} placeholder="Cost name" {...field} />} />
            </div>
            <ControlledSelect name="costType" label="Cost Type" width={180} options={COST_TYPES} />
            <ControlledSelect name="affiliation" label="Affiliation" width={180} options={AFFILIATIONS} />
            <Controller name="hotels" control={control} render={({ field }) => (
              <MultiSelectDropdown label="Hotels" value={field.value} onChange={field.onChange} width={180} />
            )} />
          </div>

          {/* Schedules */}
          <div style={{ marginBottom: 24 }}>
            <p className="section-label">Schedules</p>
            <div className="radio-group">
              <Controller name="schedule" control={control} render={({ field }) => (
                <>
                  <label className="radio-label"><input type="radio" {...field} value="continuous" checked={field.value === 'continuous'} /> Continuous</label>
                  <label className="radio-label"><input type="radio" {...field} value="scheduled" checked={field.value === 'scheduled'} /> Scheduled</label>
                </>
              )} />
            </div>
            {schedule === 'scheduled' && <ScheduledPanel namePrefix="scheduleDates" />}
          </div>

          <hr className="divider" />

          {/* Rule Definition */}
          <div style={{ marginBottom: 24 }}>
            <p className="section-label">Rule Definition</p>
            <RuleRows control={control} fields={ruleFields} append={appendRule} remove={removeRule} move={moveRule} />
          </div>

          <hr className="divider" />

          {/* Costs */}
          <div style={{ marginBottom: 24 }}>
            <p className="section-label">Costs</p>
            <CostLineItems namePrefix="costs" />
          </div>

          <hr className="divider" />

          {/* Exceptions */}
          <div style={{ marginBottom: 24 }}>
            <p className="section-label" style={{ fontSize: 16 }}>Exceptions</p>
            {exFields.map((field, index) => (
              <ExceptionBlock key={field.id} index={index} onRemove={() => removeEx(index)} />
            ))}
            <button type="button" className="btn btn-outlined" onClick={() => appendEx({ ...DEFAULT_EXCEPTION })}>
              Add exception
            </button>
          </div>

          <hr className="divider" />

          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-lg" disabled={!name}>Save</button>
            <button type="button" className="btn-cancel" onClick={() => navigate('/')}>Cancel</button>
          </div>
        </form>
      </FormProvider>
      {saved && <div className="snackbar">✓ Cost saved successfully</div>}
    </Modal>
  );
}
