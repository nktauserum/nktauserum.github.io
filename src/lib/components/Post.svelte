<script lang="ts">
	import { onMount } from 'svelte';
	import type { Post } from '$lib/types/Post';

	const props = $props();
	const uuid: string = props.uuid;

	async function fetchPost(uuid: string): Promise<Post> {
		const res = await fetch(`http://localhost:8080/articles/${uuid}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!res.ok) {
			const error = await res.json().catch(() => ({ message: res.statusText }));
			throw new Error(error.message || `Ошибка ${res.status}`);
		}

		const data = (await res.json()) as Post;
		return data;
	}

	let post = $state<Post | null>(null);
	let loading = $state(false);
	let error: string | null = null;

	async function loadPosts() {
		loading = true;
		error = null;

		try {
			const fetched = await fetchPost(uuid);
			post = fetched;
		} catch (err) {
			error = err instanceof Error ? err.message : String(err);
		} finally {
			loading = false;
		}
	}

	onMount(loadPosts);
</script>

<svelte:head>
	{#if post}
		<title>{post.title}</title>
	{:else}
		<title>loading...</title>
	{/if}
</svelte:head>

<div class="post">
	{#if loading}
		Loading...
	{:else if post}
		<h1 class="text-3xl font-bold">{post.title}</h1>
		<hr />
		<p>{post.content}</p>
	{/if}
</div>
