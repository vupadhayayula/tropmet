import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FileText, Clock, CheckCircle, XCircle, RefreshCw, Bell, User,
  LogOut, ChevronRight, CreditCard, Download, Lock, Mail,
  Eye, EyeOff, AlertCircle, PlusCircle, Trash2, Send, BookOpen
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../lib/AuthContext'
import { loginUser, submitAbstract } from '../lib/api'

const THEMES = [
  "Extreme Weather Events: Prediction, Impact Assessment, and Early Warning Systems",
  "Satellite, Radar, and Multi-Platform Observations for Tropical Weather and Climate",
  "Advances in Numerical Weather Prediction and Seamless Forecasting",
  "Artificial Intelligence and Machine Learning Applications in Weather and Climate Science",
  "Physics-Driven and Hybrid AI Approaches for Tropical Meteorology and Forecasting",
  "Data Assimilation, Observing System Experiments, and Impact Studies",
  "Monsoon Dynamics, Land–Ocean–Atmosphere Interactions, and Tropical Processes",
  "Climate Variability, Climate Change, and Long-Term Tropical Climate Projections",
  "Forecast Verification, Uncertainty Quantification, and Process-Based Evaluation",
  "Weather and Climate Services for Agriculture, Water Resources, Disaster Risk Reduction, Transport, etc.",
  "Emerging Technologies and Future Observing Systems in Tropical Meteorology",
  "High-Impact Weather and Climate Extremes over the Indian Subcontinent and Surrounding Seas",
  "Multi-Scale Interactions: From Convective Scales to Large-Scale Tropical Dynamics",
  "Applications of Weather and Climate Intelligence for Societal Resilience and Sustainable Development",
  "Session themes from SAMA, IRS, AAM, OSI, etc.",
]

const statusConfig: Record<string, { label: string; icon: any; cls: string; bgCls: string }> = {
  submitted:    { label: 'Submitted — Under Secretariat Review', icon: Clock,        cls: 'text-amber-700',  bgCls: 'bg-amber-50 border-amber-200' },
  under_review: { label: 'Under Expert Review',                  icon: RefreshCw,    cls: 'text-blue-700',   bgCls: 'bg-blue-50 border-blue-200' },
  accepted:     { label: 'Accepted',                             icon: CheckCircle,  cls: 'text-green-700',  bgCls: 'bg-green-50 border-green-200' },
  rejected:     { label: 'Rejected',                             icon: XCircle,      cls: 'text-red-700',    bgCls: 'bg-red-50 border-red-200' },
  revision_requested: { label: 'Revision Requested',            icon: RefreshCw,    cls: 'text-orange-700', bgCls: 'bg-orange-50 border-orange-200' },
}

interface CoAuthor {
  name: string; email: string; institution: string
}

// ─── Universal Login Panel (Author / Reviewer / Admin — same form) ───────────
function LoginPanel() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please enter your email and password.'); return }
    setLoading(true)
    try {
      const res = await loginUser(email, password)
      const { user, token } = res.data
      login({ id: user.id, name: user.full_name || user.name, email: user.email, role: user.role, token })
      toast.success(`Welcome, ${user.full_name || user.name}!`)
      // Redirect based on role from database
      if (user.role === 'admin') navigate('/admin')
      else if (user.role === 'reviewer') navigate('/reviewer')
      else navigate('/author-dashboard')
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Invalid credentials. Please check your email and password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f5fc] pt-28 pb-16 px-4">
      <div className="max-w-md mx-auto">
        {/* Info banner */}
        <div className="bg-[#0b2d5e] rounded-2xl p-5 mb-6 text-white">
          <h2 className="font-display font-bold text-base mb-3 text-amber-400">How to Submit Your Abstract</h2>
          <ol className="space-y-2">
            {[
              { n: '1', text: 'Register as an author (create your account)', to: '/author-registration' },
              { n: '2', text: 'Verify your email from the link sent to your inbox', to: null },
              { n: '3', text: 'Login below and submit your abstract from the dashboard', to: null },
            ].map(step => (
              <li key={step.n} className="flex items-center gap-3 text-sm">
                <span className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                  {step.n}
                </span>
                {step.to
                  ? <Link to={step.to} className="underline text-amber-300 hover:text-amber-200">{step.text}</Link>
                  : <span className="text-sky-200">{step.text}</span>}
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-[#e6effa] p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#0b2d5e] rounded-xl flex items-center justify-center">
              <Lock size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-[#0b2d5e]">Login</h1>
              <p className="text-slate-400 text-xs">TROPMET 2026 — Participant Portal</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-start gap-2">
              <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#0b2d5e] uppercase tracking-wider mb-1.5">
                <Mail size={11} className="inline mr-1" />Email
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full border border-[#c8d9f0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5fa8]/30 focus:border-[#1a5fa8]"
                placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0b2d5e] uppercase tracking-wider mb-1.5">
                <Lock size={11} className="inline mr-1" />Password
              </label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full border border-[#c8d9f0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5fa8]/30 focus:border-[#1a5fa8] pr-10"
                  placeholder="Your password" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-slate-400">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#0b2d5e] hover:bg-[#0e3d7a] disabled:opacity-60 text-white py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Logging in...</>
                : 'Login'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-4">
            Don't have an account?{' '}
            <Link to="/author-registration" className="text-[#1a5fa8] hover:underline font-semibold">Register as Author</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Abstract Submission Form ─────────────────────────────────────────────────
function AbstractSubmitForm({ authorId, onSubmitted }: { authorId: number; onSubmitted: () => void }) {
  const [coAuthors, setCoAuthors] = useState<CoAuthor[]>([{ name: '', email: '', institution: '' }])
  const [title, setTitle] = useState('')
  const [abstractText, setAbstractText] = useState('')
  const [theme, setTheme] = useState('')
  const [keywords, setKeywords] = useState('')
  const [presentationType, setPresentationType] = useState('either')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const wordCount = abstractText.trim().split(/\s+/).filter(Boolean).length

  const addCoAuthor = () => setCoAuthors(c => [...c, { name: '', email: '', institution: '' }])
  const removeCoAuthor = (i: number) => setCoAuthors(c => c.filter((_, idx) => idx !== i))
  const updateCoAuthor = (i: number, field: keyof CoAuthor, val: string) =>
    setCoAuthors(c => c.map((a, idx) => idx === i ? { ...a, [field]: val } : a))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) { toast.error('Please enter the abstract title.'); return }
    if (wordCount < 50) { toast.error('Abstract must be at least 50 words.'); return }
    if (wordCount > 350) { toast.error('Abstract must not exceed 350 words.'); return }
    if (!theme) { toast.error('Please select a conference theme.'); return }

    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('author_id', String(authorId))
      fd.append('title', title)
      fd.append('abstract_text', abstractText)
      fd.append('theme', theme)
      fd.append('keywords', keywords)
      fd.append('presentation_type', presentationType)
      fd.append('co_authors', JSON.stringify(coAuthors.filter(c => c.name.trim())))
      if (file) fd.append('file', file)

      await submitAbstract(fd)
      toast.success('Abstract submitted successfully!')
      onSubmitted()
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-[#c8d9f0] rounded-2xl shadow-sm p-6">
      <h2 className="font-display text-xl font-bold text-[#0b2d5e] mb-5 flex items-center gap-2">
        <Send size={18} className="text-amber-500" /> Submit Abstract
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-[#0b2d5e] uppercase tracking-wider mb-1.5">Abstract Title <span className="text-red-500">*</span></label>
          <input value={title} onChange={e => setTitle(e.target.value)}
            className="w-full border border-[#c8d9f0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5fa8]/30 focus:border-[#1a5fa8]"
            placeholder="Full title of your paper" />
        </div>

        {/* Abstract text */}
        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-xs font-bold text-[#0b2d5e] uppercase tracking-wider">Abstract Text <span className="text-red-500">*</span></label>
            <span className={`text-xs font-semibold ${wordCount > 350 ? 'text-red-500' : wordCount > 300 ? 'text-amber-600' : 'text-slate-400'}`}>
              {wordCount} / 350 words
            </span>
          </div>
          <textarea value={abstractText} onChange={e => setAbstractText(e.target.value)} rows={8}
            className="w-full border border-[#c8d9f0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5fa8]/30 focus:border-[#1a5fa8] resize-none font-sans"
            placeholder="Enter your abstract here (maximum 350 words)..." />
        </div>

        {/* Theme */}
        <div>
          <label className="block text-xs font-bold text-[#0b2d5e] uppercase tracking-wider mb-1.5">Conference Theme <span className="text-red-500">*</span></label>
          <select value={theme} onChange={e => setTheme(e.target.value)}
            className="w-full border border-[#c8d9f0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5fa8]/30 focus:border-[#1a5fa8] bg-white">
            <option value="">Select a theme...</option>
            {THEMES.map((t, i) => <option key={i} value={t}>{i + 1}. {t}</option>)}
          </select>
        </div>

        {/* Keywords + Presentation */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#0b2d5e] uppercase tracking-wider mb-1.5">Keywords</label>
            <input value={keywords} onChange={e => setKeywords(e.target.value)}
              className="w-full border border-[#c8d9f0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5fa8]/30 focus:border-[#1a5fa8]"
              placeholder="e.g. cyclone, deep learning, NWP" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#0b2d5e] uppercase tracking-wider mb-1.5">Presentation Preference</label>
            <select value={presentationType} onChange={e => setPresentationType(e.target.value)}
              className="w-full border border-[#c8d9f0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5fa8]/30 focus:border-[#1a5fa8] bg-white">
              <option value="either">Either (Oral or Poster)</option>
              <option value="oral">Oral</option>
              <option value="poster">Poster</option>
            </select>
          </div>
        </div>

        {/* File upload */}
        <div>
          <label className="block text-xs font-bold text-[#0b2d5e] uppercase tracking-wider mb-1.5">Upload Abstract File <span className="text-slate-400 font-normal normal-case">(PDF or DOCX, optional)</span></label>
          <input type="file" accept=".pdf,.doc,.docx" onChange={e => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#eef4fc] file:text-[#0b2d5e] hover:file:bg-[#dce9f8]" />
        </div>

        {/* Co-authors */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold text-[#0b2d5e] uppercase tracking-wider">Co-Authors</label>
            <button type="button" onClick={addCoAuthor}
              className="flex items-center gap-1.5 text-xs text-[#1a5fa8] hover:text-[#0b2d5e] font-semibold transition-colors">
              <PlusCircle size={14} /> Add Co-Author
            </button>
          </div>
          <div className="space-y-3">
            {coAuthors.map((ca, i) => (
              <div key={i} className="bg-[#f8fafd] border border-[#e6effa] rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase">Co-Author {i + 1}</span>
                  {coAuthors.length > 1 && (
                    <button type="button" onClick={() => removeCoAuthor(i)} className="text-red-400 hover:text-red-600">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <input value={ca.name} onChange={e => updateCoAuthor(i, 'name', e.target.value)}
                    className="border border-[#c8d9f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a5fa8]"
                    placeholder="Full Name" />
                  <input type="email" value={ca.email} onChange={e => updateCoAuthor(i, 'email', e.target.value)}
                    className="border border-[#c8d9f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a5fa8]"
                    placeholder="Email" />
                  <input value={ca.institution} onChange={e => updateCoAuthor(i, 'institution', e.target.value)}
                    className="border border-[#c8d9f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a5fa8]"
                    placeholder="Institution" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-amber-800 text-xs font-sans leading-relaxed">
            <strong>Guidelines:</strong> Abstract must not exceed 350 words. Use the official template from <a href="https://tropmet26.ncmrwf.gov.in" className="underline" target="_blank" rel="noreferrer">tropmet26.ncmrwf.gov.in</a>.
            All submissions must be original unpublished research in English.
          </p>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-[#0b2d5e] hover:bg-[#0e3d7a] disabled:opacity-60 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md">
          {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</> : <><Send size={15} />Submit Abstract</>}
        </button>
      </form>
    </div>
  )
}

// ─── Dashboard (after login) ──────────────────────────────────────────────────
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'submissions' | 'submit' | 'profile'>('submissions')

  // Mock submissions — replace with real API call: getAuthorAbstracts(user.id)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [showSubmitted, setShowSubmitted] = useState(false)

  const handleSubmitted = () => {
    // Refresh submissions list — for now just switch tab
    setSubmissions([{
      id: 'ABS-NEW',
      title: 'Your recently submitted abstract',
      submitted: new Date().toISOString().split('T')[0],
      status: 'submitted',
      theme: '',
    }])
    setShowSubmitted(true)
    setActiveTab('submissions')
    toast.success('Abstract submitted! You can track its status here.')
  }

  return (
    <div className="min-h-screen bg-[#f0f5fc] pt-28 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#021b3e] to-[#0b2d5e] rounded-2xl p-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">Author Dashboard · TROPMET 2026</p>
            <h1 className="font-display text-2xl font-bold text-white">{user?.name}</h1>
            <p className="text-sky-300 text-sm mt-0.5">{user?.email}</p>
          </div>
          <button onClick={onLogout}
            className="flex items-center gap-1.5 border border-red-300/50 text-red-300 hover:bg-red-500/20 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
            <LogOut size={14} /> Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-[#c8d9f0] rounded-xl p-1 mb-6">
          {[
            { id: 'submissions', label: 'My Abstracts', icon: FileText },
            { id: 'submit',      label: 'Submit Abstract', icon: Send },
            { id: 'profile',     label: 'My Profile', icon: User },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 flex-1 justify-center px-4 py-2.5 rounded-lg text-sm font-semibold transition-all
                ${activeTab === tab.id ? 'bg-[#0b2d5e] text-white shadow-sm' : 'text-slate-500 hover:text-[#0b2d5e] hover:bg-[#f0f5fc]'}`}>
              <tab.icon size={15} /> {tab.label}
            </button>
          ))}
        </div>

        {/* ── My Abstracts Tab ── */}
        {activeTab === 'submissions' && (
          <div className="space-y-4">
            {submissions.length === 0 ? (
              <div className="bg-white border border-[#c8d9f0] rounded-2xl p-12 text-center">
                <BookOpen size={40} className="text-slate-300 mx-auto mb-4" />
                <h3 className="font-display font-bold text-[#0b2d5e] text-lg mb-2">No Abstracts Yet</h3>
                <p className="text-slate-500 text-sm mb-5">You haven't submitted any abstracts. Click below to submit your research.</p>
                <button onClick={() => setActiveTab('submit')}
                  className="inline-flex items-center gap-2 bg-[#0b2d5e] hover:bg-[#0e3d7a] text-white px-6 py-2.5 rounded-xl font-bold text-sm">
                  <Send size={14} /> Submit Abstract
                </button>
              </div>
            ) : (
              submissions.map(sub => {
                const sc = statusConfig[sub.status] || statusConfig.submitted
                const Icon = sc.icon
                const isAccepted = sub.status === 'accepted'
                return (
                  <div key={sub.id} className={`bg-white border rounded-2xl p-6 shadow-sm ${sc.bgCls}`}>
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="flex-1">
                        <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border mb-3 ${sc.bgCls} ${sc.cls}`}>
                          <Icon size={12} /> {sc.label}
                        </div>
                        <h3 className="font-display font-bold text-[#0b2d5e] text-lg mb-1">{sub.title}</h3>
                        <p className="text-slate-400 text-xs">Submitted: {sub.submitted} · ID: {sub.id}</p>
                        {sub.reviewerComment && (
                          <div className="mt-3 bg-white/70 border border-[#c8d9f0] rounded-xl p-3">
                            <p className="text-xs font-bold text-slate-500 mb-1">Reviewer Comment</p>
                            <p className="text-sm text-slate-700">{sub.reviewerComment}</p>
                          </div>
                        )}
                      </div>
                      {isAccepted && (
                        <div className="shrink-0">
                          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                            <CheckCircle size={24} className="text-green-500 mx-auto mb-2" />
                            <p className="text-green-800 text-xs font-bold mb-2">Abstract Accepted!</p>
                            <p className="text-green-600 text-xs mb-3">You can now register for the conference.</p>
                            <Link to="/registration"
                              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors">
                              <CreditCard size={13} /> Proceed to Registration
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* ── Submit Abstract Tab ── */}
        {activeTab === 'submit' && (
          <AbstractSubmitForm authorId={user?.id || 0} onSubmitted={handleSubmitted} />
        )}

        {/* ── Profile Tab ── */}
        {activeTab === 'profile' && (
          <div className="bg-white border border-[#c8d9f0] rounded-2xl p-6 shadow-sm">
            <h2 className="font-display text-xl font-bold text-[#0b2d5e] mb-5 flex items-center gap-2">
              <User size={18} className="text-amber-500" /> My Profile
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Full Name', value: user?.name || '—' },
                { label: 'Email', value: user?.email || '—' },
                { label: 'Role', value: 'Author' },
                { label: 'Status', value: 'Active / Verified' },
              ].map(item => (
                <div key={item.label} className="bg-[#f8fafd] border border-[#e6effa] rounded-xl p-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-[#0b2d5e] font-semibold text-sm">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function AuthorDashboardPage() {
  const { isLoggedIn, role, logout } = useAuth()
  const navigate = useNavigate()

  // If already logged in, show correct dashboard
  if (isLoggedIn && role === 'admin') { navigate('/admin'); return null }
  if (isLoggedIn && role === 'reviewer') { navigate('/reviewer'); return null }
  if (isLoggedIn && role === 'author') return <Dashboard onLogout={() => { logout(); navigate('/') }} />

  return <LoginPanel />
}
