<script lang="ts">
	import type { PostsResponse } from '$lib/types/Post';
	import type { Post } from '$lib/types/Post';
	import { onMount } from 'svelte';
	import { base } from "$app/paths";

	export async function fetchPosts(page: number = 1, limit: number = 10): Promise<PostsResponse> {
		const params = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString()
		});

		const res = await fetch(`http://localhost:8080/articles?${params.toString()}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!res.ok) {
			const error = await res.json().catch(() => ({ message: res.statusText }));
			throw new Error(error.message || `Ошибка ${res.status}`);
		}

		const data = (await res.json()) as PostsResponse;
		return data;
	}

	let posts: Post[] = [];
	let page = 1;
	let limit = 10;
	let loading = false;
	let error: string | null = null;

	async function loadPosts() {
		loading = true;
		error = null;
		try {
			const { posts: fetched, page: p, limit: l } = await fetchPosts(page, limit);
			posts = fetched;
			page = p;
			limit = l;
		} catch (err) {
			error = err instanceof Error ? err.message : String(err);
		} finally {
			loading = false;
		}
	}

	onMount(loadPosts);
</script>

<div class="list">
	{#if loading}
		<p>Загрузка...</p>
	{:else if error}
		<p class="error">{error}</p>
	{:else}
		{#each posts as post}
			<div class="list__item">
				<a href="{base}/articles?post={post.uuid}" class="title">
					{post.title}
				</a>

				<p class="description">{post.description}</p>

				<div class="meta">
					<span class="date"
						>{new Date(post.created_at).toLocaleDateString('ru-RU', {
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						})}</span
					>
				</div>

				<div class="tags">
					{#each post.tags as tag}
						<a href="{base}/?tag={tag}" class="tag">
							{tag}
						</a>
					{/each}
				</div>
			</div>
		{/each}
	{/if}
</div>

<style>
	.list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin: 1rem 0;
	}

	.list__item {
		padding: 1.25rem;
		border-radius: 6px;
		transition: box-shadow 0.3s;
	}

	.list__item:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	}

	.meta {
		font-weight: 600;
		color: var(--text-secondary);
		margin-bottom: 0.25rem;
	}

	.title {
		color: var(--link);
		font-weight: 800;
		font-size: 1.75rem;
		text-decoration: none;
	}

	.title:hover {
		text-decoration: underline;
	}

	.description {
		margin: 0.5rem 0;
		color: var(--text-secondary);
		line-height: 1.5;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 0.75rem;
	}

	.tag {
		position: relative;
		padding: 0.5rem 1rem;
		color: var(--tag-color);
		background: var(--tag-bg);
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.tag:hover {
		background-color: rgba(0, 0, 0, 0.7);
	}
</style>
