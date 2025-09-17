<script lang="ts">
  import { onMount } from 'svelte';
  import Button from './Button.svelte';

  let { isOpen, onClose, children }: {
    isOpen: boolean;
    onClose: () => void;
    children?: any;
  } = $props();
  
  let modalRef = $state<HTMLElement>();

  $effect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      modalRef?.focus();
    }
    return () => { document.body.style.overflow = ''; };
  });

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      onClose();
    }
  }
</script>

{#if isOpen}
  <div 
    class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50" 
    role="dialog" 
    aria-modal="true" 
    tabindex="-1"
    onclick={onClose}
    onkeydown={handleKeydown}
  >
    <section 
      bind:this={modalRef} 
      tabindex="-1" 
      role="document"
      class="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl" 
      onclick={(e) => e.stopPropagation()}
    >
      <div class="flex justify-end mb-4">
        <Button onclick={onClose} title="Close modal">×</Button>
      </div>
      {@render children?.()}
    </section>
  </div>
{/if}