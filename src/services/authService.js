/**
 * Service for handling authentication related operations
 */

// Initialize Apper Client
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Get current authenticated user
const getCurrentUser = () => {
  const userData = localStorage.getItem('apper_user');
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Export auth service functions
export default {
  getApperClient,
  getCurrentUser,
};