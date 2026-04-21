'use client';

import { useState } from 'react';
import { CodeBlock } from '@/components/code-block';
import { PreviewCard } from '@/components/preview-card';
import { PropsTable, type PropRow } from '@/components/props-table';
import { NumberPicker } from '@/components/ui/number-picker';

const propRows: readonly PropRow[] = [
  { name: 'min', type: 'number', description: 'Minimum value (inclusive).', required: true },
  { name: 'max', type: 'number', description: 'Maximum value (inclusive).', required: true },
  {
    name: 'step',
    type: 'number',
    defaultValue: '1',
    description: 'Increment between adjacent rows.',
  },
  { name: 'value', type: 'number', description: 'Controlled numeric value.', required: true },
  {
    name: 'onChange',
    type: '(value: number) => void',
    description: 'Fires when the picker settles on a new value.',
    required: true,
  },
  {
    name: 'pad',
    type: 'number',
    description: 'Left-pad the displayed number with zeros to this many digits.',
  },
  {
    name: 'format',
    type: '(n: number) => string',
    description: 'Override the default string formatting (e.g. for suffixes).',
  },
  { name: 'loop', type: 'boolean', defaultValue: 'false', description: 'Wrap-around.' },
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
    description: 'Visible rows at once.',
  },
];

const ageExample = `import { useState } from 'react';
import { NumberPicker } from '@/components/ui/number-picker';

export default function Example() {
  const [age, setAge] = useState(25);
  return <NumberPicker min={0} max={120} value={age} onChange={setAge} />;
}`;

const volumeExample = `<NumberPicker
  min={0}
  max={100}
  step={5}
  value={volume}
  onChange={setVolume}
  format={(n) => \`\${n}%\`}
/>`;

const minuteExample = `<NumberPicker
  min={0}
  max={59}
  value={minute}
  onChange={setMinute}
  pad={2}
  loop
/>`;

const NumberPickerDocsPage = (): React.ReactElement => {
  const [age, setAge] = useState(25);
  const [volume, setVolume] = useState(50);
  const [minute, setMinute] = useState(0);

  return (
    <article>
      <div className="mb-2 text-sm font-medium text-muted-foreground">Components</div>
      <h1 className="text-4xl font-bold tracking-tight">Number Picker</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        A thin, typed wrapper around <code className="rounded bg-muted px-1 font-mono">SnapPicker</code>{' '}
        that generates a numeric range from <code className="rounded bg-muted px-1 font-mono">min</code>,{' '}
        <code className="rounded bg-muted px-1 font-mono">max</code>, and{' '}
        <code className="rounded bg-muted px-1 font-mono">step</code>.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">Install</h2>
      <div className="mt-3">
        <CodeBlock language="bash" code="npx @como-ui/cli@latest add number-picker" />
      </div>

      <h2 className="mt-10 text-2xl font-semibold">Example · age</h2>
      <PreviewCard code={ageExample}>
        <div className="w-40">
          <NumberPicker min={0} max={120} value={age} onChange={setAge} />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Selected: <span className="font-mono font-medium text-foreground">{age}</span>
          </p>
        </div>
      </PreviewCard>

      <h2 className="mt-10 text-2xl font-semibold">Example · step + format</h2>
      <p className="mt-2 text-muted-foreground">
        Custom <code className="rounded bg-muted px-1 font-mono">format</code> lets you add suffixes,
        units, or commas.
      </p>
      <PreviewCard code={volumeExample}>
        <div className="w-40">
          <NumberPicker
            min={0}
            max={100}
            step={5}
            value={volume}
            onChange={setVolume}
            format={(n) => `${n}%`}
          />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Selected: <span className="font-mono font-medium text-foreground">{volume}%</span>
          </p>
        </div>
      </PreviewCard>

      <h2 className="mt-10 text-2xl font-semibold">Example · loop + pad</h2>
      <PreviewCard code={minuteExample}>
        <div className="w-40">
          <NumberPicker min={0} max={59} value={minute} onChange={setMinute} pad={2} loop />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Selected:{' '}
            <span className="font-mono font-medium text-foreground">
              {String(minute).padStart(2, '0')}
            </span>
          </p>
        </div>
      </PreviewCard>

      <h2 className="mt-12 text-2xl font-semibold">API Reference</h2>
      <PropsTable rows={propRows} />
    </article>
  );
};

export default NumberPickerDocsPage;
