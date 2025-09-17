<script lang="ts">
  let { type = 'button', disabled = false, onclick, children, ...rest }: {
    type?: 'button' | 'submit';
    disabled?: boolean;
    onclick?: () => void;
    children?: any;
    [key: string]: any;
  } = $props();
</script>

<button 
  {type}
  {disabled}
  {onclick}
  {...rest}
  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed" 
  aria-disabled={disabled}
>
  {@render children?.()}
</button>