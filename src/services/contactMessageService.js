import authService from './authService';

/**
 * Service for contact message operations using the Apper backend
 */

// Table name for contact messages
const TABLE_NAME = 'contact_message';

// Common fields to fetch
const DEFAULT_FIELDS = [
  'Id', 'Name', 'email', 'subject', 'message', 
  'CreatedOn', 'CreatedBy'
];

// Fetch contact messages with optional filters
const fetchContactMessages = async (pagination = { limit: 20, offset: 0 }) => {
  try {
    const client = authService.getApperClient();
    
    const params = {
      fields: DEFAULT_FIELDS,
      pagingInfo: pagination,
      orderBy: [{ field: 'CreatedOn', direction: 'desc' }],
    };
    
    const response = await client.fetchRecords(TABLE_NAME, params);
    
    if (!response || !response.data) {
      return { data: [], total: 0 };
    }
    
    return {
      data: response.data,
      total: response.totalRecordCount || response.data.length,
    };
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    throw error;
  }
};

// Create new contact message
const createContactMessage = async (messageData) => {
  try {
    const client = authService.getApperClient();
    
    const response = await client.createRecord(TABLE_NAME, {
      records: [messageData]
    });
    
    if (!response || !response.success || !response.results) {
      throw new Error('Failed to create contact message');
    }
    
    return response.results[0]?.data || null;
  } catch (error) {
    console.error('Error creating contact message:', error);
    throw error;
  }
};

// Get contact message by ID
const getContactMessageById = async (messageId) => {
  try {
    const client = authService.getApperClient();
    
    const params = {
      fields: DEFAULT_FIELDS,
    };
    
    const response = await client.getRecordById(TABLE_NAME, messageId, params);
    
    return response?.data || null;
  } catch (error) {
    console.error(`Error fetching contact message with ID ${messageId}:`, error);
    throw error;
  }
};

export default {
  fetchContactMessages,
  createContactMessage,
  getContactMessageById
};