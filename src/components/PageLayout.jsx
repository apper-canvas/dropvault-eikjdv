import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import getIcon from '../utils/iconUtils'

export default function PageLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <header className="glass sticky top-0 z-10 border-b border-surface-200 dark:border-surface-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary text-white p-2 rounded-lg">
              <VaultIcon className="w-6 h-6" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              Drop<span className="text-primary">Vault</span>
            </h1>
          </Link>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>
            {subtitle && (
              <p className="text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
          {children}
        </motion.div>
      </main>
    </div>
  )
}
const VaultIcon = getIcon("Vault")