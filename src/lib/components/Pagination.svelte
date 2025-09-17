<script lang="ts">
	let {
		currentPage,
		totalPages,
		onPageChange
	}: {
		currentPage: number;
		totalPages: number;
		onPageChange: (page: number) => void;
	} = $props();
</script>

<nav class="mt-6 flex items-center justify-center gap-2">
	<button
		onclick={() => onPageChange(currentPage - 1)}
		disabled={currentPage <= 1}
		class="rounded border px-3 py-1"
	>
		Previous
	</button>

	<span class="px-4 py-1">
		Page {currentPage} of {totalPages}
	</span>

	<button
		onclick={() => onPageChange(currentPage + 1)}
		disabled={currentPage >= totalPages}
		class="rounded border px-3 py-1"
	>
		Next
	</button>
</nav>
