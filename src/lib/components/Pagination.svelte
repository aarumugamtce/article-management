<script lang="ts">
  let { currentPage, totalPages, onPageChange }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  } = $props();
</script>

<nav class="flex justify-center items-center gap-2 mt-6">
  <button 
    onclick={() => onPageChange(currentPage - 1)}
    disabled={currentPage <= 1}
    class="px-3 py-1 rounded border"
  >
    Previous
  </button>
  
  <span class="px-4 py-1">
    Page {currentPage} of {totalPages}
  </span>
  
  <button 
    onclick={() => onPageChange(currentPage + 1)}
    disabled={currentPage >= totalPages}
    class="px-3 py-1 rounded border"
  >
    Next
  </button>
</nav>