<script lang="ts">
	import { playerStore } from '$lib/store';
	import type { Track } from '$lib/types/track';
	import { onMount } from 'svelte';

	let tracks: Track[] | null = $state(null);

	function create_title(): string {
		return $playerStore.track
			? `✨ ${$playerStore.track.title} - ${$playerStore.track.artist}`
			: '✨ Новогодний плейлист ✨';
	}

	onMount(async () => {
		const res = await fetch('/list.json');
		tracks = await res.json();
	});
</script>

<svelte:head>
	<title>{create_title()}</title>
</svelte:head>

<div class="list">
	{#if tracks}
		<ul class="track_list">
			{#each tracks as track, i}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<li>
					<button
						class="list__item results__item"
						aria-label="Play the track"
						on:click={() => {
							if (tracks) {
								playerStore.play(tracks, i);
							}
						}}
					>
						<div class="item__cover-wrapper">
							<img src={track.cover_url} class="item__cover" alt="cover" />
							<div class="item__overlay">
								<svg class="item__play-icon" viewBox="0 0 24 24" fill="currentColor">
									<path d="M8 5v14l11-7z" />
								</svg>
							</div>
						</div>
						<div class="item__info">
							<div class="item__title">{track.title}</div>
							<div class="item__artists">
								<p class="item__artist">{track.artist}</p>
							</div>
						</div>
						<a
							href={track.audio_url}
							download={`${track.title} - ${track.artist}`}
							class="item__add"
							aria-label="download"
							on:click|stopPropagation
						>
							<i class="bi bi-download" style="font-size: 1rem; color:rgb(255,255,255);"></i>
						</a>
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.track_list {
		width: 100%;
		background: none;
	}

	.track_list li {
		position: relative;
	}

	.list__item {
		width: 100%;
		display: flex;
		align-items: center;
		height: 4.5rem;
		background: var(--bg-second);
		padding: 1rem;
		cursor: pointer;
		outline: none;
		text-align: start;
		transition: background-color 0.2s ease;
		gap: 1rem;
	}

	.list__item:hover {
		background-color: var(--bg-first);
	}

	.list__item:hover .item__cover {
		opacity: 0.7;
	}

	.list__item:hover .item__overlay {
		opacity: 1;
	}

	.item__cover-wrapper {
		position: relative;
		width: 3rem;
		height: 3rem;
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.item__cover {
		width: 100%;
		height: 100%;
		background-color: var(--bg-first);
		border-radius: 0.5rem;
		transition: opacity 0.2s ease;
	}

	.item__overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transition: opacity 0.1s ease;
		border-radius: 0.5rem;
	}

	.item__play-icon {
		width: 1.5rem;
		height: 1.5rem;
		color: white;
	}

	.item__info {
		display: block;
		background: none;
	}

	.item__title {
		width: 100%;
		background: none;
		font-size: 1.1rem;
		margin-bottom: 0.1rem;

		white-space: nowrap; /* Запрещаем перенос строк */
		overflow: hidden; /* Обрезаем все, что не помещается в область */
		text-overflow: ellipsis;
	}

	.item__artists {
		display: flex;
		background: none;
		gap: 0.3rem;
	}

	.item__artist {
		background: none;
		font-size: 0.9rem;
		color: var(--txt-second);
		background: none;
		cursor: pointer;
	}

	.item__add {
		margin-left: auto;
		background: none;
		cursor: pointer;
	}
</style>
