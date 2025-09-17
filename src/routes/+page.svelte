<script lang="ts">
  import { onMount } from 'svelte';
  import type { Article } from '$lib/types';
  import { articles } from '$lib/stores/articles';
  import { roleStore, setRole } from '$lib/stores/role';
  import { themeStore, setTheme } from '$lib/stores/theme';
  import { PAGINATION, DEBOUNCE_DELAY, OBSERVER_CONFIG, MESSAGES, USER_ROLES, THEMES } from '$lib/constants';
  import Modal from '$lib/components/Modal.svelte';
  import ArticleForm from '$lib/components/ArticleForm.svelte';
  import ArticleCard from '$lib/components/ArticleCard.svelte';
  import Input from '$lib/components/Input.svelte';
  import Select from '$lib/components/Select.svelte';
  import Button from '$lib/components/Button.svelte';

  let search = $state('');
  let status = $state('');
  let page = $state(1);
  let total = $state(0);
  let loading = $state(false);
  let error = $state<string | undefined>();
  let modalOpen = $state(false);
  let editingArticle = $state<Article | undefined>();
  let hasMore = $state(true);
  let loadMoreRef = $state<HTMLElement>();
  let displayedArticles = $state<Article[]>([]);

  let currentTheme = $state('light');
  let currentRole = $state('editor');
  
  $effect(() => {
    const unsubTheme = themeStore.subscribe(v => currentTheme = v);
    const unsubRole = roleStore.subscribe(v => currentRole = v);
    return () => { unsubTheme(); unsubRole(); };
  });

  async function fetchArticles(append = false) {
    loading = true;
    error = undefined;
    try {
      const { articleAPI } = await import('$lib/api/articles');
      const data = await articleAPI.getArticles({
        page,
        limit: PAGINATION.DEFAULT_LIMIT,
        search,
        status
      });
      
      if (append) {
        displayedArticles = [...displayedArticles, ...data.articles];
      } else {
        displayedArticles = data.articles;
      }
      total = data.total;
      hasMore = displayedArticles.length < total;
    } catch (e) {
      error = e instanceof Error ? e.message : MESSAGES.ERRORS.FETCH_FAILED;
    } finally {
      loading = false;
    }
  }

  // Initial fetch
  onMount(() => {
    fetchArticles();
  });
  
  // Reset page and fetch when search/status changes
  let lastSearch = $state('');
  let lastStatus = $state('');
  
  $effect(() => {
    if (search !== lastSearch || status !== lastStatus) {
      lastSearch = search;
      lastStatus = status;
      page = 1;
      displayedArticles = [];
      fetchArticles();
    }
  });

  // Separate effect for infinite scroll
  let observer: IntersectionObserver | undefined;
  
  $effect(() => {
    if (typeof window !== 'undefined' && loadMoreRef) {
      if (observer) observer.disconnect();
      
      observer = new IntersectionObserver((entries) => {
        console.log('Intersection observed:', entries[0].isIntersecting, 'hasMore:', hasMore, 'loading:', loading, 'page:', page);
        if (entries[0].isIntersecting && hasMore && !loading) {
          console.log('Loading more articles, incrementing page from:', page);
          const nextPage = page + 1;
          page = nextPage;
          fetchArticles(true);
        }
      }, { threshold: OBSERVER_CONFIG.THRESHOLD });
      
      observer.observe(loadMoreRef);
    }
    
    return () => {
      if (observer) {
        observer.disconnect();
        observer = undefined;
      }
    };
  });

  $effect(() => {
    if (typeof window !== 'undefined') {
      console.log('Theme changing to:', currentTheme);
      document.documentElement.classList.toggle('dark', currentTheme === 'dark');
      console.log('HTML classes:', document.documentElement.className);
    }
  });

  async function handleDelete(id: number) {
    try {
      const { articleAPI } = await import('$lib/api/articles');
      await articleAPI.deleteArticle(id);
      await fetchArticles();
    } catch (e) {
      error = e instanceof Error ? e.message : MESSAGES.ERRORS.DELETE_FAILED;
    }
  }

  async function handleSubmit(data: Omit<Article, 'id' | 'createdAt'>) {
    try {
      const { articleAPI } = await import('$lib/api/articles');
      
      if (editingArticle) {
        await articleAPI.updateArticle(editingArticle.id, data);
      } else {
        await articleAPI.createArticle(data);
      }
      
      modalOpen = false;
      editingArticle = undefined;
      await fetchArticles();
    } catch (e) {
      error = e instanceof Error ? e.message : MESSAGES.ERRORS.SAVE_FAILED;
    }
  }
</script>

<main class="min-h-screen transition-colors p-4">
  <header class="mb-6">
    <h1 class="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Article Manager</h1>
    
    <div class="flex gap-2 mb-4">
      <Button onclick={() => setTheme(currentTheme === 'light' ? 'dark' : 'light')}>
        {currentTheme === 'light' ? '🌙' : '☀️'} {currentTheme}
      </Button>
      <Button onclick={() => setRole(currentRole === 'editor' ? 'viewer' : 'editor')}>
        👤 {currentRole}
      </Button>
    </div>
  </header>

  <section class="mb-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <Input label="Search by Title" value={search} onInput={(val) => search = val} />
      <Select label="Filter by Status" value={status} onChange={(val) => status = val} options={['All', 'Published', 'Draft']} />
    </div>

    {#if currentRole === 'editor'}
      <Button onclick={() => { modalOpen = true; editingArticle = undefined; }}>+ Add Article</Button>
    {/if}
  </section>

  {#if loading && page === 1}
    <div class="text-center py-8" aria-live="polite">
      <p>Loading articles...</p>
    </div>
  {/if}
  
  {#if error}
    <div class="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4" role="alert" aria-live="assertive">
      {error}
    </div>
  {/if}

  {#if displayedArticles.length === 0 && !loading}
    <div class="text-center py-8 text-gray-500 dark:text-gray-400">
      <p>{MESSAGES.EMPTY_STATES.NO_ARTICLES}</p>
    </div>
  {:else}
    <section>
      <ul class="space-y-4" role="list">
        {#each displayedArticles as art (art.id)}
          <li>
            <ArticleCard 
              article={art} 
              onEdit={() => { editingArticle = art; modalOpen = true; }} 
              onDelete={() => handleDelete(art.id)} 
            />
          </li>
        {/each}
      </ul>

      <div bind:this={loadMoreRef} class="h-20 flex items-center justify-center border-2 border-dashed border-gray-300 mt-8">
        {#if loading && page > 1}
          <p aria-live="polite">{MESSAGES.LOADING.MORE_ARTICLES}</p>
        {:else if !hasMore && displayedArticles.length > 0}
          <p class="text-gray-500 dark:text-gray-400">{MESSAGES.EMPTY_STATES.NO_MORE_ARTICLES} ({displayedArticles.length} total)</p>
        {:else if hasMore}
          <p class="text-gray-400">Scroll to load more... (Page {page}, {displayedArticles.length}/{total})</p>
        {/if}
      </div>
    </section>
  {/if}

  <Modal isOpen={modalOpen} onClose={() => { modalOpen = false; editingArticle = undefined; }}>
    <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">{editingArticle ? 'Edit Article' : 'Add New Article'}</h2>
    <ArticleForm article={editingArticle} onSubmit={handleSubmit} />
  </Modal>
</main>