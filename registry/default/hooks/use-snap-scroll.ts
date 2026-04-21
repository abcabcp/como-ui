import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface UseSnapScrollOptions<T> {
	items: readonly T[];
	value: T;
	onChange: (value: T, index: number) => void;
	itemHeight: number;
	/** Equality comparator; defaults to Object.is. Used to locate the active index. */
	equals?: (a: T, b: T) => boolean;
	/** Number of items visible at once (must be odd to center the pointer). */
	visibleCount?: number;
	/** If true, the list wraps around like a drum. */
	loop?: boolean;
	/** Debounce ms between scroll-end detection and snap. */
	snapDebounceMs?: number;
}

export interface UseSnapScrollReturn {
	containerRef: React.RefObject<HTMLDivElement | null>;
	paddingTop: number;
	paddingBottom: number;
	snapToIndex: (index: number, smooth?: boolean) => void;
	activeIndex: number;
	visibleCount: number;
}

const defaultEquals = <T>(a: T, b: T): boolean => Object.is(a, b);

/**
 * Headless scroll-snap logic for vertical pickers.
 *
 * Consumers supply the items + value; the hook manages scroll position,
 * snap-on-settle behavior, and reports the currently active index.
 */
export const useSnapScroll = <T>(
	options: UseSnapScrollOptions<T>,
): UseSnapScrollReturn => {
	const {
		items,
		value,
		onChange,
		itemHeight,
		equals = defaultEquals,
		visibleCount = 5,
		loop = false,
		snapDebounceMs = 100,
	} = options;

	const containerRef = useRef<HTMLDivElement>(null);
	const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const isProgrammaticScrollRef = useRef(false);
	const [activeIndex, setActiveIndex] = useState<number>(() => {
		const idx = items.findIndex((i) => equals(i, value));
		return idx === -1 ? 0 : idx;
	});

	const { paddingTop, paddingBottom } = useMemo(() => {
		const half = Math.floor(visibleCount / 2);
		return {
			paddingTop: half * itemHeight,
			paddingBottom: (visibleCount - Math.ceil(visibleCount / 2)) * itemHeight,
		};
	}, [itemHeight, visibleCount]);

	const snapToIndex = useCallback(
		(index: number, smooth = true): void => {
			const el = containerRef.current;
			if (!el) return;
			const clamped = loop
				? ((index % items.length) + items.length) % items.length
				: Math.max(0, Math.min(items.length - 1, index));
			isProgrammaticScrollRef.current = true;
			el.scrollTo({
				top: clamped * itemHeight,
				behavior: smooth ? "smooth" : "auto",
			});
			setActiveIndex(clamped);
			// Clear programmatic flag after the smooth scroll settles.
			setTimeout(
				() => {
					isProgrammaticScrollRef.current = false;
				},
				smooth ? 350 : 50,
			);
		},
		[itemHeight, items.length, loop],
	);

	const handleSettle = useCallback((): void => {
		const el = containerRef.current;
		if (!el || isProgrammaticScrollRef.current) return;
		const rawIndex = el.scrollTop / itemHeight;
		const nextIndex = Math.max(
			0,
			Math.min(items.length - 1, Math.round(rawIndex)),
		);
		setActiveIndex(nextIndex);
		const nextValue = items[nextIndex];
		if (nextValue === undefined) return;
		if (!equals(nextValue, value)) {
			onChange(nextValue, nextIndex);
		}
		// Snap if we settled between rows.
		if (Math.abs(rawIndex - nextIndex) > 0.01) {
			snapToIndex(nextIndex);
		}
	}, [equals, itemHeight, items, onChange, snapToIndex, value]);

	// Attach scroll/touch listeners
	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		const onScroll = (): void => {
			if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
			scrollTimeoutRef.current = setTimeout(handleSettle, snapDebounceMs);
		};

		el.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
			el.removeEventListener("scroll", onScroll);
		};
	}, [handleSettle, snapDebounceMs]);

	// External value changes should drive the scroll position.
	// We intentionally depend only on `value` + `items` so external updates
	// (e.g. controlled form value) resync the scroll, but internal scroll
	// updates don't re-trigger.
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		const idx = items.findIndex((i) => equals(i, value));
		if (idx === -1) return;
		if (idx !== activeIndex) {
			snapToIndex(idx);
		}
	}, [value, items]);

	return {
		containerRef,
		paddingTop,
		paddingBottom,
		snapToIndex,
		activeIndex,
		visibleCount,
	};
};
