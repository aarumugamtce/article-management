<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';

	const errorMessages = {
		400: { title: 'Bad Request', desc: 'The request could not be understood by the server.' },
		403: { title: 'Access Denied', desc: "You don't have permission to access this resource." },
		404: { title: 'Page Not Found', desc: "The page you're looking for doesn't exist." },
		500: {
			title: 'Server Error',
			desc: "We're experiencing technical difficulties. Please try again later."
		},
		503: {
			title: 'Service Unavailable',
			desc: 'The service is temporarily unavailable. Please check back soon.'
		}
	};

	const getErrorInfo = (status: number) => {
		return (
			errorMessages[status as keyof typeof errorMessages] || {
				title: 'Something Went Wrong',
				desc: 'An unexpected error occurred. Please try again.'
			}
		);
	};

	$: errorInfo = getErrorInfo($page.status);
	$: isServerError = $page.status >= 500;
</script>

<svelte:head>
	<title>Error {$page.status} - Article Manager</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
	<div class="w-full max-w-md text-center">
		<div class="mb-8">
			<div class="mb-4 text-6xl font-bold text-gray-300 dark:text-gray-600">
				{$page.status}
			</div>
			<h1 class="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
				{errorInfo.title}
			</h1>
			<p class="mb-8 text-gray-600 dark:text-gray-400">
				{errorInfo.desc}
			</p>
		</div>

		<div class="space-y-4">
			<Button onclick={() => goto('/')}>← Go Home</Button>

			{#if isServerError}
				<Button onclick={() => window.location.reload()}>🔄 Try Again</Button>
			{/if}
		</div>

		{#if isServerError}
			<div
				class="mt-8 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20"
			>
				<p class="text-sm text-yellow-800 dark:text-yellow-200">
					If this problem persists, please contact support with error code: {$page.status}
				</p>
			</div>
		{/if}
	</div>
</div>
