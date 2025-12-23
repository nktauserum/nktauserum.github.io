<script lang="ts">
	import { playerStore } from "$lib/store";
	import type { Track } from "$lib/types/track";

    let tracks: Track[] = [
        {
            audio_url: 'https://raw.githubusercontent.com/nktauserum/libmusic/refs/heads/main/example/%D0%9Di%D0%BA%D0%BE%D0%BB%D0%B8%20-%20%D0%9E%D0%BA%D0%B5%D0%B0%D0%BD%20%D0%95%D0%BB%D1%8C%D0%B7%D0%B8.mp3',
            cover_url: 'https://t2.genius.com/unsafe/689x689/https%3A%2F%2Fimages.genius.com%2F5a7a692fcd8dba71cfd9188c494480fe.1000x1000x1.png',
            title: 'Нiколи',
            artist: 'Океан Ельзи',
        },
        {
            audio_url: 'https://raw.githubusercontent.com/nktauserum/libmusic/refs/heads/main/example/%D0%91%D0%BE%D0%BD%D0%B4%20%D1%81%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%BE%D0%B9%20-%20%D0%9A%D1%83%D1%85%D0%BD%D0%B8.mp3',
            cover_url: 'https://t2.genius.com/unsafe/689x689/https%3A%2F%2Fimages.genius.com%2F1de41e902062833940243d2e3717267e.1000x1000x1.png',
            title: 'Кухни',
            artist: 'Бонд с кнопкой',
        },
        {
            audio_url: 'https://raw.githubusercontent.com/nktauserum/libmusic/refs/heads/main/example/Дракон - Мельница.mp3',
            cover_url: 'https://t2.genius.com/unsafe/689x689/https%3A%2F%2Fimages.genius.com%2F54d44fed4f955864a6330d85b7fd5316.1000x1000x1.jpg',
            title: 'Дракон',
            artist: 'Мельница',
        },
        {
            audio_url: 'https://raw.githubusercontent.com/nktauserum/libmusic/refs/heads/main/example/Blue - YOASOBI.mp3',
            cover_url: 'https://t2.genius.com/unsafe/689x689/https%3A%2F%2Fimages.genius.com%2F94f2b6933945e049e6eddf918e3284b8.1000x1000x1.webp',
            title: 'Blue',
            artist: 'YOASOBI',
        },
    ];

	function create_title(): string {
		return $playerStore.track ? `✨ ${$playerStore.track.title} - ${$playerStore.track.artist}` : "✨ Новогодний плейлист ✨";
	}
</script>

<svelte:head>
	<title>{create_title()}</title>
</svelte:head>

<div class="list">
	<ul class="track_list">
		{#each tracks as track, i}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<li>

				<button class="list__item results__item" aria-label="Play the track" on:click={() => {
							if (tracks) {
								playerStore.play(tracks, i);
							}
						}}>
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
							href="{track.audio_url}"
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

	.item__play {
		width: 3rem;
		height: 3rem;
		margin-right: 1rem;
		background: none;
		padding: 0;
		border: none;
		cursor: pointer;
	}

	.item__info {
		display: block;
		background: none;
	}

	.item__title {
		background: none;
		font-size: 1.1rem;
		margin-bottom: 0.1rem;
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

	.dropdown-menu {
		position: absolute;
		top: 100%;
		right: 1rem;
		background-color: var(--bg-second);
		border: 1px solid var(--border, gray);
		border-radius: 0.5rem;
		padding: 0.5rem;
		z-index: 10;
		min-width: 10rem;
	}

	.dropdown-menu button {
		width: 100%;
		padding: 0.5rem 1rem;
		cursor: pointer;
		background: none;
	}

	.dropdown-menu button:hover {
		background-color: var(--bg-first);
	}
</style>