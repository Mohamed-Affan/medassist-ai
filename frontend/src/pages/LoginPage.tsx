import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { KeyRound, Mail, AlertCircle, Heart } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post('http://localhost:8000/api/v1/auth/login', {
        email,
        password,
      })
      
      // Store token
      localStorage.setItem('token', response.data.access_token)
      
      // Redirect to dashboard
      navigate('/dashboard')
    } catch (err: any) {
      setError(
        err.response?.data?.detail || 'An error occurred. Please check your credentials.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F8FAFC] to-[#E2E8F0] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-teal flex items-center justify-center text-white shadow-md">
            <Heart className="w-6 h-6 animate-pulse" />
          </div>
          <span className="font-display font-bold text-2xl bg-clip-text text-transparent bg-linear-to-r from-primary to-teal">
            MedAssist AI
          </span>
        </Link>
        <h2 className="text-center text-3xl font-display font-extrabold text-slate-900">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Or{' '}
          <Link to="/register" className="font-semibold text-primary hover:text-primary/80 transition-colors">
            create a new health account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="glass-panel p-8 bg-white/80">
          {error && (
            <div className="mb-6 p-4 bg-danger/10 border border-danger/20 text-danger text-sm rounded-btn flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-input transition-colors outline-hidden text-slate-800"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-input transition-colors outline-hidden text-slate-800"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-linear-to-r from-primary to-teal text-white rounded-btn font-sans font-bold shadow-md hover:shadow-lg hover:shadow-primary/30 transition-all transform hover:-translate-y-[1px] disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
