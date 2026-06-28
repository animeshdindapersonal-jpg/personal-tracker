import { useCallback, useEffect, useState } from 'react';

// ---- Types -----------------------------------------------------------------

export interface Habit {
  id: string;
  name: string;
  /** ISO date strings (YYYY-MM-DD) on which the habit was completed. */
  history: string[];
  createdAt: number;
}

export interface Task {
  id: string;
  title: string;
  done: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
}

export interface Expense {
  id: string;
  label: string;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  createdAt: number;
}

export interface TrackerData {
  habits: Habit[];
  tasks: Task[];
  expenses: Expense[];
}

const STORAGE_KEY = 'personal-tracker:v1';

export const emptyData: TrackerData = {
  habits: [],
  tasks: [],
  expenses: [],
};

// ---- Pure helpers ----------------------------------------------------------

export function loadData(): TrackerData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyData;
    const parsed = JSON.parse(raw) as Partial<TrackerData>;
    return {
      habits: parsed.habits ?? [],
      tasks: parsed.tasks ?? [],
      expenses: parsed.expenses ?? [],
    };
  } catch {
    return emptyData;
  }
}

export function saveData(data: TrackerData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* storage full or unavailable — ignore */
  }
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Current consecutive-day streak for a habit, counting back from today. */
export function currentStreak(history: string[]): number {
  const set = new Set(history);
  let streak = 0;
  const d = new Date();
  // Allow today OR yesterday to anchor the streak so it doesn't reset at midnight.
  if (!set.has(d.toISOString().slice(0, 10))) {
    d.setDate(d.getDate() - 1);
    if (!set.has(d.toISOString().slice(0, 10))) return 0;
  }
  while (set.has(d.toISOString().slice(0, 10))) {
    streak += 1;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

// ---- React store hook ------------------------------------------------------

/**
 * Stateful tracker store backed by localStorage.
 * Returns the data plus immutable update helpers.
 */
export function useTracker() {
  const [data, setData] = useState<TrackerData>(loadData);

  useEffect(() => {
    saveData(data);
  }, [data]);

  // Habits ------------------------------------------------------------------
  const addHabit = useCallback((name: string) => {
    if (!name.trim()) return;
    setData((d) => ({
      ...d,
      habits: [
        ...d.habits,
        { id: uid(), name: name.trim(), history: [], createdAt: Date.now() },
      ],
    }));
  }, []);

  const toggleHabitToday = useCallback((id: string) => {
    const t = todayISO();
    setData((d) => ({
      ...d,
      habits: d.habits.map((h) =>
        h.id === id
          ? {
              ...h,
              history: h.history.includes(t)
                ? h.history.filter((x) => x !== t)
                : [...h.history, t],
            }
          : h,
      ),
    }));
  }, []);

  const removeHabit = useCallback((id: string) => {
    setData((d) => ({ ...d, habits: d.habits.filter((h) => h.id !== id) }));
  }, []);

  // Tasks -------------------------------------------------------------------
  const addTask = useCallback((title: string, priority: Task['priority']) => {
    if (!title.trim()) return;
    setData((d) => ({
      ...d,
      tasks: [
        ...d.tasks,
        {
          id: uid(),
          title: title.trim(),
          done: false,
          priority,
          createdAt: Date.now(),
        },
      ],
    }));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      tasks: d.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    }));
  }, []);

  const removeTask = useCallback((id: string) => {
    setData((d) => ({ ...d, tasks: d.tasks.filter((t) => t.id !== id) }));
  }, []);

  // Expenses ----------------------------------------------------------------
  const addExpense = useCallback(
    (label: string, amount: number, category: string) => {
      if (!label.trim() || !Number.isFinite(amount) || amount <= 0) return;
      setData((d) => ({
        ...d,
        expenses: [
          ...d.expenses,
          {
            id: uid(),
            label: label.trim(),
            amount,
            category: category.trim() || 'Other',
            date: todayISO(),
            createdAt: Date.now(),
          },
        ],
      }));
    },
    [],
  );

  const removeExpense = useCallback((id: string) => {
    setData((d) => ({ ...d, expenses: d.expenses.filter((e) => e.id !== id) }));
  }, []);

  return {
    data,
    addHabit,
    toggleHabitToday,
    removeHabit,
    addTask,
    toggleTask,
    removeTask,
    addExpense,
    removeExpense,
  };
}
