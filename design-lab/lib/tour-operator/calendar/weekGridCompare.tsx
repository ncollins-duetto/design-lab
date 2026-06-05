import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import type { CompareMode } from '@/lib/tour-operator/calendar/metrics';

type PillDef = {
  key: string;
  label: string;
  curr: number;
  ref: number;
  isPercent?: boolean;
};

export function ComparePills({
  pills,
  compareModes,
}: {
  pills: PillDef[];
  compareModes: CompareMode[];
}) {
  if (compareModes.length === 0) return null;

  const visible = pills.filter((p) => {
    if (compareModes.includes('stly') && p.key === 'stly') return true;
    if (compareModes.includes('ly') && p.key === 'ly') return true;
    if ((compareModes.includes('fcst') || compareModes.includes('budget')) && p.key === 'fcst') return true;
    return false;
  });

  if (visible.length === 0) return null;

  return (
    <div className="wb-compare-pills">
      {visible.map((p) => {
        const diff = p.curr - p.ref;
        if (diff === 0) return null;
        const up = diff > 0;
        const mag = p.isPercent
          ? `${Math.abs(Math.round(diff))}%`
          : `${Math.abs(Math.round(diff))}`;
        return (
          <span key={p.key} className={`wb-cmp-pill${up ? ' wb-cmp-pill--up' : ' wb-cmp-pill--dn'}`}>
            {up ? (
              <ArrowUpwardIcon sx={{ fontSize: 12 }} />
            ) : (
              <ArrowDownwardIcon sx={{ fontSize: 12 }} />
            )}
            <span>
              {mag} vs {p.label}
            </span>
          </span>
        );
      })}
    </div>
  );
}

export function SubCompareChip({
  label,
  refVal,
  compareModes,
}: {
  label: string;
  refVal: number | string;
  compareModes: CompareMode[];
}) {
  if (compareModes.length === 0) return null;
  const show =
    (label === 'STLY' && compareModes.includes('stly')) ||
    (label === 'LY' && compareModes.includes('ly')) ||
    (label === 'Fc' && (compareModes.includes('fcst') || compareModes.includes('budget')));
  if (!show) return null;

  return (
    <span className="wb-sub-cmp-chip">
      <TrendingUpIcon sx={{ fontSize: 11 }} />
      <span>
        {label}:{refVal}
      </span>
    </span>
  );
}
