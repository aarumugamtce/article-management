<script lang="ts">
	import type { Article } from '$lib/types';
	import Input from './Input.svelte';
	import Select from './Select.svelte';
	import Button from './Button.svelte';

	type FormData = Omit<Article, 'id' | 'createdAt'>;

	const { article, onSubmit } = $props<{
		article?: Article;
		onSubmit?: (data: FormData) => void;
	}>();

	let form = $state<FormData>({
		title: article?.title ?? '',
		status: article?.status ?? 'Draft',
		author: article?.author ?? ''
	});

	let errors = $state<Record<string, string>>({});

	const validate = () => {
		errors = {
			...(!form.title.trim() && { title: 'Title is required' }),
			...(!form.author.trim() && { author: 'Author is required' })
		};
		return !Object.keys(errors).length;
	};

	const handleSubmit = (e: Event) => {
		e.preventDefault();
		if (validate()) {
			onSubmit?.({
				title: form.title.trim(),
				status: form.status,
				author: form.author.trim()
			});
		}
	};
</script>

<form onsubmit={handleSubmit}>
	<Input
		label="Title"
		value={form.title}
		error={errors.title}
		onInput={(val) => (form.title = val)}
	/>
	<Select
		label="Status"
		value={form.status}
		onChange={(val) => (form.status = val as 'Published' | 'Draft')}
		options={['Published', 'Draft']}
	/>
	<Input
		label="Author"
		value={form.author}
		error={errors.author}
		onInput={(val) => (form.author = val)}
	/>
	<Button type="submit">Save</Button>
</form>
