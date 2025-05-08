import authService from './authService';

/**
 * Service for file-related operations using the Apper backend
 */

// Table name for files
const TABLE_NAME = 'file';

// Common fields to fetch
const DEFAULT_FIELDS = [
  'Id', 'Name', 'size', 'type', 'date', 'status', 'progress', 
  'CreatedOn', 'CreatedBy', 'ModifiedOn', 'Tags'
];

// Fetch files with optional filters
const fetchFiles = async (filters = {}, pagination = { limit: 20, offset: 0 }) => {
  try {
    const client = authService.getApperClient();
    
    const params = {
      fields: DEFAULT_FIELDS,
      pagingInfo: pagination,
      orderBy: [{ field: 'CreatedOn', direction: 'desc' }],
    };
    
    // Add filters if provided
    if (filters.where && filters.where.length > 0) {
      params.where = filters.where;
    }
    
    const response = await client.fetchRecords(TABLE_NAME, params);
    
    if (!response || !response.data) {
      return { data: [], total: 0 };
    }
    
    return {
      data: response.data,
      total: response.totalRecordCount || response.data.length,
    };
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
};

// Get file by ID
const getFileById = async (fileId) => {
  try {
    const client = authService.getApperClient();
    
    const params = {
      fields: DEFAULT_FIELDS,
    };
    
    const response = await client.getRecordById(TABLE_NAME, fileId, params);
    
    return response?.data || null;
  } catch (error) {
    console.error(`Error fetching file with ID ${fileId}:`, error);
    throw error;
  }
};

// Create new file record
const createFile = async (fileData) => {
  try {
    const client = authService.getApperClient();
    
    const response = await client.createRecord(TABLE_NAME, {
      records: [fileData]
    });
    
    if (!response || !response.success || !response.results) {
      throw new Error('Failed to create file record');
    }
    
    return response.results[0]?.data || null;
  } catch (error) {
    console.error('Error creating file record:', error);
    throw error;
  }
};

// Update file record
const updateFile = async (fileId, fileData) => {
  try {
    const client = authService.getApperClient();
    
    const updateData = {
      ...fileData,
      Id: fileId
    };
    
    const response = await client.updateRecord(TABLE_NAME, {
      records: [updateData]
    });
    
    if (!response || !response.success || !response.results) {
      throw new Error('Failed to update file record');
    }
    
    return response.results[0]?.data || null;
  } catch (error) {
    console.error(`Error updating file record with ID ${fileId}:`, error);
    throw error;
  }
};

// Delete file record
const deleteFile = async (fileId) => {
  try {
    const client = authService.getApperClient();
    
    await client.deleteRecord(TABLE_NAME, { RecordIds: [fileId] });
    return true;
  } catch (error) {
    console.error(`Error deleting file record with ID ${fileId}:`, error);
    throw error;
  }
};

export default {
  fetchFiles,
  getFileById,
  createFile,
  updateFile,
  deleteFile
};