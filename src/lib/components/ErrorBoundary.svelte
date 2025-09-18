<script lang="ts">
	import { onMount } from 'svelte';
	import Button from './Button.svelte';
	import { logError } from '$lib/utils/errorHandler';

	const { children, fallback } = $props<{
		children: any;
		fallback?: any;
	}>();

	let hasError = $state(false);
	let errorMessage = $state('');

	onMount(() => {
		const handleError = (event: ErrorEvent) => {
			hasError = true;
			errorMessage = event.message || 'An unexpected error occurred';
			logError(event.error, 'ErrorBoundary');
		};

		const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
			hasError = true;
			errorMessage = 'A network or server error occurred';
			logError(event.reason, 'UnhandledPromiseRejection');
		};

		window.addEventListener('error', handleError);
		window.addEventListener('unhandledrejection', handleUnhandledRejection);

		return () => {
			window.removeEventListener('error', handleError);
			window.removeEventListener('unhandledrejection', handleUnhandledRejection);
		};
	});

	const retry = () => {
		hasError = false;
		errorMessage = '';
	};
</script>

{#if hasError}
	{#if fallback}
		{@render fallback()}
	{:else}
		<div class="flex min-h-[200px] items-center justify-center p-8">
			<div class="max-w-md text-center">
				<div class="mb-4 text-4xl">⚠️</div>
				<h2 class="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
					Something went wrong
				</h2>
				<p class="mb-6 text-gray-600 dark:text-gray-400">
					{errorMessage}
				</p>
				<div class="space-y-2">
					<Button onclick={retry}>Try Again</Button>
					<Button onclick={() => window.location.reload()}>Reload Page</Button>
				</div>
			</div>
		</div>
	{/if}
{:else}
	{@render children()}
{/if}
