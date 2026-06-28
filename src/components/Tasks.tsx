import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Button } from '@astryxdesign/core/Button';
import { TextInput } from '@astryxdesign/core/TextInput';
import { Badge } from '@astryxdesign/core/Badge';
import { Text } from '@astryxdesign/core/Text';
import { VStack, HStack } from '@astryxdesign/core/Layout';
import { Divider } from '@astryxdesign/core/Divider';
import { Panel } from './Panel';
import type { Task } from '../lib/storage';

const styles = stylex.create({
  row: { justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  doneText: {
    textDecoration: 'line-through',
    color: 'var(--color-text-secondary, #999)',
  },
  empty: { color: 'var(--color-text-secondary, #777)' },
});

const PRIORITIES: Task['priority'][] = ['low', 'medium', 'high'];

export function Tasks({
  tasks,
  onAdd,
  onToggle,
  onRemove,
}: {
  tasks: Task[];
  onAdd: (title: string, priority: Task['priority']) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');

  const sorted = [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return (
    <Panel title="Tasks">
      <VStack gap={2}>
        <HStack gap={2} xstyle={styles.row}>
          <TextInput
            label="New task"
            placeholder="e.g. Email the team"
            value={title}
            onChange={(e: { target: { value: string } }) =>
              setTitle(e.target.value)
            }
          />
          <Button
            label="Add"
            variant="primary"
            onClick={() => {
              onAdd(title, priority);
              setTitle('');
            }}
          />
        </HStack>
        <HStack gap={2}>
          {PRIORITIES.map((p) => (
            <Button
              key={p}
              label={p}
              variant={priority === p ? 'primary' : 'secondary'}
              onClick={() => setPriority(p)}
            />
          ))}
        </HStack>
      </VStack>

      <Divider />

      {tasks.length === 0 ? (
        <Text xstyle={styles.empty}>No tasks yet — add one above.</Text>
      ) : (
        <VStack gap={3}>
          {sorted.map((t) => (
            <HStack key={t.id} gap={3} xstyle={styles.row}>
              <HStack gap={2}>
                <Button
                  label={t.done ? '✓' : '○'}
                  variant="secondary"
                  onClick={() => onToggle(t.id)}
                />
                <Text xstyle={t.done ? styles.doneText : undefined}>
                  {t.title}
                </Text>
                <Badge label={t.priority} />
              </HStack>
              <Button
                label="✕"
                variant="secondary"
                onClick={() => onRemove(t.id)}
              />
            </HStack>
          ))}
        </VStack>
      )}
    </Panel>
  );
}
