import * as stylex from '@stylexjs/stylex';
import { Heading, Text } from '@astryxdesign/core/Text';
import { Badge } from '@astryxdesign/core/Badge';
import { VStack, HStack } from '@astryxdesign/core/Layout';
import { useTracker, currentStreak, todayISO } from './lib/storage';
import { Habits } from './components/Habits';
import { Tasks } from './components/Tasks';
import { Expenses } from './components/Expenses';

const styles = stylex.create({
  page: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    padding: 'var(--spacing-6, 24px)',
  },
  shell: {
    width: '100%',
    maxWidth: 760,
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    width: '100%',
  },
  subtitle: { color: 'var(--color-text-secondary, #777)' },
  stats: { flexWrap: 'wrap' },
});

export default function App() {
  const t = useTracker();
  const { habits, tasks, expenses } = t.data;

  const today = todayISO();
  const habitsDoneToday = habits.filter((h) =>
    h.history.includes(today),
  ).length;
  const tasksOpen = tasks.filter((x) => !x.done).length;
  const bestStreak = habits.reduce(
    (m, h) => Math.max(m, currentStreak(h.history)),
    0,
  );
  const spentToday = expenses
    .filter((e) => e.date === today)
    .reduce((s, e) => s + e.amount, 0);

  return (
    <main {...stylex.props(styles.page)}>
      <VStack gap={5} xstyle={styles.shell}>
        <HStack gap={3} xstyle={styles.header}>
          <VStack gap={1}>
            <Heading level={1}>Personal Tracker</Heading>
            <Text xstyle={styles.subtitle}>
              Habits, tasks &amp; expenses — saved in your browser.
            </Text>
          </VStack>
          <HStack gap={2} xstyle={styles.stats}>
            <Badge label={`✓ ${habitsDoneToday}/${habits.length} habits`} />
            <Badge label={`🔥 best ${bestStreak}`} />
            <Badge label={`☐ ${tasksOpen} open tasks`} />
            <Badge label={`$${spentToday.toFixed(2)} today`} />
          </HStack>
        </HStack>

        <Habits
          habits={habits}
          onAdd={t.addHabit}
          onToggle={t.toggleHabitToday}
          onRemove={t.removeHabit}
        />
        <Tasks
          tasks={tasks}
          onAdd={t.addTask}
          onToggle={t.toggleTask}
          onRemove={t.removeTask}
        />
        <Expenses
          expenses={expenses}
          onAdd={t.addExpense}
          onRemove={t.removeExpense}
        />
      </VStack>
    </main>
  );
}
