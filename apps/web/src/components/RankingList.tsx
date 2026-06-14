import type { RankRow } from '@/lib/teamData';

const POS_CLASS = [
  'bg-[rgba(245,200,66,.15)] text-[#F5C842]',
  'bg-[rgba(180,178,169,.12)] text-[#B4B2A9]',
  'bg-[rgba(205,127,50,.12)] text-[#CD7F32]',
];

function initials(name: string): string {
  const words = name.replace(/\(.*?\)/g, '').trim().split(/\s+/);
  return words
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase();
}

/** Ranking de vendedores con medalla, avatar y barra de progreso. */
export function RankingList({ rows }: { rows: RankRow[] }) {
  return (
    <div>
      {rows.map((r, i) => (
        <div key={r.n} className="border-b border-wire py-2 last:border-b-0">
          <div className="flex items-center gap-2.5">
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-heading text-[10px] font-bold ${
                POS_CLASS[i] ?? 'bg-lift text-fog'
              }`}
            >
              {i + 1}
            </span>
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-wire bg-surface font-heading text-[10px] font-semibold text-cipher">
              {initials(r.n)}
            </span>
            <span className="flex-1 text-xs font-medium text-clean">{r.n}</span>
            <span className="font-heading text-xs font-semibold text-cipher">{r.v}</span>
          </div>
          <div className="mt-1 h-0.5 overflow-hidden rounded bg-lift">
            <div
              className="h-full rounded bg-gradient-to-r from-cipher-dark to-cipher"
              style={{ width: `${r.p}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
