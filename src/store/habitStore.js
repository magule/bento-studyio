import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { format } from 'date-fns';
import translations from '../i18n/translations';
import { isLocalStorageAvailable, getStoredHabits, setStoredHabits } from '../utils/storageHelper';

// Check if localStorage is available
const hasLocalStorage = isLocalStorageAvailable();
console.log('🔌 localStorage available in habitStore:', hasLocalStorage);

// Get the current language from localStorage
const getCurrentLanguage = () => {
  if (!hasLocalStorage) return 'en';
  return localStorage.getItem('language') || 'en';
};

// Initialize with default habits if the store is empty
const createDefaultHabits = () => {
  return [];  // Return empty array instead of default habits
};

// Pre-initialize localStorage with default habits if needed
if (hasLocalStorage) {
  try {
    console.log('🔎 Checking if localStorage needs initialization...');
    
    // Get stored habits (this will use both primary and backup storage)
    const storedHabits = getStoredHabits();
    
    if (!storedHabits || storedHabits.length === 0) {
      console.log('🏁 No valid habits found, initializing with empty habits array');
      const defaultHabits = createDefaultHabits();
      setStoredHabits(defaultHabits);
    } else {
      console.log('✓ Found existing habits in localStorage:', storedHabits.length);
      console.log('📋 First habit:', storedHabits[0]?.name);
      
      // Make sure to write habits back to both primary and backup storage
      setStoredHabits(storedHabits);
    }
  } catch (error) {
    console.error('❌ Error during pre-initialization:', error);
  }
}

// Get initial habits (from localStorage or defaults)
const getInitialHabits = () => {
  if (!hasLocalStorage) return createDefaultHabits();
  
  const storedHabits = getStoredHabits();
  if (storedHabits && storedHabits.length > 0) {
    console.log('📥 Using habits from localStorage:', storedHabits.length);
    return storedHabits;
  }
  
  console.log('📦 Using default habits');
  return createDefaultHabits();
};

// Create a store with persist middleware
const useHabitStore = create(
  persist(
    (set, get) => ({
      // Initialize with existing habits from localStorage or defaults
      habits: getInitialHabits(),
      theme: 'light',
      
      // For debugging
      _debug_logStorage: () => {
        console.log('🔄 Current store state:', get());
        if (hasLocalStorage) {
          console.log('💾 localStorage value:', localStorage.getItem('habit-storage'));
        }
      },
      
      // Theme control - use a different pattern to avoid unnecessary renders
      toggleTheme: () => {
        const currentTheme = get().theme;
        set({ theme: currentTheme === 'light' ? 'dark' : 'light' });
      },
      
      // Add a new habit
      addHabit: (habitData) => {
        if (!habitData.name.trim()) return;
        
        const habits = get().habits;
        const newHabit = {
          id: `habit-${Date.now()}`,
          name: habitData.name,
          description: habitData.description || '',
          count: habitData.count || 0,
          bgColor: habitData.bgColor || '',
          textColor: habitData.textColor || '',
          timerDuration: habitData.timerDuration || null,
          countDirection: habitData.countDirection || 'up',
          countAmount: habitData.countAmount || 1,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          streak: 0,
          history: []
        };
        
        console.log('✅ Adding new habit:', newHabit.name);
        
        const updatedHabits = [...habits, newHabit];
        set({ habits: updatedHabits });
        
        // Force synchronous localStorage update for extra reliability
        if (hasLocalStorage) {
          console.log('📝 Direct localStorage update with', updatedHabits.length, 'habits');
          
          // Use two methods for extra reliability
          try {
            // Method 1: Update via setStoredHabits helper (saves to both primary and backup)
            setStoredHabits(updatedHabits);
            
            // Method 2: Direct backup save as extra insurance
            const serializedData = JSON.stringify({
              state: { habits: updatedHabits, theme: get().theme },
              version: 1
            });
            localStorage.setItem('habit-storage-backup', serializedData);
            
            console.log('💾 Successfully saved new habit to primary and backup storage');
          } catch (error) {
            console.error('❌ Error saving to localStorage:', error);
          }
        }
      },
      
      // Delete a habit
      deleteHabit: (id) => {
        const habits = get().habits;
        const updatedHabits = habits.filter(habit => habit.id !== id);
        set({ habits: updatedHabits });
        
        // Manual backup to both storage locations
        if (hasLocalStorage) {
          setStoredHabits(updatedHabits);
        }
      },
      
      // Update habit count
      updateCount: (id) => {
        const habits = get().habits;
        const habitIndex = habits.findIndex(h => h.id === id);
        
        if (habitIndex === -1) return;
        
        const habit = habits[habitIndex];
        const count = habit.countDirection === 'up'
          ? habit.count + (habit.countAmount || 1)
          : habit.count - (habit.countAmount || 1);
          
        const today = format(new Date(), 'yyyy-MM-dd');
        const history = [...habit.history];
        const todayIndex = history.findIndex(h => h.date === today);
        
        if (todayIndex >= 0) {
          history[todayIndex] = { 
            ...history[todayIndex], 
            count 
          };
        } else {
          history.push({ date: today, count });
        }
        
        let streak = habit.streak;
        if (habit.countDirection === 'up' && count > 0) {
          // Check if last date was yesterday
          const lastDate = habit.history.length > 0 
            ? new Date(habit.history[habit.history.length - 1].date) 
            : null;
            
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (lastDate && format(lastDate, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
            streak += 1;
          } else if (!lastDate) {
            streak = 1;
          }
        }
        
        const updatedHabit = { 
          ...habit, 
          count,
          streak,
          history,
          lastUpdated: new Date().toISOString()
        };
        
        const updatedHabits = [...habits];
        updatedHabits[habitIndex] = updatedHabit;
        
        set({ habits: updatedHabits });
        
        // Save to backup storage
        if (hasLocalStorage) {
          setStoredHabits(updatedHabits);
        }
      },
      
      // Reset a habit count
      resetHabit: (id) => {
        const habits = get().habits;
        const updatedHabits = habits.map(habit => 
          habit.id === id ? { ...habit, count: 0 } : habit
        );
        
        set({ habits: updatedHabits });
        
        // Save to backup storage
        if (hasLocalStorage) {
          setStoredHabits(updatedHabits);
        }
      },
      
      // Update a habit's properties
      updateHabit: (id, habitData) => {
        const habits = get().habits;
        set({ 
          habits: habits.map(habit => 
            habit.id === id ? { ...habit, ...habitData } : habit
          )
        });
      },
      
      // Reset to default habits
      resetToDefaults: () => {
        set({ habits: createDefaultHabits() });
      }
    }),
    {
      name: 'habit-storage',
      version: 1,
      storage: createJSONStorage(() => hasLocalStorage ? localStorage : {
        getItem: () => null,
        setItem: () => null,
        removeItem: () => null
      }),
      partialize: (state) => ({ 
        habits: state.habits,
        theme: state.theme 
      }),
      merge: (persistedState, currentState) => {
        console.log('🔄 Merging state:', { 
          persistedStateHabits: persistedState?.habits?.length || 0,
          currentStateHabits: currentState?.habits?.length || 0,
          persistedHabitNames: persistedState?.habits?.map(h => h.name).slice(0, 3)
        });
        
        // Always prioritize persisted state if it has habits
        if (persistedState?.habits?.length > 0) {
          console.log('📦 Using persisted habits:', persistedState.habits.length);
          return {
            ...currentState,
            habits: persistedState.habits,
            theme: persistedState.theme || currentState.theme
          };
        }
        
        // Otherwise keep current state (which has default habits from getInitialHabits)
        console.log('🏭 Using current state habits:', currentState.habits.length);
        return currentState;
      }
    }
  )
);

// Perform initial check and debug
console.log('🚀 habitStore initialized');

// Force save initial habits with delay (after everything else is loaded)
if (hasLocalStorage) {
  // First immediate save
  const initialState = useHabitStore.getState();
  if (initialState.habits.length > 0) {
    setStoredHabits(initialState.habits);
    console.log('📤 Immediate save of habits to localStorage:', initialState.habits.length);
  }
  
  // Second save after a delay to ensure persistence
  setTimeout(() => {
    const state = useHabitStore.getState();
    if (state.habits.length > 0) {
      // Save to both storage mechanisms
      setStoredHabits(state.habits);
      
      // Extra direct backup after everything else has initialized
      try {
        const serialized = JSON.stringify({
          state: { habits: state.habits, theme: state.theme },
          version: 1
        });
        localStorage.setItem('habit-storage-backup', serialized);
        console.log('🔒 Final persistence check completed with', state.habits.length, 'habits');
      } catch (err) {
        console.error('❌ Final persistence check failed:', err);
      }
    }
  }, 1000);
}

export default useHabitStore; 