import { useState, useEffect } from 'react'
import {
  Droplet,
  Moon,
  Footprints,
  Plus,
  RefreshCw,
  Sparkles,
  Award
} from 'lucide-react'

export default function WellnessDashboard() {
  // Initialize trackers from localStorage or default values
  const [water, setWater] = useState(() => {
    const val = localStorage.getItem('wellness_water')
    return val ? parseInt(val) : 750 // Default ml
  })
  
  const [sleep, setSleep] = useState(() => {
    const val = localStorage.getItem('wellness_sleep')
    return val ? parseFloat(val) : 6.5 // Default hours
  })

  const [exercise, setExercise] = useState(() => {
    const val = localStorage.getItem('wellness_exercise')
    return val ? parseInt(val) : 15 // Default minutes
  })

  // Persistence hooks
  useEffect(() => {
    localStorage.setItem('wellness_water', String(water))
  }, [water])

  useEffect(() => {
    localStorage.setItem('wellness_sleep', String(sleep))
  }, [sleep])

  useEffect(() => {
    localStorage.setItem('wellness_exercise', String(exercise))
  }, [exercise])

  const resetDailyLogs = () => {
    setWater(0)
    setSleep(0)
    setExercise(0)
  }

  // Goal metrics
  const waterGoal = 2000 // 2L
  const sleepGoal = 8.0 // 8 hours
  const exerciseGoal = 30 // 30 minutes

  const waterPercentage = Math.min((water / waterGoal) * 100, 100)
  const sleepPercentage = Math.min((sleep / sleepGoal) * 100, 100)
  const exercisePercentage = Math.min((exercise / exerciseGoal) * 100, 100)

  // Radar circle coordinates for circular trackers
  const circleRadius = 40
  const circleCircumference = 2 * Math.PI * circleRadius

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-display font-bold text-lg text-slate-800 tracking-tight">Personalized Wellness Hub</h3>
          <p className="font-sans text-2xs text-slate-400">Track and optimize daily physiological behaviors.</p>
        </div>
        <button
          onClick={resetDailyLogs}
          className="p-2 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-500 rounded-btn transition-all text-xs font-semibold flex items-center gap-1.5"
          title="Reset daily limits"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card 1: Water Intake */}
        <div className="glass-panel bg-white border border-slate-200/50 rounded-card p-6 overflow-hidden relative min-h-[190px] flex flex-col justify-between">
          <div className="z-10">
            <div className="flex justify-between items-start">
              <span className="p-2.5 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Droplet className="w-5 h-5" />
              </span>
              <span className="text-3xs font-bold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Goal: 2L
              </span>
            </div>
            <div className="mt-4">
              <h4 className="font-display font-extrabold text-slate-800 text-2xl">{water} <span className="text-xs font-normal text-slate-450">ml</span></h4>
              <p className="font-sans text-3xs text-slate-400 mt-0.5">Hydration status: {waterPercentage.toFixed(0)}% reached</p>
            </div>
          </div>

          <div className="flex gap-2 z-10 pt-4">
            <button
              onClick={() => setWater(prev => prev + 250)}
              className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-sans font-bold text-2xs rounded-btn transition-colors flex items-center justify-center gap-1"
            >
              <Plus className="w-3 h-3" /> 250ml
            </button>
            <button
              onClick={() => setWater(prev => prev + 500)}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold text-2xs rounded-btn shadow-sm transition-colors flex items-center justify-center gap-1"
            >
              <Plus className="w-3 h-3" /> 500ml
            </button>
          </div>

          {/* Water wave background fill */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-blue-500/10 transition-all duration-500 ease-out z-0 pointer-events-none"
            style={{ height: `${waterPercentage}%` }}
          />
        </div>

        {/* Card 2: Sleep Tracker */}
        <div className="glass-panel bg-white border border-slate-200/50 rounded-card p-6 min-h-[190px] flex flex-col justify-between relative">
          <div>
            <div className="flex justify-between items-start">
              <span className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Moon className="w-5 h-5" />
              </span>
              <span className="text-3xs font-bold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Goal: 8h
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <h4 className="font-display font-extrabold text-slate-800 text-2xl">{sleep} <span className="text-xs font-normal text-slate-450">hrs</span></h4>
                <p className="font-sans text-3xs text-slate-400 mt-0.5">Sleep index: {sleepPercentage.toFixed(0)}% optimal</p>
              </div>

              {/* Progress Circle */}
              <svg className="w-16 h-16 transform -rotate-95 overflow-visible">
                <circle
                  cx="32"
                  cy="32"
                  r={circleRadius}
                  className="stroke-slate-100 fill-none"
                  strokeWidth="6"
                />
                <circle
                  cx="32"
                  cy="32"
                  r={circleRadius}
                  className="stroke-indigo-600 fill-none transition-all duration-500 ease-out"
                  strokeWidth="6"
                  strokeDasharray={circleCircumference}
                  strokeDashoffset={circleCircumference - (sleepPercentage / 100) * circleCircumference}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              onClick={() => setSleep(prev => Math.max(0, prev - 0.5))}
              className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-sans font-bold text-2xs rounded-btn transition-colors"
            >
              - 30m
            </button>
            <button
              onClick={() => setSleep(prev => prev + 0.5)}
              className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-bold text-2xs rounded-btn shadow-sm transition-colors"
            >
              + 30m
            </button>
          </div>
        </div>

        {/* Card 3: Active Exercise */}
        <div className="glass-panel bg-white border border-slate-200/50 rounded-card p-6 min-h-[190px] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <span className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Footprints className="w-5 h-5" />
              </span>
              <span className="text-3xs font-bold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Goal: 30m
              </span>
            </div>
            <div className="mt-4">
              <h4 className="font-display font-extrabold text-slate-800 text-2xl">{exercise} <span className="text-xs font-normal text-slate-450">mins</span></h4>
              <p className="font-sans text-3xs text-slate-400 mt-0.5">Cardio metric: {exercisePercentage.toFixed(0)}% completed</p>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              onClick={() => setExercise(prev => Math.max(0, prev - 5))}
              className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-sans font-bold text-2xs rounded-btn transition-colors"
            >
              - 5 min
            </button>
            <button
              onClick={() => setExercise(prev => prev + 5)}
              className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-2xs rounded-btn shadow-sm transition-colors"
            >
              + 5 min
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic AI Wellness Tips Banner */}
      <div className="p-4.5 bg-linear-to-r from-primary/5 to-teal/5 border border-primary/10 rounded-card flex items-start gap-3">
        <Sparkles className="w-5.5 h-5.5 text-primary shrink-0 mt-0.5 animate-pulse" />
        <div className="font-sans text-xs">
          <span className="font-bold text-slate-800 flex items-center gap-1">
            <Award className="w-4 h-4 text-yellow-500" /> AI Wellness Recommendations:
          </span>
          <ul className="list-disc list-inside text-slate-500 mt-1 space-y-1">
            {waterPercentage < 100 && (
              <li>Your hydration is low today. Sip another <b>{waterGoal - water}ml</b> to boost metabolic filtering.</li>
            )}
            {sleepPercentage < 100 && (
              <li>Sleep deficiency logs detected. Try prioritizing an extra <b>{(sleepGoal - sleep).toFixed(1)} hrs</b> tonight.</li>
            )}
            {exercisePercentage < 100 && (
              <li>Your cardio target is active. Log another <b>{exerciseGoal - exercise} mins</b> of brisk walking.</li>
            )}
            {waterPercentage >= 100 && sleepPercentage >= 100 && exercisePercentage >= 100 && (
              <li className="text-teal font-semibold">Perfect alignment! All baseline wellness goals are fully unlocked today.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
