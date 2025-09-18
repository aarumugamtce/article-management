<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<title>Article Manager</title>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
