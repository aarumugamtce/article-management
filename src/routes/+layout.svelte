<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	const { children } = $props();
</script>

<svelte:head>
	<title>Article Manager - Modern Article Management</title>
	<meta name="description" content="Professional article management system built with SvelteKit" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
