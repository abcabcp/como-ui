'use client';

import * as React from 'react';
import { NumberPicker } from '@/components/ui/number-picker';
import { SnapPicker } from '@/components/ui/snap-picker';
import { cn } from '@/lib/utils';

export type TimeFormat = '12h' | '24h';
export type Meridiem = 'AM' | 'PM';

export interface TimePickerProps {
  /** Canonical `Date` value. Only the time portion is mutated by the picker. */
  value: Date;
  onChange: (next: Date) => void;
  format?: TimeFormat;
  /**
   * IANA timezone for display (e.g. `'Asia/Seoul'`). The underlying Date
   * instant stays canonical; only the rendered wall-clock time shifts.
   * When omitted, the browser's local zone is used.
   */
  timezone?: string;
  showSeconds?: boolean;
  minuteStep?: number;
  secondStep?: number;
  itemHeight?: number;
  visibleCount?: number;
  label?: string;
  className?: string;
  disabled?: boolean;
}

interface TimeParts {
  hour: number;
  minute: number;
  second: number;
}

const MERIDIEMS: readonly Meridiem[] = ['AM', 'PM'];

const to12h = (hour24: number): { hour12: number; meridiem: Meridiem } => {
  const meridiem: Meridiem = hour24 < 12 ? 'AM' : 'PM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return { hour12, meridiem };
};

const to24h = (hour12: number, meridiem: Meridiem): number => {
  if (meridiem === 'AM') return hour12 === 12 ? 0 : hour12;
  return hour12 === 12 ? 12 : hour12 + 12;
};

/** Read wall-clock time of `date` as it appears in `timezone`. */
const getPartsInZone = (date: Date, timezone?: string): TimeParts => {
  if (!timezone) {
    return {
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds(),
    };
  }
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hourCycle: 'h23',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(date);
  const pick = (type: string): number => Number(parts.find((p) => p.type === type)?.value ?? '0');
  return { hour: pick('hour'), minute: pick('minute'), second: pick('second') };
};

/** Returns the minutes-from-UTC offset of `timezone` at the given instant. */
const getZoneOffsetMinutesAt = (date: Date, timezone: string): number => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type: string): number => Number(parts.find((p) => p.type === type)?.value ?? '0');
  const asUTC = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour'),
    get('minute'),
    get('second'),
  );
  return Math.round((asUTC - date.getTime()) / 60000);
};

/**
 * Build a new Date whose wall-clock time in `timezone` equals the supplied
 * parts, preserving the base date's y-m-d in that same zone.
 */
const setPartsInZone = (base: Date, timezone: string | undefined, next: TimeParts): Date => {
  if (!timezone) {
    const out = new Date(base);
    out.setHours(next.hour, next.minute, next.second, 0);
    return out;
  }
  const dateParts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(base);
  const get = (type: string): number =>
    Number(dateParts.find((p) => p.type === type)?.value ?? '0');
  const y = get('year');
  const m = get('month');
  const d = get('day');
  const asUTC = Date.UTC(y, m - 1, d, next.hour, next.minute, next.second);
  const firstGuess = new Date(asUTC);
  const offset1 = getZoneOffsetMinutesAt(firstGuess, timezone);
  let result = new Date(asUTC - offset1 * 60000);
  // Second pass to stabilize across DST transitions.
  const offset2 = getZoneOffsetMinutesAt(result, timezone);
  if (offset2 !== offset1) {
    result = new Date(asUTC - offset2 * 60000);
  }
  return result;
};

export const TimePicker = ({
  value,
  onChange,
  format = '24h',
  timezone,
  showSeconds = false,
  minuteStep = 1,
  secondStep = 1,
  itemHeight = 60,
  visibleCount = 5,
  label,
  className,
  disabled,
}: TimePickerProps): React.ReactElement => {
  const parts = React.useMemo(() => getPartsInZone(value, timezone), [value, timezone]);

  const emit = React.useCallback(
    (next: TimeParts): void => {
      onChange(setPartsInZone(value, timezone, next));
    },
    [onChange, value, timezone],
  );

  const setHour = React.useCallback(
    (hour: number): void => emit({ ...parts, hour }),
    [emit, parts],
  );
  const setMinute = React.useCallback(
    (minute: number): void => emit({ ...parts, minute }),
    [emit, parts],
  );
  const setSecond = React.useCallback(
    (second: number): void => emit({ ...parts, second }),
    [emit, parts],
  );

  const columns: React.ReactNode[] = [];

  if (format === '24h') {
    columns.push(
      <NumberPicker
        key="hour"
        min={0}
        max={23}
        step={1}
        pad={2}
        value={parts.hour}
        onChange={setHour}
        itemHeight={itemHeight}
        visibleCount={visibleCount}
        loop
        label="Hour"
        disabled={disabled}
      />,
    );
  } else {
    const { hour12, meridiem } = to12h(parts.hour);
    columns.push(
      <NumberPicker
        key="hour12"
        min={1}
        max={12}
        step={1}
        pad={2}
        value={hour12}
        onChange={(h) => setHour(to24h(h, meridiem))}
        itemHeight={itemHeight}
        visibleCount={visibleCount}
        loop
        label="Hour"
        disabled={disabled}
      />,
    );
    columns.push(
      <SnapPicker<Meridiem>
        key="meridiem"
        items={MERIDIEMS}
        value={meridiem}
        onChange={(m) => setHour(to24h(hour12, m))}
        itemHeight={itemHeight}
        visibleCount={visibleCount}
        label="AM/PM"
        disabled={disabled}
      />,
    );
  }

  columns.splice(
    1,
    0,
    <NumberPicker
      key="minute"
      min={0}
      max={59}
      step={minuteStep}
      pad={2}
      value={parts.minute}
      onChange={setMinute}
      itemHeight={itemHeight}
      visibleCount={visibleCount}
      loop
      label="Minute"
      disabled={disabled}
    />,
  );

  if (showSeconds) {
    columns.splice(
      2,
      0,
      <NumberPicker
        key="second"
        min={0}
        max={59}
        step={secondStep}
        pad={2}
        value={parts.second}
        onChange={setSecond}
        itemHeight={itemHeight}
        visibleCount={visibleCount}
        loop
        label="Second"
        disabled={disabled}
      />,
    );
  }

  return (
    <div
      role="group"
      aria-label={label ?? 'Time picker'}
      className={cn('flex items-stretch gap-2', className)}
    >
      {columns.map((col, i) => (
        <div key={i} className="flex-1">
          {col}
        </div>
      ))}
    </div>
  );
};
