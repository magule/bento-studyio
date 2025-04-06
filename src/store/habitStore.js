import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { format } from 'date-fns';
import translations from '../i18n/translations';

// Get the current language from localStorage
const getCurrentLanguage = () => {
  return localStorage.getItem('language') || 'tr';
};

// Initialize with default habits if the store is empty
const createDefaultHabits = () => {
  const now = new Date().toISOString();
  const lang = getCurrentLanguage();
  const t = (key) => translations[lang][key] || translations.en[key] || key;
  
  return [
    {
      id: Date.now(),
      name: t('physics'),
      description: t('physicsDesc'),
      count: 0,
      bgColor: '#F9A8D4', // Pink color
      textColor: '',
      timerDuration: 60, // 1 hour
      countDirection: 'up',
      countAmount: 1,
      createdAt: now,
      lastUpdated: now,
      streak: 0,
      history: []
    },
    {
      id: Date.now() + 1,
      name: t('chemistry'),
      description: t('chemistryDesc'),
      count: 0,
      bgColor: '#C4B5FD', // Purple color
      textColor: '',
      timerDuration: 60, // 1 hour
      countDirection: 'up',
      countAmount: 1,
      createdAt: now,
      lastUpdated: now,
      streak: 0,
      history: []
    },
    {
      id: Date.now() + 2,
      name: t('biology'),
      description: t('biologyDesc'),
      count: 0,
      bgColor: '#BEF264', // Khaki green (lime-300)
      textColor: '',
      timerDuration: 60, // 1 hour
      countDirection: 'up',
      countAmount: 1,
      createdAt: now,
      lastUpdated: now,
      streak: 0,
      history: []
    }
  ];
};

// Create a store with persist middleware
const useHabitStore = create(
  persist(
    (set, get) => ({
      habits: createDefaultHabits(),
      theme: 'light',
      
      // Theme control - use a different pattern to avoid unnecessary renders
      toggleTheme: () => {
        const currentTheme = get().theme;
        set({ theme: currentTheme === 'light' ? 'dark' : 'light' });
      },
      
      // Add a new habit
      addHabit: (habitData) => {
        if (!habitData.name.trim()) return;
        
        const habits = get().habits;
        set({
          habits: [
            ...habits,
            {
              id: Date.now(),
              name: habitData.name,
              count: 0,
              bgColor: habitData.bgColor || '',
              textColor: habitData.textColor || '',
              timerDuration: habitData.timerDuration || null,
              countDirection: habitData.countDirection || 'up',
              countAmount: habitData.countAmount || 1,
              createdAt: new Date().toISOString(),
              lastUpdated: new Date().toISOString(),
              streak: 0,
              history: []
            }
          ]
        });
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
      },
      
      // Delete a habit
      deleteHabit: (id) => {
        const habits = get().habits;
        set({ habits: habits.filter(habit => habit.id !== id) });
      },
      
      // Reset a habit count
      resetHabit: (id) => {
        const habits = get().habits;
        set({ 
          habits: habits.map(habit => 
            habit.id === id ? { ...habit, count: 0 } : habit
          )
        });
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
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // If no habits exist, initialize with defaults
        if (!state || !state.habits || state.habits.length === 0) {
          state.habits = createDefaultHabits();
        }
      }
    }
  )
);

export default useHabitStore; 