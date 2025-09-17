<script lang="ts">
	import { onMount } from 'svelte';
	import type { Article } from '$lib/types';
	import { roleStore, setRole } from '$lib/stores/role';
	import { themeStore, setTheme } from '$lib/stores/theme';

	import { PAGINATION, OBSERVER_CONFIG, MESSAGES } from '$lib/constants';
	import Modal from '$lib/components/Modal.svelte';
	import ArticleForm from '$lib/components/ArticleForm.svelte';
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import Input from '$lib/components/Input.svelte';
	import Select from '$lib/components/Select.svelte';
	import Button from '$lib/components/Button.svelte';

	// Initialize from localStorage to persist across refreshes
	let search = $state(
		typeof localStorage !== 'undefined' ? localStorage.getItem('search') || '' : ''
	);
	let status = $state(
		typeof localStorage !== 'undefined' ? localStorage.getItem('status') || '' : ''
	);
	let viewMode = $state<'list' | 'grid'>(
		typeof localStorage !== 'undefined'
			? (localStorage.getItem('viewMode') as 'list' | 'grid') || 'list'
			: 'list'
	);

	let page = $state(1);
	let total = $state(0);
	let loading = $state(false);
	let error = $state<string | undefined>();
	let modalOpen = $state(false);
	let editingArticle = $state<Article | undefined>();
	let hasMore = $state(true);
	let loadMoreRef = $state<HTMLElement>();
	let displayedArticles = $state<Article[]>([]);
	let showScrollTop = $state(false);

	let currentTheme = $state('dark');
	let currentRole = $state(
		typeof document !== 'undefined'
			? (document.documentElement.getAttribute('data-role') as 'editor' | 'viewer') || 'editor'
			: 'editor'
	);

	$effect(() => {
		const unsubTheme = themeStore.subscribe((v) => (currentTheme = v));
		const unsubRole = roleStore.subscribe((v) => {
			currentRole = v;
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem('role', v);
			}
		});
		return () => {
			unsubTheme();
			unsubRole();
		};
	});

	// Persist search, status, and viewMode to localStorage
	$effect(() => {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('search', search);
		}
	});

	$effect(() => {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('status', status);
		}
	});

	$effect(() => {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('viewMode', viewMode);
		}
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

			observer = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting && hasMore && !loading) {
						page = page + 1;
						fetchArticles(true);
					}
				},
				{ threshold: OBSERVER_CONFIG.THRESHOLD }
			);

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
			document.documentElement.classList.toggle('dark', currentTheme === 'dark');

			// Scroll to top button visibility
			const handleScroll = () => {
				showScrollTop = window.scrollY > 300;
			};

			window.addEventListener('scroll', handleScroll);
			return () => window.removeEventListener('scroll', handleScroll);
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

<svelte:head>
	<title>Article Manager - Enterprise Article Management System</title>
	<meta
		name="description"
		content="Professional article management system built with SvelteKit, TypeScript, and Tailwind CSS"
	/>
	<script>
		// Prevent theme and role flash by setting states immediately
		(function () {
			const storedTheme = localStorage.getItem('theme');
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			const theme = storedTheme || (prefersDark ? 'dark' : 'dark'); // Default to dark
			if (theme === 'dark') {
				document.documentElement.classList.add('dark');
			}
			// Set data attributes for immediate access
			document.documentElement.setAttribute('data-theme', theme);

			const storedRole = localStorage.getItem('role') || 'editor';
			document.documentElement.setAttribute('data-role', storedRole);
		})();
	</script>
</svelte:head>

<main class="min-h-screen transition-colors">
	<header class="sticky top-0 z-40 bg-white p-4 shadow-sm dark:bg-gray-900">
		<h1 class="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100">Article Manager</h1>

		<div class="mb-4 flex flex-wrap items-center gap-4">
			<!-- Theme Toggle -->
			<div
				class="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
			>
				<span class="text-sm text-gray-700 dark:text-gray-300">☀️</span>
				<button
					onclick={() => setTheme(currentTheme === 'light' ? 'dark' : 'light')}
					title="Toggle theme"
					aria-label="Toggle theme"
					class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none {currentTheme ===
					'dark'
						? 'bg-blue-600'
						: 'bg-gray-200'}"
				>
					<span
						class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform {currentTheme ===
						'dark'
							? 'translate-x-6'
							: 'translate-x-1'}"
					></span>
				</button>
				<span class="text-sm text-gray-700 dark:text-gray-300">🌙</span>
			</div>

			<!-- Role Toggle -->
			<div
				class="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
			>
				<span class="text-sm text-gray-700 dark:text-gray-300">Viewer</span>
				<button
					onclick={() => setRole(currentRole === 'editor' ? 'viewer' : 'editor')}
					title="Toggle role"
					aria-label="Toggle role"
					class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none {currentRole ===
					'editor'
						? 'bg-blue-600'
						: 'bg-gray-200'}"
				>
					<span
						class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform {currentRole ===
						'editor'
							? 'translate-x-6'
							: 'translate-x-1'}"
					></span>
				</button>
				<span class="text-sm text-gray-700 dark:text-gray-300">Editor</span>
			</div>

			<!-- View Toggle - Hidden on mobile -->
			<div
				class="hidden items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 md:flex dark:border-gray-600 dark:bg-gray-800"
			>
				<span class="text-sm text-gray-700 dark:text-gray-300">📋</span>
				<button
					onclick={() => (viewMode = viewMode === 'list' ? 'grid' : 'list')}
					title="Toggle view mode"
					aria-label="Toggle view mode"
					class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none {viewMode ===
					'grid'
						? 'bg-blue-600'
						: 'bg-gray-200'}"
				>
					<span
						class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform {viewMode ===
						'grid'
							? 'translate-x-6'
							: 'translate-x-1'}"
					></span>
				</button>
				<span class="text-sm text-gray-700 dark:text-gray-300">⊞</span>
			</div>
		</div>

		<div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
			<Input
				label="Search by Title"
				placeholder="Type to search articles..."
				value={search}
				onInput={(val) => (search = val)}
			/>
			<Select
				label="Filter by Status"
				value={status}
				onChange={(val) => (status = val)}
				options={['All', 'Published', 'Draft']}
			/>
		</div>

		{#if currentRole === 'editor'}
			<Button
				onclick={() => {
					modalOpen = true;
					editingArticle = undefined;
				}}>+ Add Article</Button
			>
		{/if}
	</header>

	<section class="p-4">
		{#if loading && page === 1}
			<div class="py-8 text-center" aria-live="polite">
				<p>Loading articles...</p>
			</div>
		{/if}

		{#if error}
			<div
				class="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700 dark:border-red-600 dark:bg-red-900/50 dark:text-red-200"
				role="alert"
				aria-live="assertive"
			>
				{error}
			</div>
		{/if}

		{#if displayedArticles.length === 0 && !loading}
			<div class="py-8 text-center text-gray-500 dark:text-gray-400">
				<p>{MESSAGES.EMPTY_STATES.NO_ARTICLES}</p>
			</div>
		{:else}
			<section>
				<ul
					class={viewMode === 'grid'
						? 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'
						: 'space-y-4'}
					role="list"
				>
					{#each displayedArticles as art (art.id)}
						<li>
							<ArticleCard
								article={art}
								onEdit={() => {
									editingArticle = art;
									modalOpen = true;
								}}
								onDelete={() => handleDelete(art.id)}
							/>
						</li>
					{/each}
				</ul>

				<div
					bind:this={loadMoreRef}
					class="mt-8 flex h-20 items-center justify-center border-2 border-dashed border-gray-300"
				>
					{#if loading && page > 1}
						<p aria-live="polite">{MESSAGES.LOADING.MORE_ARTICLES}</p>
					{:else if !hasMore && displayedArticles.length > 0}
						<p class="text-gray-500 dark:text-gray-400">
							{MESSAGES.EMPTY_STATES.NO_MORE_ARTICLES} ({displayedArticles.length} total)
						</p>
					{:else if hasMore}
						<p class="text-gray-600 dark:text-gray-300">
							Scroll to load more... (Page {page}, {displayedArticles.length}/{total})
						</p>
					{/if}
				</div>
			</section>
		{/if}

		<Modal
			isOpen={modalOpen}
			onClose={() => {
				modalOpen = false;
				editingArticle = undefined;
			}}
		>
			<h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
				{editingArticle ? 'Edit Article' : 'Add New Article'}
			</h2>
			<ArticleForm article={editingArticle} onSubmit={handleSubmit} />
		</Modal>

		<!-- Scroll to Top Button -->
		{#if showScrollTop}
			<button
				onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
				class="fixed right-6 bottom-6 z-50 rounded-full border border-gray-300 bg-gray-100 p-3 text-gray-900 shadow-lg transition-all hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
				aria-label="Scroll to top"
				title="Go to top"
			>
				↑
			</button>
		{/if}
	</section>
</main>
