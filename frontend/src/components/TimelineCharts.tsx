import { useState } from 'react'

interface HistoryRecord {
  id: string
  symptoms_summary: string
  predicted_disease: string
  confidence: number
  timestamp: string
}

interface TimelineChartsProps {
  history: HistoryRecord[]
  latestAge?: number
  latestSmoking?: string
  latestAlcohol?: string
  latestBmi?: number
  latestHistory?: string[]
  latestPain?: number
  latestDisease?: string
}

export function HistoryLineChart({ history }: { history: HistoryRecord[] }) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)

  // Ensure data exists and is sorted chronologically
  const chartData = [...history]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .slice(-7) // Show last 7 assessments

  if (chartData.length === 0) {
    return (
      <div className="h-48 border border-slate-200 border-dashed rounded-card flex items-center justify-center text-slate-400 font-sans text-xs bg-white">
        Assessments timeline will render once you complete a test.
      </div>
    )
  }

  // Dimensions
  const width = 500
  const height = 200
  const paddingX = 40
  const paddingY = 30

  // Scales
  const maxX = chartData.length - 1
  const maxY = 100

  const getX = (index: number) => {
    if (maxX === 0) return width / 2
    return paddingX + (index / maxX) * (width - 2 * paddingX)
  }

  const getY = (value: number) => {
    return height - paddingY - (value / maxY) * (height - 2 * paddingY)
  }

  // Path data
  const points = chartData.map((d, i) => ({ x: getX(i), y: getY(d.confidence), label: d.confidence, disease: d.predicted_disease }))
  
  let dPath = ''
  if (points.length > 0) {
    dPath = `M ${points[0].x} ${points[0].y} `
    for (let i = 1; i < points.length; i++) {
      dPath += `L ${points[i].x} ${points[i].y} `
    }
  }

  return (
    <div className="relative font-sans bg-white border border-slate-250/50 rounded-card p-6 shadow-sm">
      <h3 className="font-display font-bold text-base text-slate-800 mb-4 tracking-tight">Health Matching Confidence Trend</h3>
      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((yVal) => (
            <g key={yVal}>
              <line
                x1={paddingX}
                y1={getY(yVal)}
                x2={width - paddingX}
                y2={getY(yVal)}
                stroke="#E2E8F0"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text x={paddingX - 10} y={getY(yVal) + 3} textAnchor="end" className="fill-slate-400 text-[9px] font-semibold">
                {yVal}%
              </text>
            </g>
          ))}

          {/* Line Path */}
          {points.length > 1 && (
            <path
              d={dPath}
              fill="none"
              stroke="#2563EB"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-md"
            />
          )}

          {/* Data Points */}
          {points.map((p, i) => (
            <g key={i} onMouseEnter={() => setHoveredPoint(i)} onMouseLeave={() => setHoveredPoint(null)} className="cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredPoint === i ? 7 : 5}
                className="fill-white stroke-primary stroke-[3] transition-all"
              />
              {hoveredPoint === i && (
                <g>
                  {/* Tooltip background */}
                  <rect
                    x={p.x - 65}
                    y={p.y - 45}
                    width="130"
                    height="32"
                    rx="6"
                    className="fill-slate-900/90 text-white shadow-lg"
                  />
                  {/* Tooltip texts */}
                  <text x={p.x} y={p.y - 32} textAnchor="middle" className="fill-white text-[8px] font-bold">
                    {p.disease}
                  </text>
                  <text x={p.x} y={p.y - 20} textAnchor="middle" className="fill-teal text-[8px] font-bold">
                    Confidence: {p.label}%
                  </text>
                </g>
              )}
            </g>
          ))}
        </svg>
      </div>
      <div className="flex justify-between text-4xs text-slate-400 font-semibold px-6 pt-2">
        <span>Oldest Assessment</span>
        <span>Latest logs</span>
      </div>
    </div>
  )
}

export function HealthRadarChart({
  latestAge = 25,
  latestSmoking = 'no',
  latestAlcohol = 'no',
  latestBmi = 22,
  latestHistory = [],
  latestPain = 5,
  latestDisease = ''
}: TimelineChartsProps) {
  // Compute risk category metrics (0.0 to 1.0, where 1.0 is healthy and 0.2 is high risk)
  const calculateRadarScores = () => {
    let respiratory = 0.90
    let cardio = 0.90
    let metabolic = 0.95
    let lifestyle = 0.90
    let nutrition = 0.85
    let immune = 0.90

    const disease = latestDisease.toLowerCase()

    // 1. Respiratory
    if (disease.includes('influenza') || disease.includes('cold') || disease.includes('bronchitis') || disease.includes('asthma')) {
      respiratory = 0.40
    }
    if (latestHistory.includes('Asthma')) respiratory = Math.min(respiratory, 0.50)

    // 2. Cardiovascular
    if (disease.includes('cardiovascular') || disease.includes('angina') || latestPain >= 8) {
      cardio = 0.30
    }
    if (latestHistory.includes('Heart Disease') || latestHistory.includes('Hypertension')) {
      cardio = Math.min(cardio, 0.50)
    }

    // 3. Metabolic
    if (disease.includes('diabetes')) {
      metabolic = 0.35
    }
    if (latestHistory.includes('Diabetes')) metabolic = Math.min(metabolic, 0.45)
    if (latestAge > 50) metabolic = Math.min(metabolic, 0.70)

    // 4. Lifestyle
    if (latestSmoking === 'heavy') lifestyle = 0.35
    else if (latestSmoking === 'occasionally') lifestyle = 0.60
    if (latestAlcohol === 'heavy') lifestyle = Math.min(lifestyle, 0.45)
    else if (latestAlcohol === 'socially') lifestyle = Math.min(lifestyle, 0.75)

    // 5. Nutrition
    if (latestBmi > 30) nutrition = 0.40  // Obese
    else if (latestBmi > 25) nutrition = 0.65  // Overweight
    else if (latestBmi < 18.5) nutrition = 0.55  // Underweight

    // 6. Immune Health
    if (disease.includes('influenza') || disease.includes('covid-19') || latestHistory.length > 2) {
      immune = 0.45
    }

    return [
      { key: 'Respiratory', val: respiratory },
      { key: 'Cardio', val: cardio },
      { key: 'Metabolic', val: metabolic },
      { key: 'Lifestyle', val: lifestyle },
      { key: 'Nutrition', val: nutrition },
      { key: 'Immune', val: immune }
    ]
  }

  const scores = calculateRadarScores()

  // Dimensions
  const width = 360
  const height = 300
  const centerX = width / 2
  const centerY = height / 2 - 10
  const maxRadius = 100

  // Vertices calculation helper
  const getVertex = (index: number, score: number) => {
    const angle = (Math.PI * 2 / 6) * index - Math.PI / 2
    return {
      x: centerX + maxRadius * score * Math.cos(angle),
      y: centerY + maxRadius * score * Math.sin(angle)
    }
  }

  // Draw concentric helper grids
  const gridLevels = [0.25, 0.5, 0.75, 1.0]
  
  // Renders radar fill points
  const points = scores.map((s, i) => getVertex(i, s.val))
  const pointsPath = points.map(p => `${p.x},${p.y}`).join(' ')

  return (
    <div className="font-sans bg-white border border-slate-250/50 rounded-card p-6 shadow-sm flex flex-col justify-between min-h-[350px]">
      <div>
        <h3 className="font-display font-bold text-base text-slate-800 tracking-tight">AI Health Risk Radar</h3>
        <p className="font-sans text-2xs text-slate-400 mt-0.5">Calculates functional system stability based on latest biometrics.</p>
      </div>

      <div className="w-full flex items-center justify-center my-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-64 h-auto overflow-visible">
          {/* Concentric hexagonal grid rings */}
          {gridLevels.map((level) => {
            const gridPts = Array.from({ length: 6 }).map((_, i) => getVertex(i, level))
            const gridPath = gridPts.map(p => `${p.x},${p.y}`).join(' ')
            return (
              <polygon
                key={level}
                points={gridPath}
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="1"
              />
            )
          })}

          {/* Radial axis lines */}
          {Array.from({ length: 6 }).map((_, i) => {
            const endpoint = getVertex(i, 1.0)
            return (
              <line
                key={i}
                x1={centerX}
                y1={centerY}
                x2={endpoint.x}
                y2={endpoint.y}
                stroke="#E2E8F0"
                strokeWidth="1.2"
              />
            )
          })}

          {/* Polygon matches */}
          <polygon
            points={pointsPath}
            fill="rgba(37, 99, 235, 0.15)"
            stroke="#2563EB"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Points circular indicators */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="4"
              className="fill-white stroke-primary stroke-[2]"
            />
          ))}

          {/* Axis text labels */}
          {scores.map((s, i) => {
            const labelPos = getVertex(i, 1.22)
            const textAnchor = i === 0 || i === 3 ? 'middle' : (i === 1 || i === 2 ? 'start' : 'end')
            return (
              <g key={s.key}>
                <text
                  x={labelPos.x}
                  y={labelPos.y + 3}
                  textAnchor={textAnchor}
                  className="fill-slate-700 text-[10px] font-bold"
                >
                  {s.key}
                </text>
                <text
                  x={labelPos.x}
                  y={labelPos.y + 12}
                  textAnchor={textAnchor}
                  className={`text-[8px] font-bold ${s.val < 0.6 ? 'fill-danger' : 'fill-teal'}`}
                >
                  {s.val < 0.6 ? 'Vulnerable' : 'Stable'}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-4xs font-bold uppercase tracking-wider text-slate-400">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-primary rounded-xs"></span> Target Health Area</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-teal rounded-full"></span> 6-Axis Diagnostics</span>
      </div>
    </div>
  )
}
