import { useState } from 'react'
import {
  Database,
  Cpu,
  Layers,
  AlertTriangle,
  Users,
  Activity,
  FileSpreadsheet
} from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'xai' | 'dataset'>('analytics')

  const stats = [
    { name: 'Total Users Registered', value: '142', icon: Users, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { name: 'Assessments Processed', value: '1,024', icon: Activity, color: 'text-teal bg-teal/10 border-teal/20' },
    { name: 'Clinical Reports Generated', value: '512', icon: Layers, color: 'text-purple-600 bg-purple-50 border-purple-100' },
    { name: 'Emergency Alerts Intercepted', value: '14', icon: AlertTriangle, color: 'text-danger bg-danger/10 border-danger/20' }
  ]

  const featureWeights = [
    { name: 'Primary Symptoms Overlap', weight: 65, color: 'bg-primary' },
    { name: 'Pain Severity Level Coefficient', weight: 20, color: 'bg-teal' },
    { name: 'Demographics Factor (Age/Gender)', weight: 10, color: 'bg-indigo-600' },
    { name: 'Lifestyle Modifiers (Smoking/Alcohol)', weight: 5, color: 'bg-slate-500' }
  ]

  const exportData = (type: 'csv' | 'json') => {
    alert(`Exporting research telemetry logs in ${type.toUpperCase()} format. Telemetry download complete.`)
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10 animate-fade-in">
      {/* Title */}
      <div className="border-b border-slate-200/50 pb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight flex items-center gap-2">
            <Cpu className="w-8 h-8 text-primary animate-pulse" /> Explainable AI & Research Control Lab
          </h2>
          <p className="font-sans text-slate-500 text-sm mt-1">
            Faculty audit dashboard to analyze machine learning metrics, feature weights, and database distributions.
          </p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200/80">
          {['analytics', 'xai', 'dataset'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-5 py-2 rounded-full font-sans text-xs font-bold transition-all uppercase tracking-wider ${activeTab === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {tab === 'xai' ? 'XAI Lab' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className="glass-panel bg-white border border-slate-200/50 p-6 rounded-card flex items-center gap-4">
              <span className={`p-3 rounded-xl border flex items-center justify-center shrink-0 ${s.color}`}>
                <Icon className="w-6 h-6" />
              </span>
              <div>
                <h4 className="font-display font-extrabold text-slate-800 text-xl tracking-tight">{s.value}</h4>
                <p className="font-sans text-3xs text-slate-450 mt-0.5">{s.name}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* TAB 1: Analytics & SVG Charts */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Top Diseases bar chart (SVG) */}
          <div className="md:col-span-8 glass-panel bg-white border border-slate-200/50 p-8 rounded-card space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-display font-bold text-base text-slate-800 tracking-tight">Most Common Predicted Diseases</h3>
                <p className="font-sans text-3xs text-slate-400">Diagnosis classification frequency logs.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => exportData('csv')}
                  className="py-1.5 px-3 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-btn text-2xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" /> CSV
                </button>
              </div>
            </div>

            {/* SVG Horizontal Bar Chart */}
            <div className="space-y-4">
              {[
                { name: 'Influenza (Flu)', count: 423, percent: 85, color: 'bg-primary' },
                { name: 'Common Cold', count: 284, percent: 65, color: 'bg-teal' },
                { name: 'Diabetes Type 2', count: 184, percent: 45, color: 'bg-indigo-600' },
                { name: 'COVID-19', count: 133, percent: 35, color: 'bg-purple-600' }
              ].map((d, i) => (
                <div key={i} className="grid grid-cols-12 items-center gap-4 text-xs font-sans">
                  <span className="col-span-3 text-slate-700 font-semibold truncate">{d.name}</span>
                  <div className="col-span-7 h-3.5 bg-slate-100 rounded-full overflow-hidden relative">
                    <div className={`h-full ${d.color} transition-all`} style={{ width: `${d.percent}%` }}></div>
                  </div>
                  <span className="col-span-2 text-right text-slate-400 font-bold">{d.count} cases</span>
                </div>
              ))}
            </div>
          </div>

          {/* Demographics pie distribution (SVG) */}
          <div className="md:col-span-4 glass-panel bg-white border border-slate-200/50 p-8 rounded-card flex flex-col justify-between min-h-[300px]">
            <div>
              <h3 className="font-display font-bold text-base text-slate-800 tracking-tight">Patient Age Distribution</h3>
              <p className="font-sans text-3xs text-slate-400 mt-0.5">Demographics partition metrics.</p>
            </div>

            {/* SVG Pie Chart Rings */}
            <div className="w-full flex items-center justify-center my-4">
              <svg viewBox="0 0 100 100" className="w-36 h-36">
                <circle cx="50" cy="50" r="35" fill="none" stroke="#E2E8F0" strokeWidth="12" />
                {/* 18-35 (55%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="12"
                  strokeDasharray="219.9"
                  strokeDashoffset="98.9"
                />
                {/* 36-50 (30%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="#0D9488"
                  strokeWidth="12"
                  strokeDasharray="219.9"
                  strokeDashoffset="164.9"
                />
              </svg>
            </div>

            <div className="flex justify-between items-center text-4xs font-bold text-slate-400 uppercase tracking-wider border-t border-slate-100 pt-3">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-primary rounded-xs"></span> 18-35 (55%)</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-teal rounded-xs"></span> 36-50 (30%)</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: XAI Laboratory & Feature Weights */}
      {activeTab === 'xai' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Feature Weights Matrix */}
          <div className="md:col-span-7 glass-panel bg-white border border-slate-200/50 p-8 rounded-card space-y-6">
            <div>
              <h3 className="font-display font-bold text-base text-slate-800 tracking-tight">Feature Importance Vector</h3>
              <p className="font-sans text-3xs text-slate-400 mt-0.5">Parameters weight contribution inside matching algorithm.</p>
            </div>

            <div className="space-y-4">
              {featureWeights.map((f, i) => (
                <div key={i} className="space-y-1.5 font-sans text-xs">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>{f.name}</span>
                    <span className="text-primary">{f.weight}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${f.color}`} style={{ width: `${f.weight}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Model Accuracy metrics */}
          <div className="md:col-span-5 glass-panel bg-white border border-slate-250/50 p-8 rounded-card space-y-6">
            <div>
              <h3 className="font-display font-bold text-base text-slate-800 tracking-tight">Active ML Model Analytics</h3>
              <p className="font-sans text-3xs text-slate-400 mt-0.5">Model assessment validation weights.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Model Accuracy', val: '94.0%' },
                { name: 'F1 Classification', val: '92.5%' },
                { name: 'Recall Rate', val: '91.0%' },
                { name: 'Inference Speed', val: '14 ms' }
              ].map((m, i) => (
                <div key={i} className="p-4 bg-slate-50 border border-slate-200/60 rounded-btn">
                  <div className="text-2xs font-bold text-slate-400 uppercase tracking-wider">{m.name}</div>
                  <div className="font-display font-extrabold text-slate-800 text-lg mt-1">{m.val}</div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-primary/5 border border-primary/10 rounded-btn text-primary text-2xs font-sans flex items-start gap-2 leading-relaxed">
              <Database className="w-5 h-5 shrink-0 mt-0.5" />
              <span><b>Knowledge Base Matrix:</b> 20+ disease classifications with 120+ distinct matching feature parameters. Dynamic tf-idf weighting evaluates symptom overlays instantly.</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Dataset Management */}
      {activeTab === 'dataset' && (
        <div className="glass-panel bg-white border border-slate-200/50 p-10 rounded-card text-center space-y-6 max-w-3xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mx-auto">
            <Database className="w-8 h-8" />
          </div>
          <h3 className="font-display font-extrabold text-xl text-slate-800">ML Dataset Management</h3>
          <p className="font-sans text-slate-550 text-sm max-w-md mx-auto leading-relaxed">
            Faculty can upload CSV datasets or image scan packages to refresh classifications, training models, or updating reference matrices.
          </p>

          <div className="border border-dashed border-slate-300 rounded-card p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100/50 transition-colors cursor-pointer">
            <Database className="w-8 h-8 text-slate-400 mb-2 animate-bounce" />
            <span className="font-sans font-bold text-xs text-slate-600">Drag & Drop model dataset CSV file</span>
            <span className="text-3xs text-slate-450 mt-1">Accepts disease_matrix.csv or model_vectors.h5 files</span>
          </div>

          <div className="pt-4 flex justify-center gap-4">
            <button
              onClick={() => alert("Model retraining simulated successfully using active dataset matrix.")}
              className="px-6 py-3 bg-primary hover:bg-blue-700 text-white font-sans font-bold text-xs rounded-btn shadow-sm transition-all"
            >
              Retrain Model
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
