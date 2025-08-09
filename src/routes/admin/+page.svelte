<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from "$app/paths";

	let title = '';
	let description = '';
	let content = '';
	let error: string | null = null;

	async function createPost() {
		error = null;
		try {
			const res = await fetch('http://localhost:8080/admin/articles/create', {
				method: 'POST',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title, description, content })
			});

			if (!res.ok) throw new Error('Login failed');
			const result = await res.json();
			goto({base} + `/articles?post=` + result.uuid);
		} catch (e: any) {
			error = e.message;
		}
	}

	let textareaEl: HTMLTextAreaElement;
	let minHeightPx: number;

	function autoResize(): void {
		textareaEl.style.height = 'auto';
		const newHeight = Math.max(textareaEl.scrollHeight, minHeightPx);
		textareaEl.style.height = `${newHeight}px`;
	}

	onMount(() => {
		textareaEl.style.height = '65vh';
		minHeightPx = textareaEl.clientHeight;
		autoResize();
	});
</script>

<svelte:head>
	<title>Админка</title>
</svelte:head>

<div class="post-container block">
	<form on:submit|preventDefault={createPost}>
		<button type="submit" class="btn btn-submit">Опубликовать</button>
		{#if error}
			<p class="error">{error}</p>
		{/if}

		<input type="text" bind:value={title} placeholder="Заголовок" required />

		<textarea bind:value={description} placeholder="Описание" required class="description block"
		></textarea>

		<textarea
			bind:value={content}
			bind:this={textareaEl}
			on:input={autoResize}
			placeholder="Текст поста"
			required
			class="content"
		></textarea>
	</form>
</div>

<style>
	form {
		display: block;
		margin-top: 2rem;
	}

	input,
	textarea {
		border: none;
		background: transparent;
		outline: none;
		box-shadow: none;
		appearance: none;
		overflow: hidden;
		resize: none;
		margin-bottom: 1rem;
		width: 100%;
		transition: box-shadow 0.3s;
		line-height: 1.5;
		border-radius: 10px;
	}

	input:focus,
	textarea:focus {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	}

	input {
		font-size: 1.5rem;
		font-weight: 600;
	}

	.description {
		font-size: 1.3rem;
		font-weight: 500;
	}

	.btn-submit {
		position: fixed;
		left: 50%;
		top: 0;
		right: 0;
		margin: 3rem 0 0 30rem;
		padding: 0.5rem;
		border: 1px solid #fff;
		cursor: pointer;
		width: 10rem;
	}

	.content {
		height: 68vh;
	}
</style>
