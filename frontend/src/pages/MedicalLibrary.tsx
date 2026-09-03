import { useState } from 'react'
import {
  BookOpen,
  Search,
  AlertTriangle,
  Heart,
  ChevronRight,
  ShieldCheck,
  Activity
} from 'lucide-react'

// Disease details dictionary
const DISEASE_DATABASE = [
  {
    name: "Influenza (Flu)",
    causes: "Influenza viruses (Types A and B) infecting the respiratory tract.",
    symptoms: "High fever, chills, body aches, dry cough, severe fatigue, sore throat, headache.",
    diet: "Stay hydrated with warm broths and water. Intake citrus fruits (Vitamin C) and ginger tea.",
    prevention: "Annual influenza vaccination, regular hand hygiene, avoiding close contact with sick individuals.",
    complications: "Pneumonia, acute bronchitis, sinus infections, secondary bacterial infections."
  },
  {
    name: "COVID-19",
    causes: "Infection with the SARS-CoV-2 coronavirus.",
    symptoms: "Fever, cough, loss of smell or taste, difficulty breathing, sore throat, body fatigue.",
    diet: "Protein-rich foods, vitamin-dense vegetables, warm fluids, zinc-rich seeds.",
    prevention: "Vaccination, wearing protective masks in high-risk areas, maintaining distance.",
    complications: "Severe acute respiratory syndrome (SARS), lung injury, kidney failure, cardiac stress."
  },
  {
    name: "Migraine",
    causes: "Neurological triggers altering blood flow and nerve signals in the brain.",
    symptoms: "Severe throbbing headache, light/sound sensitivity, nausea, visual aura or blur.",
    diet: "Leafy greens, magnesium-rich nuts, ginger. Avoid aged cheese, red wine, and chocolate.",
    prevention: "Stress management, maintaining consistent sleep cycles, avoiding screen flares.",
    complications: "Status migrainosus (debilitating migraine lasting >72 hours), sleep disturbances."
  },
  {
    name: "Diabetes Type 2",
    causes: "Insulin resistance coupled with progressive pancreatic beta-cell dysfunction.",
    symptoms: "Polydipsia (thirst), polyuria (frequent urination), fatigue, slow-healing cuts.",
    diet: "High-fiber whole grains, legumes, fatty fish (omega-3). Strictly avoid refined sugars.",
    prevention: "Maintaining healthy body weight, daily aerobic walking, balanced carbohydrate portioning.",
    complications: "Retinopathy (vision loss), neuropathy (nerve damage), cardiovascular disease, kidney damage."
  },
  {
    name: "Bronchitis",
    causes: "Inflammation of the bronchial lining, typically following a viral cold.",
    symptoms: "Persistent wet cough, grey/green mucus production, chest tightness, mild fever.",
    diet: "Warm soups, lemon-honey water. Avoid dairy items which tend to thicken secretions.",
    prevention: "Avoiding exposure to chemical fumes and second-hand tobacco smoke.",
    complications: "Secondary bacterial pneumonia, development of chronic obstructive pulmonary disease (COPD)."
  }
]

// Medicine details dictionary
const MEDICINE_DATABASE = [
  {
    generic: "Paracetamol",
    brand: "Tylenol, Panadol, Calpol, PCM",
    drugClass: "Analgesic & Antipyretic (Pain & Fever Reliever)",
    uses: "Relieving mild-to-moderate physical pain and reducing high body temperatures.",
    dosage: "Standard adult dose is 325 mg to 1000 mg every 4 to 6 hours. Do not exceed 4,000 mg (4g) per 24 hours.",
    sideEffects: "Very rare at recommended dosages. Hypersensitivity skin rashes may occur.",
    warnings: "<b>Severe Hepatotoxicity Warning:</b> High doses or mixing with alcohol causes severe liver injury. Always verify if other cold remedies contain paracetamol to avoid double-dosing."
  },
  {
    generic: "Ibuprofen",
    brand: "Advil, Motrin, Nurofen",
    drugClass: "Non-Steroidal Anti-Inflammatory Drug (NSAID)",
    uses: "Reducing inflammatory pain, arthritis discomfort, dental pain, and muscular swelling.",
    dosage: "Standard adult dose is 200 mg to 400 mg every 6 hours with food. Do not exceed 1,200 mg per day without a doctor's advice.",
    sideEffects: "Heartburn, mild stomach discomfort, dizziness, fluid retention.",
    warnings: "Take with meals or milk to protect stomach lining. Contraindicated for patients with active stomach ulcers, renal impairment, or severe heart disease."
  },
  {
    generic: "Metformin",
    brand: "Glucophage, Riomet, Fortamet",
    drugClass: "Biguanide Antidiabetic Agent",
    uses: "First-line oral medication to improve insulin sensitivity and manage Type 2 Diabetes.",
    dosage: "Typically initialized at 500 mg to 850 mg once or twice daily. Maximum dose is 2,550 mg daily.",
    sideEffects: "Mild diarrhea, flatulence, abdominal bloating, metallic taste in mouth.",
    warnings: "Should be taken with meals to reduce stomach sensitivity. Carry quick-acting glucose source in case of hypoglycemic drops."
  },
  {
    generic: "Lisinopril",
    brand: "Zestril, Prinivil",
    drugClass: "ACE (Angiotensin-Converting Enzyme) Inhibitor",
    uses: "Lowering high blood pressure (Hypertension) and managing congestive heart failure.",
    dosage: "Standard initial dose is 5 mg to 10 mg once daily, adjusted based on BP response.",
    sideEffects: "Persistent dry cough, lightheadedness, mild hyperkalemia (high potassium).",
    warnings: "Never stop taking Lisinopril abruptly. Monitor potassium levels. Seek urgent care if you experience swelling of face, lips, or throat (angioedema)."
  }
]

export default function MedicalLibrary() {
  const [activeTab, setActiveTab] = useState<'diseases' | 'medicines'>('diseases')
  const [search, setSearch] = useState('')
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const handleTabChange = (tab: 'diseases' | 'medicines') => {
    setActiveTab(tab)
    setSearch('')
    setExpandedIndex(null)
  }

  // Filter content based on search
  const filteredDiseases = DISEASE_DATABASE.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.symptoms.toLowerCase().includes(search.toLowerCase())
  )

  const filteredMedicines = MEDICINE_DATABASE.filter(m => 
    m.generic.toLowerCase().includes(search.toLowerCase()) || 
    m.brand.toLowerCase().includes(search.toLowerCase()) || 
    m.drugClass.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10 animate-fade-in">
      {/* Header */}
      <div className="border-b border-slate-200/50 pb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-primary" /> Disease & Medicine Library
          </h2>
          <p className="font-sans text-slate-500 text-sm mt-1">
            Browse educational reference guides on common conditions and pharmaceuticals.
          </p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200/80">
          <button
            onClick={() => handleTabChange('diseases')}
            className={`px-5 py-2 rounded-full font-sans text-xs font-bold transition-all ${activeTab === 'diseases' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Diseases
          </button>
          <button
            onClick={() => handleTabChange('medicines')}
            className={`px-5 py-2 rounded-full font-sans text-xs font-bold transition-all ${activeTab === 'medicines' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Medicines
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder={activeTab === 'diseases' ? "Search diseases, symptoms (e.g. Cough, Fever)..." : "Search drug generic name, class (e.g. Paracetamol, Lisinopril)..."}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setExpandedIndex(null)
          }}
          className="w-full pl-10 pr-4 py-3.5 bg-white border border-slate-200 rounded-input focus:border-primary outline-hidden text-sm text-slate-850"
        />
      </div>

      {/* Disease List */}
      {activeTab === 'diseases' && (
        <div className="space-y-4">
          {filteredDiseases.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-sans text-sm">
              No matching diseases found in our encyclopedia.
            </div>
          ) : (
            filteredDiseases.map((d, i) => {
              const expanded = expandedIndex === i
              return (
                <div key={i} className="glass-panel bg-white border border-slate-200/50 overflow-hidden shadow-xs hover:scale-[1.002]">
                  <button
                    onClick={() => setExpandedIndex(expanded ? null : i)}
                    className="w-full p-6 text-left flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-display font-extrabold text-slate-800 text-base">{d.name}</h4>
                        <p className="font-sans text-2xs text-slate-400 mt-0.5">Causes: {d.causes.substring(0, 80)}...</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
                  </button>

                  {expanded && (
                    <div className="border-t border-slate-100 p-6 bg-slate-50/50 space-y-4 font-sans text-sm text-slate-600 leading-relaxed">
                      <div>
                        <h5 className="font-display font-bold text-slate-700 text-xs uppercase tracking-wider mb-1">Causes & Pathology</h5>
                        <p>{d.causes}</p>
                      </div>
                      <div>
                        <h5 className="font-display font-bold text-slate-700 text-xs uppercase tracking-wider mb-1">Characteristic Symptoms</h5>
                        <p>{d.symptoms}</p>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6 pt-2">
                        <div className="bg-teal/5 p-4 rounded-btn border border-teal/15">
                          <h5 className="font-display font-bold text-teal text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                            🥗 Recovery & Nutrition Plan
                          </h5>
                          <p className="text-slate-700 text-xs mt-1">{d.diet}</p>
                        </div>
                        <div className="bg-primary/5 p-4 rounded-btn border border-primary/15">
                          <h5 className="font-display font-bold text-primary text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                            🛡️ Prevention & Prophylaxis
                          </h5>
                          <p className="text-slate-700 text-xs mt-1">{d.prevention}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      )}

      {/* Medicines List */}
      {activeTab === 'medicines' && (
        <div className="space-y-4">
          {filteredMedicines.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-sans text-sm">
              No matching pharmaceuticals found.
            </div>
          ) : (
            filteredMedicines.map((m, i) => {
              const expanded = expandedIndex === i
              return (
                <div key={i} className="glass-panel bg-white border border-slate-200/50 overflow-hidden shadow-xs hover:scale-[1.002]">
                  <button
                    onClick={() => setExpandedIndex(expanded ? null : i)}
                    className="w-full p-6 text-left flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal/10 text-teal flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-display font-extrabold text-slate-800 text-base">{m.generic}</h4>
                        <p className="font-sans text-2xs text-slate-400 mt-0.5">Class: {m.drugClass} | Brands: {m.brand}</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
                  </button>

                  {expanded && (
                    <div className="border-t border-slate-100 p-6 bg-slate-50/50 space-y-4 font-sans text-sm text-slate-600 leading-relaxed">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-display font-bold text-slate-700 text-xs uppercase tracking-wider mb-0.5">Drug Brand Names</h5>
                          <p className="text-slate-800 font-semibold text-xs">{m.brand}</p>
                        </div>
                        <div>
                          <h5 className="font-display font-bold text-slate-700 text-xs uppercase tracking-wider mb-0.5">Therapeutic Class</h5>
                          <p className="text-slate-800 font-semibold text-xs">{m.drugClass}</p>
                        </div>
                      </div>

                      <div className="pt-2">
                        <h5 className="font-display font-bold text-slate-700 text-xs uppercase tracking-wider mb-1">Primary Indicated Uses</h5>
                        <p>{m.uses}</p>
                      </div>

                      <div className="pt-2">
                        <h5 className="font-display font-bold text-slate-700 text-xs uppercase tracking-wider mb-1">General Dosage Information</h5>
                        <p className="text-slate-700 text-xs leading-relaxed">{m.dosage}</p>
                      </div>

                      <div className="pt-2">
                        <h5 className="font-display font-bold text-slate-700 text-xs uppercase tracking-wider mb-1">Potential Side Effects</h5>
                        <p>{m.sideEffects}</p>
                      </div>

                      {/* Warnings Block */}
                      <div className="bg-red-50/70 border border-red-150 p-4 rounded-btn text-red-900 text-xs flex items-start gap-2.5 mt-2">
                        <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                        <div dangerouslySetInnerHTML={{ __html: m.warnings }} />
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      )}

      {/* Strict educational disclaimer */}
      <div className="p-4 bg-slate-100 rounded-btn text-slate-400 text-[10px] leading-relaxed flex items-start gap-2 max-w-3xl mx-auto">
        <Heart className="w-4 h-4 shrink-0 text-slate-300 mt-0.5" />
        <span><b>Disclaimer:</b> The Disease & Medicine Library contains general health reference information for awareness and capstone presentation purposes only. It is not clinical counseling or diagnostic evaluation. Never adjust or start pharmaceutical therapies without direct clearance from a licensed medical professional.</span>
      </div>
    </div>
  )
}
