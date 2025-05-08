import { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';
import getIcon from '../utils/iconUtils';

function Login() {
  const { isInitialized } = useContext(AuthContext);

  useEffect(() => {
    if (isInitialized) {
      // Show login UI in this component
      const { ApperUI } = window.ApperSDK;
      ApperUI.showLogin("#authentication");
    }
  }, [isInitialized]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 dark:bg-surface-900">
      <div className="w-full max-w-md space-y-8 p-6 bg-white dark:bg-surface-800 rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-primary text-white p-2 rounded-lg">
              <VaultIcon className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Drop<span className="text-primary">Vault</span>
            </h1>
          </div>
          <h2 className="text-2xl font-bold text-surface-800 dark:text-surface-100">Welcome Back</h2>
          <p className="mt-2 text-surface-600 dark:text-surface-400">Sign in to your account</p>
        </div>
        
        <div id="authentication" className="min-h-[400px]"></div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-surface-600 dark:text-surface-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-primary hover:text-primary-dark">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const VaultIcon = getIcon("Vault");

export default Login;