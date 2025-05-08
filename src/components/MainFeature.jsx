import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import fileService from '../services/fileService'
import getIcon from '../utils/iconUtils'

export default function MainFeature({ onFileUploaded }) {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const fileInputRef = useRef(null)
  
  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }
  
  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }
  
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    if (droppedFiles.length > 0) {
      processFiles(droppedFiles)
    }
  }
  
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files)
    if (selectedFiles.length > 0) {
      processFiles(selectedFiles)
    }
  }
  
  const processFiles = (newFiles) => {
    // Process and add new files to the state
    const processedFiles = newFiles.map(file => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified),
      status: 'ready', // ready, uploading, complete, error
    }))
    
    setFiles(prev => [...prev, ...processedFiles])
    toast.success(`${newFiles.length} file${newFiles.length > 1 ? 's' : ''} added to queue`)
  }
  
  const removeFile = (id) => {
    setFiles(files.filter(file => file.id !== id))
    // If file was uploading, remove from progress tracking
    if (uploadProgress[id]) {
      const newProgress = { ...uploadProgress }
      delete newProgress[id]
      setUploadProgress(newProgress)
    }
    toast.info("File removed from queue")
  }
  
  const uploadFiles = () => {
    if (files.length === 0 || uploading) return
    
    setUploading(true)
    let uploadedCount = 0;
    let errorCount = 0;
    
    // Create initial progress state for all files
    const initialProgress = {};
    files.forEach(file => {
      if (file.status !== 'complete') {
        initialProgress[file.id] = 0;
        // Update file status to uploading
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'uploading' } : f
        ));
      }
    });
    setUploadProgress(initialProgress);
    
    // Process uploads sequentially to avoid overwhelming the backend
    const filesToUpload = files.filter(file => file.status !== 'complete');
    
    for (const file of filesToUpload) {
      try {
        // Simulate progress updates while actually uploading
        const uploadPromise = uploadFileToBackend(file);
        simulateFileUpload(file.id, file.size);
        
        // Wait for upload to complete
        await uploadPromise;
        uploadedCount++;
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        
        // Mark file as error
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'error' } : f
        ));
        
        errorCount++;
      }
    }
    
    // When all uploads are done
    setUploading(false);
    
    if (uploadedCount > 0) {
      toast.success(`${uploadedCount} file${uploadedCount !== 1 ? 's' : ''} uploaded successfully!`);
      if (typeof onFileUploaded === 'function') onFileUploaded();
    }
    
    if (errorCount > 0) {
      toast.error(`Failed to upload ${errorCount} file${errorCount !== 1 ? 's' : ''}`);
    }
  }
  
  // Upload a file to the backend
  const uploadFileToBackend = async (file) => {
    try {
      // Create file record in the backend
      const fileData = {
        Name: file.name,
        size: file.size,
        type: getMimeCategory(file.file.type),
        date: new Date().toISOString(),
        status: 'complete',
        progress: 100
      };
      
      // Upload to backend
      const response = await fileService.createFile(fileData);
      
      // Update file status to complete
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'complete', backendId: response.Id } : f
      ));
      
      setUploadProgress(prev => ({
        ...prev,
        [file.id]: 100
      }));
      
      return response;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };
  
  // Determine the category of a MIME type
  const getMimeCategory = (mimeType) => {
    if (!mimeType) return 'unknown';
    
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('text/')) return 'text';
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'spreadsheet';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'presentation';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'doc';
    if (mimeType.includes('zip') || mimeType.includes('compressed')) return 'compressed';
    
    return 'unknown';
  };
  
  const simulateFileUpload = (fileId, fileSize) => {
    // Simulate an upload with progress updates
    // Larger files take longer to upload
    const duration = Math.max(2000, Math.min(10000, fileSize / 100000 * 1000))
    const steps = 50
    const interval = duration / steps
    
    let currentStep = 0
    
    const uploadInterval = setInterval(() => {
      currentStep++
      const newProgress = Math.min(Math.round((currentStep / steps) * 100), 99)
      
      setUploadProgress(prev => ({
        ...prev,
        [fileId]: newProgress
      }))
      
      // When reaching 99%, simulate completion after a delay
      if (newProgress >= 99) {
        clearInterval(uploadInterval)
        
        // Simulate server processing time
        setTimeout(() => {
          setUploadProgress(prev => ({
            ...prev,
            [fileId]: 100
          }))
          
          // Mark file as complete
          setFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, status: 'complete' } : f
          ))
          
          // Check if all files are complete
          checkAllUploadsComplete()
        }, 1000) 
      }
    }, interval)
  }
  
  const checkAllUploadsComplete = () => {
    // Check if all files have completed uploading
    const allComplete = files.every(file => 
      file.status === 'complete' || file.status === 'error'
    )
    
    if (allComplete) {
      setUploading(false)
      toast.success('All files uploaded successfully!')
    }
  }
  
  const cancelUpload = () => {
    setUploading(false)
    setUploadProgress({})
    
    // Reset file status
    setFiles(prev => prev.map(file => ({
      ...file,
      status: file.status === 'uploading' ? 'ready' : file.status
    })))
    
    toast.info('Upload canceled')
  }
  
  const clearCompleted = () => {
    setFiles(prev => prev.filter(file => file.status !== 'complete'))
    toast.info('Completed uploads cleared')
  }
  
  const formatBytes = (bytes, decimals = 1) => {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }
  
  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return ImageIcon
    if (type.startsWith('video/')) return VideoIcon
    if (type.startsWith('audio/')) return AudioIcon
    if (type.startsWith('text/')) return FileTextIcon
    if (type.includes('pdf')) return FileTextIcon
    if (type.includes('spreadsheet') || type.includes('excel')) return FileSpreadsheetIcon
    if (type.includes('presentation') || type.includes('powerpoint')) return FilePresentationIcon
    if (type.includes('word') || type.includes('document')) return FileTextIcon
    if (type.includes('zip') || type.includes('compressed')) return ArchiveIcon
    return FileIcon
  }
  
  const getStatusIcon = (status) => {
    switch(status) {
      case 'ready': return ClockIcon
      case 'uploading': return UploadCloudIcon
      case 'complete': return CheckCircleIcon
      case 'error': return AlertCircleIcon
      default: return HelpCircleIcon
    }
  }
  
  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">File Uploader</h2>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' 
                ? 'bg-primary/10 text-primary dark:text-primary-light' 
                : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-400'
            }`}
            aria-label="Grid view"
          >
            <GridIcon className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' 
                ? 'bg-primary/10 text-primary dark:text-primary-light' 
                : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-400'
            }`}
            aria-label="List view"
          >
            <ListIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div 
        className={`dropzone mb-6 ${isDragging ? 'dropzone-active' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
        />
        
        <motion.div
          animate={{
            y: isDragging ? -10 : 0,
            scale: isDragging ? 1.05 : 1
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="mb-4 p-4 rounded-full bg-primary/10 mx-auto w-16 h-16 flex items-center justify-center">
            <UploadCloudIcon className="w-8 h-8 text-primary dark:text-primary-light" />
          </div>
          
          <h3 className="text-lg font-medium mb-2">
            {isDragging ? 'Drop files here' : 'Drag and drop files here'}
          </h3>
          
          <p className="text-surface-600 dark:text-surface-400 text-sm mb-4">
            or
          </p>
          
          <button
            onClick={() => fileInputRef.current.click()}
            className="btn btn-primary"
            disabled={uploading}
          >
            Select Files
          </button>
        </motion.div>
      </div>
      
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">
              {files.length} file{files.length > 1 ? 's' : ''}
            </h3>
            
            <div className="flex space-x-2">
              {files.some(file => file.status === 'complete') && (
                <button 
                  onClick={clearCompleted}
                  className="text-sm btn btn-outline"
                >
                  Clear Completed
                </button>
              )}
              
              {uploading ? (
                <button 
                  onClick={cancelUpload}
                  className="text-sm btn bg-red-500 hover:bg-red-600 text-white"
                >
                  Cancel
                </button>
              ) : (
                <button 
                  onClick={uploadFiles}
                  className="text-sm btn btn-primary flex items-center"
                  disabled={files.length === 0 || files.every(file => file.status === 'complete')}
                >
                  <UploadIcon className="w-4 h-4 mr-1" />
                  Upload All
                </button>
              )}
            </div>
          </div>
          
          <AnimatePresence>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {files.map(file => {
                  const FileTypeIcon = getFileIcon(file.type)
                  const StatusIcon = getStatusIcon(file.status)
                  const progress = uploadProgress[file.id] || 0
                  
                  return (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="bg-surface-50 dark:bg-surface-800 rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700"
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="p-3 rounded-lg bg-surface-100 dark:bg-surface-700">
                            <FileTypeIcon className="w-6 h-6 text-primary" />
                          </div>
                          
                          <button
                            onClick={() => removeFile(file.id)}
                            className="p-1 hover:bg-surface-200 dark:hover:bg-surface-600 rounded-full"
                            disabled={uploading && file.status === 'uploading'}
                          >
                            <XIcon className="w-4 h-4 text-surface-500" />
                          </button>
                        </div>
                        
                        <h4 className="mt-3 font-medium text-sm line-clamp-1" title={file.name}>
                          {file.name}
                        </h4>
                        
                        <div className="flex items-center justify-between mt-2 text-xs text-surface-500">
                          <span>{formatBytes(file.size)}</span>
                          <div className="flex items-center">
                            <StatusIcon className={`w-3.5 h-3.5 mr-1 ${
                              file.status === 'complete' ? 'text-green-500' :
                              file.status === 'error' ? 'text-red-500' :
                              file.status === 'uploading' ? 'text-primary' : 'text-surface-500'
                            }`} />
                            <span>
                              {file.status === 'ready' && 'Ready'}
                              {file.status === 'uploading' && `${progress}%`}
                              {file.status === 'complete' && 'Complete'}
                              {file.status === 'error' && 'Failed'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {(file.status === 'uploading' || file.status === 'complete') && (
                        <div className="h-1 bg-surface-200 dark:bg-surface-700">
                          <div 
                            className={`h-full ${
                              file.status === 'complete' ? 'bg-green-500' : 'bg-primary'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="border border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden">
                {files.map((file, index) => {
                  const FileTypeIcon = getFileIcon(file.type)
                  const StatusIcon = getStatusIcon(file.status)
                  const progress = uploadProgress[file.id] || 0
                  
                  return (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className={`flex items-center p-3 ${
                        index !== files.length - 1 ? 'border-b border-surface-200 dark:border-surface-700' : ''
                      } ${
                        file.status === 'uploading' ? 'bg-primary/5 dark:bg-primary/10' : 
                        file.status === 'complete' ? 'bg-green-50 dark:bg-green-900/20' :
                        'bg-surface-50 dark:bg-surface-800'
                      }`}
                    >
                      <div className="p-2 rounded-md bg-surface-100 dark:bg-surface-700 mr-3">
                        <FileTypeIcon className="w-5 h-5 text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0 mr-4">
                        <h4 className="text-sm font-medium truncate" title={file.name}>
                          {file.name}
                        </h4>
                        <div className="flex items-center text-xs text-surface-500 mt-1">
                          <span>{formatBytes(file.size)}</span>
                          <span className="mx-2">•</span>
                          <span>{file.lastModified.toLocaleDateString()}</span>
                        </div>
                        
                        {file.status === 'uploading' && (
                          <div className="mt-2 h-1.5 w-full bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className={`flex items-center space-x-1 text-xs ${
                          file.status === 'complete' ? 'text-green-500' :
                          file.status === 'error' ? 'text-red-500' :
                          file.status === 'uploading' ? 'text-primary' : 'text-surface-500'
                        }`}>
                          <StatusIcon className="w-4 h-4" />
                          <span>
                            {file.status === 'ready' && 'Ready'}
                            {file.status === 'uploading' && `${progress}%`}
                            {file.status === 'complete' && 'Complete'}
                            {file.status === 'error' && 'Failed'}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => removeFile(file.id)}
                          className="p-1.5 hover:bg-surface-200 dark:hover:bg-surface-600 rounded-full"
                          disabled={uploading && file.status === 'uploading'}
                        >
                          <XIcon className="w-4 h-4 text-surface-500" />
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

// Icon declarations
const UploadCloudIcon = getIcon("UploadCloud")
const UploadIcon = getIcon("Upload")
const FileIcon = getIcon("File")
const FileTextIcon = getIcon("FileText")
const FileSpreadsheetIcon = getIcon("FileSpreadsheet")
const FilePresentationIcon = getIcon("FilePresentation")
const ArchiveIcon = getIcon("Archive")
const ImageIcon = getIcon("Image")
const VideoIcon = getIcon("Video")
const AudioIcon = getIcon("Audio")
const GridIcon = getIcon("Grid")
const ListIcon = getIcon("List")
const XIcon = getIcon("X")
const ClockIcon = getIcon("Clock")
const CheckCircleIcon = getIcon("CheckCircle")
const AlertCircleIcon = getIcon("AlertCircle")
const HelpCircleIcon = getIcon("HelpCircle")