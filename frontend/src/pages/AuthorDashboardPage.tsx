import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText, Clock, CheckCircle, XCircle, RefreshCw, Bell, User,
  LogOut, ChevronRight, CreditCard, QrCode, Download
} from 'lucide-react'

// ─── Mock data for demo ──────────────────────────────────────────────────────
const MOCK_SUBMISSIONS = [
  {
    id: 'ABS-10432',
    title: 'Deep Learning Approaches for Tropical Cyclone Intensity Prediction',
    submitted: '2026-07-12',
    status: 'accepted', // pending | accepted | rejected | minor_revision | major_revision
    reviewerComment: 'Strong methodology and novel approach. Accepted for oral presentation.',
    presentationType: 'Oral',
    paymentStatus: 'paid', // none | pending | paid
    regId: 'REG-2847',
  },
]

const MOCK_NOTIFICATIONS = [
  { id: 1, text: 'Your abstract ABS-10432 has been accepted for oral presentation!', date: '2026-09-30', read: false },
  { id: 2, text: 'Payment confirmed for registration REG-2847. Your ID card is ready.', date: '2026-10-05', read: false },
  { id: 3, text: 'Abstract submission deadline extended to 20 August 2026.', date: '2026-07-15', read: true },
]

const statusConfig: Record<string, { label: string; icon: any; cls: string }> = {
  pending:        { label: 'Under Review',   icon: Clock,       cls: 'bg-amber-100 text-amber-700' },
  accepted:       { label: 'Accepted',       icon: CheckCircle, cls: 'bg-green-100 text-green-700' },
  rejected:       { label: 'Rejected',       icon: XCircle,     cls: 'bg-red-100 text-red-700' },
  minor_revision: { label: 'Minor Revision', icon: RefreshCw,   cls: 'bg-blue-100 text-blue-700' },
  major_revision: { label: 'Major Revision', icon: RefreshCw,   cls: 'bg-orange-100 text-orange-700' },
}

export default function AuthorDashboardPage() {
  const [loggedIn, setLoggedIn] = useState(true) // assume logged in for demo
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const [showNotif, setShowNotif] = useState(false)

  const unread = notifications.filter(n => !n.read).length
  const submissions = MOCK_SUBMISSIONS

  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, read: true })))

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#021b3e] to-[#0b2d5e] rounded-2xl p-6 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center">
              <User size={22} className="text-[#0b2d5e]" />
            </div>
            <div>
              <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-0.5">Author Dashboard</p>
              <h1 className="font-display font-bold text-xl text-white">TROPMET 2026</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => { setShowNotif(!showNotif); markAllRead() }}
                className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center relative"
              >
                <Bell size={18} className="text-white" />
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-[#0b2d5e] text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </button>
              {showNotif && (
                <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-2xl border border-[#e6effa] z-50">
                  <div className="p-4 border-b border-slate-100">
                    <h3 className="font-bold text-[#0b2d5e] text-sm">Notifications</h3>
                  </div>
                  {notifications.map(n => (
                    <div key={n.id} className={`p-4 border-b border-slate-50 text-xs ${n.read ? 'text-slate-400' : 'text-slate-700'}`}>
                      <p className="leading-relaxed">{n.text}</p>
                      <p className="text-slate-400 mt-1">{n.date}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs font-semibold border border-white/20 rounded-xl px-3 py-2">
              <LogOut size={14} /> Log Out
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Submitted', value: submissions.length, cls: 'text-sky-600 bg-sky-100' },
            { label: 'Under Review', value: submissions.filter(s => s.status === 'pending').length, cls: 'text-amber-600 bg-amber-100' },
            { label: 'Accepted', value: submissions.filter(s => s.status === 'accepted').length, cls: 'text-green-600 bg-green-100' },
            { label: 'Rejected', value: submissions.filter(s => s.status === 'rejected').length, cls: 'text-red-600 bg-red-100' },
          ].map(({ label, value, cls }) => (
            <div key={label} className="bg-white rounded-2xl border border-[#e6effa] p-5 shadow-sm text-center">
              <p className={`font-display font-bold text-3xl ${cls.split(' ')[0]}`}>{value}</p>
              <p className="text-xs text-slate-400 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link to="/submit-abstract" className="bg-white border border-[#e6effa] rounded-2xl p-5 flex items-center gap-3 hover:border-sky-300 hover:shadow-md transition-all group">
            <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
              <FileText size={18} className="text-sky-600" />
            </div>
            <div>
              <p className="font-bold text-[#0b2d5e] text-sm">Submit Abstract</p>
              <p className="text-xs text-slate-400">Add a new submission</p>
            </div>
            <ChevronRight size={16} className="text-slate-300 ml-auto group-hover:text-sky-500" />
          </Link>
          <Link to="/registration" className="bg-white border border-[#e6effa] rounded-2xl p-5 flex items-center gap-3 hover:border-sky-300 hover:shadow-md transition-all group">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <CreditCard size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="font-bold text-[#0b2d5e] text-sm">Pay & Register</p>
              <p className="text-xs text-slate-400">After acceptance only</p>
            </div>
            <ChevronRight size={16} className="text-slate-300 ml-auto group-hover:text-sky-500" />
          </Link>
          <button className="bg-white border border-[#e6effa] rounded-2xl p-5 flex items-center gap-3 hover:border-sky-300 hover:shadow-md transition-all group text-left w-full">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <QrCode size={18} className="text-green-600" />
            </div>
            <div>
              <p className="font-bold text-[#0b2d5e] text-sm">Download ID Card</p>
              <p className="text-xs text-slate-400">Available after payment</p>
            </div>
            <ChevronRight size={16} className="text-slate-300 ml-auto group-hover:text-sky-500" />
          </button>
        </div>

        {/* Submissions list */}
        <h2 className="font-display font-bold text-[#0b2d5e] text-lg mb-4">My Submissions</h2>
        <div className="space-y-4">
          {submissions.map(sub => {
            const cfg = statusConfig[sub.status]
            const Icon = cfg.icon
            return (
              <div key={sub.id} className="bg-white rounded-2xl border border-[#e6effa] shadow-sm p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-display font-semibold text-[#0b2d5e] text-sm leading-snug">{sub.title}</h3>
                  <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${cfg.cls}`}>
                    <Icon size={11} /> {cfg.label}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-slate-400 mb-4">
                  <span>ID: <span className="font-mono font-semibold text-slate-600">{sub.id}</span></span>
                  <span>Submitted: {sub.submitted}</span>
                  {sub.presentationType && <span>Type: {sub.presentationType}</span>}
                </div>

                {sub.reviewerComment && (
                  <div className={`rounded-xl p-3 text-xs mb-4 ${
                    sub.status === 'accepted' ? 'bg-green-50 border border-green-200 text-green-800' :
                    sub.status === 'rejected' ? 'bg-red-50 border border-red-200 text-red-800' :
                    'bg-blue-50 border border-blue-200 text-blue-800'
                  }`}>
                    <strong>Reviewer feedback:</strong> {sub.reviewerComment}
                  </div>
                )}

                {/* Action buttons based on status */}
                {sub.status === 'accepted' && sub.paymentStatus === 'none' && (
                  <Link to="/registration"
                    className="inline-flex items-center gap-2 bg-[#0b2d5e] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#0e3d7a] transition-colors">
                    <CreditCard size={13} /> Complete Registration & Payment
                  </Link>
                )}

                {sub.status === 'accepted' && sub.paymentStatus === 'paid' && (
                  <div className="flex flex-wrap gap-2">
                    <button className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-green-700 transition-colors">
                      <QrCode size={13} /> Download ID Card
                    </button>
                    <button className="inline-flex items-center gap-2 border border-[#c8d9f0] text-[#0b2d5e] px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#eef4fc] transition-colors">
                      <Download size={13} /> Acceptance Letter
                    </button>
                    <button className="inline-flex items-center gap-2 border border-[#c8d9f0] text-[#0b2d5e] px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#eef4fc] transition-colors">
                      <Download size={13} /> Registration Receipt
                    </button>
                  </div>
                )}
              </div>
            )
          })}

          {submissions.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <FileText size={40} className="mx-auto mb-3 opacity-30" />
              <p className="mb-4">No abstracts submitted yet.</p>
              <Link to="/submit-abstract" className="inline-flex items-center gap-2 bg-[#0b2d5e] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#0e3d7a]">
                Submit Your First Abstract <ChevronRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
