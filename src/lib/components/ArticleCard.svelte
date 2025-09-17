<script lang="ts">
	import type { Article } from '$lib/types';
	import Button from './Button.svelte';
	import { roleStore } from '$lib/stores/role';

	const props = $props<{ article: Article; onEdit?: () => void; onDelete?: () => void }>();
	let role = $state('editor');

	$effect(() => {
		const unsub = roleStore.subscribe((v) => (role = v));
		return unsub;
	});
</script>

<article
	class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
>
	<header class="mb-3">
		<h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{props.article.title}</h2>
		<div class="mt-2 flex items-center gap-4 text-sm text-gray-700 dark:text-gray-300">
			<span
				class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {props
					.article.status === 'Published'
					? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
					: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}"
			>
				{props.article.status}
			</span>
			<span>by {props.article.author}</span>
			<time datetime={props.article.createdAt}
				>{new Date(props.article.createdAt).toLocaleDateString()}</time
			>
		</div>
	</header>

	{#if role === 'editor'}
		<footer class="mt-4 flex gap-2">
			<Button onclick={props.onEdit}>Edit</Button>
			<Button onclick={props.onDelete}>Delete</Button>
		</footer>
	{/if}
</article>
