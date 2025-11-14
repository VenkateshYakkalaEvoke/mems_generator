// Instant DB initialization and database functions
let db = null;
let auth = null;
let dbInitialized = false;

// Initialize Instant DB
// Note: This assumes InstantDB is loaded via script tag in HTML
// The global InstantDB object will be available
async function initDB() {
  if (dbInitialized && db && auth) {
    return { db, auth };
  }
  
  try {
    // Wait for InstantDB to be available (it loads asynchronously)
    let attempts = 0;
    while (typeof InstantDB === 'undefined' && attempts < 50) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    // Check if InstantDB is available globally (loaded via script tag)
    if (typeof InstantDB === 'undefined') {
      throw new Error('InstantDB not loaded. Please check your internet connection and try refreshing the page.');
    }
    
    const { db: database, auth: authInstance } = InstantDB.init({
      appId: INSTANT_DB_APP_ID
    });
    
    db = database;
    auth = authInstance;
    dbInitialized = true;
    
    console.log('Instant DB initialized successfully');
    return { db, auth };
  } catch (error) {
    console.error('Error initializing Instant DB:', error);
    throw error;
  }
}

// Get current user
function getCurrentUser() {
  if (!auth) return null;
  return auth.user;
}

// Check if user is authenticated
function isAuthenticated() {
  return auth && auth.user !== null;
}

// Get database instance
function getDB() {
  return db;
}

// Get auth instance
function getAuth() {
  return auth;
}

