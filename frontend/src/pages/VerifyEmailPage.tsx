import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2, ShieldCheck } from 'lucide-react'
import { verifyEmail } from '../lib/api'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleVerify = () => {
    if (!token) {
      setStatus('error')
      setMessage('No verification token found in the link.')
      return
    }
    setStatus('loading')
    verifyEmail(token)
      .then(res => {
        setStatus('success')
        setMessage(res.data.message || 'Email verified successfully!')
      })
      .catch(err => {
        setStatus('error')
        setMessage(err?.response?.data?.detail || 'Verification failed. The link may have expired.')
      })
  }

  return (
    <div className="min-h-screen bg-[#f0f5fc] flex items-center justify-center pt-28 px-4 pb-16">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center border border-[#e6effa]">

        {/* Idle — show Verify Now button */}
        {status === 'idle' && (
          <>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={36} className="text-[#1a5fa8]" />
            </div>
            <h2 className="font-display font-bold text-2xl text-[#0b2d5e] mb-2">Verify Your Email</h2>
            <p className="text-slate-500 text-sm mb-6">
              Click the button below to verify your email address and activate your TROPMET 2026 account.
            </p>
            <button
              onClick={handleVerify}
              className="inline-flex items-center justify-center gap-2 bg-[#0b2d5e] hover:bg-[#0e3d7a] text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors w-full"
            >
              ✓ &nbsp; Verify My Email Now
            </button>
          </>
        )}

        {/* Loading */}
        {status === 'loading' && (
          <>
            <Loader2 size={48} className="text-[#1a5fa8] animate-spin mx-auto mb-4" />
            <h2 className="font-display font-bold text-2xl text-[#0b2d5e] mb-2">Verifying…</h2>
            <p className="text-slate-500 text-sm">Please wait while we activate your account.</p>
          </>
        )}

        {/* Success */}
        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={36} className="text-green-600" />
            </div>
            <h2 className="font-display font-bold text-2xl text-[#0b2d5e] mb-2">Email Verified!</h2>
            <p className="text-slate-600 text-sm mb-6">{message}</p>
            <Link
              to="/author-dashboard"
              className="inline-flex items-center justify-center gap-2 bg-[#0b2d5e] hover:bg-[#0e3d7a] text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors w-full"
            >
              Go to Dashboard →
            </Link>
          </>
        )}

        {/* Error */}
        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle size={36} className="text-red-500" />
            </div>
            <h2 className="font-display font-bold text-2xl text-[#0b2d5e] mb-2">Verification Failed</h2>
            <p className="text-slate-600 text-sm mb-6">{message}</p>
            <div className="space-y-3">
              <Link
                to="/author-registration"
                className="inline-flex items-center justify-center gap-2 bg-[#0b2d5e] hover:bg-[#0e3d7a] text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors w-full"
              >
                Re-register
              </Link>
              <p className="text-xs text-slate-500">
                Need help? Email{' '}
                <a href="mailto:imsnoidachapter@gmail.com" className="text-amber-600 font-semibold underline">
                  imsnoidachapter@gmail.com
                </a>
              </p>
            </div>
          </>
        )}

      </div>
    </div>
  )
}