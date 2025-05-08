import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import fileService from '../services/fileService';
import getIcon from '../utils/iconUtils';

export default function FileList() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    limit: 10,
    offset: 0,
    total: 0
  });

  // Load files on component mount
  useEffect(() => {
    loadFiles();
  }, [pagination.offset, pagination.limit]);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const { data, total } = await fileService.fetchFiles({}, {
        limit: pagination.limit,
        offset: pagination.offset
      });
      setFiles(data);
      setPagination(prev => ({ ...prev, total }));
      setError(null);
    } catch (err) {
      console.error('Failed to load files:', err);
      setError('Failed to load files. Please try again.');
      toast.error('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    try {
      await fileService.deleteFile(fileId);
      setFiles(files.filter(file => file.Id !== fileId));
      toast.success('File deleted successfully');
    } catch (err) {
      console.error('Failed to delete file:', err);
      toast.error('Failed to delete file');
    }
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFileIcon = (type) => {
    if (!type) return FileIcon;
    
    if (type.includes('pdf')) return FileTextIcon;
    if (type.includes('zip') || type.includes('compressed')) return ArchiveIcon;
    if (type.includes('pptx') || type.includes('presentation')) return SlideshowIcon;
    if (type.includes('doc') || type.includes('word')) return FileTextIcon;
    if (type.includes('jpg') || type.includes('png') || type.includes('gif') || type.includes('image')) return ImageIcon;
    
    return FileIcon;
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (pagination.offset + pagination.limit < pagination.total) {
      setPagination(prev => ({ ...prev, offset: prev.offset + prev.limit }));
    }
  };

  const handlePrevPage = () => {
    if (pagination.offset > 0) {
      setPagination(prev => ({ ...prev, offset: Math.max(0, prev.offset - prev.limit) }));
    }
  };

  if (loading && files.length === 0) {
    return <div className="flex justify-center p-8"><LoaderIcon className="animate-spin h-8 w-8 text-primary" /></div>;
  }

  if (error && files.length === 0) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  if (files.length === 0) {
    return <div className="text-center p-8 text-surface-500">No files found. Upload some files to get started.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="border border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden">
        {files.map((file, index) => {
          const FileIconComponent = getFileIcon(file.type);
          
          return (
            <div key={file.Id} className={`flex items-center p-3 ${
              index !== files.length - 1 ? 'border-b border-surface-200 dark:border-surface-700' : ''
            } bg-surface-50 dark:bg-surface-800`}>
              <div className="p-2 rounded-md bg-surface-100 dark:bg-surface-700 mr-3">
                <FileIconComponent className="w-5 h-5 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0 mr-4">
                <h4 className="text-sm font-medium truncate" title={file.Name}>
                  {file.Name}
                </h4>
                <div className="flex items-center text-xs text-surface-500 mt-1">
                  <span>{formatBytes(file.size)}</span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(file.date || file.CreatedOn)}</span>
                  {file.status && (
                    <>
                      <span className="mx-2">•</span>
                      <span className={`
                        ${file.status === 'complete' ? 'text-green-500' : 
                          file.status === 'error' ? 'text-red-500' : 
                          'text-primary'}
                      `}>
                        {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  className="p-1.5 rounded-full hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                  onClick={() => window.open(`/files/${file.Id}`, '_blank')}
                  title="Download file"
                >
                  <DownloadIcon className="w-4 h-4 text-surface-600 dark:text-surface-400" />
                </button>
                <button 
                  className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors"
                  onClick={() => handleDelete(file.Id)}
                  title="Delete file"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className="flex justify-between items-center pt-2">
          <button 
            className="btn btn-outline text-sm py-1 px-3 disabled:opacity-50"
            onClick={handlePrevPage}
            disabled={pagination.offset === 0}
          >
            Previous
          </button>
          
          <span className="text-sm text-surface-600 dark:text-surface-400">
            Showing {pagination.offset + 1}-
            {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total}
          </span>
          
          <button 
            className="btn btn-outline text-sm py-1 px-3 disabled:opacity-50"
            onClick={handleNextPage}
            disabled={pagination.offset + pagination.limit >= pagination.total}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

// Icon declarations
const FileIcon = getIcon("File");
const FileTextIcon = getIcon("FileText");
const ArchiveIcon = getIcon("Archive");
const SlideshowIcon = getIcon("MonitorPlay");
const ImageIcon = getIcon("Image");
const DownloadIcon = getIcon("Download");
const TrashIcon = getIcon("Trash");
const LoaderIcon = getIcon("Loader");