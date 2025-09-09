<script lang="ts">
</script>

<header>
	<img src="https://avatars.githubusercontent.com/u/145584656?v=4" alt="avatar" class="avatar" />

	<div class="info">
		<h1 class="name">Никита Архипов</h1>
		<p class="description">Ищу себя в человеческом обществе. Не могу найти.</p>
	</div>
</header>

<style>
	header {
		display: flex;
		gap: 3rem;
		padding: 2rem;
		max-width: 700px;
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
		gap: 1rem;
	}

	.name {
		font-size: 3rem;
		font-weight: 700;
		margin: 0;
		color: var(--text-primary);
	}

	.description {
		font-size: 2rem;
		font-weight: 400;
		margin: 0;
		color: var(--text-secondary);
	}
</style>
