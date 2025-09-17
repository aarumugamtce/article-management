<script lang="ts">
	let {
		type = 'button',
		disabled = false,
		onclick,
		children,
		...rest
	}: {
		type?: 'button' | 'submit';
		disabled?: boolean;
		onclick?: () => void;
		children?: any;
		[key: string]: any;
	} = $props();
</script>

<button
	{type}
	{disabled}
	{onclick}
	{...rest}
	class="rounded-md border border-gray-300 bg-gray-100 px-4 py-2 font-medium text-gray-900 transition-colors hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-400"
	aria-disabled={disabled}
>
	{@render children?.()}
</button>
