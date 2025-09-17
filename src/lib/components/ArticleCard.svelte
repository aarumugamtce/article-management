<script lang="ts">
  import type { Article } from '$lib/types';
  import Button from './Button.svelte';
  import { roleStore } from '$lib/stores/role';

  const props = $props<{ article: Article; onEdit?: () => void; onDelete?: () => void }>();
  let role = $state('editor');
  
  $effect(() => {
    const unsub = roleStore.subscribe(v => role = v);
    return unsub;
  });
</script>

<article class="border border-gray-200 dark:border-gray-700 p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
  <header class="mb-3">
    <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{props.article.title}</h3>
    <div class="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {props.article.status === 'Published' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}">
        {props.article.status}
      </span>
      <span>by {props.article.author}</span>
      <time datetime={props.article.createdAt}>{new Date(props.article.createdAt).toLocaleDateString()}</time>
    </div>
  </header>
  
  {#if role === 'editor'}
    <footer class="flex gap-2 mt-4">
      <Button onclick={props.onEdit}>Edit</Button>
      <Button onclick={props.onDelete}>Delete</Button>
    </footer>
  {/if}
</article>