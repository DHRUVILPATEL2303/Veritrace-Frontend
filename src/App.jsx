import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import VerifyPage from './pages/VerifyPage'
import LibraryPage from './pages/LibraryPage'
import AboutPage from './pages/AboutPage'
import ProfilePage from './pages/ProfilePage'
import EnterprisePage from './pages/EnterprisePage'
import AdminPage from './pages/AdminPage'
import { Toaster } from './components/ui/sonner'
import AppShell from './components/AppShell'
import ChatWidget from './components/ChatWidget'
import OnboardingTour from './components/OnboardingTour'

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

// Page wrapper: a short CSS fade on route change. No exit animation, so navigation never waits.
function PageWrapper({ children }) {
  const { pathname } = useLocation()
  return (
    <div key={pathname} className="w-full animate-fade-up">
      {children}
    </div>
  )
}

function App() {
  const location = useLocation()
  
  return (
    <>
      <ScrollToTop />
      <AppShell>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
            <Route path="/register" element={<PageWrapper><RegisterPage /></PageWrapper>} />
            <Route path="/verify" element={<PageWrapper><VerifyPage /></PageWrapper>} />
            <Route path="/library" element={<PageWrapper><LibraryPage /></PageWrapper>} />
            <Route path="/enterprise" element={<PageWrapper><EnterprisePage /></PageWrapper>} />
            <Route path="/profile" element={<PageWrapper><ProfilePage /></PageWrapper>} />
            <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
            <Route path="/admin/owner" element={<PageWrapper><AdminPage /></PageWrapper>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </AppShell>
      <ChatWidget />
      <Toaster />
      <OnboardingTour />
    </>
  )
}

export default App
