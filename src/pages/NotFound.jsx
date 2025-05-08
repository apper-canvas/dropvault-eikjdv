import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import getIcon from '../utils/iconUtils'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <div className="mb-8 flex justify-center">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 3
            }}
            className="p-6 rounded-full bg-surface-100 dark:bg-surface-800 inline-flex"
          >
            <FileQuestionIcon className="w-16 h-16 text-primary" />
          </motion.div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Page Not Found</h1>
        
        <p className="text-surface-600 dark:text-surface-400 mb-8 text-lg">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          to="/"
          className="inline-flex items-center px-6 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium shadow-soft transition-all duration-300"
        >
          <HomeIcon className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </motion.div>
      
      <div className="mt-16 text-center">
        <p className="text-surface-500 dark:text-surface-500 text-sm">
          Need help? <a href="#" className="text-primary hover:underline">Contact Support</a>
        </p>
      </div>
    </div>
  )
}

// Icon declarations
const FileQuestionIcon = getIcon("FileQuestion")
const HomeIcon = getIcon("Home")