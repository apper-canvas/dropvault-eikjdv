import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import getIcon from '../utils/iconUtils'

export default function Home() {
  const [storageInfo, setStorageInfo] = useState({
    total: 5 * 1024 * 1024 * 1024, // 5GB in bytes
    used: 1.27 * 1024 * 1024 * 1024, // 1.27GB in bytes
    recentFiles: [
      { name: "Project Proposal.pdf", size: 2.4 * 1024 * 1024, type: "pdf", date: new Date(2023, 5, 12) },
      { name: "Vacation Photos.zip", size: 245 * 1024 * 1024, type: "zip", date: new Date(2023, 6, 3) },
      { name: "Client Presentation.pptx", size: 15.2 * 1024 * 1024, type: "pptx", date: new Date(2023, 6, 18) }
    ]
  })
  
  const usedPercentage = Math.round((storageInfo.used / storageInfo.total) * 100)
  
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  const getFileIcon = (type) => {
    switch(type) {
      case 'pdf': return FileTextIcon;
      case 'zip': return ArchiveIcon;
      case 'pptx': return SlideshowIcon;
      case 'doc':
      case 'docx': return FileTextIcon;
      case 'jpg':
      case 'png':
      case 'gif': return ImageIcon;
      default: return FileIcon;
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <header className="glass sticky top-0 z-10 border-b border-surface-200 dark:border-surface-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-primary text-white p-2 rounded-lg">
              <VaultIcon className="w-6 h-6" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              Drop<span className="text-primary">Vault</span>
            </h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-36 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${usedPercentage > 90 ? 'bg-red-500' : 'bg-primary'}`}
                  style={{ width: `${usedPercentage}%` }}
                ></div>
              </div>
              <span className="text-sm text-surface-600 dark:text-surface-400">
                {formatBytes(storageInfo.used)} / {formatBytes(storageInfo.total)}
              </span>
            </div>
          </div>
          
          <button className="neumorphic p-2 rounded-full hover:scale-105 transition-all duration-300">
            <MenuIcon className="w-5 h-5 text-surface-600 dark:text-surface-400" />
          </button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="md:hidden flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-36 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${usedPercentage > 90 ? 'bg-red-500' : 'bg-primary'}`}
                  style={{ width: `${usedPercentage}%` }}
                ></div>
              </div>
              <span className="text-sm text-surface-600 dark:text-surface-400">
                {formatBytes(storageInfo.used)} / {formatBytes(storageInfo.total)}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <MainFeature />
            </div>
            
            <div className="flex flex-col space-y-6">
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Recent Files</h3>
                  <button className="text-primary hover:text-primary-dark dark:hover:text-primary-light transition-colors">
                    <RefreshIcon className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {storageInfo.recentFiles.map((file, index) => {
                    const FileIconComponent = getFileIcon(file.type);
                    
                    return (
                      <div 
                        key={index} 
                        className="flex items-center p-3 rounded-lg bg-surface-50 dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                      >
                        <div className="p-2 rounded-md bg-surface-100 dark:bg-surface-700 mr-3">
                          <FileIconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">{file.name}</h4>
                          <div className="flex items-center text-xs text-surface-500 mt-1">
                            <span>{formatBytes(file.size)}</span>
                            <span className="mx-2">•</span>
                            <span>{formatDate(file.date)}</span>
                          </div>
                        </div>
                        <button className="p-1.5 rounded-full hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors">
                          <DownloadIcon className="w-4 h-4 text-surface-600 dark:text-surface-400" />
                        </button>
                      </div>
                    )
                  })}
                </div>
                
                <button className="w-full mt-4 py-2 text-sm font-medium text-primary hover:text-primary-dark dark:hover:text-primary-light transition-colors">
                  View All Files
                </button>
              </div>
              
              <div className="card bg-gradient-to-br from-accent/20 to-primary/20 dark:from-accent/10 dark:to-primary/10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">Upgrade Storage</h3>
                  <span className="bg-accent text-white text-xs font-bold px-2 py-1 rounded-full">PRO</span>
                </div>
                
                <p className="text-sm text-surface-700 dark:text-surface-300 mb-4">
                  Get more space, advanced security and better collaboration tools.
                </p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-4 h-4 text-accent mr-2" />
                    <span className="text-sm">100GB storage space</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-4 h-4 text-accent mr-2" />
                    <span className="text-sm">Advanced file recovery</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-4 h-4 text-accent mr-2" />
                    <span className="text-sm">Password protected sharing</span>
                  </div>
                </div>
                
                <button className="w-full btn bg-accent hover:bg-accent/90 text-white">
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

// Icon declarations
const VaultIcon = getIcon("Vault")
const MenuIcon = getIcon("Menu")
const FileIcon = getIcon("File")
const FileTextIcon = getIcon("FileText")
const ArchiveIcon = getIcon("Archive")
const SlideshowIcon = getIcon("MonitorPlay")
const ImageIcon = getIcon("Image")
const RefreshIcon = getIcon("RefreshCw")
const DownloadIcon = getIcon("Download")
const CheckCircleIcon = getIcon("CheckCircle")