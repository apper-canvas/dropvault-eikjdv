import { Routes, Route, useNavigate } from 'react-router-dom'
import { useState, useEffect, createContext } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Login from './pages/Login'
import Signup from './pages/Signup'
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

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;

  useEffect(() => {
    // Apply dark mode class to document body
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', darkMode.toString())
  }, [darkMode])

  useEffect(() => {
    // Initialize ApperUI once when the app loads
    const { ApperClient, ApperUI } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function(user) {
        // Store user data in Redux store
        const { setUser } = require('./store/userSlice');
        let currentPath = window.location.pathname + window.location.search;
        if (user && user.isAuthenticated) {
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
          navigate('/dashboard');
        } else if (!currentPath.includes('login')) {
          navigate(currentPath);
        } else {
          navigate('/login');
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
        toast.error("Authentication failed. Please try again.");
      }
    });
    
    setIsInitialized(true);
  }, [dispatch, navigate]);
  
  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        const { clearUser } = require('./store/userSlice');
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
        toast.success("You have been logged out successfully");
      } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Logout failed. Please try again.");
      }
    }
  };
  
  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  // Create auth context
  export const AuthContext = createContext(authMethods);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <AuthContext.Provider value={authMethods}>
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-800 dark:text-surface-100 
            shadow-soft hover:shadow-card transition-all duration-300 focus:outline-none focus:ring-2 
        {/* Public routes - accessible only when NOT authenticated */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? 
        
        {/* Protected routes - require authentication */}
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="*" element={<NotFound />} />
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
    </AuthContext.Provider>
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        className="mt-16 md:mt-0" // Adjust for mobile to avoid overlap with UI

// Import after declaration to avoid reference error
import Dashboard from './pages/Dashboard'
import { Navigate } from 'react-router-dom'

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