import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './lib/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AnnouncementTicker from './components/AnnouncementTicker'
import HomePage from './pages/HomePage'
import SubmitAbstractPage from './pages/SubmitAbstractPage'
import RegistrationPage from './pages/RegistrationPage'
import AuthorRegistrationPage from './pages/AuthorRegistrationPage'
import AcceptancePage from './pages/AcceptancePage'
import AuthorDashboardPage from './pages/AuthorDashboardPage'
import ReviewerPage from './pages/ReviewerPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import SpotRegistrationPage from './pages/SpotRegistrationPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import { AboutPage, ThemesPage, CommitteesPage, SchedulePage, ContactPage, AccommodationPage, IndustryExhibitionPage, CallForPapersPage, ReviewProcessPage, ExploreNoidaPage, InstitutionalPatronsPage } from './pages/OtherPages'
import { SpeakersPage, GalleryPage } from './pages/SpeakersGallery'

export default function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <AnnouncementTicker />
        <main className="flex-1">
          <Routes>
            <Route path="/"                   element={<HomePage />} />
            <Route path="/about"              element={<AboutPage />} />
            <Route path="/themes"             element={<ThemesPage />} />
            <Route path="/committees"         element={<CommitteesPage />} />
            <Route path="/call-for-papers"    element={<CallForPapersPage />} />
            {/* Submission workflow */}
            <Route path="/author-registration" element={<AuthorRegistrationPage />} />
            <Route path="/verify-email"       element={<VerifyEmailPage />} />
            <Route path="/submit-abstract"    element={<SubmitAbstractPage />} />
            <Route path="/review-process"     element={<ReviewProcessPage />} />
            <Route path="/acceptance"         element={<AcceptancePage />} />
            {/* Registration & payment */}
            <Route path="/registration"       element={<RegistrationPage />} />
            <Route path="/spot-registration"  element={<SpotRegistrationPage />} />
            {/* Dashboards — role-based */}
            <Route path="/author-dashboard"   element={<AuthorDashboardPage />} />
            <Route path="/reviewer"           element={<ReviewerPage />} />
            <Route path="/admin"              element={<AdminDashboardPage />} />
            {/* Other pages */}
            <Route path="/schedule"           element={<SchedulePage />} />
            <Route path="/speakers"           element={<SpeakersPage />} />
            <Route path="/accommodation"      element={<AccommodationPage />} />
            <Route path="/industry-exhibition" element={<IndustryExhibitionPage />} />
            <Route path="/gallery"            element={<GalleryPage />} />
            <Route path="/contact"            element={<ContactPage />} />
            <Route path="/explore-noida"      element={<ExploreNoidaPage />} />
            <Route path="/institutional-patrons" element={<InstitutionalPatronsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
    </AuthProvider>
  )
}