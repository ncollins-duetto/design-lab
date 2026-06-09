'use client';

import { HOTEL_CAPACITY } from '@/lib/tour-operator/data/calendarData';
import { toRooms } from '@/lib/tour-operator/calendar/metrics';

type Props = {
  x: number;
  y: number;
  hotelPct: number;
  toPct: number;
};

export function DayTooltip({ x, y, hotelPct, toPct }: Props) {
  const hotelRooms = toRooms(hotelPct);
  const toRoomsSold = toRooms(toPct);
  const avail = Math.max(0, HOTEL_CAPACITY - hotelRooms - toRoomsSold);
  const availClass =
    avail < 10
      ? 'cal-cap-tip-line cal-cap-tip-line--avail cal-cap-tip-line--low'
      : 'cal-cap-tip-line cal-cap-tip-line--avail cal-cap-tip-line--ok';

  let left = x + 14;
  let top = y - 10;
  if (left + 240 > window.innerWidth) left = x - 250;
  if (top + 100 > window.innerHeight) top = y - 110;

  return (
    <div id="calCapTip" className="cal-cap-tip" style={{ left, top, display: 'block' }} role="tooltip">
      <div className="cal-cap-tip-line cal-cap-tip-line--hotel">
        Hotel: {hotelPct}% ({hotelRooms} rooms)
      </div>
      <div className="cal-cap-tip-line">TO: {toPct}% ({toRoomsSold} rooms)</div>
      <div className={availClass}>{avail} rooms available</div>
    </div>
  );
}
