<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from './Button.svelte';

	const { isOpen, onClose, children } = $props<{
		isOpen: boolean;
		onClose: () => void;
		children?: Snippet;
	}>();

	let modalRef = $state<HTMLElement>();

	$effect(() => {
		document.body.style.overflow = isOpen ? 'hidden' : '';
		if (isOpen) modalRef?.focus();
	});

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') onClose();
	};

	const handleBackdropClick = (e: MouseEvent) => {
		if (e.target === e.currentTarget) onClose();
	};
</script>

{#if isOpen}
	<div
		class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-gray-900 p-4"
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
	>
		<div
			bind:this={modalRef}
			tabindex="-1"
			class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 text-gray-900 shadow-xl dark:bg-gray-800 dark:text-gray-100"
		>
			<div class="mb-4 flex justify-end">
				<Button onclick={onClose} title="Close modal">×</Button>
			</div>
			{@render children?.()}
		</div>
	</div>
{/if}
