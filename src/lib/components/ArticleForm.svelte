<script lang="ts">
  import type { Article } from '$lib/types';
  import Input from './Input.svelte';
  import Select from './Select.svelte';
  import Button from './Button.svelte';

  const props = $props<{ article?: Article; onSubmit?: (data: Omit<Article, 'id' | 'createdAt'>) => void }>();

  let title = $state(props.article?.title ?? '');
  let status = $state<'Published' | 'Draft'>(props.article?.status ?? 'Draft');
  let author = $state(props.article?.author ?? '');
  
  let errors = $state<Record<string, string>>({});

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!author.trim()) newErrors.author = 'Author is required';
    errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: Event) {
    e.preventDefault();
    if (validate()) {
      props.onSubmit?.({ title: title.trim(), status, author: author.trim() });
    }
  }
</script>

<form onsubmit={handleSubmit}>
  <Input label="Title" value={title} error={errors.title} onInput={(val) => title = val} />
  <Select label="Status" value={status} onChange={(val) => status = val as 'Published' | 'Draft'} options={['Published', 'Draft']} />
  <Input label="Author" value={author} error={errors.author} onInput={(val) => author = val} />
  <Button type="submit">Save</Button>
</form>