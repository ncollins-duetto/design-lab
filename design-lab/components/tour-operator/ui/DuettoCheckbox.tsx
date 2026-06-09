'use client';

/**
 * Duetto design-system checkbox.
 * Spec: 18×18, 2px radius, teal-700 (#006461) selected / indeterminate, 2px grey-700 (#4f5b60) border unselected.
 * Figma node 12467:301 (file yZ5mR7q3QcSdB24e3PmaX3).
 */
export type DuettoCheckboxState = 'checked' | 'unchecked' | 'indeterminate';

export function DuettoCheckbox({
  state,
  disabled = false,
}: {
  state: DuettoCheckboxState;
  disabled?: boolean;
}) {
  const filled = state === 'checked' || state === 'indeterminate';
  const bg = disabled
    ? state === 'unchecked'
      ? '#eaeeef'
      : '#aeb4ba'
    : filled
      ? '#006461'
      : '#fff';
  const border = filled ? 'none' : `2px solid ${disabled ? '#aeb4ba' : '#4f5b60'}`;

  return (
    <span
      style={{
        width: 18,
        height: 18,
        borderRadius: 2,
        background: bg,
        border,
        boxSizing: 'border-box',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {state === 'checked' && (
        <svg width="12" height="9" viewBox="0 0 12 9" fill="none" aria-hidden>
          <path
            d="M1 4.5L4.5 8 11 1"
            stroke={disabled ? '#eaeeef' : '#fff'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {state === 'indeterminate' && (
        <span
          style={{
            width: 10,
            height: 2,
            background: disabled ? '#eaeeef' : '#fff',
            borderRadius: 2,
          }}
        />
      )}
    </span>
  );
}
