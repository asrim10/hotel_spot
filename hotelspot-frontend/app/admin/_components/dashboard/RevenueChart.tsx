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

const W = 600,
  H = 140,
  PAD = 10;

function buildPath(data: number[]) {
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => ({
    x: PAD + (i / (data.length - 1)) * (W - PAD * 2),
    y: H - PAD - (v / max) * (H - PAD * 2),
  }));
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const cx = (pts[i - 1].x + pts[i].x) / 2;
    d += ` C ${cx} ${pts[i - 1].y}, ${cx} ${pts[i].y}, ${pts[i].x} ${pts[i].y}`;
  }
  return { d, pts, max };
}

interface RevenueChartProps {
  totalRevenue: number;
  bookings?: {
    checkInDate?: string;
    createdAt?: string;
    totalPrice?: number;
    paymentStatus?: string;
  }[];
}

export function RevenueChart({
  totalRevenue,
  bookings = [],
}: RevenueChartProps) {
  // Build monthly revenue from real bookings
  const currentYear = new Date().getFullYear();

  const monthlyData = Array(12).fill(0);

  bookings.forEach((b) => {
    if (b.paymentStatus !== "paid") return;
    const date = new Date(b.createdAt ?? b.checkInDate ?? "");
    if (isNaN(date.getTime())) return;
    if (date.getFullYear() !== currentYear) return;
    const month = date.getMonth(); // 0-indexed
    monthlyData[month] += b.totalPrice ?? 0;
  });

  const hasData = monthlyData.some((v) => v > 0);
  const chartData = hasData ? monthlyData : Array(12).fill(0);

  const { d, pts, max } = buildPath(chartData);
  const areaD = `${d} L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`;

  // Highlight the month with highest revenue
  const peakIdx = chartData.indexOf(Math.max(...chartData));

  const fmt =
    totalRevenue >= 1_000_000
      ? `Rs.${(totalRevenue / 1_000_000).toFixed(1)}M`
      : totalRevenue >= 1_000
        ? `Rs.${(totalRevenue / 1_000).toFixed(1)}k`
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
            Across all properties · {currentYear}
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

          {/* Grid lines */}
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

          {/* Y-axis value hints */}
          {[0.5, 1].map((v) => (
            <text
              key={v}
              x={PAD}
              y={H - PAD - v * (H - PAD * 2) - 4}
              fontSize="8"
              fill="#6b6b8a"
              fontFamily="DM Sans"
            >
              {max > 0 ? `Rs.${((v * max) / 1000).toFixed(0)}k` : ""}
            </text>
          ))}

          {/* Area fill */}
          <path d={areaD} fill="url(#goldGrad)" />

          {/* Line */}
          <path
            d={d}
            fill="none"
            stroke="#C9A84C"
            strokeWidth="2"
            filter="url(#glow)"
          />

          {/* Peak dot */}
          {hasData && (
            <>
              <circle
                cx={pts[peakIdx].x}
                cy={pts[peakIdx].y}
                r="5"
                fill="#C9A84C"
              />
              <circle
                cx={pts[peakIdx].x}
                cy={pts[peakIdx].y}
                r="9"
                fill="none"
                stroke="#C9A84C"
                strokeOpacity="0.3"
                strokeWidth="1"
              />
            </>
          )}

          {/* Month labels */}
          {MONTHS.map((m, i) => (
            <text
              key={m}
              x={PAD + (i / (chartData.length - 1)) * (W - PAD * 2)}
              y={H + 22}
              textAnchor="middle"
              fontSize="9"
              fill={i === peakIdx && hasData ? "#C9A84C" : "#6b6b8a"}
              fontFamily="DM Sans"
              letterSpacing="1"
            >
              {m.toUpperCase()}
            </text>
          ))}
        </svg>
      </div>

      {/* No data state */}
      {!hasData && (
        <p className="text-center text-[11px] text-[#6b6b8a] mt-2">
          No paid bookings recorded for {currentYear} yet
        </p>
      )}
    </div>
  );
}
