'use client';

import type { Dispatch, SetStateAction } from 'react';
import type { CompareMode } from '@/lib/tour-operator/calendar/metrics';
import type { MetricKey } from '@/lib/tour-operator/data/calendarData';
import { WeekGrid } from './WeekGrid';

type Props = {
  month: number;
  startDay: number;
  compare: CompareMode;
  compareModes: CompareMode[];
  selectedMetrics: MetricKey[];
  collapsed: Record<string, boolean>;
  onCollapsedChange: Dispatch<SetStateAction<Record<string, boolean>>>;
  selectMode: boolean;
  selectedDays: Set<string>;
  onSelectDay: (iso: string) => void;
};

/** Weekly calendar — legacy Daily B grid (`wb-layout`) */
export function WeeklyView({
  month,
  startDay,
  compare,
  compareModes,
  collapsed,
  onCollapsedChange,
  selectMode,
  selectedDays,
  onSelectDay,
}: Props) {
  return (
    <div
      className="cal-weekly-wrap"
      role="tabpanel"
      id="cal-tabpanel-weekly"
      aria-labelledby="cal-tab-weekly"
    >
      <WeekGrid
        month={month}
        startDay={startDay}
        compare={compare}
        compareModes={compareModes}
        collapsed={collapsed}
        onCollapsedChange={onCollapsedChange}
        selectMode={selectMode}
        selectedDays={selectedDays}
        onSelectDay={onSelectDay}
      />
    </div>
  );
}
