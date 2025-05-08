import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Contact from './pages/Contact'
import Footer from './components/Footer'
import getIcon from './utils/iconUtils'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check for saved preference or system preference
    const savedMode = localStorage.getItem('darkMode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return savedMode === 'true' || (savedMode === null && prefersDark)
  })

  useEffect(() => {
    // Apply dark mode class to document body
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', darkMode.toString())
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <>
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-800 dark:text-surface-100 
            shadow-soft hover:shadow-card transition-all duration-300 focus:outline-none focus:ring-2 
            focus:ring-primary-light dark:focus:ring-primary-dark"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? 
            <DarkModeIcon className="w-5 h-5" /> : 
            <LightModeIcon className="w-5 h-5" />
          }
        </button>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        className="mt-16 md:mt-0" // Adjust for mobile to avoid overlap with UI
        toastClassName="bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-surface-100 shadow-soft"
      />
      
      <Footer />
    </>
  )
}

// Icon declarations
const DarkModeIcon = getIcon("Moon")
const LightModeIcon = getIcon("Sun")

export default App