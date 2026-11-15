import React, { useState } from 'react';
import { getWhoGrowthChartData } from '../services/whoGrowthStandards';

export default function WhoGrowthChart({ childName, gender = 'Male', currentAge = 24, history = [] }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const whoPoints = getWhoGrowthChartData(gender);

  // SVG dimensions & margins
  const width = 640;
  const height = 340;
  const margin = { top: 30, right: 30, bottom: 40, left: 45 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Scales: X-axis 0 to 60 months, Y-axis 0 to 26 kg
  const minX = 0;
  const maxX = 60;
  const minY = 4;
  const maxY = 26;

  const scaleX = (val) => margin.left + ((val - minX) / (maxX - minX)) * innerWidth;
  const scaleY = (val) => margin.top + innerHeight - ((val - minY) / (maxY - minY)) * innerHeight;

  // Generate SVG path for an array of points
  const makePath = (pts, key) => {
    return pts
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.month)} ${scaleY(p[key])}`)
      .join(' ');
  };

  // Polygon for Red Zone (0 to -3SD)
  const redZonePoints = [
    `M ${scaleX(whoPoints[0].month)} ${scaleY(minY)}`,
    ...whoPoints.map(p => `L ${scaleX(p.month)} ${scaleY(p.sdMinus3)}`),
    `L ${scaleX(whoPoints[whoPoints.length - 1].month)} ${scaleY(minY)}`,
    'Z'
  ].join(' ');

  // Polygon for Yellow Zone (-3SD to -2SD)
  const yellowZonePoints = [
    `M ${scaleX(whoPoints[0].month)} ${scaleY(whoPoints[0].sdMinus3)}`,
    ...whoPoints.map(p => `L ${scaleX(p.month)} ${scaleY(p.sdMinus2)}`),
    ...whoPoints.slice().reverse().map(p => `L ${scaleX(p.month)} ${scaleY(p.sdMinus3)}`),
    'Z'
  ].join(' ');

  // Polygon for Green Zone (-2SD to +2SD)
  const greenZonePoints = [
    `M ${scaleX(whoPoints[0].month)} ${scaleY(whoPoints[0].sdMinus2)}`,
    ...whoPoints.map(p => `L ${scaleX(p.month)} ${scaleY(p.sdPlus2)}`),
    ...whoPoints.slice().reverse().map(p => `L ${scaleX(p.month)} ${scaleY(p.sdMinus2)}`),
    'Z'
  ].join(' ');

  const medianPath = makePath(whoPoints, 'median');

  // Child's actual historical measurements
  const validHistory = history
    .filter(h => h.weightKg && (h.ageMonths !== undefined || h.date))
    .map(h => ({
      age: h.ageMonths || currentAge,
      weight: parseFloat(h.weightKg),
      date: h.date || 'Recent',
      category: h.overallCategory || 'Normal'
    }))
    .sort((a, b) => a.age - b.age);

  const childTrajectoryPath = validHistory.length > 1
    ? validHistory.map((h, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(h.age)} ${scaleY(h.weight)}`).join(' ')
    : '';

  return (
    <div className="who-chart-container">
      <div className="who-chart-header">
        <div>
          <h4 className="chart-title">WHO Weight-for-Age Growth Curve (0-60 Months)</h4>
          <p className="chart-subtitle">
            Plotted against WHO Standard Percentiles for <strong>{gender}</strong> • Child: <strong>{childName || 'Child'}</strong>
          </p>
        </div>
        <div className="chart-legend">
          <span className="legend-item"><span className="color-box bg-green"></span> Normal (Green)</span>
          <span className="legend-item"><span className="color-box bg-yellow"></span> MAM (Yellow)</span>
          <span className="legend-item"><span className="color-box bg-red"></span> SAM (Red Alert)</span>
        </div>
      </div>

      <div className="svg-wrapper">
        <svg viewBox={`0 0 ${width} ${height}`} className="growth-svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="yellowGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.12" />
            </linearGradient>
            <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[6, 12, 18, 24, 30, 36, 42, 48, 54, 60].map(m => (
            <line
              key={`xgrid-${m}`}
              x1={scaleX(m)}
              y1={margin.top}
              x2={scaleX(m)}
              y2={height - margin.bottom}
              stroke="#e2e8f0"
              strokeDasharray="3 3"
            />
          ))}
          {[6, 10, 14, 18, 22].map(w => (
            <line
              key={`ygrid-${w}`}
              x1={margin.left}
              y1={scaleY(w)}
              x2={width - margin.right}
              y2={scaleY(w)}
              stroke="#e2e8f0"
              strokeDasharray="3 3"
            />
          ))}

          {/* Colored WHO Bands */}
          <path d={greenZonePoints} fill="url(#greenGrad)" />
          <path d={yellowZonePoints} fill="url(#yellowGrad)" />
          <path d={redZonePoints} fill="url(#redGrad)" />

          {/* Band Boundary Lines */}
          <path d={makePath(whoPoints, 'sdPlus2')} fill="none" stroke="#059669" strokeWidth="1.5" strokeDasharray="4 2" />
          <path d={medianPath} fill="none" stroke="#047857" strokeWidth="2.5" />
          <path d={makePath(whoPoints, 'sdMinus2')} fill="none" stroke="#d97706" strokeWidth="1.5" strokeDasharray="4 2" />
          <path d={makePath(whoPoints, 'sdMinus3')} fill="none" stroke="#dc2626" strokeWidth="2" />

          {/* Child Trajectory line */}
          {childTrajectoryPath && (
            <path
              d={childTrajectoryPath}
              fill="none"
              stroke="#1e3a8a"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Child Recorded Points */}
          {validHistory.map((h, idx) => {
            const cx = scaleX(h.age);
            const cy = scaleY(h.weight);
            const isHovered = hoveredPoint?.idx === idx;
            const pointColor = h.category === 'SAM' ? '#dc2626' : (h.category === 'MAM' ? '#d97706' : '#059669');

            return (
              <g key={`pt-${idx}`}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 8 : 6}
                  fill={pointColor}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  className="interactive-point"
                  onMouseEnter={() => setHoveredPoint({ ...h, idx, cx, cy })}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            );
          })}

          {/* X Axis & Labels */}
          <line
            x1={margin.left}
            y1={height - margin.bottom}
            x2={width - margin.right}
            y2={height - margin.bottom}
            stroke="#64748b"
            strokeWidth="1.5"
          />
          {[0, 12, 24, 36, 48, 60].map(m => (
            <text
              key={`xlabel-${m}`}
              x={scaleX(m)}
              y={height - margin.bottom + 18}
              textAnchor="middle"
              className="axis-label"
            >
              {m}m
            </text>
          ))}
          <text
            x={width / 2}
            y={height - 6}
            textAnchor="middle"
            className="axis-title"
          >
            Age in Months (आयु माह में)
          </text>

          {/* Y Axis & Labels */}
          <line
            x1={margin.left}
            y1={margin.top}
            x2={margin.left}
            y2={height - margin.bottom}
            stroke="#64748b"
            strokeWidth="1.5"
          />
          {[6, 10, 14, 18, 22].map(w => (
            <text
              key={`ylabel-${w}`}
              x={margin.left - 8}
              y={scaleY(w) + 4}
              textAnchor="end"
              className="axis-label"
            >
              {w}kg
            </text>
          ))}
          <text
            x={-height / 2}
            y={14}
            transform="rotate(-90)"
            textAnchor="middle"
            className="axis-title"
          >
            Weight (वजन kg)
          </text>

          {/* Reference line labels */}
          <text x={width - margin.right - 2} y={scaleY(whoPoints[whoPoints.length - 1].median) - 4} textAnchor="end" className="band-label green-text">Median</text>
          <text x={width - margin.right - 2} y={scaleY(whoPoints[whoPoints.length - 1].sdMinus2) - 4} textAnchor="end" className="band-label yellow-text">-2SD (MAM)</text>
          <text x={width - margin.right - 2} y={scaleY(whoPoints[whoPoints.length - 1].sdMinus3) - 4} textAnchor="end" className="band-label red-text">-3SD (SAM)</text>
        </svg>

        {/* Floating Tooltip */}
        {hoveredPoint && (
          <div
            className="chart-tooltip"
            style={{
              left: `${(hoveredPoint.cx / width) * 100}%`,
              top: `${(hoveredPoint.cy / height) * 100}%`
            }}
          >
            <div className="tooltip-title">{hoveredPoint.date}</div>
            <div>Age: <strong>{hoveredPoint.age} months</strong></div>
            <div>Weight: <strong>{hoveredPoint.weight} kg</strong></div>
            <div className={`status-badge-mini ${hoveredPoint.category.toLowerCase()}`}>
              {hoveredPoint.category}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
