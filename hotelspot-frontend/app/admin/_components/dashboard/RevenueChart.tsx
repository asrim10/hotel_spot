"use client";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const DATA = [42, 68, 55, 81, 73, 95, 88, 102, 91, 118, 107, 134];
const MAX = Math.max(...DATA);
const W = 600,
  H = 140,
  PAD = 10;

function buildPath(data: number[]) {
  const pts = data.map((v, i) => ({
    x: PAD + (i / (data.length - 1)) * (W - PAD * 2),
    y: H - PAD - (v / MAX) * (H - PAD * 2),
  }));
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const cx = (pts[i - 1].x + pts[i].x) / 2;
    d += ` C ${cx} ${pts[i - 1].y}, ${cx} ${pts[i].y}, ${pts[i].x} ${pts[i].y}`;
  }
  return { d, pts };
}

export function RevenueChart({ totalRevenue }: { totalRevenue: number }) {
  const { d, pts } = buildPath(DATA);
  const areaD = `${d} L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`;
  const peak = DATA.indexOf(MAX);
  const fmt =
    totalRevenue >= 1000000
      ? `Rs.${(totalRevenue / 1000000).toFixed(1)}M`
      : totalRevenue >= 1000
        ? `Rs.${(totalRevenue / 1000).toFixed(1)}k`
        : `Rs.${totalRevenue}`;

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d0d] p-6 h-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#6b6b8a] mb-1">
            Total Revenue
          </p>
          <p
            className="text-[28px] font-bold text-white"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {fmt}
          </p>
          <p className="text-xs text-[#6b6b8a] mt-0.5">
            Across all properties · all time
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-[#6b6b8a]">
          <div className="w-2 h-2 rounded-full bg-[#C9A84C]" /> Revenue trend
        </div>
      </div>
      <div
        className="relative w-full"
        style={{ aspectRatio: `${W}/${H + 30}` }}
      >
        <svg
          viewBox={`0 0 ${W} ${H + 30}`}
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {[0.25, 0.5, 0.75, 1].map((v) => (
            <line
              key={v}
              x1={PAD}
              y1={H - PAD - v * (H - PAD * 2)}
              x2={W - PAD}
              y2={H - PAD - v * (H - PAD * 2)}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
            />
          ))}
          <path d={areaD} fill="url(#goldGrad)" />
          <path
            d={d}
            fill="none"
            stroke="#C9A84C"
            strokeWidth="2"
            filter="url(#glow)"
          />
          <circle cx={pts[peak].x} cy={pts[peak].y} r="5" fill="#C9A84C" />
          <circle
            cx={pts[peak].x}
            cy={pts[peak].y}
            r="9"
            fill="none"
            stroke="#C9A84C"
            strokeOpacity="0.3"
            strokeWidth="1"
          />
          {MONTHS.map((m, i) => (
            <text
              key={m}
              x={PAD + (i / (DATA.length - 1)) * (W - PAD * 2)}
              y={H + 22}
              textAnchor="middle"
              fontSize="9"
              fill="#6b6b8a"
              fontFamily="DM Sans"
              letterSpacing="1"
            >
              {m.toUpperCase()}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
