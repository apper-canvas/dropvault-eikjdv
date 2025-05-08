import { Link } from 'react-router-dom'
import getIcon from '../utils/iconUtils'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="border-t border-surface-200 dark:border-surface-700 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="bg-primary text-white p-1.5 rounded-lg">
              <VaultIcon className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Drop<span className="text-primary">Vault</span>
            </span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <Link to="/privacy" className="text-sm text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light transition-colors">Terms of Service</Link>
            <Link to="/contact" className="text-sm text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light transition-colors">Contact Us</Link>
          </div>
          
          <div className="mt-4 md:mt-0 text-sm text-surface-500 dark:text-surface-500">
            © {currentYear} DropVault. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

const VaultIcon = getIcon("Vault")