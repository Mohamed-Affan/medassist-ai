import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot
} from 'lucide-react'

interface Message {
  sender: 'user' | 'assistant'
  text: string
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: "Hello! I am the <b>MedAssist AI Health Assistant</b>, a digital clinical support agent. You can ask me medical Q&As or medication FAQs (e.g. Paracetamol guidelines, Metformin side effects, DASH Diet guidelines). How can I support your health today?"
    }
  ])
  const [inputVal, setInputVal] = useState('')
  const [loading, setLoading] = useState(false)
  
  const chatEndRef = useRef<HTMLDivElement | null>(null)

  const quickPrompts = [
    { label: '💊 Paracetamol Max Dose', query: 'What is the maximum dosage and precautions for Paracetamol?' },
    { label: '🧬 Metformin Usage', query: 'How does Metformin work and what are its side effects?' },
    { label: '❤️ DASH Diet & BP', query: 'What is the DASH diet and sodium limits for hypertension?' },
    { label: '💨 Rescue Inhaler Info', query: 'How should I use a rescue inhaler for asthma?' }
  ]

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return

    const newMessages = [...messages, { sender: 'user', text: textToSend } as Message]
    setMessages(newMessages)
    setInputVal('')
    setLoading(true)

    const token = localStorage.getItem('token')

    try {
      const response = await axios.post(
        'http://localhost:8000/api/v1/chat/message',
        { message: textToSend },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      
      setMessages([
        ...newMessages,
        { sender: 'assistant', text: response.data.response }
      ])
    } catch (err) {
      console.error('Failed to post message to chat assistant', err)
      setMessages([
        ...newMessages,
        { sender: 'assistant', text: 'Error: Failed to fetch clinical advice. Ensure backend server connections are online.' }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col space-y-6 animate-fade-in">
      {/* Title */}
      <div className="border-b border-slate-200/50 pb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" /> AI Health Assistant
          </h2>
          <p className="font-sans text-slate-500 text-xs mt-0.5">
            Structured clinical guidance and medication educational dialogue.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-full font-sans text-2xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Clinical Knowledge Engine</span>
        </div>
      </div>

      {/* Main Dialogue Panel */}
      <div className="flex-1 bg-white border border-slate-200/80 rounded-card p-6 overflow-y-auto space-y-6 shadow-sm min-h-[300px]">
        {messages.map((msg, index) => {
          const isUser = msg.sender === 'user'
          return (
            <div key={index} className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
              )}
              <div
                className={`max-w-[70%] p-4 rounded-3xl text-sm font-sans leading-relaxed ${isUser ? 'bg-primary text-white rounded-br-xs' : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-bl-xs'}`}
              >
                {isUser ? (
                  msg.text
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                )}
              </div>
            </div>
          )
        })}

        {/* Loading / Typing bubble */}
        {loading && (
          <div className="flex gap-3.5 justify-start">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div className="bg-slate-50 text-slate-500 border border-slate-100 p-4 rounded-3xl rounded-bl-xs text-xs font-semibold flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150"></span>
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-300"></span>
              <span>Researching medical guidelines...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Suggestions scroll bar */}
      <div className="space-y-2">
        <h4 className="font-display font-semibold text-2xs text-slate-400 uppercase tracking-wider px-1">Common Inquiries</h4>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {quickPrompts.map((p) => (
            <button
              key={p.label}
              onClick={() => handleSendMessage(p.query)}
              className="px-4 py-2.5 bg-slate-50 hover:bg-primary/5 hover:text-primary border border-slate-200 rounded-full font-sans font-semibold text-xs whitespace-nowrap transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input controls */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Ask about medications, blood pressure ranges, insulin tips..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputVal)}
          className="flex-1 px-5 py-4 bg-white border border-slate-200 rounded-input focus:border-primary outline-hidden text-sm text-slate-850"
        />
        <button
          onClick={() => handleSendMessage(inputVal)}
          className="p-4 bg-primary text-white rounded-input hover:bg-blue-600 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
