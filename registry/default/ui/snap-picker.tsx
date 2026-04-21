'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useSnapScroll } from '@/hooks/use-snap-scroll';

export interface SnapPickerClassNames {
  root?: string;
  viewport?: string;
  pointer?: string;
  item?: string;
  itemSelected?: string;
}

export interface SnapPickerRenderContext<T> {
  item: T;
  index: number;
  isSelected: boolean;
  distance: number;
}

export interface SnapPickerProps<T> {
  items: readonly T[];
  value: T;
  onChange: (value: T, index: number) => void;
  /** Row height in px. Default: 60. */
  itemHeight?: number;
  /** Number of items visible (must be odd). Default: 5. */
  visibleCount?: number;
  /** Wrap-around. Default: false. */
  loop?: boolean;
  /** Custom key extractor for complex items. */
  getKey?: (item: T, index: number) => React.Key;
  /** Custom renderer. Defaults to `String(item)`. */
  renderItem?: (ctx: SnapPickerRenderContext<T>) => React.ReactNode;
  /** Deep equality for non-primitive values. */
  equals?: (a: T, b: T) => boolean;
  /** Optional label for the whole picker; exposed as aria-label. */
  label?: string;
  classNames?: SnapPickerClassNames;
  className?: string;
  disabled?: boolean;
}

const SnapPickerInner = <T,>({
  items,
  value,
  onChange,
  itemHeight = 60,
  visibleCount = 5,
  loop = false,
  getKey,
  renderItem,
  equals,
  label,
  classNames,
  className,
  disabled,
}: SnapPickerProps<T>): React.ReactElement => {
  const {
    containerRef,
    paddingTop,
    paddingBottom,
    snapToIndex,
    activeIndex,
  } = useSnapScroll<T>({
    items,
    value,
    onChange,
    itemHeight,
    visibleCount,
    loop,
    equals,
  });

  const height = itemHeight * visibleCount;

  return (
    <div
      role="listbox"
      aria-label={label}
      aria-disabled={disabled}
      className={cn(
        'relative overflow-hidden select-none',
        classNames?.root,
        className,
      )}
      style={{ height }}
    >
      {/* Center pointer */}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-x-0 z-10 rounded-md bg-muted/60',
          classNames?.pointer,
        )}
        style={{ top: paddingTop, height: itemHeight }}
      />
      {/* Scroll viewport */}
      <div
        ref={containerRef}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            snapToIndex(activeIndex + 1);
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            snapToIndex(activeIndex - 1);
          } else if (e.key === 'Home') {
            e.preventDefault();
            snapToIndex(0);
          } else if (e.key === 'End') {
            e.preventDefault();
            snapToIndex(items.length - 1);
          }
        }}
        className={cn(
          'relative z-20 h-full overflow-y-auto outline-none',
          'snap-y snap-mandatory scroll-smooth',
          '[&::-webkit-scrollbar]:hidden [scrollbar-width:none]',
          classNames?.viewport,
        )}
      >
        <div style={{ height: paddingTop }} aria-hidden />
        {items.map((item, idx) => {
          const isSelected = idx === activeIndex;
          const distance = Math.abs(idx - activeIndex);
          return (
            <div
              key={getKey ? getKey(item, idx) : idx}
              role="option"
              aria-selected={isSelected}
              onClick={() => {
                if (disabled) return;
                snapToIndex(idx);
              }}
              className={cn(
                'flex w-full cursor-pointer snap-center items-center justify-center text-center text-xl transition-colors',
                isSelected
                  ? 'font-semibold text-foreground'
                  : 'text-muted-foreground',
                classNames?.item,
                isSelected && classNames?.itemSelected,
              )}
              style={{ height: itemHeight }}
            >
              {renderItem
                ? renderItem({ item, index: idx, isSelected, distance })
                : String(item)}
            </div>
          );
        })}
        <div style={{ height: paddingBottom }} aria-hidden />
      </div>
    </div>
  );
};

/**
 * `SnapPicker` — a generic, accessible vertical snap scroll picker.
 *
 * Preserves generic `T` by re-exporting the inner component. Users get
 * proper type inference from `items` / `value` / `onChange`.
 */
export const SnapPicker = SnapPickerInner as <T>(
  props: SnapPickerProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement;
