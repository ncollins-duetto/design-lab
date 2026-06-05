'use client';

import type { ReactNode } from 'react';

export type CalendarViewTab = 'monthly' | 'weekly';

const TABS: { id: CalendarViewTab; label: string }[] = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'weekly', label: 'Weekly' },
];

type Props = {
  value: CalendarViewTab;
  onChange: (tab: CalendarViewTab) => void;
  trailing?: ReactNode;
};

/** Duetto DS v4 TabBar — matches Storybook components-tabbar--default */
export function CalendarTabBar({ value, onChange, trailing }: Props) {
  return (
    <div className="ds-tab-bar" role="presentation">
      <div className="ds-tab-bar__tabs" role="tablist" aria-label="Calendar view">
        {TABS.map((tab) => {
          const active = value === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`cal-tab-${tab.id}`}
              aria-selected={active}
              aria-controls={`cal-tabpanel-${tab.id}`}
              tabIndex={active ? 0 : -1}
              className={`ds-tab-bar__tab${active ? ' ds-tab-bar__tab--active' : ''}`}
              onClick={() => onChange(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {trailing ? <div className="ds-tab-bar__trailing">{trailing}</div> : null}
    </div>
  );
}
