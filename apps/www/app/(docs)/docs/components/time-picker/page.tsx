'use client';

import { useMemo, useState } from 'react';
import { CodeBlock } from '@/components/code-block';
import { PreviewCard } from '@/components/preview-card';
import { PropsTable, type PropRow } from '@/components/props-table';
import { TimePicker } from '@/components/ui/time-picker';

const TIMEZONES: readonly string[] = [
  'Asia/Seoul',
  'America/New_York',
  'Europe/London',
  'Australia/Sydney',
  'UTC',
];

const propRows: readonly PropRow[] = [
  {
    name: 'value',
    type: 'Date',
    description: 'Canonical Date instant. Only the time portion is mutated.',
    required: true,
  },
  {
    name: 'onChange',
    type: '(next: Date) => void',
    description: 'Fires with a new Date when any column settles on a value.',
    required: true,
  },
  {
    name: 'format',
    type: `'12h' | '24h'`,
    defaultValue: `'24h'`,
    description: 'Display format.',
  },
  {
    name: 'timezone',
    type: 'string (IANA)',
    description:
      "Render the wall-clock time in a given timezone (e.g. 'Asia/Seoul'). The stored Date stays canonical.",
  },
  {
    name: 'showSeconds',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Show a seconds column.',
  },
  {
    name: 'minuteStep',
    type: 'number',
    defaultValue: '1',
    description: 'Step between minute rows.',
  },
  {
    name: 'secondStep',
    type: 'number',
    defaultValue: '1',
    description: 'Step between second rows.',
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
    description: 'Visible rows at once.',
  },
];

const basicExample = `import { useState } from 'react';
import { TimePicker } from '@/components/ui/time-picker';

export default function Example() {
  const [date, setDate] = useState(() => new Date());
  return <TimePicker value={date} onChange={setDate} format="24h" />;
}`;

const twelveExample = `<TimePicker value={date} onChange={setDate} format="12h" />`;

const secondsExample = `<TimePicker
  value={date}
  onChange={setDate}
  showSeconds
  minuteStep={15}
  secondStep={5}
/>`;

const tzExample = `<TimePicker
  value={date}
  onChange={setDate}
  timezone="Asia/Seoul"
  format="12h"
/>`;

const makeInitial = (hour: number, minute: number, second = 0): Date => {
  const d = new Date();
  d.setHours(hour, minute, second, 0);
  return d;
};

const formatISO = (date: Date): string => date.toISOString();

const formatInZone = (date: Date, timezone: string): string =>
  new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);

const TimePickerDocsPage = (): React.ReactElement => {
  const [time24, setTime24] = useState<Date>(() => makeInitial(14, 30));
  const [time12, setTime12] = useState<Date>(() => makeInitial(9, 15));
  const [timeSec, setTimeSec] = useState<Date>(() => makeInitial(12, 0, 0));
  const [tz, setTz] = useState<string>(TIMEZONES[0] ?? 'UTC');
  const [timeTz, setTimeTz] = useState<Date>(() => makeInitial(9, 0));

  const zonedLabel = useMemo(
    () => formatInZone(timeTz, tz),
    [timeTz, tz],
  );

  return (
    <article>
      <div className="mb-2 text-sm font-medium text-muted-foreground">
        Components
      </div>
      <h1 className="text-4xl font-bold tracking-tight">Time Picker</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Composite picker for hour / minute / (second). Accepts and emits a
        standard <code className="rounded bg-muted px-1 font-mono">Date</code>,
        with optional 12h display and timezone-aware rendering.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">Install</h2>
      <div className="mt-3">
        <CodeBlock
          language="bash"
          code="npx @como-ui/cli@latest add time-picker"
        />
      </div>

      <h2 className="mt-10 text-2xl font-semibold">Example · 24h</h2>
      <PreviewCard code={basicExample}>
        <div className="w-full max-w-sm">
          <TimePicker value={time24} onChange={setTime24} format="24h" />
          <p className="mt-4 text-center font-mono text-xs text-muted-foreground">
            value.toISOString() · {formatISO(time24)}
          </p>
        </div>
      </PreviewCard>

      <h2 className="mt-10 text-2xl font-semibold">Example · 12h (AM/PM)</h2>
      <PreviewCard code={twelveExample}>
        <div className="w-full max-w-md">
          <TimePicker value={time12} onChange={setTime12} format="12h" />
          <p className="mt-4 text-center font-mono text-xs text-muted-foreground">
            {formatISO(time12)}
          </p>
        </div>
      </PreviewCard>

      <h2 className="mt-10 text-2xl font-semibold">Example · seconds + step</h2>
      <PreviewCard code={secondsExample}>
        <div className="w-full max-w-md">
          <TimePicker
            value={timeSec}
            onChange={setTimeSec}
            showSeconds
            minuteStep={15}
            secondStep={5}
          />
          <p className="mt-4 text-center font-mono text-xs text-muted-foreground">
            {formatISO(timeSec)}
          </p>
        </div>
      </PreviewCard>

      <h2 className="mt-10 text-2xl font-semibold">Example · timezone-aware</h2>
      <p className="mt-2 text-muted-foreground">
        The same canonical <code className="rounded bg-muted px-1 font-mono">Date</code>{' '}
        is displayed differently per zone. The stored instant never changes
        unless the user moves a picker.
      </p>
      <PreviewCard code={tzExample}>
        <div className="w-full max-w-md">
          <label className="mb-3 flex items-center gap-3 text-sm">
            Timezone:
            <select
              className="rounded border border-border bg-background px-2 py-1"
              value={tz}
              onChange={(e) => setTz(e.target.value)}
            >
              {TIMEZONES.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </label>
          <TimePicker
            value={timeTz}
            onChange={setTimeTz}
            timezone={tz}
            format="12h"
          />
          <div className="mt-4 space-y-1 text-center font-mono text-xs text-muted-foreground">
            <p>canonical · {formatISO(timeTz)}</p>
            <p>
              in {tz} · {zonedLabel}
            </p>
          </div>
        </div>
      </PreviewCard>

      <h2 className="mt-12 text-2xl font-semibold">API Reference</h2>
      <PropsTable rows={propRows} />

      <h2 className="mt-10 text-2xl font-semibold">Tips</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          Use <code className="rounded bg-muted px-1 font-mono">useState(() =&gt; new Date())</code>{' '}
          to avoid creating a new Date on every render.
        </li>
        <li>
          Integrates cleanly with form libraries: pass{' '}
          <code className="rounded bg-muted px-1 font-mono">field.value</code>{' '}
          and{' '}
          <code className="rounded bg-muted px-1 font-mono">field.onChange</code>{' '}
          directly.
        </li>
        <li>
          For formatting output, reach for{' '}
          <code className="rounded bg-muted px-1 font-mono">Intl.DateTimeFormat</code>,{' '}
          <code className="rounded bg-muted px-1 font-mono">date-fns</code>, or{' '}
          <code className="rounded bg-muted px-1 font-mono">dayjs</code>.
        </li>
      </ul>
    </article>
  );
};

export default TimePickerDocsPage;
