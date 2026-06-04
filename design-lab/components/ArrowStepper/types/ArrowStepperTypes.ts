export enum StepState {
  INACTIVE = 'inactive',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DISABLED = 'disabled',
}

export interface StepConfig {
  id: string;
  label: string;
  description?: string;
  state?: StepState;
}
export enum StepperModes {
  READONLY = 'readonly',
  INTERACTIVE = 'interactive',
}
