import { useEffect, useState } from 'react'
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import SymptomAssessment from './SymptomAssessment'
import ImageScanner from './ImageScanner'
import AIChat from './AIChat'
import ReportsHistory from './ReportsHistory'
import Settings from './Settings'
import MedicalLibrary from './MedicalLibrary'
import AdminDashboard from './AdminDashboard'
import WellnessDashboard from '../components/WellnessDashboard'
import { HistoryLineChart, HealthRadarChart } from '../components/TimelineCharts'
import {
  LayoutDashboard,
  Activity,
  Camera,
  MessageSquare,
  FileText,
  Settings as SettingsIcon,
  LogOut,
  User as UserIcon,
  Heart,
  ShieldAlert,
  Menu,
  X,
  Sun,
  Moon,
  BookOpen,
  Eye
} from 'lucide-react'

interface UserProfile {
  id: string
  name: string
  email: string
  age?: number
  gender?: string
  phone?: string
}

export default function DashboardShell() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  })
  const [contrast, setContrast] = useState<'normal' | 'high'>(() => {
    return (localStorage.getItem('contrast') as 'normal' | 'high') || 'normal'
  })
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    localStorage.setItem('theme', theme)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  useEffect(() => {
    localStorage.setItem('contrast', contrast)
    if (contrast === 'high') {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }, [contrast])


  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }

      try {
        const response = await axios.get('http://localhost:8000/api/v1/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setUser(response.data)
      } catch (err) {
        console.error('Failed to fetch profile', err)
        localStorage.removeItem('token')
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <Heart className="w-10 h-10 text-primary animate-pulse" />
          <span className="text-slate-500 font-semibold tracking-wide">Loading health profile...</span>
        </div>
      </div>
    )
  }

  const menuItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Symptom Assessment', path: '/dashboard/symptoms', icon: Activity },
    { name: 'Image Scanner', path: '/dashboard/scanner', icon: Camera },
    { name: 'AI Chat', path: '/dashboard/chat', icon: MessageSquare },
    { name: 'Medical Library', path: '/dashboard/library', icon: BookOpen },
    { name: 'Reports', path: '/dashboard/reports', icon: FileText },
    { name: 'Settings', path: '/dashboard/settings', icon: SettingsIcon },
    { name: 'XAI Admin Lab', path: '/dashboard/admin', icon: ShieldAlert },
  ]

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* Mobile Sidebar Trigger */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed bottom-8 right-8 z-50 p-4 bg-primary text-white rounded-full shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-transform"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col transform transition-transform duration-300 ease-in-out md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:shrink-0 border-r border-slate-800`}>
        {/* Logo Area */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-teal animate-pulse" />
            <span className="font-display font-bold text-xl text-white tracking-tight">MedAssist AI</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Menu Items with increased vertical spacing */}
        <nav className="flex-1 px-4 py-8 space-y-3 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-btn font-medium transition-all transform hover:translate-x-1 ${active ? 'bg-primary text-white shadow-md shadow-primary/20' : 'hover:bg-slate-800 hover:text-white'}`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Card & Logout Section */}
        <div className="p-5 border-t border-slate-850 bg-slate-950/40">
          <div className="flex items-center gap-3 mb-5 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center text-teal font-bold border border-slate-700">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="truncate">
              <div className="text-sm font-semibold text-white truncate">{user?.name}</div>
              <div className="text-xs text-slate-400 truncate">{user?.email}</div>
            </div>
          </div>
          {/* Accessibility & Theme Toggles */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              type="button"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="py-2.5 px-3 border border-slate-800 hover:bg-slate-800 hover:text-white rounded-btn text-3xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all text-slate-400"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-yellow-500" />}
              <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
            </button>
            <button
              type="button"
              onClick={() => setContrast(contrast === 'normal' ? 'high' : 'normal')}
              className={`py-2.5 px-3 border border-slate-800 hover:bg-slate-800 hover:text-white rounded-btn text-3xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all text-slate-400 ${contrast === 'high' ? 'bg-primary/20 text-white border-primary/30' : ''}`}
              title="Toggle High Contrast Mode"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{contrast === 'normal' ? 'Contrast' : 'Normal'}</span>
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 border border-slate-800 rounded-btn text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area with increased padding */}
      <main className="flex-1 min-w-0 overflow-y-auto p-8 md:p-12 lg:p-16">
        <Routes>
          <Route path="/" element={<OverviewTab user={user} />} />
          <Route path="/symptoms" element={<SymptomAssessment />} />
          <Route path="/scanner" element={<ImageScanner />} />
          <Route path="/chat" element={<AIChat />} />
          <Route path="/library" element={<MedicalLibrary />} />
          <Route path="/reports" element={<ReportsHistory />} />
          <Route path="/settings" element={<Settings onProfileUpdate={(updated) => setUser(updated)} />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
    </div>
  )
}

/* Overview Tab Components */
function OverviewTab({ user }: { user: UserProfile | null }) {
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token')
      try {
        const response = await axios.get('http://localhost:8000/api/v1/assessment/history', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setHistory(response.data)
      } catch (err) {
        console.error('Failed to load history in overview', err)
      }
    }
    fetchHistory()
  }, [])

  // Derive latest diagnostics metrics
  const hasHistory = history.length > 0
  const latestRecord = hasHistory ? history[0] : null
  
  // Calculate dynamic health score
  const getHealthScore = () => {
    if (!latestRecord) return 92
    const painPen = latestRecord.pain_level ? latestRecord.pain_level * 4 : 20
    const score = 100 - painPen
    return Math.max(45, score)
  }
  const healthScore = getHealthScore()

  return (
    <div className="w-full max-w-7xl mx-auto space-y-10 animate-fade-in">
      {/* Welcome banner with deep breathing space */}
      <div className="glass-panel p-10 bg-linear-to-r from-primary/10 via-teal/5 to-white border border-primary/20 shadow-md">
        <h2 className="font-display font-extrabold text-3xl md:text-5xl text-slate-900 mb-3 tracking-tight">
          Welcome back, {user?.name}!
        </h2>
        <p className="font-sans text-lg text-slate-600 leading-relaxed max-w-3xl">
          Review your dynamic health stability logs, log daily physiological activities, and verify predictive trends.
        </p>
      </div>

      {/* Grid of core metrics: Wellness & Charts vs Radar & Emergency */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Wellness Tracker & Timeline Line Chart */}
        <div className="lg:col-span-8 space-y-10">
          <WellnessDashboard />
          <HistoryLineChart history={history} />
        </div>

        {/* Right Column: Radar Chart & Emergency Panel */}
        <div className="lg:col-span-4 space-y-10">
          {/* Circular Score Meter Card */}
          <div className="glass-panel bg-white border border-slate-200/50 p-6 rounded-card shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-base text-slate-800 tracking-tight">Health Score</h3>
              <p className="font-sans text-3xs text-slate-400 mt-0.5">Stability assessment coefficient.</p>
            </div>
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90 overflow-visible">
                <circle cx="40" cy="40" r="32" className="stroke-slate-100 fill-none" strokeWidth="5" />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  className="stroke-teal fill-none transition-all duration-500 ease-out"
                  strokeWidth="5"
                  strokeDasharray={2 * Math.PI * 32}
                  strokeDashoffset={2 * Math.PI * 32 - (healthScore / 100) * 2 * Math.PI * 32}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute font-display font-extrabold text-xl text-teal">{healthScore}</span>
            </div>
          </div>

          <HealthRadarChart
            history={history}
            latestAge={user?.age || 25}
            latestSmoking={latestRecord?.lifestyle_smoking || 'no'}
            latestAlcohol={latestRecord?.lifestyle_alcohol || 'no'}
            latestBmi={latestRecord?.bmi || 22}
            latestHistory={latestRecord?.medical_history ? latestRecord.medical_history.split(',') : []}
            latestPain={latestRecord?.pain_level || 5}
            latestDisease={latestRecord?.predicted_disease || ''}
          />

          {/* Emergency Triage Card */}
          <div className="p-8 bg-linear-to-br from-danger via-red-500 to-red-600 rounded-card text-white flex flex-col justify-between min-h-[260px] shadow-lg shadow-danger/20 hover:shadow-xl hover:shadow-danger/30 transition-all transform hover:-translate-y-[2px]">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="w-7 h-7 shrink-0 text-white animate-bounce" />
                <h3 className="font-display font-bold text-lg tracking-tight">Emergency Panel</h3>
              </div>
              <p className="font-sans text-xs text-red-50 leading-relaxed">
                If you report chest pain, shortness of breath, loss of consciousness, or pain scale &gt; 9, seek urgent medical treatment immediately.
              </p>
            </div>
            <button
              onClick={() => alert("Simulating Emergency Alert Signal. Dispatching telemetry to nearest cardiovascular clinics.")}
              className="w-full py-3 bg-white text-danger font-sans font-bold text-xs rounded-btn shadow-md hover:bg-slate-50 transition-colors mt-6"
            >
              🚨 Dispatch Emergency Alert
            </button>
          </div>
        </div>

      </div>

      {/* Quick Actions Grid with breathing margins */}
      <div className="space-y-6 pt-6">
        <h3 className="font-display font-bold text-xl text-slate-900 tracking-tight">Quick Health Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <Link to="/dashboard/symptoms" className="glass-panel p-6 bg-white flex flex-col items-center text-center hover:scale-[1.02] transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Activity className="w-6 h-6" />
            </div>
            <h4 className="font-display font-bold text-slate-800 mb-1 text-sm">Symptom Checker</h4>
            <p className="font-sans text-3xs text-slate-400">Run risk diagnosis</p>
          </Link>

          <Link to="/dashboard/scanner" className="glass-panel p-6 bg-white flex flex-col items-center text-center hover:scale-[1.02] transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-teal/10 text-teal flex items-center justify-center mb-4">
              <Camera className="w-6 h-6" />
            </div>
            <h4 className="font-display font-bold text-slate-800 mb-1 text-sm">Image Scanner</h4>
            <p className="font-sans text-3xs text-slate-400">Analyze skin or rashes</p>
          </Link>

          <Link to="/dashboard/chat" className="glass-panel p-6 bg-white flex flex-col items-center text-center hover:scale-[1.02] transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-indigo/10 text-indigo-600 flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h4 className="font-display font-bold text-slate-800 mb-1 text-sm">AI Health Chat</h4>
            <p className="font-sans text-3xs text-slate-400">Ask medical helper</p>
          </Link>

          <Link to="/dashboard/reports" className="glass-panel p-6 bg-white flex flex-col items-center text-center hover:scale-[1.02] transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="font-display font-bold text-slate-800 mb-1 text-sm">Health Reports</h4>
            <p className="font-sans text-3xs text-slate-400">Download PDF log</p>
          </Link>
        </div>
      </div>
    </div>
  )
}


