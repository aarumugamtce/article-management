<script lang="ts">
  let { label, value, error, options, onChange }: {
    label: string;
    value: string;
    error?: string;
    options: string[];
    onChange?: (val: string) => void;
  } = $props();
</script>

<div class="mb-4">
  <label class="block mb-2 font-medium text-gray-700 dark:text-gray-300" for={label}>{label}</label>
  <select 
    id={label} 
    bind:value={value} 
    onchange={(e) => onChange?.(e.currentTarget.value)} 
    aria-invalid={!!error} 
    class="border border-gray-300 dark:border-gray-600 p-2 w-full rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  >
    {#each options as opt}
      <option value={opt === 'All' ? '' : opt}>{opt}</option>
    {/each}
  </select>
  {#if error}<span class="text-red-500 text-sm" role="alert">{error}</span>{/if}
</div>