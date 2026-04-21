'use client';

import { useState } from 'react';
import { CodeBlock } from '@/components/code-block';
import { PreviewCard } from '@/components/preview-card';
import { PropsTable, type PropRow } from '@/components/props-table';
import { SnapPicker } from '@/components/ui/snap-picker';

const COLORS: readonly string[] = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
];

interface Fruit {
  id: string;
  name: string;
  emoji: string;
}
const FRUITS: readonly Fruit[] = [
  { id: 'apple', name: 'Apple', emoji: '🍎' },
  { id: 'banana', name: 'Banana', emoji: '🍌' },
  { id: 'cherry', name: 'Cherry', emoji: '🍒' },
  { id: 'grape', name: 'Grape', emoji: '🍇' },
  { id: 'mango', name: 'Mango', emoji: '🥭' },
  { id: 'peach', name: 'Peach', emoji: '🍑' },
  { id: 'strawberry', name: 'Strawberry', emoji: '🍓' },
];
const FALLBACK: Fruit = { id: 'apple', name: 'Apple', emoji: '🍎' };

const propRows: readonly PropRow[] = [
  {
    name: 'items',
    type: 'readonly T[]',
    description: 'The list of values to display.',
    required: true,
  },
  {
    name: 'value',
    type: 'T',
    description: 'Currently selected value. Controlled.',
    required: true,
  },
  {
    name: 'onChange',
    type: '(value: T, index: number) => void',
    description: 'Called with the newly selected value when the picker settles.',
    required: true,
  },
  {
    name: 'itemHeight',
    type: 'number',
    defaultValue: '60',
    description: 'Row height in pixels.',
  },
  {
    name: 'visibleCount',
    type: 'number',
    defaultValue: '5',
    description: 'Number of items visible at once (must be odd).',
  },
  {
    name: 'loop',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Wrap the list around like a drum.',
  },
  {
    name: 'getKey',
    type: '(item: T, index: number) => React.Key',
    description: 'Key extractor for non-primitive items.',
  },
  {
    name: 'equals',
    type: '(a: T, b: T) => boolean',
    defaultValue: 'Object.is',
    description: 'Custom equality comparator for locating the active index.',
  },
  {
    name: 'renderItem',
    type: '(ctx: { item: T; index: number; isSelected: boolean; distance: number }) => React.ReactNode',
    description: 'Custom item renderer. Falls back to String(item).',
  },
  {
    name: 'label',
    type: 'string',
    description: 'Accessible label surfaced via aria-label.',
  },
  {
    name: 'classNames',
    type: 'SnapPickerClassNames',
    description:
      'Per-part class overrides: root, viewport, pointer, item, itemSelected.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Disable interactions.',
  },
];

const stringExample = `import { useState } from 'react';
import { SnapPicker } from '@/components/ui/snap-picker';

const COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'];

export default function Example() {
  const [color, setColor] = useState<string>('red');
  return (
    <SnapPicker<string>
      items={COLORS}
      value={color}
      onChange={setColor}
      loop
      label="Color"
    />
  );
}`;

const objectExample = `interface Fruit {
  id: string;
  name: string;
  emoji: string;
}

const FRUITS: Fruit[] = [
  { id: 'apple', name: 'Apple', emoji: '🍎' },
  { id: 'banana', name: 'Banana', emoji: '🍌' },
  // ...
];

<SnapPicker<Fruit>
  items={FRUITS}
  value={fruit}
  onChange={setFruit}
  getKey={(f) => f.id}
  equals={(a, b) => a.id === b.id}
  renderItem={({ item }) => (
    <span className="flex items-center gap-2">
      <span aria-hidden>{item.emoji}</span>
      <span>{item.name}</span>
    </span>
  )}
/>`;

const SnapPickerDocsPage = (): React.ReactElement => {
  const [color, setColor] = useState<string>(COLORS[0] ?? 'red');
  const [fruit, setFruit] = useState<Fruit>(FRUITS[0] ?? FALLBACK);

  return (
    <article>
      <div className="mb-2 text-sm font-medium text-muted-foreground">
        Components
      </div>
      <h1 className="text-4xl font-bold tracking-tight">Snap Picker</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        A generic, accessible vertical snap-scroll picker. Works with any item
        type — primitives or objects — and exposes every row renderer for full
        visual control.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">Install</h2>
      <div className="mt-3">
        <CodeBlock
          language="bash"
          code="npx @como-ui/cli@latest add snap-picker"
        />
      </div>

      <h2 className="mt-10 text-2xl font-semibold">Example · primitives</h2>
      <p className="mt-2 text-muted-foreground">
        Pass an array of strings or numbers and a controlled{' '}
        <code className="rounded bg-muted px-1 font-mono">value</code>.
      </p>
      <PreviewCard code={stringExample}>
        <div className="w-44">
          <SnapPicker<string>
            items={COLORS}
            value={color}
            onChange={setColor}
            loop
            label="Color"
          />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Selected:{' '}
            <span className="font-mono font-medium text-foreground">
              {color}
            </span>
          </p>
        </div>
      </PreviewCard>

      <h2 className="mt-10 text-2xl font-semibold">Example · objects</h2>
      <p className="mt-2 text-muted-foreground">
        Supply{' '}
        <code className="rounded bg-muted px-1 font-mono">getKey</code>,{' '}
        <code className="rounded bg-muted px-1 font-mono">equals</code>, and{' '}
        <code className="rounded bg-muted px-1 font-mono">renderItem</code> for
        complex item shapes.
      </p>
      <PreviewCard code={objectExample}>
        <div className="w-56">
          <SnapPicker<Fruit>
            items={FRUITS}
            value={fruit}
            onChange={setFruit}
            getKey={(f) => f.id}
            equals={(a, b) => a.id === b.id}
            label="Fruit"
            renderItem={({ item }) => (
              <span className="flex items-center gap-2">
                <span aria-hidden>{item.emoji}</span>
                <span>{item.name}</span>
              </span>
            )}
          />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Selected:{' '}
            <span className="font-mono font-medium text-foreground">
              {fruit.name}
            </span>
          </p>
        </div>
      </PreviewCard>

      <h2 className="mt-12 text-2xl font-semibold">API Reference</h2>
      <PropsTable rows={propRows} />

      <h2 className="mt-12 text-2xl font-semibold">Keyboard</h2>
      <div className="mt-3 overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Key</th>
              <th className="px-4 py-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="px-4 py-2 font-mono text-xs">↑ / ↓</td>
              <td className="px-4 py-2 text-muted-foreground">
                Move to previous / next item
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono text-xs">Home / End</td>
              <td className="px-4 py-2 text-muted-foreground">
                Jump to the first / last item
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  );
};

export default SnapPickerDocsPage;
