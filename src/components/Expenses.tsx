import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Button } from '@astryxdesign/core/Button';
import { TextInput } from '@astryxdesign/core/TextInput';
import { Badge } from '@astryxdesign/core/Badge';
import { Text } from '@astryxdesign/core/Text';
import { VStack, HStack } from '@astryxdesign/core/Layout';
import { Divider } from '@astryxdesign/core/Divider';
import { Panel } from './Panel';
import type { Expense } from '../lib/storage';

const styles = stylex.create({
  row: { justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  total: { fontWeight: 700 },
  amount: { fontVariantNumeric: 'tabular-nums' },
  empty: { color: 'var(--color-text-secondary, #777)' },
});

export function Expenses({
  expenses,
  onAdd,
  onRemove,
}: {
  expenses: Expense[];
  onAdd: (label: string, amount: number, category: string) => void;
  onRemove: (id: string) => void;
}) {
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <Panel title="Expenses">
      <VStack gap={2}>
        <HStack gap={2} xstyle={styles.row}>
          <TextInput
            label="What"
            placeholder="Coffee"
            value={label}
            onChange={(e: { target: { value: string } }) =>
              setLabel(e.target.value)
            }
          />
          <TextInput
            label="Amount"
            placeholder="4.50"
            value={amount}
            onChange={(e: { target: { value: string } }) =>
              setAmount(e.target.value)
            }
          />
          <TextInput
            label="Category"
            placeholder="Food"
            value={category}
            onChange={(e: { target: { value: string } }) =>
              setCategory(e.target.value)
            }
          />
          <Button
            label="Add"
            variant="primary"
            onClick={() => {
              onAdd(label, parseFloat(amount), category);
              setLabel('');
              setAmount('');
              setCategory('');
            }}
          />
        </HStack>
        <HStack gap={2} xstyle={styles.row}>
          <Text xstyle={styles.total}>Total</Text>
          <Text xstyle={[styles.total, styles.amount]}>
            ${total.toFixed(2)}
          </Text>
        </HStack>
      </VStack>

      <Divider />

      {expenses.length === 0 ? (
        <Text xstyle={styles.empty}>No expenses logged yet.</Text>
      ) : (
        <VStack gap={3}>
          {[...expenses]
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((e) => (
              <HStack key={e.id} gap={3} xstyle={styles.row}>
                <HStack gap={2}>
                  <Text>{e.label}</Text>
                  <Badge label={e.category} />
                  <Text xstyle={styles.empty}>{e.date}</Text>
                </HStack>
                <HStack gap={2}>
                  <Text xstyle={styles.amount}>${e.amount.toFixed(2)}</Text>
                  <Button
                    label="✕"
                    variant="secondary"
                    onClick={() => onRemove(e.id)}
                  />
                </HStack>
              </HStack>
            ))}
        </VStack>
      )}
    </Panel>
  );
}
