import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  FileText,
  Download,
  Calendar,
  ArrowRight,
  ClipboardList
} from 'lucide-react'
import { Link } from 'react-router-dom'

interface HistoryRecord {
  id: string
  symptoms_summary: string
  predicted_disease: string
  confidence: number
  timestamp: string
}

export default function ReportsHistory() {
  const [history, setHistory] = useState<HistoryRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token')
      try {
        const response = await axios.get('http://localhost:8000/api/v1/assessment/history', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setHistory(response.data)
      } catch (err) {
        console.error('Failed to fetch assessment history logs', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchHistory()
  }, [])

  const downloadReport = async (predictionId: string) => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/assessment/report/${predictionId}/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      )
      
      const file = new Blob([response.data], { type: 'application/pdf' })
      const fileURL = URL.createObjectURL(file)
      const link = document.createElement('a')
      link.href = fileURL
      link.setAttribute('download', `health_report_${predictionId.substring(0, 8)}.pdf`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('PDF report download failed', err)
      alert('Failed to download report PDF.')
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 font-sans">
        <ClipboardList className="w-10 h-10 text-primary animate-pulse" />
        <span className="text-slate-400 font-semibold text-sm">Fetching historical logs...</span>
      </div>
    )
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10 animate-fade-in">
      {/* Title */}
      <div className="border-b border-slate-200/50 pb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
            Personal Health Reports
          </h2>
          <p className="font-sans text-slate-500 text-sm mt-1">
            Access, review, or download PDF summaries of all your past diagnostic assessments.
          </p>
        </div>
        <div className="text-xs font-bold bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full">
          Total Logs: {history.length}
        </div>
      </div>

      {history.length === 0 ? (
        /* Empty state view */
        <div className="glass-panel p-16 bg-white text-center flex flex-col items-center justify-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 border border-slate-200 flex items-center justify-center mb-2">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="font-display font-extrabold text-xl text-slate-800">No Health Logs Found</h3>
          <p className="font-sans text-slate-500 text-sm max-w-sm leading-relaxed">
            You haven't logged any diagnostic assessments yet. Complete a symptom assessment to generate reports.
          </p>
          <Link
            to="/dashboard/symptoms"
            className="px-6 py-3 bg-primary hover:bg-blue-600 text-white font-sans font-bold text-xs rounded-btn shadow-sm transition-all flex items-center gap-1.5"
          >
            Start Assessment <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        /* Reports logs list table */
        <div className="glass-panel bg-white border border-slate-200/50 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left font-sans text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80">
                  <th className="p-5 font-display font-bold text-xs text-slate-400 uppercase tracking-wider">Date & Time</th>
                  <th className="p-5 font-display font-bold text-xs text-slate-400 uppercase tracking-wider w-1/3">Logged Symptoms</th>
                  <th className="p-5 font-display font-bold text-xs text-slate-400 uppercase tracking-wider">Estimate Outcome</th>
                  <th className="p-5 font-display font-bold text-xs text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((record) => {
                  const date = new Date(record.timestamp).toLocaleString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                  return (
                    <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-5 whitespace-nowrap">
                        <span className="flex items-center gap-2 text-slate-600 font-semibold">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {date}
                        </span>
                      </td>
                      <td className="p-5">
                        <span className="text-slate-500 line-clamp-2 leading-relaxed">
                          {record.symptoms_summary}
                        </span>
                      </td>
                      <td className="p-5 whitespace-nowrap">
                        <div>
                          <div className="font-bold text-slate-800 text-sm">{record.predicted_disease}</div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-teal" style={{ width: `${record.confidence}%` }}></div>
                            </div>
                            <span className="text-2xs font-semibold text-slate-400">{record.confidence}% match</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-5 text-right whitespace-nowrap">
                        <button
                          onClick={() => downloadReport(record.id)}
                          className="p-3 bg-slate-50 hover:bg-primary/5 hover:text-primary border border-slate-200 hover:border-primary/20 rounded-btn text-slate-600 transition-colors"
                          title="Download PDF Report"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
