<script lang="ts">
	const { label, value, error, options, onChange } = $props<{
		label: string;
		value: string;
		error?: string;
		options: string[];
		onChange?: (val: string) => void;
	}>();

	let isOpen = $state(false);
	let dropdownRef = $state<HTMLDivElement>();

	const handleSelect = (option: string) => {
		const newValue = option === 'All' ? '' : option;
		onChange?.(newValue);
		isOpen = false;
	};

	const getDisplayValue = () => {
		return value === '' ? 'All' : value;
	};

	// Close dropdown when clicking outside
	$effect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
				isOpen = false;
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
			return () => document.removeEventListener('mousedown', handleClickOutside);
		}
	});
</script>

<div class="mb-4">
	<label class="mb-2 block font-medium text-gray-700 dark:text-gray-300" for="select-{label}"
		>{label}</label
	>
	<div class="relative" bind:this={dropdownRef}>
		<button
			id="select-{label}"
			type="button"
			onclick={() => (isOpen = !isOpen)}
			aria-expanded={isOpen}
			aria-haspopup="listbox"
			class="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white p-2 text-left text-gray-900 focus:border-gray-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 {error
				? 'border-red-500'
				: ''}"
		>
			<span>{getDisplayValue()}</span>
			<svg
				class="h-4 w-4 transition-transform {isOpen ? 'rotate-180' : ''}"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"
				></path>
			</svg>
		</button>

		{#if isOpen}
			<div
				class="absolute z-50 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800"
				role="listbox"
				aria-labelledby="select-{label}"
			>
				{#each options as option}
					<button
						type="button"
						onclick={() => handleSelect(option)}
						role="option"
						aria-selected={getDisplayValue() === option}
						class="w-full px-3 py-2 text-left text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700 {getDisplayValue() ===
						option
							? 'bg-gray-100 dark:bg-gray-700'
							: ''}"
					>
						{option}
					</button>
				{/each}
			</div>
		{/if}
	</div>
	{#if error}<span class="text-sm text-red-500" role="alert">{error}</span>{/if}
</div>
