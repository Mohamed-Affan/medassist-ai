import { useState } from 'react'
import axios from 'axios'
import {
  Camera,
  Upload,
  Activity,
  RefreshCw,
  UserCheck,
  CheckCircle,
  Eye
} from 'lucide-react'

interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
}

interface HeatmapPoint {
  x: number
  y: number
  val: number
}

interface ScannerResult {
  condition: string
  description: string
  confidence: number
  severity: string
  specialist: string
  precautions: string[]
  bounding_box: BoundingBox
  activations: HeatmapPoint[]
}

export default function ImageScanner() {
  const [scanType, setScanType] = useState('skin')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [scanStep, setScanStep] = useState('idle') // idle, loading, result
  const [result, setResult] = useState<ScannerResult | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
      setResult(null)
      setScanStep('idle')
    }
  }

  const handleUpload = async () => {
    if (!imageFile) {
      alert('Please upload an image file first.')
      return
    }

    setLoading(true)
    setScanStep('loading')
    
    // Simulate neural layer steps
    const steps = [
      'Initializing image tensor dimensions...',
      'Running Conv2D layer features activation maps...',
      'Activating MaxPooling2D feature reduction...',
      'Executing Softmax Dense classification layers...'
    ]
    
    let currentStepIdx = 0
    const stepInterval = setInterval(() => {
      if (currentStepIdx < steps.length - 1) {
        currentStepIdx++
      }
    }, 900)

    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('file', imageFile)

    try {
      const response = await axios.post(
        'http://localhost:8000/api/v1/scanner/upload',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Scan-Type': scanType,
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      
      clearInterval(stepInterval)
      // Slight artificial buffer for visual polish
      setTimeout(() => {
        setResult(response.data)
        setScanStep('result')
        setLoading(false)
      }, 3000)
      
    } catch (err) {
      clearInterval(stepInterval)
      console.error('Inference scanner failed', err)
      alert('Failed to execute computer vision scan. Ensure server is online.')
      setScanStep('idle')
      setLoading(false)
    }
  }

  const handleReset = () => {
    setImageFile(null)
    setImagePreview(null)
    setResult(null)
    setScanStep('idle')
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10 animate-fade-in">
      {/* Title */}
      <div className="border-b border-slate-200/50 pb-6">
        <h2 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
          Medical Image Scanner
        </h2>
        <p className="font-sans text-slate-500 text-sm mt-1">
          Upload skin, nail, or throat images for simulated CNN computer vision analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Side: Upload Panel / Preview */}
        <div className="lg:col-span-7 space-y-8">
          <div className="glass-panel p-8 bg-white space-y-6">
            <h3 className="font-display font-bold text-lg text-slate-800 tracking-tight">
              1. Choose Scanning Category
            </h3>
            
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'skin', label: 'Skin / Rash', desc: 'Eczema or dermatitis' },
                { id: 'nails', label: 'Nails', desc: 'Fungal detection' },
                { id: 'tongue', label: 'Tongue / Throat', desc: 'Pharyngitis checks' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setScanType(item.id)
                    setResult(null)
                    setScanStep('idle')
                  }}
                  className={`p-4 border rounded-btn text-center transition-all cursor-pointer ${scanType === item.id ? 'bg-primary/5 border-primary text-primary shadow-sm' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
                >
                  <span className="font-display font-bold text-sm block">{item.label}</span>
                  <span className="font-sans text-2xs text-slate-400 mt-1 block">{item.desc}</span>
                </button>
              ))}
            </div>

            <h3 className="font-display font-bold text-lg text-slate-800 tracking-tight pt-2">
              2. Upload Target Image
            </h3>

            {!imagePreview ? (
              /* Drag-drop box */
              <label className="border-2 border-dashed border-slate-200 hover:border-primary/50 hover:bg-primary/2 rounded-card p-12 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[250px]">
                <Upload className="w-12 h-12 text-slate-400 mb-4 animate-bounce" />
                <span className="font-display font-bold text-slate-800 text-sm">Select scan image</span>
                <span className="font-sans text-xs text-slate-400 mt-1">Supports PNG, JPG, JPEG up to 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              /* Interactive Preview and Overlay Wrapper */
              <div className="space-y-4">
                <div className="relative border border-slate-200 rounded-card overflow-hidden bg-slate-900 max-h-[450px] flex items-center justify-center">
                  <img
                    src={imagePreview}
                    alt="Scan preview"
                    className="max-h-[450px] w-auto object-contain block opacity-90"
                  />

                  {/* Absolute Bounding Box Overlay */}
                  {scanStep === 'result' && result && (
                    <div
                      className="absolute border-[3px] border-danger rounded-xs shadow-lg shadow-danger/25 animate-pulse"
                      style={{
                        left: `${result.bounding_box.x}%`,
                        top: `${result.bounding_box.y}%`,
                        width: `${result.bounding_box.width}%`,
                        height: `${result.bounding_box.height}%`,
                      }}
                    >
                      <span className="absolute -top-6 left-0 bg-danger text-white font-display font-bold text-[9px] px-2 py-0.5 rounded-sm uppercase tracking-wider whitespace-nowrap shadow-md">
                        Region of Concern ({result.confidence}% match)
                      </span>
                    </div>
                  )}

                  {/* Absolute CNN Activation Map Heatmap Dots */}
                  {scanStep === 'result' && result && result.activations.map((pt, idx) => (
                    <div
                      key={idx}
                      className="absolute w-5 h-5 bg-radial from-red-500 to-transparent rounded-full flex items-center justify-center"
                      style={{
                        left: `${pt.x}%`,
                        top: `${pt.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleReset}
                    className="flex-1 py-3 border border-slate-200 rounded-btn font-sans font-semibold text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Clear Image
                  </button>
                  {scanStep !== 'result' && (
                    <button
                      onClick={handleUpload}
                      disabled={loading}
                      className="flex-1 py-3 bg-primary hover:bg-blue-600 text-white font-sans font-bold text-sm rounded-btn transition-colors flex items-center justify-center gap-2"
                    >
                      <Activity className="w-4 h-4" /> Run CNN Diagnosis
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: CNN Processing Stats / Diagnosis Results */}
        <div className="lg:col-span-5">
          {scanStep === 'idle' && (
            <div className="glass-panel p-10 bg-white text-center flex flex-col items-center justify-center min-h-[350px]">
              <Camera className="w-12 h-12 text-slate-300 mb-4" />
              <h4 className="font-display font-bold text-slate-800 text-base">Waiting for Scan</h4>
              <p className="font-sans text-slate-400 text-xs mt-1.5 max-w-xs leading-relaxed">
                Choose a category on the left, upload a target image, and run the neural diagnostic check.
              </p>
            </div>
          )}

          {scanStep === 'loading' && (
            /* Live neural logging */
            <div className="glass-panel p-8 bg-slate-950 text-emerald-400 font-mono text-xs space-y-4 min-h-[350px] shadow-lg shadow-slate-900/10 border border-slate-900">
              <div className="flex items-center gap-2 text-white border-b border-slate-800 pb-3">
                <RefreshCw className="w-4 h-4 animate-spin text-teal" />
                <span className="font-semibold uppercase tracking-wider text-[10px]">CNN Execution Log</span>
              </div>
              <div className="space-y-2">
                <p>&gt; Loading tensorflow models...</p>
                <p>&gt; Initializing image tensor dimension mapping...</p>
                <p className="animate-pulse">&gt; Processing Conv2D Layer 1 activation map...</p>
                <p className="text-slate-500">&gt; MaxPooling2D reduction layers...</p>
                <p className="text-slate-500">&gt; Computing Softmax dense confidence scores...</p>
              </div>
            </div>
          )}

          {scanStep === 'result' && result && (
            <div className="space-y-6">
              {/* Condition diagnosis card */}
              <div className="glass-panel p-8 bg-white border border-teal/20 shadow-md">
                <span className="text-2xs font-bold text-teal bg-teal/5 px-2.5 py-1 rounded-full border border-teal/20 uppercase tracking-wide">
                  Estimated Condition
                </span>
                <h3 className="font-display font-extrabold text-2xl text-slate-900 mt-2.5 tracking-tight">
                  {result.condition}
                </h3>
                <p className="font-sans text-slate-500 text-xs mt-1 leading-relaxed">
                  {result.description}
                </p>

                {/* Score bar */}
                <div className="space-y-2 pt-6">
                  <div className="flex justify-between font-sans text-2xs font-semibold text-slate-400">
                    <span>Clinical Match Confidence</span>
                    <span className="text-primary font-bold">{result.confidence}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-primary to-teal rounded-full"
                      style={{ width: `${result.confidence}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Precautions list */}
              <div className="glass-panel p-8 bg-white space-y-4">
                <h4 className="font-display font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Eye className="w-5 h-5 text-primary" /> Specialist Recommendations
                </h4>
                <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-btn flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-display font-bold text-slate-800 text-xs">Consult a Specialist</h5>
                    <p className="font-sans text-xs text-slate-500 mt-0.5">Recommended doctor: <b>{result.specialist}</b></p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h5 className="font-display font-bold text-slate-700 text-xs">Action Plan & Care Guidelines:</h5>
                  <ul className="space-y-2.5">
                    {result.precautions.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs font-sans text-slate-600 leading-relaxed">
                        <CheckCircle className="w-4.5 h-4.5 shrink-0 text-teal mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
