import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown, ChevronRight, ArrowRight, LogOut, User } from 'lucide-react'
import ncmrwfLogo from '../assets/ncmrwf-logo-new.png'
import imsLogo from '../assets/ims-logo-new.png'
import indiaAiLogo from '../assets/indiaai-logo.png'
import emblemLogo from '../assets/emblem-india.svg'
import { useAuth } from '../lib/AuthContext'

const ROLE_DASHBOARD: Record<string, string> = {
  admin: '/admin',
  reviewer: '/reviewer',
  author: '/author-dashboard',
}
const ROLE_LABEL: Record<string, string> = {
  admin: 'Admin',
  reviewer: 'Reviewer',
  author: 'Dashboard',
}

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About Conference', to: '/about' },
  { label: 'Themes', to: '/themes' },
  { label: 'Committees', to: '/committees' },
  {
    label: 'Call for Papers',
    to: '/call-for-papers',
    workflow: true,
    children: [
      { label: 'Author Registration',  to: '/author-registration', desc: 'Step 1 — Create your author account', step: 1 },
      { label: 'Abstract Submission',  to: '/author-registration', desc: 'Step 2 — Register first, then login & submit from dashboard', step: 2 },
      { label: 'Review Process',       to: '/review-process',      desc: 'How abstracts are evaluated', step: 3 },
      { label: 'Acceptance',           to: '/acceptance',          desc: 'Notifications & acceptance letters', step: 4 },
      { label: 'Spot Registration',    to: '/spot-registration',   desc: 'Register directly at the venue', step: 5 },
    ]
  },
  { label: 'Programme Schedule', to: '/schedule' },
  { label: 'Speakers',           to: '/speakers' },
  { label: 'Institutional Patrons', to: '/institutional-patrons' },
  { label: 'Accommodation',      to: '/accommodation' },
  { label: 'Industry Exhibition', to: '/industry-exhibition' },
  { label: 'Gallery',            to: '/gallery' },
  { label: 'Places to Explore · Delhi & Noida', to: '/explore-noida' },
  { label: 'Contact',            to: '/contact' },
]

const primaryLinks = [
  { label: 'Home',   to: '/' },
  { label: 'About',  to: '/about' },
  { label: 'Themes', to: '/themes' },
  { label: 'Committees', to: '/committees' },
  {
    label: 'Call for Papers',
    to: '/call-for-papers',
    workflow: true,
    children: [
      { label: 'Author Registration', to: '/author-registration', desc: 'Step 1 — Create your author account', step: 1 },
      { label: 'Abstract Submission', to: '/author-registration', desc: 'Step 2 — Register first, then login & submit from dashboard', step: 2 },
      { label: 'Review Process',      to: '/review-process',     desc: 'How abstracts are evaluated', step: 3 },
      { label: 'Acceptance',          to: '/acceptance',         desc: 'Notifications & acceptance letters', step: 4 },
      { label: 'Spot Registration',   to: '/spot-registration',  desc: 'Register directly at the venue', step: 5 },
    ]
  },
  { label: 'Programme', to: '/schedule' },
  { label: 'Speakers',  to: '/speakers' },
  {
    label: 'More',
    to: '#',
    children: [
      { label: 'Institutional Patrons', to: '/institutional-patrons', desc: 'NCMRWF, IMD & supporting institutions' },
      { label: 'Accommodation',       to: '/accommodation',       desc: 'Hotels & transport info' },
      { label: 'Industry Exhibition', to: '/industry-exhibition', desc: 'Exhibition & presentations' },
      { label: 'Gallery',             to: '/gallery',             desc: 'Photos & media' },
      { label: 'Places to Explore · Delhi & Noida', to: '/explore-noida', desc: 'Attractions & landmarks near venue' },
      { label: 'Contact',             to: '/contact',             desc: 'Get in touch with organizers' },
    ]
  },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdown, setDropdown] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { isLoggedIn, user, logout, role } = useAuth()

  const dashboardPath = role ? ROLE_DASHBOARD[role] : '/author-dashboard'
  const dashboardLabel = role ? ROLE_LABEL[role] : 'Dashboard'

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])
  useEffect(() => { setOpen(false); setDropdown(null); setMobileExpanded(null) }, [location])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${scrolled ? 'bg-white/97 shadow-lg backdrop-blur-sm border-b border-[#c8d9f0]' : 'bg-white border-b border-[#c8d9f0]'}`}>

      {/* Top deadline strip */}
      <div className="bg-[#0b2d5e] text-white text-xs py-1.5 text-center font-sans font-semibold tracking-wide">
        Abstract Deadline: <strong>15 Aug 2026</strong>&ensp;·&ensp;Early Bird: <strong>31 Oct 2026</strong>&ensp;·&ensp;Conference: <strong>19–21 Nov 2026, Noida</strong>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-[68px] gap-6">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={emblemLogo}  alt="Emblem of India" className="w-11 h-11 object-contain" />
            <img src={ncmrwfLogo}  alt="NCMRWF"          className="w-11 h-11 object-contain" />
            <img src={imsLogo}     alt="IMS"              className="w-11 h-11 object-contain" />
            <img src={indiaAiLogo} alt="IndiaAI"          className="h-9 w-auto object-contain max-w-[100px]" />
            <div className="leading-none ml-2 border-l border-slate-200 pl-3">
              <div className="text-[#0b2d5e] font-display font-bold text-base tracking-tight">
                TROPMET <span className="text-[#1a5fa8]">2026</span>
              </div>
              <div className="text-slate-400 font-sans text-[9px] tracking-widest uppercase">PRaGaTI · Noida</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden xl:flex items-center gap-0 ml-auto">
            {primaryLinks.map(link =>
              link.children ? (
                <div key={link.label} className="relative"
                  onMouseEnter={() => setDropdown(link.label)}
                  onMouseLeave={() => setDropdown(null)}>
                  <button className={`flex items-center gap-1 px-2 py-2 text-[12.5px] font-sans font-medium transition-colors
                    ${link.workflow ? 'text-[#0b2d5e] hover:text-[#1a5fa8]' : 'text-slate-600 hover:text-[#0b2d5e]'}`}>
                    {link.label}
                    <ChevronDown size={12} className={`transition-transform ${dropdown === link.label ? 'rotate-180' : ''}`} />
                  </button>
                  {dropdown === link.label && (
                    <div className="absolute top-full left-0 mt-0 bg-white border border-[#c8d9f0] shadow-2xl rounded-xl py-2 z-50"
                      style={{ minWidth: link.workflow ? '300px' : '210px' }}>
                      {link.workflow && (
                        <div className="px-4 pt-1 pb-2 border-b border-[#e6effa] mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 font-sans">Submission Workflow</span>
                        </div>
                      )}
                      {link.children.map((c: any) => (
                        <Link key={c.label} to={c.to}
                          className="flex items-start gap-3 px-4 py-2.5 hover:bg-[#eef4fc] transition-colors group/item">
                          {link.workflow && c.step && (
                            <span className="w-5 h-5 rounded-full bg-[#0b2d5e] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 group-hover/item:bg-amber-500 transition-colors">
                              {c.step}
                            </span>
                          )}
                          <div>
                            <div className="text-sm font-sans font-semibold text-[#0b2d5e] flex items-center gap-1">
                              {c.label}
                              <ChevronRight size={11} className="opacity-0 group-hover/item:opacity-100 transition-opacity text-amber-500" />
                            </div>
                            {c.desc && <div className="text-xs text-slate-400 mt-0.5">{c.desc}</div>}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={link.to} to={link.to}
                  className={`px-2 py-2 text-[12.5px] font-sans font-medium transition-colors relative
                    ${location.pathname === link.to ? 'text-[#0b2d5e]' : 'text-slate-600 hover:text-[#0b2d5e]'}`}>
                  {link.label}
                  {location.pathname === link.to && (
                    <span className="absolute bottom-0 inset-x-2 h-0.5 bg-amber-500 rounded-full" />
                  )}
                </Link>
              )
            )}

            {/* Auth buttons — single set, no duplicates */}
            <div className="flex items-center gap-2 ml-2">
              {isLoggedIn ? (
                <>
                  <Link to={dashboardPath}
                    className="flex items-center gap-1.5 bg-[#0b2d5e] hover:bg-[#0e3d7a] text-white text-xs px-4 py-2 font-bold rounded-lg transition-colors shadow-sm">
                    <User size={12} />
                    {user?.name ? user.name.split(' ')[0] : dashboardLabel}
                    {role && role !== 'author' && <span className="ml-1 text-amber-300 text-[10px] uppercase">{role}</span>}
                  </Link>
                  <button onClick={handleLogout}
                    className="flex items-center gap-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs px-3 py-2 font-semibold rounded-lg transition-colors">
                    <LogOut size={12} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/author-registration"
                    className="bg-[#0b2d5e] hover:bg-[#0e3d7a] text-white text-xs px-4 py-2 font-bold rounded-lg transition-colors shadow-sm flex items-center gap-1.5">
                    Submit Abstract <ArrowRight size={12} />
                  </Link>
                  <Link to="/author-dashboard"
                    className={`flex items-center gap-1.5 border text-xs px-3 py-2 font-semibold rounded-lg transition-colors
                      ${location.pathname === '/author-dashboard' ? 'bg-[#0b2d5e] text-white border-[#0b2d5e]' : 'border-[#c8d9f0] text-[#0b2d5e] hover:bg-[#eef4fc]'}`}>
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="xl:hidden text-[#0b2d5e] p-2 rounded hover:bg-[#eef4fc]">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="xl:hidden border-t border-[#c8d9f0] pb-4 pt-2 max-h-[80vh] overflow-y-auto">
            {navLinks.map(link =>
              link.children ? (
                <div key={link.label}>
                  <button
                    onClick={() => setMobileExpanded(mobileExpanded === link.label ? null : link.label)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-sans font-medium text-slate-700 hover:bg-[#eef4fc] rounded-lg transition-colors">
                    <span className="flex items-center gap-2">
                      {link.label}
                      {link.workflow && <span className="text-[9px] font-bold uppercase tracking-widest bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Workflow</span>}
                    </span>
                    <ChevronDown size={14} className={`transition-transform text-slate-400 ${mobileExpanded === link.label ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileExpanded === link.label && (
                    <div className="ml-3 mt-1 mb-1 border-l-2 border-[#c8d9f0] pl-3 space-y-0.5">
                      {link.children.map((c: any) => (
                        <Link key={c.label} to={c.to}
                          className="flex items-center gap-2 py-2 px-2 text-sm font-sans text-slate-600 hover:text-[#0b2d5e] rounded-lg hover:bg-[#eef4fc] transition-colors">
                          {link.workflow && c.step && (
                            <span className="w-5 h-5 rounded-full bg-[#0b2d5e]/10 text-[#0b2d5e] flex items-center justify-center text-[10px] font-bold shrink-0">
                              {c.step}
                            </span>
                          )}
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={link.to} to={link.to}
                  className={`block px-3 py-2.5 text-sm font-sans rounded-lg transition-colors
                    ${location.pathname === link.to ? 'text-[#0b2d5e] bg-[#eef4fc] font-semibold' : 'text-slate-600 hover:text-[#0b2d5e] hover:bg-[#eef4fc]'}`}>
                  {link.label}
                </Link>
              )
            )}

            {/* Mobile auth — single set */}
            <div className="px-3 pt-3 space-y-2 border-t border-[#e6effa] mt-2">
              {isLoggedIn ? (
                <>
                  <Link to={dashboardPath} className="bg-[#0b2d5e] hover:bg-[#0e3d7a] text-white w-full flex justify-center items-center gap-2 text-sm py-2.5 rounded-lg font-bold">
                    <User size={14} /> {dashboardLabel}
                  </Link>
                  <button onClick={handleLogout} className="border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold py-2 rounded-lg w-full flex items-center justify-center gap-1.5 transition-colors">
                    <LogOut size={12} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/author-registration" className="bg-[#0b2d5e] hover:bg-[#0e3d7a] text-white w-full flex justify-center items-center gap-2 text-sm py-2.5 rounded-lg font-bold">
                    Submit Abstract <ArrowRight size={14} />
                  </Link>
                  <Link to="/author-dashboard" className="text-center border border-[#c8d9f0] text-[#0b2d5e] text-xs font-semibold py-2 rounded-lg hover:bg-[#eef4fc] flex items-center justify-center gap-1">
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}