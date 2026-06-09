import type { ReactNode } from 'react';
import { HOTEL_CAPACITY } from '@/lib/tour-operator/data/calendarData';
import type { CompareMode } from '@/lib/tour-operator/calendar/metrics';
import type { WeekDayData, WbRow } from '@/lib/tour-operator/calendar/weekGridData';
import { RT_CAPS } from '@/lib/tour-operator/calendar/weekGridData';
import { ComparePills, SubCompareChip } from '@/lib/tour-operator/calendar/weekGridCompare';

const WB_TO = '#004948';
const WB_OTHER = '#52d9ce';

function mealPct(d: WeekDayData, key: string) {
  const map: Record<string, number> = { ai: d.aiPct, bb: d.bbPct, hb: d.hbPct, ro: d.roPct };
  return map[key] ?? 0;
}

/** Stacked progress bar: TO share + Other segments (occupancy-scale %). */
function toOtherBar(d: WeekDayData) {
  return [
    { pct: d.to, color: WB_TO },
    { pct: d.otherPct, color: WB_OTHER },
  ];
}

/** TO vs Hotel RN as % of capacity (meal plans, room-type sold). */
function toHotelRnBar(toRn: number, hotelRn: number) {
  return [
    { pct: Math.min(100, (toRn / HOTEL_CAPACITY) * 100), color: WB_TO },
    { pct: Math.min(100, (hotelRn / HOTEL_CAPACITY) * 100), color: WB_OTHER },
  ];
}

function wbGrad(clr: string) {
  if (clr === '#004948') return 'linear-gradient(to right,#004948,#007a75)';
  if (clr === '#52d9ce') return 'linear-gradient(to right,#52d9ce,#8aeee8)';
  if (clr === '#445e0d') return 'linear-gradient(to right,#445e0d,#6a9014)';
  if (clr === '#D97706') return 'linear-gradient(to right,#D97706,#F59E0B)';
  if (clr === '#967EF3') return 'linear-gradient(to right,#967EF3,#a78bfa)';
  if (clr === '#16a34a') return 'linear-gradient(to right,#16a34a,#22c55e)';
  if (clr === '#d7f7ed') return '#d7f7ed';
  return clr;
}

function barTrack(segments: { pct: number; color: string }[], markerPct?: number | null) {
  return (
    <div className="wb-bar-wrap">
      <div className="wv-occ-bar-track">
        {segments.map((s, i) => (
          <div
            key={i}
            className="wv-occ-seg"
            style={{ width: `${Math.max(0, Math.min(100, s.pct))}%`, background: wbGrad(s.color) }}
          />
        ))}
      </div>
      {markerPct != null && !Number.isNaN(markerPct) ? (
        <span className="wb-bar-marker" style={{ left: `${Math.max(0, Math.min(100, markerPct))}%` }} />
      ) : null}
    </div>
  );
}

function SectionCell({
  primary,
  pills,
  compareModes,
  segments,
  markerPct,
  footer,
}: {
  primary: ReactNode;
  pills: { key: string; label: string; curr: number; ref: number; isPercent?: boolean }[];
  compareModes: CompareMode[];
  segments: { pct: number; color: string }[];
  markerPct?: number | null;
  footer?: ReactNode;
}) {
  return (
    <div
      className={`wb-acc-cell${primary != null && primary !== '' ? '' : ' wb-acc-cell--no-metric'}`}
    >
      <div className="wb-acc-head">
        <span
          className={`wb-metric-primary${primary != null && primary !== '' ? '' : ' wb-metric-primary--empty'}`}
        >
          {primary != null && primary !== '' ? primary : '\u00a0'}
        </span>
        <div className="wb-pills-slot">
          <ComparePills pills={pills} compareModes={compareModes} />
        </div>
      </div>
      {segments.length > 0 ? (
        <div className="wb-acc-bar-slot">{barTrack(segments, markerPct)}</div>
      ) : null}
      {footer ? <div className="wb-acc-footer">{footer}</div> : null}
    </div>
  );
}

function SubCell({
  primary,
  secondary,
  chips,
  compareModes,
  isRem,
  barPct,
}: {
  primary: string;
  secondary?: string;
  chips: { label: string; ref: number | string }[];
  compareModes: CompareMode[];
  isRem?: boolean;
  barPct?: number;
}) {
  return (
    <div className={`wb-sub-cell-inner${isRem ? ' wb-sub-cell-inner--rem' : ''}`}>
      <div className="wb-sub-value-line">
        <span className="wb-sub-primary">{primary}</span>
        {secondary ? <span className="wb-sub-secondary">{secondary}</span> : null}
      </div>
      {barPct != null ? (
        <div className="wb-sub-bar-track">
          <div
            className="wb-sub-bar-fill"
            style={{ width: `${Math.max(0, Math.min(100, barPct))}%` }}
          />
        </div>
      ) : null}
      {chips.length > 0 ? (
        <div className="wb-sub-chips-line">
          {chips.map((c) => (
            <SubCompareChip key={c.label} label={c.label} refVal={c.ref} compareModes={compareModes} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function pctOfCap(rn: number) {
  return (rn / HOTEL_CAPACITY) * 100;
}

export function renderTopCell(
  row: WbRow,
  _d: WeekDayData,
  collapsed: boolean,
  isLocked: boolean,
  isPartial: boolean,
) {
  if (row.id !== 'g_closeouts' || !collapsed) return null;
  if (isLocked) {
    return <span className="wb-top-summary wb-top-summary--closed">Full Close Out</span>;
  }
  if (isPartial) {
    return <span className="wb-top-summary wb-top-summary--partial">Partial</span>;
  }
  return <span className="wb-top-summary wb-top-summary--open">Open</span>;
}

export function renderSectCell(row: WbRow, d: WeekDayData, _compareModes: CompareMode[]) {
  void _compareModes;
  // Section row is overview: always show all three compare pills regardless of user's compare selection.
  const compareModes: CompareMode[] = ['stly', 'ly', 'fcst'];
  const stly = { key: 'stly', label: 'STLY' };
  const ly = { key: 'ly', label: 'LY' };
  const fc = { key: 'fcst', label: 'Fc' };

  switch (row.id) {
    case 'occ':
      return (
        <SectionCell
          compareModes={compareModes}
          primary={`${d.hotel}%`}
          pills={[
            { ...stly, curr: d.hotel, ref: d.sdlyH, isPercent: true },
            { ...ly, curr: d.hotel, ref: d.lyH, isPercent: true },
            { ...fc, curr: d.hotel, ref: d.fcstH, isPercent: true },
          ]}
          markerPct={compareModes.length > 0 ? d.sdlyH : null}
          segments={toOtherBar(d)}
        />
      );
    case 'onoff':
      return (
        <SectionCell
          compareModes={compareModes}
          primary={`${d.onlinePct}%`}
          pills={[
            { ...stly, curr: d.onlinePct, ref: Math.max(20, d.onlinePct - 4), isPercent: true },
            { ...ly, curr: d.onlinePct, ref: Math.max(20, d.onlinePct - 2), isPercent: true },
            { ...fc, curr: d.onlinePct, ref: Math.min(90, d.onlinePct + 2), isPercent: true },
          ]}
          segments={[
            { pct: d.onlinePct, color: WB_TO },
            { pct: 100 - d.onlinePct, color: WB_OTHER },
          ]}
        />
      );
    case 'adr':
      return (
        <SectionCell
          compareModes={compareModes}
          primary={`$${d.toAdr}`}
          pills={[
            { ...stly, curr: d.toAdr, ref: d.sdlyA },
            { ...ly, curr: d.toAdr, ref: d.lyA },
            { ...fc, curr: d.toAdr, ref: d.fcstA },
          ]}
          markerPct={compareModes.length > 0 ? d.sdlyH : null}
          segments={toOtherBar(d)}
        />
      );
    case 'rev':
      return (
        <SectionCell
          compareModes={compareModes}
          primary={d.fR(d.toRev)}
          pills={[
            { ...stly, curr: d.toRev, ref: d.sdlyR },
            { ...ly, curr: d.toRev, ref: d.lyR },
            { ...fc, curr: d.toRev, ref: d.fcstR },
          ]}
          segments={toOtherBar(d)}
        />
      );
    case 'rn':
      return (
        <SectionCell
          compareModes={compareModes}
          primary={String(d.toRn)}
          pills={[
            { ...stly, curr: d.toRn, ref: d.sdlyRn },
            { ...ly, curr: d.toRn, ref: d.lyRn },
            { ...fc, curr: d.toRn, ref: d.fcstRn },
          ]}
          segments={[
            { pct: Math.min(90, Math.round((d.toRn / HOTEL_CAPACITY) * 100)), color: '#004948' },
            { pct: Math.min(90, Math.round((d.hnRn / HOTEL_CAPACITY) * 100)), color: '#52d9ce' },
          ]}
        />
      );
    case 'revpar_s':
      return (
        <SectionCell
          compareModes={compareModes}
          primary={`$${d.hRevpar}`}
          pills={[
            { ...stly, curr: d.hRevpar, ref: d.sdlyRevpar },
            { ...ly, curr: d.hRevpar, ref: d.lyRevpar },
            { ...fc, curr: d.hRevpar, ref: d.hRevpar + 4 },
          ]}
          segments={toOtherBar(d)}
        />
      );
    case 'pickup_0':
      return (
        <SectionCell
          compareModes={compareModes}
          primary={`+${d.pickup}`}
          pills={[
            { ...stly, curr: d.pickup, ref: Math.max(0, d.hPickup - 2) },
            { ...ly, curr: d.pickup, ref: Math.max(0, d.hPickup - 1) },
            { ...fc, curr: d.pickup, ref: d.pickup + 1 },
          ]}
          segments={toOtherBar(d)}
        />
      );
    case 'avga_s':
      return (
        <SectionCell
          compareModes={compareModes}
          primary={d.avgA}
          pills={[]}
          segments={toOtherBar(d)}
        />
      );
    case 'los_s':
      return (
        <SectionCell
          compareModes={compareModes}
          primary={d.avgLos}
          pills={[]}
          segments={toOtherBar(d)}
        />
      );
    case 'lead_s':
      return (
        <SectionCell
          compareModes={compareModes}
          primary={d.avgLead}
          pills={[]}
          segments={toOtherBar(d)}
        />
      );
    case 'avail_s':
      return (
        <SectionCell
          compareModes={compareModes}
          primary={`${d.availRooms} rm`}
          pills={[]}
          segments={toOtherBar(d)}
        />
      );
    case 'availg_s':
      return (
        <SectionCell
          compareModes={compareModes}
          primary={`${d.availGuar} rm`}
          pills={[]}
          segments={toOtherBar(d)}
        />
      );
    case 'biz':
      return (
        <SectionCell
          compareModes={compareModes}
          primary=""
          pills={[]}
          segments={[
            { pct: d.toMix, color: '#004948' },
            { pct: d.dirMix, color: '#52d9ce' },
            { pct: d.otaMix, color: '#D97706' },
            { pct: d.otherMix, color: '#9ca3af' },
          ]}
          footer={
            <div className="wb-biz-legend">
              <span style={{ color: '#004948' }}>TO {d.toMix}%</span>
              <span style={{ color: '#52d9ce' }}>D {d.dirMix}%</span>
              <span style={{ color: '#D97706' }}>OTA {d.otaMix}%</span>
            </div>
          }
        />
      );
    case 'mp_sum': {
      const gpr = parseFloat(d.hAvgA) + parseFloat(d.hAvgC);
      const aiSt = Math.round(d.hnRn * (d.aiPct / 100) * gpr);
      return (
        <SectionCell
          compareModes={compareModes}
          primary=""
          pills={[]}
          segments={[
            { pct: d.aiPct, color: '#004948' },
            { pct: d.bbPct, color: '#52d9ce' },
            { pct: d.hbPct, color: '#D97706' },
            { pct: d.roPct, color: '#d7f7ed' },
          ]}
          footer={
            <div className="wb-biz-legend">
              AI {d.aiPct}% · {aiSt} seats
            </div>
          }
        />
      );
    }
    default:
      if (row.mpKey) {
        const pct = mealPct(d, row.mpKey);
        const toRm = Math.round(d.toRn * (pct / 100));
        const hRm = Math.round(d.hnRn * (pct / 100));
        return (
          <SectionCell
            compareModes={compareModes}
            primary={`${pct}%`}
            pills={[]}
            segments={toHotelRnBar(toRm, hRm)}
            footer={<span className="wb-acc-footer-muted">{hRm} RN hotel</span>}
          />
        );
      }
      if (row.rtIdx !== undefined) {
        const inv = RT_CAPS[row.rtIdx];
        const sold = Math.min(inv, Math.floor((inv * d.hotel) / 110));
        const toSold = Math.min(sold, Math.floor((inv * d.to) / 100));
        const otherSold = Math.max(0, sold - toSold);
        const avRm = Math.max(0, inv - sold);
        return (
          <SectionCell
            compareModes={compareModes}
            primary={avRm <= 0 ? '0 available' : `${avRm} avail`}
            pills={[]}
            segments={[
              { pct: Math.min(100, (toSold / inv) * 100), color: WB_TO },
              { pct: Math.min(100, (otherSold / inv) * 100), color: WB_OTHER },
            ]}
          />
        );
      }
      if (row.toIdx !== undefined) {
        const toRate = d.adr - 15 + Math.abs((d.dm * (row.toIdx + 3) + d.dd * (row.toIdx + 5)) % 50);
        return (
          <SectionCell
            compareModes={compareModes}
            primary={`$${toRate}`}
            pills={[]}
            segments={toOtherBar(d)}
          />
        );
      }
      if (row.toBase) {
        const baseRate = d.adr + 8;
        return (
          <SectionCell
            compareModes={compareModes}
            primary={`$${baseRate}`}
            pills={[]}
            segments={toOtherBar(d)}
          />
        );
      }
      return null;
  }
}

export function renderSubCell(row: WbRow, d: WeekDayData, isLocked: boolean, isPartial: boolean, compareModes: CompareMode[]) {
  const chips = [
    { label: 'STLY', ref: 20 },
    { label: 'LY', ref: 18 },
    { label: 'Fc', ref: 22 },
  ];

  switch (row.id) {
    case 'co_rooms':
      return (
        <SubCell primary={isLocked ? 'All' : isPartial ? 'Partial' : '—'} chips={[]} compareModes={compareModes} />
      );
    case 'co_boards':
      return (
        <SubCell primary={isLocked ? 'All' : isPartial ? 'BB, HB' : '—'} chips={[]} compareModes={compareModes} />
      );
    case 'co_tos':
      return (
        <SubCell
          primary={isLocked ? 'All' : isPartial ? 'Sunshine Tours' : '—'}
          chips={[]}
          compareModes={compareModes}
        />
      );
    case 'occ_tdh':
      return (
        <SubCell
          primary={`${d.toRn} RN`}
          secondary={`${d.to}%`}
          chips={[{ label: 'STLY', ref: d.sdlyRn }]}
          compareModes={compareModes}
          barPct={d.to}
        />
      );
    case 'occ_other':
      return (
        <SubCell
          primary={`${d.otherRms} RN`}
          secondary={`${d.otherPct}%`}
          chips={[{ label: 'STLY', ref: d.sdlyRn }]}
          compareModes={compareModes}
          barPct={d.otherPct}
        />
      );
    case 'occ_rem':
      return (
        <SubCell
          primary={`${d.freeRms} RN`}
          secondary={`${Math.max(0, 100 - d.hotel)}%`}
          chips={[{ label: 'STLY', ref: 20 }]}
          compareModes={compareModes}
          isRem
          barPct={Math.max(0, 100 - d.hotel)}
        />
      );
    case 'onoff_on':
      return <SubCell primary={`${d.onlinePct}%`} chips={chips} compareModes={compareModes} barPct={d.onlinePct} />;
    case 'onoff_off':
      return <SubCell primary={`${100 - d.onlinePct}%`} chips={chips} compareModes={compareModes} barPct={100 - d.onlinePct} />;
    case 'adr_t':
      return <SubCell primary={`$${d.toAdr}`} chips={[{ label: 'STLY', ref: d.sdlyA }]} compareModes={compareModes} barPct={Math.min(100, d.toAdr / 3)} />;
    case 'adr_hotel':
      return <SubCell primary={`$${d.adr}`} chips={[{ label: 'STLY', ref: d.sdlyA }]} compareModes={compareModes} barPct={Math.min(100, d.adr / 3)} />;
    case 'rev_t':
      return <SubCell primary={d.fR(d.toRev)} chips={[{ label: 'STLY', ref: d.fR(d.sdlyR) }]} compareModes={compareModes} barPct={Math.min(100, d.toRev / 1000)} />;
    case 'rev_hotel':
      return <SubCell primary={d.fR(d.hnRev)} chips={[{ label: 'STLY', ref: d.fR(d.lyR) }]} compareModes={compareModes} barPct={Math.min(100, d.hnRev / 1000)} />;
    case 'rn_t':
      return <SubCell primary={`${d.toRn} RN`} chips={[{ label: 'STLY', ref: d.sdlyRn }]} compareModes={compareModes} barPct={pctOfCap(d.toRn)} />;
    case 'rn_hotel':
      return <SubCell primary={`${d.hnRn} RN`} chips={[{ label: 'STLY', ref: Math.round(d.lyRn) }]} compareModes={compareModes} barPct={pctOfCap(d.hnRn)} />;
    case 'revpar_t':
      return <SubCell primary={`$${d.toRevpar}`} chips={[{ label: 'STLY', ref: d.sdlyRevpar }]} compareModes={compareModes} barPct={Math.min(100, d.toRevpar / 3)} />;
    case 'revpar_h':
      return <SubCell primary={`$${d.hRevpar}`} chips={[{ label: 'STLY', ref: d.lyRevpar }]} compareModes={compareModes} barPct={Math.min(100, d.hRevpar / 3)} />;
    case 'pickup_0_t':
      return <SubCell primary={`+${d.pickup}`} chips={chips} compareModes={compareModes} barPct={Math.min(100, d.pickup * 5)} />;
    case 'pickup_0_h':
      return <SubCell primary={`+${d.hPickup}`} chips={chips} compareModes={compareModes} barPct={Math.min(100, d.hPickup * 5)} />;
    case 'avga_t':
      return <SubCell primary={d.avgA} chips={chips} compareModes={compareModes} />;
    case 'avga_h':
      return <SubCell primary={d.hAvgA} chips={chips} compareModes={compareModes} />;
    case 'los_t':
      return <SubCell primary={d.avgLos} chips={chips} compareModes={compareModes} />;
    case 'los_h':
      return <SubCell primary={d.hLos} chips={chips} compareModes={compareModes} />;
    case 'lead_t':
      return <SubCell primary={d.avgLead} chips={chips} compareModes={compareModes} />;
    case 'lead_h':
      return <SubCell primary={d.hLead} chips={chips} compareModes={compareModes} />;
    case 'biz_to':
      return <SubCell primary={`${d.toMix}%`} chips={chips} compareModes={compareModes} barPct={d.toMix} />;
    case 'biz_dir':
      return <SubCell primary={`${d.dirMix}%`} chips={chips} compareModes={compareModes} barPct={d.dirMix} />;
    case 'biz_ota':
      return <SubCell primary={`${d.otaMix}%`} chips={chips} compareModes={compareModes} barPct={d.otaMix} />;
    case 'biz_other':
      return <SubCell primary={`${d.otherMix}%`} chips={chips} compareModes={compareModes} barPct={d.otherMix} />;
    default:
      if (row.mpKey && row.id.endsWith('_t')) {
        return (
          <SubCell
            primary={`${Math.round(d.toRn * (mealPct(d, row.mpKey) / 100))} RN`}
            chips={chips}
            compareModes={compareModes}
          />
        );
      }
      if (row.mpKey && row.id.endsWith('_h')) {
        return (
          <SubCell
            primary={`${Math.round(d.hnRn * (mealPct(d, row.mpKey) / 100))} RN`}
            chips={chips}
            compareModes={compareModes}
          />
        );
      }
      if (row.rtIdx !== undefined && row.rtSub === 'to') {
        return (
          <SubCell
            primary={`${Math.min(RT_CAPS[row.rtIdx], Math.floor((RT_CAPS[row.rtIdx] * d.to) / 100))} RN`}
            chips={chips}
            compareModes={compareModes}
          />
        );
      }
      if (row.rtIdx !== undefined && row.rtSub === 'avail') {
        const inv = RT_CAPS[row.rtIdx];
        const sold = Math.min(inv, Math.floor((inv * d.hotel) / 110));
        return (
          <SubCell
            primary={`${Math.max(0, inv - sold)} RN`}
            chips={chips}
            compareModes={compareModes}
            isRem
          />
        );
      }
      return null;
  }
}
