import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Button } from '@astryxdesign/core/Button';
import { TextInput } from '@astryxdesign/core/TextInput';
import { Badge } from '@astryxdesign/core/Badge';
import { Text } from '@astryxdesign/core/Text';
import { VStack, HStack } from '@astryxdesign/core/Layout';
import { Divider } from '@astryxdesign/core/Divider';
import { Panel } from './Panel';
import { currentStreak, todayISO, type Habit } from '../lib/storage';

const styles = stylex.create({
  row: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  done: {
    backgroundColor: 'var(--color-success-background, #16a34a)',
    color: 'white',
  },
  empty: { color: 'var(--color-text-secondary, #777)' },
});

export function Habits({
  habits,
  onAdd,
  onToggle,
  onRemove,
}: {
  habits: Habit[];
  onAdd: (name: string) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const [name, setName] = useState('');
  const today = todayISO();

  return (
    <Panel title="Habits">
      <HStack gap={2} xstyle={styles.row}>
        <TextInput
          label="New habit"
          placeholder="e.g. Drink water"
          value={name}
          onChange={(e: { target: { value: string } }) =>
            setName(e.target.value)
          }
        />
        <Button
          label="Add"
          variant="primary"
          onClick={() => {
            onAdd(name);
            setName('');
          }}
        />
      </HStack>

      <Divider />

      {habits.length === 0 ? (
        <Text xstyle={styles.empty}>No habits yet — add one above.</Text>
      ) : (
        <VStack gap={3}>
          {habits.map((h) => {
            const doneToday = h.history.includes(today);
            const streak = currentStreak(h.history);
            return (
              <HStack key={h.id} gap={3} xstyle={styles.row}>
                <HStack gap={2}>
                  <Text>{h.name}</Text>
                  <Badge label={`🔥 ${streak}`} />
                </HStack>
                <HStack gap={2}>
                  <Button
                    label={doneToday ? '✓ Done' : 'Mark today'}
                    variant={doneToday ? 'primary' : 'secondary'}
                    xstyle={doneToday ? styles.done : undefined}
                    onClick={() => onToggle(h.id)}
                  />
                  <Button
                    label="✕"
                    variant="secondary"
                    onClick={() => onRemove(h.id)}
                  />
                </HStack>
              </HStack>
            );
          })}
        </VStack>
      )}
    </Panel>
  );
}
