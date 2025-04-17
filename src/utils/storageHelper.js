/**
 * Storage Helper Utilities
 * Provides helper functions for working with localStorage
 */

// Constants
const PRIMARY_STORAGE_KEY = 'habit-storage';
const BACKUP_STORAGE_KEY = 'habit-storage-backup';

// Check if localStorage is available and working
export const isLocalStorageAvailable = () => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

// Get habit data from localStorage
export const getStoredHabits = () => {
  try {
    // First try the primary storage
    const primaryStorageData = localStorage.getItem(PRIMARY_STORAGE_KEY);
    console.log('🔍 Raw localStorage primary data:', primaryStorageData);
    
    // Try to get habits from primary storage
    let habits = extractHabitsFromStorage(primaryStorageData);
    
    // If primary storage doesn't have habits, try the backup
    if (!habits || habits.length === 0) {
      console.log('⚠️ Primary storage empty, checking backup storage');
      const backupStorageData = localStorage.getItem(BACKUP_STORAGE_KEY);
      console.log('🔍 Raw localStorage backup data:', backupStorageData);
      
      // Try to get habits from backup storage
      habits = extractHabitsFromStorage(backupStorageData);
      
      // If we found habits in backup but not in primary, restore them to primary
      if (habits && habits.length > 0) {
        console.log('🔄 Restoring habits from backup to primary storage');
        setStoredHabits(habits);
      }
    }
    
    return habits;
  } catch (e) {
    console.error('❌ Failed to get habits from localStorage:', e);
    return null;
  }
};

// Helper function to extract habits from storage data
const extractHabitsFromStorage = (storageData) => {
  if (!storageData) {
    return null;
  }
  
  try {
    const parsed = JSON.parse(storageData);
    
    if (!parsed.state || !parsed.state.habits) {
      return null;
    }
    
    const habits = parsed.state.habits;
    console.log('✅ Found habits in storage:', habits.length);
    return habits.length > 0 ? habits : null;
  } catch (err) {
    console.error('❌ Error parsing storage data:', err);
    return null;
  }
};

// Set habit data to localStorage, preserving other data
export const setStoredHabits = (habits) => {
  try {
    if (!habits || !Array.isArray(habits)) {
      console.error('❌ Invalid habits data passed to setStoredHabits:', habits);
      return false;
    }
    
    if (habits.length === 0) {
      console.warn('⚠️ Attempting to save empty habits array - this is likely an error');
    }
    
    console.log('📝 Setting habits to localStorage:', habits.length, 'habits');
    
    // Try to get existing storage
    const existingData = localStorage.getItem(PRIMARY_STORAGE_KEY);
    
    // Prepare storage data with correct format for Zustand persist
    let dataToStore = { state: { habits, theme: 'light' }, version: 1 };
    
    // If we have existing data, preserve other fields
    if (existingData) {
      try {
        const parsed = JSON.parse(existingData);
        if (parsed && parsed.state) {
          dataToStore = {
            ...parsed,
            state: {
              ...parsed.state,
              habits: habits
            }
          };
        }
      } catch (err) {
        console.warn('⚠️ Error parsing existing storage, using new data:', err);
      }
    }
    
    const dataString = JSON.stringify(dataToStore);
    
    // Save to both primary and backup storage
    localStorage.setItem(PRIMARY_STORAGE_KEY, dataString);
    localStorage.setItem(BACKUP_STORAGE_KEY, dataString);
    
    // Verify the data was stored correctly in primary storage
    const verification = localStorage.getItem(PRIMARY_STORAGE_KEY);
    
    if (!verification) {
      console.error('❌ Verification failed: No data saved to primary localStorage');
      return false;
    }
    
    try {
      const verifiedData = JSON.parse(verification);
      const hasHabits = verifiedData?.state?.habits?.length > 0;
      console.log('✓ Storage verification:', hasHabits ? 'Success' : 'Failed', 
        'Found', verifiedData?.state?.habits?.length || 0, 'habits');
      return hasHabits;
    } catch (err) {
      console.error('❌ Verification failed: Could not parse stored data');
      return false;
    }
  } catch (e) {
    console.error('❌ Failed to store habits to localStorage:', e);
    return false;
  }
};

// Initialize storage with default habits if empty
export const initializeStorageIfEmpty = (defaultHabits) => {
  try {
    const existingHabits = getStoredHabits();
    
    if (!existingHabits || existingHabits.length === 0) {
      console.log('Initializing localStorage with default habits');
      setStoredHabits(defaultHabits);
      return true;
    }
    
    return false;
  } catch (e) {
    console.error('Failed to initialize storage:', e);
    return false;
  }
};

// Export ready flag to indicate localStorage was checked
export const STORAGE_READY = isLocalStorageAvailable();

// Debug info for console on load
console.log('✨ Storage helper initialized');
console.log('💾 localStorage available:', STORAGE_READY); 