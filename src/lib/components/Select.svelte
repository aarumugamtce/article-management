<script lang="ts">
	let {
		label,
		value,
		error,
		options,
		onChange
	}: {
		label: string;
		value: string;
		error?: string;
		options: string[];
		onChange?: (val: string) => void;
	} = $props();
</script>

<div class="mb-4">
	<label class="mb-2 block font-medium text-gray-700 dark:text-gray-300" for={label}>{label}</label>
	<select
		id={label}
		bind:value
		onchange={(e) => onChange?.(e.currentTarget.value)}
		aria-invalid={!!error}
		class="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
	>
		{#each options as opt}
			<option value={opt === 'All' ? '' : opt}>{opt}</option>
		{/each}
	</select>
	{#if error}<span class="text-sm text-red-500" role="alert">{error}</span>{/if}
</div>
