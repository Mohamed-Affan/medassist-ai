import { useState } from 'react'
import { RotateCw, Sparkles, UserCheck } from 'lucide-react'

interface BodyMapProps {
  onSymptomSelect: (symptom: string) => void
  onSymptomRemove: (symptom: string) => void
  selectedSymptoms: string[]
}

interface RegionSymptoms {
  [key: string]: string[]
}

const REGION_SYMPTOMS: RegionSymptoms = {
  Head: ['Headache', 'Dizziness', 'Fatigue', 'Fever'],
  Eyes: ['Vision Blur', 'Red Eyes'],
  Neck: ['Sore Throat', 'Neck Stiffness'],
  Chest: ['Chest Pain', 'Shortness of Breath', 'Cough', 'Wheezing'],
  Abdomen: ['Nausea', 'Vomiting', 'Stomach Cramps', 'Diarrhea'],
  Back: ['Back Pain', 'Body Pain', 'Spine Discomfort'],
  Arms: ['Body Pain', 'Weakness', 'Joint Stiffness'],
  Legs: ['Body Pain', 'Swelling', 'Joint Pain', 'Numbness']
}

export default function SymptomBodyMap({
  onSymptomSelect,
  onSymptomRemove,
  selectedSymptoms
}: BodyMapProps) {
  const [view, setView] = useState<'front' | 'back'>('front')
  const [activeRegion, setActiveRegion] = useState<string | null>(null)

  const handleRegionClick = (region: string) => {
    setActiveRegion(activeRegion === region ? null : region)
  }

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      onSymptomRemove(symptom)
    } else {
      onSymptomSelect(symptom)
    }
  }

  return (
    <div className="font-sans grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-slate-100 pb-8 mt-4">
      {/* Visual Instruction */}
      <div className="md:col-span-4 flex flex-col justify-between space-y-4">
        <div>
          <h4 className="font-display font-bold text-slate-800 text-sm flex items-center gap-1.5">
            <Sparkles className="w-4.5 h-4.5 text-primary" /> Interactive Symptom Body Map
          </h4>
          <p className="text-2xs text-slate-500 mt-1 leading-relaxed">
            Click on any highlighted muscle or organ hotzone on the body model to reveal and select matching symptoms directly.
          </p>
        </div>

        {/* Front/Back Control */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => {
              setView(view === 'front' ? 'back' : 'front')
              setActiveRegion(null)
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-btn text-xs font-bold transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" /> Toggle Model ({view === 'front' ? 'Rear View' : 'Front View'})
          </button>
        </div>

        {/* Selected symptoms info */}
        {activeRegion && (
          <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-card space-y-3 animate-fade-in">
            <h5 className="font-display font-bold text-slate-700 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-teal" /> {activeRegion} Symptoms
            </h5>
            <div className="flex flex-col gap-2">
              {REGION_SYMPTOMS[activeRegion].map((symptom) => {
                const isActive = selectedSymptoms.includes(symptom)
                return (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => toggleSymptom(symptom)}
                    className={`w-full py-2 px-3 rounded-btn text-left text-xs font-semibold transition-all border ${isActive ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    {isActive ? '✔ ' : '+ '} {symptom}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* SVG Silhouette Grid */}
      <div className="md:col-span-8 flex justify-center items-center relative py-4 bg-slate-50/50 border border-slate-200/40 rounded-card min-h-[320px]">
        <svg
          viewBox="0 0 200 300"
          className="w-48 h-auto overflow-visible select-none drop-shadow-sm"
        >
          {/* Main body boundary silhouette */}
          <path
            d="M 100,20 C 130,20 135,53 125,60 C 120,65 140,80 150,110 C 158,135 152,165 148,175 C 145,180 142,165 138,155 C 130,135 125,140 120,150 C 117,160 120,220 123,260 C 125,280 127,290 121,290 C 115,290 110,270 106,240 C 103,220 97,220 94,240 C 90,270 85,290 79,290 C 73,290 75,280 77,260 C 80,220 83,160 80,150 C 75,140 70,135 62,155 C 58,165 55,180 52,175 C 48,165 42,135 50,110 C 60,80 80,65 75,60 C 65,53 70,20 100,20 Z"
            className="fill-slate-100 stroke-slate-200 stroke-[1.5]"
          />

          {/* HEAD REGION */}
          {view === 'front' && (
            <circle
              cx="100"
              cy="38"
              r="15"
              onClick={() => handleRegionClick('Head')}
              className={`cursor-pointer transition-colors stroke-2 ${activeRegion === 'Head' ? 'fill-primary/30 stroke-primary' : 'fill-slate-300/40 hover:fill-primary/20 stroke-slate-400/80'}`}
            >
              <title>Click Head</title>
            </circle>
          )}

          {/* EYES */}
          {view === 'front' && (
            <g onClick={() => handleRegionClick('Eyes')} className="cursor-pointer">
              <ellipse cx="94" cy="38" rx="2.5" ry="1.5" className="fill-slate-600 hover:fill-primary" />
              <ellipse cx="106" cy="38" rx="2.5" ry="1.5" className="fill-slate-600 hover:fill-primary" />
            </g>
          )}

          {/* NECK */}
          {view === 'front' && (
            <rect
              x="94"
              y="53"
              width="12"
              height="8"
              rx="2"
              onClick={() => handleRegionClick('Neck')}
              className={`cursor-pointer transition-colors stroke-2 ${activeRegion === 'Neck' ? 'fill-primary/30 stroke-primary' : 'fill-slate-300/40 hover:fill-primary/20 stroke-slate-400/80'}`}
            />
          )}

          {/* CHEST */}
          {view === 'front' && (
            <path
              d="M 80,64 L 120,64 L 115,100 L 85,100 Z"
              onClick={() => handleRegionClick('Chest')}
              className={`cursor-pointer transition-colors stroke-2 ${activeRegion === 'Chest' ? 'fill-primary/30 stroke-primary' : 'fill-slate-300/40 hover:fill-primary/20 stroke-slate-400/80'}`}
            />
          )}

          {/* ABDOMEN */}
          {view === 'front' && (
            <path
              d="M 85,100 L 115,100 L 110,136 L 90,136 Z"
              onClick={() => handleRegionClick('Abdomen')}
              className={`cursor-pointer transition-colors stroke-2 ${activeRegion === 'Abdomen' ? 'fill-primary/30 stroke-primary' : 'fill-slate-300/40 hover:fill-primary/20 stroke-slate-400/80'}`}
            />
          )}

          {/* BACK REGION (only visible on rear view) */}
          {view === 'back' && (
            <path
              d="M 80,64 L 120,64 L 110,136 L 90,136 Z"
              onClick={() => handleRegionClick('Back')}
              className={`cursor-pointer transition-colors stroke-2 ${activeRegion === 'Back' ? 'fill-primary/30 stroke-primary' : 'fill-slate-300/40 hover:fill-primary/20 stroke-slate-400/80'}`}
            />
          )}

          {/* ARMS */}
          <path
            d="M 75,64 L 62,110 L 56,135"
            onClick={() => handleRegionClick('Arms')}
            className={`cursor-pointer transition-colors stroke-2 stroke-linecap-round fill-none ${activeRegion === 'Arms' ? 'stroke-primary' : 'stroke-slate-400/80 hover:stroke-primary/50'}`}
          />
          <path
            d="M 125,64 L 138,110 L 144,135"
            onClick={() => handleRegionClick('Arms')}
            className={`cursor-pointer transition-colors stroke-2 stroke-linecap-round fill-none ${activeRegion === 'Arms' ? 'stroke-primary' : 'stroke-slate-400/80 hover:stroke-primary/50'}`}
          />

          {/* LEGS */}
          <path
            d="M 90,136 L 90,210 L 86,260"
            onClick={() => handleRegionClick('Legs')}
            className={`cursor-pointer transition-colors stroke-3 stroke-linecap-round fill-none ${activeRegion === 'Legs' ? 'stroke-primary' : 'stroke-slate-400 hover:stroke-primary/50'}`}
          />
          <path
            d="M 110,136 L 110,210 L 114,260"
            onClick={() => handleRegionClick('Legs')}
            className={`cursor-pointer transition-colors stroke-3 stroke-linecap-round fill-none ${activeRegion === 'Legs' ? 'stroke-primary' : 'stroke-slate-400 hover:stroke-primary/50'}`}
          />
        </svg>

        {/* Hover labels helper */}
        <div className="absolute bottom-4 left-4 text-3xs font-bold text-slate-400 border border-slate-200/50 px-2 py-1 rounded-sm bg-white">
          Active Mode: {view === 'front' ? 'Frontal hotzones' : 'Posterior spine hotzones'}
        </div>
      </div>
    </div>
  )
}
