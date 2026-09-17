import Navbar from './Navbar'
import Topbar from './Topbar'
import Footer from './Footer'
import AmbientBackground from './AmbientBackground'

/** Shared layout boundary for every route. */
export default function AppShell({ children }) {
  return (
    <>
      <AmbientBackground />
      <Topbar />
      <Navbar />
      <main className="site-content min-h-[calc(100vh-200px)] pb-8">{children}</main>
      <Footer />
    </>
  )
}
