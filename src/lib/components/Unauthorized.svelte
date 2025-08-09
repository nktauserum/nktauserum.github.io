<script lang="ts">
	import { base } from "$app/paths";
	function redirect() {
		window.location.href = '/';
	}
</script>

<div class="unauthorized-frame" on:click={redirect}>
	<div class="window" on:click|stopPropagation>
		<div class="popup">
			<img src="{base}/images/unauthorized-access.jpg" alt="Unauthorized access" />
			<h1 class="text-2xl font-bold">Эй, дружок!</h1>
			<div class="mt-1 text-lg">
				Кажется, ты выбрал не тот эндпоинт. Вход для посетителей на главной странице.
			</div>
		</div>
		<button class="close" aria-label="Close" on:click={redirect}>
			<svg
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
			>
				<path
					d="M1 1L15 15M15 1L1 15"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
				/>
			</svg>
		</button>
	</div>
</div>

<style>
	.unauthorized-frame {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #000000a1;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1;
	}

	.window {
		display: flex;
		gap: 1rem;
	}

	.popup {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		width: 30rem;
		padding: 1.5rem;
		background: #3f3f3f;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		border-radius: 0.5rem;
	}

	.popup img {
		max-width: 100%;
		max-height: 18rem;
		border-radius: 0.5rem;
		margin-bottom: 1rem;
	}

	.popup p {
		color: #ffffff;
		font-size: 1.1rem;
		line-height: 1.4;
		margin: 0;
	}

	.close {
		flex-shrink: 0;
		width: 2.5rem;
		height: 2.5rem;
		background: #fff;
		border: none;
		border-radius: 50%;
		padding: 0;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #333;
		transition: background 0.2s;
		outline: none;
	}

	.close:hover {
		background: #e0e0e0;
	}

	.close:focus {
		box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.3);
	}

	.close svg {
		display: block;
		margin-top: 2px;
		margin-left: 1px;
		transform: scale(0.8);
	}
</style>
