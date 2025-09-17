<script lang="ts">
  import { debounce } from '$lib/utils/debounce';
  import { DEBOUNCE_DELAY } from '$lib/constants';

  let { label, value, error, onInput }: {
    label: string;
    value: string;
    error?: string;
    onInput?: (val: string) => void;
  } = $props();
  
  let inputValue = $state(value);
  const debouncedInput = debounce((val: string) => onInput?.(val), DEBOUNCE_DELAY);
  
  $effect(() => {
    inputValue = value;
  });
</script>

<div class="mb-4">
  <label class="block mb-2 font-medium text-gray-700 dark:text-gray-300" for={label}>{label}</label>
  <input 
    id={label} 
    bind:value={inputValue} 
    oninput={(e) => debouncedInput(e.currentTarget.value)} 
    aria-invalid={!!error} 
    class="border border-gray-300 dark:border-gray-600 p-2 w-full rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
  />
  {#if error}<span class="text-red-500 text-sm" role="alert">{error}</span>{/if}
</div>