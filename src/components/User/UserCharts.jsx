import "./UserCharts.css";

export function IncomePayoutDonutChart({ income = 241550, payout = 233900 }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const total = income + payout || 1;
  const incomeRatio = income / total;
  const payoutRatio = payout / total;

  const incomeOffset = circumference * (1 - incomeRatio);

  return (
    <div className="donut-chart-container">
      <div className="donut-graphic">
        <svg viewBox="0 0 100 100" className="donut-svg">
          {/* Payout Arc (Gray/Gold light) */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#f0ca4d"
            strokeWidth="12"
          />
          {/* Income Arc (Golden Highlight) */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#d4af37"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={incomeOffset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
      </div>

      <div className="donut-legend">
        <div className="legend-row">
          <span className="legend-dot legend-dot--income" />
          <div className="legend-details">
            <span className="legend-val">₹{income.toLocaleString()}</span>
            <span className="legend-lbl">Income</span>
          </div>
        </div>
        <div className="legend-row">
          <span className="legend-dot legend-dot--payout" />
          <div className="legend-details">
            <span className="legend-val">₹{payout.toLocaleString()}</span>
            <span className="legend-lbl">Payout</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NetworkAreaChart({ data }) {
  const chartData = data && data.length ? data : [
    { month: "Jan 2026", val: 0.1 },
    { month: "Feb 2026", val: 0.8 },
    { month: "Mar 2026", val: 2.0 },
    { month: "Apr 2026", val: 0.2 },
    { month: "May 2026", val: 0.1 },
    { month: "Jul 2026", val: 0.1 },
  ];

  const width = 500;
  const height = 180;
  const padding = { top: 20, right: 20, bottom: 30, left: 35 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const maxVal = 4;

  const points = chartData.map((d, i) => ({
    x: padding.left + (i / Math.max(chartData.length - 1, 1)) * chartW,
    y: padding.top + chartH - (d.val / maxVal) * chartH,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

  const yTicks = [0, 1, 2, 3, 4];
  const xTicks = chartData.map((d) => d.month);

  return (
    <div className="network-area-chart-wrapper">
      <svg viewBox={`0 0 ${width} ${height}`} className="area-chart-svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="yellowAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffc52d" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#ffc52d" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Y Axis lines & labels */}
        {yTicks.map((tick) => {
          const y = padding.top + chartH - (tick / maxVal) * chartH;
          return (
            <g key={tick}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#f0f0f0" strokeWidth="1" />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" className="chart-label">
                {tick}
              </text>
            </g>
          );
        })}

        {/* Smooth gradient area */}
        <path d={areaPath} fill="url(#yellowAreaGradient)" />

        {/* Smooth line */}
        <path d={linePath} fill="none" stroke="#ffc52d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* X Axis labels */}
        {xTicks.map((month, i) => {
          const x = padding.left + (i / Math.max(chartData.length - 1, 1)) * chartW;
          return (
            <text key={month} x={x} y={height - 6} textAnchor="middle" className="chart-label">
              {month}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
