<script lang="ts">
	import type { Info } from '$lib/types/Info';

	const info: Info = {
		avatar: 'https://avatars.githubusercontent.com/u/145584656?v=4',
		name: 'Никита Архипов',
		description: 'Описание профиля.'
	};

	const popular_tags: string[] = ['Rust', 'Golang'];
</script>

<header>
	<img src={info.avatar} alt="avatar" class="avatar" />

	<div class="info">
		<h1 class="name">{info.name}</h1>
		<p class="description">{info.description}</p>

		<div class="tags">
			{#each popular_tags as tag}
				<a href="/?tag={tag}" class="tag">
					{tag}
				</a>
			{/each}
		</div>
	</div>
</header>

<style>
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
		background-color: rgba(0, 0, 0, 0.178);
	}

	.tag:hover {
		background-color: rgba(0, 0, 0, 0.7);
	}

	header {
		display: flex;
		gap: 1rem;
		padding: 2rem;
		max-width: 600px;
	}

	.avatar {
		width: 200px;
		height: 200px;
		border-radius: 10%;
		object-fit: cover;
		border: 2px solid var(--accent);
	}

	.info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.name {
		font-size: 2rem;
		font-weight: 700;
		margin: 0;
		color: var(--text-primary);
	}

	.description {
		font-size: 1.5rem;
		font-weight: 400;
		margin: 0;
		color: var(--text-secondary);
	}
</style>
