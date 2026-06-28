import * as stylex from '@stylexjs/stylex';
import { VStack } from '@astryxdesign/core/Layout';
import { Heading } from '@astryxdesign/core/Text';
import type { ReactNode } from 'react';

const styles = stylex.create({
  panel: {
    backgroundColor: 'var(--color-background-surface, #fff)',
    border: '1px solid var(--color-border, #e5e5e5)',
    borderRadius: 'var(--radius-container, 12px)',
    padding: 'var(--spacing-5, 20px)',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  },
});

/** A reusable surface card built from Astryx layout primitives + xstyle,
 *  avoiding any unverified component entrypoint. */
export function Panel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section {...stylex.props(styles.panel)}>
      <VStack gap={4}>
        <Heading level={2}>{title}</Heading>
        {children}
      </VStack>
    </section>
  );
}
