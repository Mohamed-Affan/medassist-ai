import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Activity,
  User,
  Heart,
  ChevronRight,
  ChevronLeft,
  Search,
  X,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download
} from 'lucide-react'
import SymptomBodyMap from '../components/SymptomBodyMap'

// Pydantic matching interface
interface Prediction {
  name: string
  description: string
  confidence: number
  severity: string
  doctor_specialty: string
  precautions: string[]
}

interface AssessmentResult {
  prediction_id: string
  predictions: Prediction[]
  is_emergency: boolean
  explainability: {
    primary_matched: string[]
    primary_missing: string[]
    reasoning: string
  }
  preventive_care: {
    diet_foods_to_eat: string[]
    diet_foods_to_avoid: string[]
    exercise_advice: string
    water_target: string
    sleep_target: string
    general_tips: string[]
  }
}

export default function SymptomAssessment() {
  const [step, setStep] = useState(1)
  const [dbSymptoms, setDbSymptoms] = useState<string[]>([])
  
  // Form State
  const [age, setAge] = useState('25')
  const [gender, setGender] = useState('male')
  const [height, setHeight] = useState('175')
  const [weight, setWeight] = useState('70')
  const [painLevel, setPainLevel] = useState(5)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [durationDays, setDurationDays] = useState(3)
  const [medicalHistory, setMedicalHistory] = useState<string[]>([])
  const [smoking, setSmoking] = useState('no')
  const [alcohol, setAlcohol] = useState('no')
  
  // Search & Results state
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Fetch symptom options on mount
  useEffect(() => {
    const fetchSymptoms = async () => {
      const token = localStorage.getItem('token')
      try {
        const response = await axios.get('http://localhost:8000/api/v1/assessment/symptoms', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setDbSymptoms(response.data)
      } catch (err) {
        console.error('Failed to load symptoms list', err)
      }
    }
    fetchSymptoms()
  }, [])

  // Handle Autocomplete
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([])
      return
    }
    const filtered = dbSymptoms.filter(
      (s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !selectedSymptoms.includes(s)
    )
    setSuggestions(filtered)
  }, [searchQuery, dbSymptoms, selectedSymptoms])

  // BMI Calculator
  const getBmi = () => {
    const h = parseFloat(height) / 100
    const w = parseFloat(weight)
    if (!h || !w) return { score: 0, text: 'N/A', color: 'text-slate-400' }
    const score = parseFloat((w / (h * h)).toFixed(1))
    
    if (score < 18.5) return { score, text: 'Underweight', color: 'text-yellow-600' }
    if (score < 25) return { score, text: 'Normal weight', color: 'text-teal' }
    if (score < 30) return { score, text: 'Overweight', color: 'text-yellow-600' }
    return { score, text: 'Obese', color: 'text-danger' }
  }

  const bmi = getBmi()

  const handleSymptomSelect = (symptom: string) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom])
    }
    setSearchQuery('')
    setSuggestions([])
  }

  const handleSymptomRemove = (symptom: string) => {
    setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom))
  }

  const toggleHistory = (condition: string) => {
    if (medicalHistory.includes(condition)) {
      setMedicalHistory(medicalHistory.filter((c) => c !== condition))
    } else {
      setMedicalHistory([...medicalHistory, condition])
    }
  }

  const handleReset = () => {
    setStep(1)
    setResult(null)
    setSelectedSymptoms([])
    setMedicalHistory([])
    setPainLevel(5)
    setDurationDays(3)
  }

  const handleSubmit = async () => {
    if (selectedSymptoms.length === 0) {
      alert('Please select at least one symptom before submitting.')
      return
    }

    setSubmitting(true)
    const token = localStorage.getItem('token')

    try {
      const payload = {
        age: parseInt(age),
        gender,
        height: parseFloat(height),
        weight: parseFloat(weight),
        pain_level: painLevel,
        symptoms: selectedSymptoms,
        duration_days: durationDays,
        medical_history: medicalHistory,
        lifestyle_smoking: smoking,
        lifestyle_alcohol: alcohol,
      }

      const response = await axios.post(
        'http://localhost:8000/api/v1/assessment/submit',
        payload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      
      setResult(response.data)
      setStep(5)
    } catch (err) {
      console.error('Failed to submit assessment', err)
      alert('Failed to process diagnosis. Please verify your server connections.')
    } finally {
      setSubmitting(false)
    }
  }

  const downloadPdf = async () => {
    if (!result) return
    const token = localStorage.getItem('token')

    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/assessment/report/${result.prediction_id}/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      )
      
      const file = new Blob([response.data], { type: 'application/pdf' })
      const fileURL = URL.createObjectURL(file)
      const link = document.createElement('a')
      link.href = fileURL
      link.setAttribute('download', `health_report_${result.prediction_id.substring(0, 8)}.pdf`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('PDF download error', err)
      alert('Failed to compile and download health report.')
    }
  }

  // Label helpers for slider
  const getPainLabel = (val: number) => {
    if (val <= 3) return { text: 'Mild / Bearable', color: 'bg-teal/10 text-teal border-teal/20' }
    if (val <= 6) return { text: 'Moderate / Heavy discomfort', color: 'bg-yellow-50 text-yellow-800 border-yellow-200' }
    if (val <= 8) return { text: 'Severe Pain', color: 'bg-danger/10 text-danger border-danger/20' }
    return { text: 'Critical Emergency Triage level', color: 'bg-red-600 text-white border-red-700 animate-pulse' }
  }

  const painLabel = getPainLabel(painLevel)

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10 animate-fade-in">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-200/50 pb-6">
        <div>
          <h2 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
            AI Symptom Assessment
          </h2>
          <p className="font-sans text-slate-500 text-sm mt-1">
            Complete the multi-step diagnostics wizard for risk prediction.
          </p>
        </div>
        {step < 5 && (
          <div className="font-display text-sm font-semibold px-4 py-2 bg-slate-100 rounded-full text-slate-600 border border-slate-200">
            Step {step} of 4
          </div>
        )}
      </div>

      {submitting ? (
        /* Neural loading engine */
        <div className="glass-panel p-20 bg-white flex flex-col items-center justify-center text-center space-y-6">
          <Activity className="w-16 h-16 text-primary animate-pulse" />
          <h3 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">
            Analyzing Diagnostic Profile...
          </h3>
          <p className="font-sans text-slate-600 max-w-md leading-relaxed">
            Our ML neural engine is analyzing your biometric indicators, symptom logs, and history database to estimate risk probabilities.
          </p>
          <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden relative">
            <div className="absolute top-0 bottom-0 left-0 bg-primary w-2/3 rounded-full animate-bounce"></div>
          </div>
        </div>
      ) : (
        /* Progress wizard tabs */
        <div className="space-y-8">
          {/* Step 1: Biometrics */}
          {step === 1 && (
            <div className="glass-panel p-10 bg-white space-y-8">
              <h3 className="font-display font-bold text-xl text-slate-800 mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-primary" />
                Step 1: Biometric & Lifestyle Logs
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-input focus:border-primary focus:ring-1 focus:ring-primary outline-hidden text-slate-850"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Biological Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-input focus:border-primary focus:ring-1 focus:ring-primary outline-hidden text-slate-850"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Height (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-input focus:border-primary focus:ring-1 focus:ring-primary outline-hidden text-slate-850"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-input focus:border-primary focus:ring-1 focus:ring-primary outline-hidden text-slate-850"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Smoking Habit</label>
                  <select
                    value={smoking}
                    onChange={(e) => setSmoking(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-input focus:border-primary focus:ring-1 focus:ring-primary outline-hidden text-slate-850"
                  >
                    <option value="no">Non-smoker</option>
                    <option value="occasionally">Occasionally</option>
                    <option value="heavy">Heavy Smoker</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Alcohol Intake</label>
                  <select
                    value={alcohol}
                    onChange={(e) => setAlcohol(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-input focus:border-primary focus:ring-1 focus:ring-primary outline-hidden text-slate-850"
                  >
                    <option value="no">Non-drinker</option>
                    <option value="socially">Social drinker</option>
                    <option value="heavy">Heavy drinker</option>
                  </select>
                </div>
              </div>

              {/* BMI Output */}
              <div className="p-6 bg-slate-50 rounded-card flex items-center justify-between border border-slate-200/50 mt-6">
                <div>
                  <h4 className="font-display font-bold text-slate-800 text-sm">Calculated Body Mass Index (BMI)</h4>
                  <p className="font-sans text-xs text-slate-500 mt-0.5">Calculated using height and weight metrics.</p>
                </div>
                <div className="text-right">
                  <div className="font-display font-extrabold text-2xl text-slate-900">{bmi.score}</div>
                  <div className={`font-sans font-bold text-sm ${bmi.color}`}>{bmi.text}</div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Symptoms Selection */}
          {step === 2 && (
            <div className="glass-panel p-10 bg-white space-y-8">
              <h3 className="font-display font-bold text-xl text-slate-800 mb-6 flex items-center gap-2">
                <Search className="w-6 h-6 text-primary" />
                Step 2: Log Symptoms
              </h3>

              <SymptomBodyMap
                onSymptomSelect={handleSymptomSelect}
                onSymptomRemove={handleSymptomRemove}
                selectedSymptoms={selectedSymptoms}
              />

              {/* Autocomplete Search input */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700">Search and Add Symptoms</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Type symptom (e.g. Fever, Cough, Headache)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-input focus:border-primary outline-hidden text-slate-855"
                  />
                  {/* Suggestion box */}
                  {suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-card shadow-lg max-h-56 overflow-y-auto z-50">
                      {suggestions.map((symptom) => (
                        <button
                          key={symptom}
                          type="button"
                          onClick={() => handleSymptomSelect(symptom)}
                          className="w-full px-5 py-3.5 text-left font-sans text-sm hover:bg-primary/5 hover:text-primary border-b border-slate-100 last:border-0 transition-colors"
                        >
                          {symptom}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Selected symptoms capsules */}
              {selectedSymptoms.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-display font-semibold text-sm text-slate-600">Selected Symptoms</h4>
                  <div className="flex flex-wrap gap-2.5">
                    {selectedSymptoms.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary/10 border border-primary/20 text-primary rounded-full font-sans font-medium text-sm"
                      >
                        {s}
                        <button
                          type="button"
                          onClick={() => handleSymptomRemove(s)}
                          className="hover:text-danger transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Pain scale and Duration sliders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">Duration (Days)</label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={durationDays}
                    onChange={(e) => setDurationDays(parseInt(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>1 day</span>
                    <span className="font-semibold text-primary">{durationDays} days</span>
                    <span>30 days</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">Pain Severity Scale</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={painLevel}
                    onChange={(e) => setPainLevel(parseInt(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Mild (1)</span>
                    <span className="font-semibold text-primary">Score: {painLevel}</span>
                    <span>Unbearable (10)</span>
                  </div>
                  {/* Severity Badge indicator */}
                  <div className={`mt-2 p-3 text-xs font-semibold rounded-btn border text-center ${painLabel.color}`}>
                    {painLabel.text}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Pre-existing Conditions */}
          {step === 3 && (
            <div className="glass-panel p-10 bg-white space-y-8">
              <h3 className="font-display font-bold text-xl text-slate-800 mb-6 flex items-center gap-2">
                <Heart className="w-6 h-6 text-primary" />
                Step 3: Medical History
              </h3>

              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Pre-existing Health Conditions</label>
                <div className="grid sm:grid-cols-2 gap-4">
                  {['Diabetes', 'Asthma', 'Hypertension', 'Heart Disease', 'Allergies', 'Pregnancy'].map((condition) => {
                    const active = medicalHistory.includes(condition)
                    return (
                      <button
                        key={condition}
                        type="button"
                        onClick={() => toggleHistory(condition)}
                        className={`p-4 border rounded-btn text-left font-sans text-sm font-semibold transition-all flex items-center justify-between ${active ? 'bg-primary/5 border-primary text-primary' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
                      >
                        {condition}
                        <input
                          type="checkbox"
                          checked={active}
                          readOnly
                          className="w-4 h-4 rounded-xs border-slate-350 accent-primary"
                        />
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="glass-panel p-10 bg-white space-y-8">
              <h3 className="font-display font-bold text-xl text-slate-800 mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-primary" />
                Step 4: Review Answers
              </h3>

              <div className="space-y-6">
                {/* Answers Table */}
                <div className="border border-slate-200 rounded-card overflow-hidden">
                  <table className="w-full border-collapse font-sans text-sm">
                    <tbody>
                      <tr className="border-b border-slate-200">
                        <td className="p-4 bg-slate-50 font-bold text-slate-700 w-1/3">Age / Gender</td>
                        <td className="p-4 text-slate-800">{age} yrs / {gender}</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-4 bg-slate-50 font-bold text-slate-700">Height / Weight (BMI)</td>
                        <td className="p-4 text-slate-800">{height} cm / {weight} kg ({bmi.score} - {bmi.text})</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-4 bg-slate-50 font-bold text-slate-700">Reported Symptoms</td>
                        <td className="p-4 text-slate-800">
                          {selectedSymptoms.length > 0 ? selectedSymptoms.join(', ') : 'None'}
                        </td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-4 bg-slate-50 font-bold text-slate-700">Pain severity / Duration</td>
                        <td className="p-4 text-slate-800">Score {painLevel} / {durationDays} days</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-4 bg-slate-50 font-bold text-slate-700">Medical History</td>
                        <td className="p-4 text-slate-800">
                          {medicalHistory.length > 0 ? medicalHistory.join(', ') : 'None reported'}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-4 bg-slate-50 font-bold text-slate-700">Lifestyle Habits</td>
                        <td className="p-4 text-slate-800">Smoker: {smoking} | Alcohol: {alcohol}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-btn text-yellow-800 text-xs leading-relaxed flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span>By submitting, you consent to having symptoms processed. MedAssist AI predictions are educational guides, not legal medical diagnoses.</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-3.5 border border-slate-200 rounded-btn font-sans font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors flex items-center gap-1.5"
              >
                <ChevronLeft className="w-5 h-5" /> Back
              </button>
            )}
            <div className="ml-auto">
              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-8 py-3.5 bg-primary text-white font-sans font-bold rounded-btn hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-1.5"
                >
                  Continue <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-8 py-3.5 bg-linear-to-r from-primary to-teal text-white font-sans font-bold rounded-btn hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-1.5"
                >
                  Submit for Diagnosis <CheckCircle className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Result View (Explainable AI & Action Plan) */}
      {step === 5 && result && (
        <div className="space-y-10 animate-fade-in">
          {/* Emergency Alert Flashing Badge */}
          {result.is_emergency && (
            <div className="p-6 bg-linear-to-r from-danger to-red-600 border border-red-700 text-white rounded-card shadow-lg shadow-danger/10 flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 shrink-0 text-white animate-bounce" />
              <div>
                <h4 className="font-display font-extrabold text-lg">🚨 Critical Emergency Warning</h4>
                <p className="font-sans text-sm text-red-50 leading-relaxed mt-1">
                  Our triage checks have flagged one or more critical symptom indicators (e.g. chest pain, extreme breath discomfort). Seek immediate medical triage at the nearest 24/7 hospital.
                </p>
              </div>
            </div>
          )}

          {/* Primary Condition Card */}
          <div className="glass-panel p-10 bg-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-slate-200/50 pb-6">
              <div>
                <span className="text-xs font-bold text-teal bg-teal/10 px-3 py-1.5 rounded-full border border-teal/20">Primary Diagnostic Estimate</span>
                <h3 className="font-display font-extrabold text-3xl md:text-4xl text-slate-900 mt-2 tracking-tight">
                  {result.predictions[0].name}
                </h3>
                <p className="font-sans text-slate-500 text-sm mt-1">{result.predictions[0].description}</p>
              </div>
              <div className="text-center bg-slate-50 p-6 rounded-card border border-slate-200/50 w-full md:w-auto min-w-[150px]">
                <div className="font-display font-extrabold text-4xl text-primary">{result.predictions[0].confidence}%</div>
                <div className="font-sans font-bold text-xs text-slate-400 mt-1 uppercase tracking-wider">Confidence</div>
              </div>
            </div>

            {/* Confidence Progress Meter */}
            <div className="space-y-2">
              <div className="flex justify-between font-sans text-xs font-semibold text-slate-500">
                <span>Confidence score threshold</span>
                <span>{result.predictions[0].confidence}% match</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-primary to-teal rounded-full"
                  style={{ width: `${result.predictions[0].confidence}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Explainable AI Dashboard */}
          <div className="glass-panel p-10 bg-white space-y-6">
            <h3 className="font-display font-bold text-xl text-slate-800 border-b border-slate-200/50 pb-4 tracking-tight">
              🧠 Explainable AI (XAI) Diagnosis Analysis
            </h3>
            
            <p className="font-sans text-slate-600 leading-relaxed text-sm bg-slate-50 p-4 border border-slate-200/50 rounded-btn">
              {result.explainability.reasoning}
            </p>

            <div className="grid md:grid-cols-2 gap-8 pt-2">
              {/* Matched symptoms list */}
              <div className="space-y-4">
                <h4 className="font-display font-bold text-slate-700 text-sm flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-teal" /> Matched Symptoms
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.explainability.primary_matched.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1.5 bg-teal/10 border border-teal/20 text-teal rounded-full font-sans text-xs font-semibold"
                    >
                      ✔ {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing symptoms list */}
              <div className="space-y-4">
                <h4 className="font-display font-bold text-slate-700 text-sm flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-danger" /> Missing Indicators (Excluded)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.explainability.primary_missing.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1.5 bg-danger/10 border border-danger/20 text-danger rounded-full font-sans text-xs font-semibold"
                    >
                      ✖ {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Alternate Predictions List */}
          {result.predictions.length > 1 && (
            <div className="glass-panel p-10 bg-white space-y-6">
              <h3 className="font-display font-bold text-xl text-slate-800 border-b border-slate-200/50 pb-4 tracking-tight">
                Alternate Diagnostic Estimates
              </h3>
              <div className="space-y-4">
                {result.predictions.slice(1).map((p, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 border border-slate-200/50 rounded-btn">
                    <div>
                      <h4 className="font-display font-bold text-base text-slate-800">{p.name}</h4>
                      <p className="font-sans text-xs text-slate-500 mt-0.5">{p.description}</p>
                    </div>
                    <div className="font-display font-bold text-lg text-primary">{p.confidence}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preventive care recommendations */}
          <div className="glass-panel p-10 bg-white space-y-8">
            <h3 className="font-display font-bold text-xl text-slate-800 border-b border-slate-200/50 pb-4 tracking-tight">
              🥗 Recommended Preventive Action Plan
            </h3>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Foods to Eat */}
              <div className="space-y-4">
                <h4 className="font-display font-bold text-slate-700 text-sm">Recommended Foods to Eat</h4>
                <div className="grid grid-cols-2 gap-3">
                  {result.preventive_care.diet_foods_to_eat.map((f) => (
                    <div key={f} className="px-3 py-2.5 bg-teal/10 border border-teal/20 text-teal rounded-btn font-sans font-semibold text-xs text-center">
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* Foods to Avoid */}
              <div className="space-y-4">
                <h4 className="font-display font-bold text-slate-700 text-sm">Dietary Items to Avoid</h4>
                <div className="grid grid-cols-2 gap-3">
                  {result.preventive_care.diet_foods_to_avoid.map((f) => (
                    <div key={f} className="px-3 py-2.5 bg-danger/10 border border-danger/20 text-danger rounded-btn font-sans font-semibold text-xs text-center">
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hydration / Sleep Targets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              <div className="p-5 bg-slate-50 border border-slate-200/50 rounded-card text-center">
                <h4 className="font-display font-bold text-xs text-slate-400 uppercase tracking-wider">Hydration Goal</h4>
                <div className="font-display font-extrabold text-xl text-slate-850 mt-1">{result.preventive_care.water_target}</div>
              </div>
              <div className="p-5 bg-slate-50 border border-slate-200/50 rounded-card text-center">
                <h4 className="font-display font-bold text-xs text-slate-400 uppercase tracking-wider">Daily Sleep Target</h4>
                <div className="font-display font-extrabold text-xl text-slate-850 mt-1">{result.preventive_care.sleep_target}</div>
              </div>
              <div className="p-5 bg-slate-50 border border-slate-200/50 rounded-card text-center">
                <h4 className="font-display font-bold text-xs text-slate-400 uppercase tracking-wider">Exercise Guideline</h4>
                <div className="font-sans font-semibold text-xs text-slate-600 mt-2 leading-relaxed">
                  {result.preventive_care.exercise_advice}
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons (Reset & PDF download) */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
            <button
              onClick={handleReset}
              className="px-6 py-3.5 border border-slate-200 rounded-btn font-sans font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-all text-center"
            >
              Start New Assessment
            </button>
            <button
              onClick={downloadPdf}
              className="px-8 py-3.5 bg-linear-to-r from-primary to-teal text-white font-sans font-bold rounded-btn shadow-md hover:shadow-lg hover:shadow-primary/30 transition-all transform hover:-translate-y-[1px] flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download PDF Report
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
