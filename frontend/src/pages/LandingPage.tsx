import { Link } from 'react-router-dom'
import { Activity, Camera, MessageSquare, Shield, HelpCircle, ChevronRight, Heart } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-height-screen bg-linear-to-b from-[#F8FAFC] via-[#EEF2F6] to-[#E2E8F0] text-slate-800">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-teal flex items-center justify-center text-white shadow-md shadow-primary/20">
            <Heart className="w-6 h-6 animate-pulse" />
          </div>
          <span className="font-display font-bold text-2xl bg-clip-text text-transparent bg-linear-to-r from-primary to-teal">
            MedAssist AI
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 font-sans font-medium text-slate-600">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
          <a href="#stats" className="hover:text-primary transition-colors">Impact</a>
          <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/login" className="px-5 py-2.5 rounded-btn font-sans font-medium text-slate-700 hover:text-primary transition-colors">
            Login
          </Link>
          <Link to="/register" className="px-5 py-2.5 bg-linear-to-r from-primary to-teal text-white rounded-btn font-sans font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all transform hover:-translate-y-[1px]">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 max-w-7xl mx-auto flex flex-col items-center text-center overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-primary/10 blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-teal/10 blur-3xl -z-10 animate-pulse"></div>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary font-sans font-semibold text-sm rounded-full mb-8 shadow-sm">
          <Shield className="w-4 h-4" />
          Educational health-support prototype
        </div>

        <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl leading-tight tracking-tight text-slate-900 max-w-4xl mb-6">
          Guided Health Support for{' '}
          <span className="bg-clip-text text-transparent bg-linear-to-r from-primary to-teal">
            Smarter Decisions
          </span>
        </h1>

        <p className="font-sans text-lg md:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
          Explore symptom patterns, preventive guidance, and a simulated image-analysis workflow in an educational health-support prototype.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-linear-to-r from-primary to-teal text-white font-sans font-bold text-lg rounded-btn shadow-lg hover:shadow-primary/30 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2">
            Start Free Assessment
            <ChevronRight className="w-5 h-5" />
          </Link>
          <a href="#features" className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-700 font-sans font-semibold text-lg rounded-btn hover:bg-slate-50 transition-colors flex items-center justify-center">
            Explore Features
          </a>
        </div>
      </section>

      {/* Core Features section */}
      <section id="features" className="px-6 py-20 bg-slate-50 border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl md:text-5xl text-slate-900 mb-4">
              Comprehensive Health Intelligence
            </h2>
            <p className="font-sans text-slate-600 max-w-2xl mx-auto">
              The current prototype combines an explainable rule set, fixed health-content patterns, and a simulated image-analysis workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-panel p-8 bg-white/80">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <Activity className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 mb-3">Symptom Pattern Assessment</h3>
              <p className="font-sans text-slate-600 leading-relaxed mb-4">
                Record symptoms, pain scale, duration, and basic context. The rule-based engine returns matching knowledge-base entries and explains the matched indicators.
              </p>
              <Link to="/register" className="inline-flex items-center gap-1 font-sans font-semibold text-primary hover:text-primary/80 transition-colors">
                Try Symptom Checker <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel p-8 bg-white/80">
              <div className="w-12 h-12 rounded-xl bg-teal/10 text-teal flex items-center justify-center mb-6">
                <Camera className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 mb-3">Simulated Image Scanner</h3>
              <p className="font-sans text-slate-600 leading-relaxed mb-4">
                Upload a skin, nail, or tongue image to explore the prototype scanner UI. It returns deterministic, predefined sample output; it does not interpret medical images.
              </p>
              <Link to="/register" className="inline-flex items-center gap-1 font-sans font-semibold text-teal hover:text-teal/80 transition-colors">
                Try Image Scanner <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel p-8 bg-white/80">
              <div className="w-12 h-12 rounded-xl bg-indigo/10 text-indigo-600 flex items-center justify-center mb-6">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 mb-3">Health Information Assistant</h3>
              <p className="font-sans text-slate-600 leading-relaxed mb-4">
                Ask common health-information questions and receive responses selected from a fixed, pattern-based content set.
              </p>
              <Link to="/register" className="inline-flex items-center gap-1 font-sans font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                Chat with Assistant <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl md:text-5xl text-slate-900 mb-4">
            How MedAssist AI Works
          </h2>
          <p className="font-sans text-slate-600 max-w-xl mx-auto">
            A simple, secure, five-step pathway to understand your health better.
          </p>
        </div>

        <div className="grid sm:grid-cols-5 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-display font-bold mb-4">1</div>
            <h4 className="font-display font-bold text-lg text-slate-900 mb-2">Input Symptoms</h4>
            <p className="font-sans text-slate-500 text-sm">Enter symptoms, logs, and lifestyle metrics.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-teal text-white flex items-center justify-center font-display font-bold mb-4">2</div>
            <h4 className="font-display font-bold text-lg text-slate-900 mb-2">Rule-Based Matching</h4>
            <p className="font-sans text-slate-500 text-sm">Known symptom patterns and emergency flags are evaluated.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-display font-bold mb-4">3</div>
            <h4 className="font-display font-bold text-lg text-slate-900 mb-2">Guidance Summary</h4>
            <p className="font-sans text-slate-500 text-sm">Review matched patterns, precautions, and when to seek care.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-display font-bold mb-4">4</div>
            <h4 className="font-display font-bold text-lg text-slate-900 mb-2">Tailored Care</h4>
            <p className="font-sans text-slate-500 text-sm">Get diet advice, hospital locator, and precautions.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-display font-bold mb-4">5</div>
            <h4 className="font-display font-bold text-lg text-slate-900 mb-2">Export PDF</h4>
            <p className="font-sans text-slate-500 text-sm">Save a comprehensive report to share with doctors.</p>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section id="stats" className="px-6 py-12 bg-linear-to-r from-primary to-teal text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 text-center py-8">
          <div>
            <div className="font-display font-extrabold text-5xl mb-2">9</div>
            <div className="font-sans text-slate-100 font-medium">Knowledge-base conditions</div>
          </div>
          <div>
            <div className="font-display font-extrabold text-5xl mb-2">30+</div>
            <div className="font-sans text-slate-100 font-medium">Unique symptom labels</div>
          </div>
          <div>
            <div className="font-display font-extrabold text-5xl mb-2">3</div>
            <div className="font-sans text-slate-100 font-medium">Prototype scan categories</div>
          </div>
          <div>
            <div className="font-display font-extrabold text-5xl mb-2">&lt; 5s</div>
            <div className="font-sans text-slate-100 font-medium">Avg Assessment Speed</div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="px-6 py-20 max-w-4xl mx-auto">
        <h2 className="font-display font-bold text-3xl md:text-5xl text-slate-900 text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
            <h4 className="font-display font-bold text-lg text-slate-900 mb-2 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              Is MedAssist AI a doctor replacement?
            </h4>
            <p className="font-sans text-slate-600 leading-relaxed">
              No. MedAssist AI is designed exclusively for educational guidance and early disease awareness. Always consult a licensed healthcare professional for any serious symptoms, emergency triage, or medical diagnoses.
            </p>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
            <h4 className="font-display font-bold text-lg text-slate-900 mb-2 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              How secure is my health data?
            </h4>
            <p className="font-sans text-slate-600 leading-relaxed">
              Passwords are hashed and the prototype uses token-based sign-in. Local SQLite data and browser-stored tokens are not production-grade protection; do not use real medical information.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-teal" />
            <span className="font-display font-bold text-xl text-white">MedAssist AI</span>
          </div>
          <p className="font-sans text-sm text-center md:text-left">
            © {new Date().getFullYear()} MedAssist AI. Aligning with UN Sustainable Development Goal 3.
          </p>
          <div className="flex gap-6 font-sans text-sm font-medium">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
