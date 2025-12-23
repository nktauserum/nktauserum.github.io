<script lang="ts">
	const info = {
		avatar: 'https://avatars.githubusercontent.com/u/145584656?v=4',
		name: 'Никита Архипов',
		description: 'Описание профиля.'
	};
</script>

<header>
	<img src="https://avatars.githubusercontent.com/u/145584656?v=4" alt="avatar" class="avatar" />

	<div class="info">
		<h1 class="name">{info.name}</h1>
		<p class="description">{info.description}</p>
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

	@media screen and (max-width: 576px) {
		header {
			flex-direction: column;
			justify-content: center;
			align-items: center !important;
			text-align: center;
		}
	}
</style>
