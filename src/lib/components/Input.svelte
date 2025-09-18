<script lang="ts">
	import { debounce } from '$lib/utils/debounce';
	import { DEBOUNCE_DELAY } from '$lib/constants';

	const { label, value, error, placeholder, onInput } = $props<{
		label: string;
		value: string;
		error?: string;
		placeholder?: string;
		onInput?: (val: string) => void;
	}>();

	const debouncedInput = debounce((val: string) => onInput?.(val), DEBOUNCE_DELAY, true);
</script>

<div class="mb-4">
	<label class="mb-2 block font-medium text-gray-700 dark:text-gray-300" for={label}>{label}</label>
	<input
		id={label}
		{value}
		oninput={(e) => debouncedInput(e.currentTarget.value)}
		aria-invalid={!!error}
		{placeholder}
		class="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
	/>
	{#if error}<span class="text-sm text-red-500" role="alert">{error}</span>{/if}
</div>
