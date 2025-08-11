<script lang="ts">
	import { onMount } from 'svelte';
	import type { Post } from '$lib/types/Post';
	import { fetchPost } from '$lib/post';

	const { uuid } = $props();
	let post: Post | undefined = $state();
	let loading = $state(false);
	let error: string | undefined = $state();

	async function loadPost() {
		loading = true;
		error = undefined;
		try {
			post = await fetchPost(uuid);
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			loading = false;
		}
	}

	onMount(loadPost);
</script>

<svelte:head>
	{#if post}
		<title>{post.title}</title>
		<meta name="description" content={post.description} />
	{:else}
		<title>Загрузка…</title>
	{/if}
</svelte:head>

<div class="container mx-auto px-4 py-8 text-gray-900 dark:text-gray-100">
	{#if loading}
		<div class="text-center text-gray-500 dark:text-gray-400">Загрузка статьи…</div>
	{:else if error}
		<div class="text-center text-red-600 dark:text-red-400">Ошибка: {error}</div>
	{:else if post}
		<article class="mx-auto prose prose-lg dark:prose-invert">
			<h1 class="mb-4 text-4xl font-extrabold">{post.title}</h1>
			<p class="mb-6 text-xl text-gray-700 dark:text-gray-300">{post.description}</p>
			<div class="text-base leading-relaxed text-gray-800 dark:text-gray-200">
				{@html post.content}
			</div>
		</article>
	{/if}
</div>

<style>
	.container {
		max-width: 800px;
	}
</style>
