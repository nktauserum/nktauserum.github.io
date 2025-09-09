<script lang="ts">
	import '../app.css';
	import 'bootstrap-icons/font/bootstrap-icons.css';
</script>

<aside class="aside">
	<div class="aside__column">
		<a
			href="https://t.me/auserum"
			class="aside__item"
			rel="noopener noreferrer"
			target="_blank"
			aria-label="true"
		>
			<i class="bi bi-telegram" style="font-size: 1.875rem; color: #ffffff;"></i>
		</a>

		<a
			href="https://bsky.app/profile/nktauserum.bsky.social"
			class="aside__item"
			rel="noopener noreferrer"
			target="_blank"
			aria-label="true"
		>
			<i class="bi bi-bluesky" style="font-size: 1.875rem; color:rgb(255,255,255);"></i>
		</a>

		<a
			href="https://github.com/nktauserum"
			class="aside__item"
			rel="noopener noreferrer"
			target="_blank"
			aria-label="true"
		>
			<i class="bi bi-github" style="font-size: 1.875rem; color:rgb(255,255,255);"></i>
		</a>
	</div>
</aside>

<div class="container">
	<slot />
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');

	@media screen and (max-width: 576px) {
		.aside {
			margin: 0;
			min-height: 3rem !important;
			position: fixed !important;
			top: 0;
			left: 0;
			width: 100%;
			padding: 1rem 0;

			display: flex !important;
			justify-content: center;
			align-items: center !important;
			z-index: 1000;
		}

		.aside__column {
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 1.5rem;
		}

		.aside__item {
			font-size: 1.875rem;
			color: #fff;
			margin: 0;
		}
	}

	.aside {
		display: flex;
		min-height: 100vh;
		align-items: center;
		position: fixed;
		margin-left: 2rem;
	}

	.aside__item {
		display: block;
		font-size: 3rem;
		margin-bottom: 1rem;
	}
</style>
