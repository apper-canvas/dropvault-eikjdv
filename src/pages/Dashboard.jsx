import { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../App';
import MainFeature from '../components/MainFeature';
import FileList from '../components/FileList';
import fileService from '../services/fileService';
import getIcon from '../utils/iconUtils';

export default function Dashboard() {
  const { user } = useSelector((state) => state.user);
  const { logout } = useContext(AuthContext);
  const [storageInfo, setStorageInfo] = useState({
    total: 5 * 1024 * 1024 * 1024, // 5GB in bytes
    used: 0,
  });
  const [loading, setLoading] = useState(true);
  
  // Calculate used percentage
  const usedPercentage = Math.round((storageInfo.used / storageInfo.total) * 100) || 0;

  // Fetch storage info on component mount
  useEffect(() => {
    fetchStorageInfo();
  }, []);

  // Fetch storage information
  const fetchStorageInfo = async () => {
    try {
      setLoading(true);
      // Get files to calculate storage used
      const { data: files } = await fileService.fetchFiles({}, { limit: 1000, offset: 0 });
      
      // Calculate total size
      const totalUsed = files.reduce((acc, file) => acc + (file.size || 0), 0);
      
      setStorageInfo(prev => ({
        ...prev,
        used: totalUsed,
      }));
    } catch (error) {
      console.error('Error fetching storage info:', error);
      toast.error('Failed to load storage information');
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <header className="glass sticky top-0 z-10 border-b border-surface-200 dark:border-surface-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-primary text-white p-2 rounded-lg">
              <VaultIcon className="w-6 h-6" />
            </div>
            <Link to="/" className="text-xl md:text-2xl font-bold tracking-tight">
              Drop<span className="text-primary">Vault</span>
            </Link>
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
                {loading ? 'Calculating...' : `${formatBytes(storageInfo.used)} / ${formatBytes(storageInfo.total)}`}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="hidden md:block text-sm">
              {user?.firstName ? `Hello, ${user.firstName}` : 'Welcome'}
            </div>
            <button 
              onClick={logout}
              className="neumorphic p-2 rounded-full hover:scale-105 transition-all duration-300"
              title="Logout"
            >
              <LogOutIcon className="w-5 h-5 text-surface-600 dark:text-surface-400" />
            </button>
          </div>
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
                {loading ? 'Calculating...' : `${formatBytes(storageInfo.used)} / ${formatBytes(storageInfo.total)}`}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <MainFeature onFileUploaded={fetchStorageInfo} />
            </div>
            
            <div className="flex flex-col space-y-6">
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Your Files</h3>
                  <button 
                    className="text-primary hover:text-primary-dark dark:hover:text-primary-light transition-colors"
                    onClick={fetchStorageInfo}
                    title="Refresh"
                  >
                    <RefreshIcon className="w-4 h-4" />
                  </button>
                </div>
                
                <FileList />
              </div>
              
              <div className="card bg-gradient-to-br from-accent/20 to-primary/20 dark:from-accent/10 dark:to-primary/10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">Account Info</h3>
                  <span className="bg-accent text-white text-xs font-bold px-2 py-1 rounded-full">
                    {user?.accountType || 'Free'}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Name:</span>
                    <span className="text-sm font-medium">
                      {user?.firstName} {user?.lastName || ''}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email:</span>
                    <span className="text-sm font-medium">{user?.emailAddress || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Storage:</span>
                    <span className="text-sm font-medium">{formatBytes(storageInfo.total)}</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-surface-200 dark:border-surface-700">
                  <button 
                    onClick={logout}
                    className="w-full btn btn-outline text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

// Icon declarations
const VaultIcon = getIcon("Vault");
const RefreshIcon = getIcon("RefreshCw");
const LogOutIcon = getIcon("LogOut");