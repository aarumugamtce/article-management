export function debounce<T extends (...args: any[]) => any>(
	fn: T,
	ms: number,
	immediate = false
): (...args: Parameters<T>) => void {
	let timeout: NodeJS.Timeout | null = null;
	let lastCallTime = 0;

	return (...args: Parameters<T>) => {
		const now = Date.now();
		const callNow = immediate && !timeout;

		if (timeout) clearTimeout(timeout);

		// For search: execute immediately on first call, then debounce
		if (callNow || (immediate && now - lastCallTime > ms)) {
			fn(...args);
			lastCallTime = now;
		}

		timeout = setTimeout(() => {
			timeout = null;
			if (!callNow) {
				fn(...args);
				lastCallTime = Date.now();
			}
		}, ms);
	};
}
