'use client';

import * as React from 'react';
import { SnapPicker, type SnapPickerClassNames } from '@/components/ui/snap-picker';

export interface NumberPickerProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  /** Left-pad the displayed number with zeroes to this many digits. */
  pad?: number;
  itemHeight?: number;
  visibleCount?: number;
  loop?: boolean;
  label?: string;
  className?: string;
  classNames?: SnapPickerClassNames;
  disabled?: boolean;
  /** Override the default string formatting (e.g. for suffixes). */
  format?: (n: number) => string;
}

const range = (min: number, max: number, step: number): number[] => {
  const out: number[] = [];
  for (let n = min; n <= max; n += step) out.push(n);
  return out;
};

export const NumberPicker = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  pad,
  itemHeight = 60,
  visibleCount = 5,
  loop = false,
  label,
  className,
  classNames,
  disabled,
  format,
}: NumberPickerProps): React.ReactElement => {
  const items = React.useMemo(() => range(min, max, step), [min, max, step]);
  const formatter = React.useCallback(
    (n: number): string => (format ? format(n) : pad ? String(n).padStart(pad, '0') : String(n)),
    [format, pad],
  );

  return (
    <SnapPicker<number>
      items={items}
      value={value}
      onChange={(v) => onChange(v)}
      itemHeight={itemHeight}
      visibleCount={visibleCount}
      loop={loop}
      label={label}
      disabled={disabled}
      className={className}
      classNames={classNames}
      renderItem={({ item }) => formatter(item)}
    />
  );
};
