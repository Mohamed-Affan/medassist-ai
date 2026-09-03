import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  User,
  Phone,
  Calendar,
  Layers,
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface SettingsProps {
  onProfileUpdate?: (updatedUser: any) => void
}

export default function Settings({ onProfileUpdate }: SettingsProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('male')
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch current user details on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token')
      try {
        const response = await axios.get('http://localhost:8000/api/v1/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = response.data
        setName(data.name || '')
        setPhone(data.phone || '')
        setAge(data.age ? String(data.age) : '')
        setGender(data.gender || 'male')
      } catch (err) {
        console.error('Failed to load profile settings', err)
        setError('Failed to fetch profile settings.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Name is a required field.')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(false)
    const token = localStorage.getItem('token')

    try {
      const payload = {
        name,
        phone: phone || null,
        age: age ? parseInt(age) : null,
        gender
      }

      const response = await axios.put('http://localhost:8000/api/v1/auth/profile', payload, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setSuccess(true)
      if (onProfileUpdate) {
        onProfileUpdate(response.data)
      }
      // Hide success banner after 4 seconds
      setTimeout(() => setSuccess(false), 4000)
    } catch (err) {
      console.error('Failed to update profile settings', err)
      setError('Failed to save profile changes. Verify server connections.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 font-sans">
        <Layers className="w-10 h-10 text-primary animate-pulse" />
        <span className="text-slate-400 font-semibold text-sm">Fetching settings data...</span>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10 animate-fade-in">
      {/* Title */}
      <div className="border-b border-slate-200/50 pb-6">
        <h2 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
          Profile Settings
        </h2>
        <p className="font-sans text-slate-500 text-sm mt-1">
          Configure your personal diagnostic baseline metrics and contact information.
        </p>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-4 bg-teal/10 border border-teal/20 text-teal rounded-btn font-sans text-sm font-semibold flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>Success: Your health profile baseline has been updated.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-danger/10 border border-danger/20 text-danger rounded-btn font-sans text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>Error: {error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Left Card: Baseline Forms */}
        <div className="md:col-span-8 space-y-8">
          <div className="glass-panel p-10 bg-white space-y-6">
            <h3 className="font-display font-bold text-lg text-slate-800 border-b border-slate-100 pb-3 tracking-tight">
              Biometric & Account Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-input focus:border-primary outline-hidden text-sm text-slate-850 font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-input focus:border-primary outline-hidden text-sm text-slate-850 font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Baseline Age</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-input focus:border-primary outline-hidden text-sm text-slate-850 font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-input focus:border-primary outline-hidden text-sm text-slate-850 font-semibold"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 bg-primary hover:bg-blue-600 text-white font-sans font-bold text-sm rounded-btn shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-1.5"
            >
              <Save className="w-4.5 h-4.5" /> {saving ? 'Saving changes...' : 'Save Settings'}
            </button>
          </div>
        </div>

        {/* Right Card: Security Notice */}
        <div className="md:col-span-4">
          <div className="glass-panel p-8 bg-white border border-slate-200/50 space-y-4">
            <h4 className="font-display font-bold text-slate-800 text-sm">Clinical Baselines</h4>
            <p className="font-sans text-xs text-slate-500 leading-relaxed">
              These baselines are used as initial coefficients inside the ML matching logic when you start a new Symptom Assessment. Keep them updated to ensure optimal diagnosis matching.
            </p>
            <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-btn text-xs font-sans text-slate-600 leading-relaxed">
              Your profile configurations are securely encrypted in transit and stored locally inside transactions.
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
