<script lang="ts">
	import { playerStore } from '$lib/store';
	import { onMount, onDestroy } from 'svelte';

	const frequencies = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

	let audio: HTMLAudioElement | null = $state(null);
	let currentTime: number | null = $state(0);
	let duration: number | null = $state(0);
	let volume: number | null = $state(0.4);
	let audioContext: AudioContext;
	let source: MediaElementAudioSourceNode;
	let filters: BiquadFilterNode[] = [];
	let gains: number[] = new Array(frequencies.length).fill(0);

	let showEq = $state(false);
	let _onKeydown: (e: KeyboardEvent) => void;

	function formatTime(time: number): string {
		if (isNaN(time)) return '00:00';
		const minutes = Math.floor(time / 60)
			.toString()
			.padStart(2, '0');
		const seconds = Math.floor(time % 60)
			.toString()
			.padStart(2, '0');
		return `${minutes}:${seconds}`;
	}

	function next() {
		playerStore.next();
	}

	function prev() {
		playerStore.prev();
	}

	function openEq() {
		showEq = true;
	}

	function closeEq() {
		showEq = false;
	}

	$effect(() => {
		if (typeof document !== 'undefined') {
			document.body.style.overflow = showEq ? 'hidden' : 'auto';
		}
	});

	$effect(() => {
		if (audio && $playerStore.track) {
			if ($playerStore.isPlaying) {
				audio.play().catch(console.error);
			} else {
				audio.pause();
			}
		}
	});

	$effect(() => {
		if (audio && audioContext && filters.length === 0) {
			source = audioContext.createMediaElementSource(audio);
			let previousNode: AudioNode = source;
			frequencies.forEach((freq, index) => {
				const filter = audioContext.createBiquadFilter();
				filter.frequency.value = freq;
				filter.Q.value = 1;
				if (index === 0) {
					filter.type = 'lowshelf';
				} else if (index === frequencies.length - 1) {
					filter.type = 'highshelf';
				} else {
					filter.type = 'peaking';
				}
				// ensure initial gain is within ±10 dB
				filter.gain.value = Math.max(-10, Math.min(10, gains[index]));
				previousNode.connect(filter);
				previousNode = filter;
				filters.push(filter);
			});
			previousNode.connect(audioContext.destination);
		}
	});

	onMount(() => {
		audioContext = new AudioContext();

		_onKeydown = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && showEq) closeEq();
		};
		window.addEventListener('keydown', _onKeydown);
	});

	onDestroy(() => {
		if (audioContext) audioContext.close();
		if (_onKeydown) window.removeEventListener('keydown', _onKeydown);
	});

	function updateGain(index: number, value: number) {
		const clamped = Math.max(-10, Math.min(10, value));
		gains[index] = clamped;
		if (filters[index]) {
			filters[index].gain.value = clamped;
		}
	}

	function scaleToGain(value: number): number {
		return (value - 0.5) * 20;
	}
</script>

<div class="player">
	{#if $playerStore.track}
		<audio
			bind:this={audio}
			src={$playerStore.track.audio_url}
			bind:currentTime
			bind:duration
			bind:volume
			crossorigin="anonymous"
			onended={() => {
				playerStore.next();
			}}
			onerror={(e) => {
				const target = e.target as HTMLAudioElement | null;
				if (target && target.error) {
					const error = target.error;
					if (error.code === MediaError.MEDIA_ERR_ABORTED) {
						return;
					}
					console.error('Audio error:', error.message, '(code:', error.code, ')');
				} else {
					console.error('Unexpected audio error event');
				}
			}}
			onloadeddata={() => {
				if ($playerStore.isPlaying && audio) {
					audio.play().catch((err) => {
						if (err.name !== 'AbortError') {
							console.error('Play error on loadeddata:', err);
						}
					});
				}
			}}
		></audio>
	{/if}

	<div class="audio-progress">
		<input
			type="range"
			class="audio-progress__slider"
			bind:value={currentTime}
			min="0"
			max={duration}
			step="0.1"
		/>
	</div>

	<div class="player-content">
		<div class="track-section">
			{#if $playerStore.track}
				<img src={$playerStore.track.cover_url} class="track__cover" alt="cover" />
				<div class="track__info">
					<div class="info__title">{$playerStore.track.title}</div>
					<div class="info__artists">
						<p class="info__artist">{$playerStore.track.artist}</p>
					</div>
				</div>
				<div class="track__time">
					<time class="audio-progress__current-time"
						>{#if currentTime}{formatTime(currentTime)}{/if}</time
					>
					<span class="audio-progress__separator">/</span>
					<time class="audio-progress__total-time"
						>{#if duration}{formatTime(duration)}{/if}</time
					>
				</div>
			{:else}
				<div class="track__cover"></div>
			{/if}
		</div>

		<div class="controls">
			<button class="ctrl" aria-label="previous" onclick={() => prev()}>
				<svg class="ctrl-icon" color="var(--txt-second)" width="32" height="32" viewBox="0 0 16 16"
					><path
						fill="currentColor"
						d="M2 2.5a.5.5 0 0 1 1 0v11a.5.5 0 0 1-1 0v-11Zm12 .502a1 1 0 0 0-1.579-.816l-7 4.963a1 1 0 0 0-.006 1.628l7 5.037A1 1 0 0 0 14 13.003V3.002ZM6 7.965l7-4.963v10L6 7.966Z"
					/></svg
				>
			</button>

			<button
				class="ctrl play"
				aria-label={$playerStore.isPlaying ? 'Pause' : 'Play'}
				onclick={async () => {
					if (audioContext.state === 'suspended') {
						await audioContext.resume();
					}
					playerStore.togglePlayback();
				}}
			>
				{#if $playerStore.isPlaying}
					<!-- Pause icon -->
					<svg class="ctrl-play" color="var(--txt-first)" width="50" height="50" viewBox="0 0 16 16">
						<path
							fill="currentColor"
							d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"
						/>
					</svg>
				{:else}
					<!-- Play icon -->
					<svg class="ctrl-play" color="var(--txt-first)" width="50" height="50" viewBox="0 0 16 16">
						<path
							fill="currentColor"
							d="M10.804 8L5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"
						/>
					</svg>
				{/if}
			</button>

			<button class="ctrl" aria-label="next" onclick={() => next()}>
				<svg class="ctrl-icon" color="var(--txt-second)" width="32" height="32" viewBox="0 0 16 16"
					><path
						fill="currentColor"
						d="M14 2.5a.5.5 0 1 0-1 0v11a.5.5 0 0 0 1 0v-11ZM2 3.002a1 1 0 0 1 1.579-.816l7 4.963a1 1 0 0 1 .006 1.628l-7 5.037A1 1 0 0 1 2 13.003V3.002Zm8 4.963L3 3.002v10l7-5.037Z"
					/></svg
				>
			</button>
		</div>

		<div class="volume-section">
			<button class="volume__btn volume__btn--min" aria-label="Mute">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<path d="M11 5v14l-6-6H2V11h3l6-6z" fill="currentColor" />
				</svg>
			</button>

			<input
				class="volume__slider"
				type="range"
				bind:value={volume}
				min="0"
				max="1"
				step="0.01"
				aria-label="Volume"
			/>

			<button class="volume__btn volume__btn--max" aria-label="Max volume">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<path d="M11 5v14l-6-6H2V11h3l6-6z" fill="currentColor" />
					<path
						d="M16.5 8.5a4.5 4.5 0 010 7"
						stroke="currentColor"
						stroke-width="2"
						fill="none"
						stroke-linecap="round"
					/>
					<path
						d="M19 6a7 7 0 010 12"
						stroke="currentColor"
						stroke-width="2"
						fill="none"
						stroke-linecap="round"
					/>
				</svg>
			</button>

			<button class="ctrl" aria-label="Equalizer" onclick={openEq}>
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<path
						d="M3 12h3M10 6h1M14 18h1M7 18h1M20 8h1"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M6 12v5M9 6v11M13 2v15M17 8v10M21 4v14"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
		</div>
	</div>

	{#if showEq}
		<div
			class="eq-overlay"
			onclick={(e) => {
				if (e.target === e.currentTarget) closeEq();
			}}
		>
			<div class="eq-window" role="dialog" aria-modal="true" aria-label="Equalizer">
				<button class="eq-close" aria-label="Close equalizer" onclick={closeEq}>✕</button>
				<div class="eq-container">
					<div class="equalizer eq-panel">
						{#each frequencies as freq, index}
							<div class="band">
								<label class="band__label">{freq}</label>
								<input
									class="band__slider"
									type="range"
									min="0"
									max="1"
									step="0.01"
									value="0.5"
									oninput={(e) => {
										if (e.target instanceof HTMLInputElement) {
											updateGain(index, scaleToGain(parseFloat(e.target.value)));
										}
									}}
								/>
								<span class="band__value">{gains[index].toFixed(1)} dB</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.player {
		position: relative;
		bottom: auto;
		left: auto;
		width: 100%;
		height: 100%;
	}

	.player-content {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		justify-items: stretch;
		width: 100%;
		padding: 0;
		height: 5rem;
		gap: 1rem;
		border: 3px solid var(--bg-second);
		border-top: 0;
		border-radius: 0 0 10px 10px;
	}

	.equalizer {
		display: flex;
		gap: 12px;
		align-items: flex-end;
		padding: 1rem 2.5rem;
		width: 100%;
		box-sizing: border-box;
	}

	.band {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;

		min-width: 48px;
		max-width: 80px;

		font-family:
			system-ui,
			-apple-system,
			'Segoe UI',
			Roboto,
			'Helvetica Neue',
			Arial;
		color: var(--txt-second);
		box-sizing: border-box;
	}

	.band__label {
		font-size: 0.75rem;
		color: var(--txt-second);
		letter-spacing: 0.6px;
		text-align: center;
		text-transform: uppercase;
		font-weight: 600;
		user-select: none;
		opacity: 0.9;
	}

	.band__slider {
		-webkit-appearance: none;
		appearance: none;
		width: 120px;
		height: 8px;
		transform: rotate(-90deg);
		transform-origin: center;
		background: color-mix(in srgb, var(--txt-first) 28%, transparent);
		border-radius: 8px;
		outline: none;
		cursor: pointer;
		transition:
			box-shadow 0.12s ease,
			transform 0.12s ease,
			opacity 0.12s ease;
		margin: 0;
	}

	.band__slider:hover {
		opacity: 0.98;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
	}

	.band__slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 12px;
		height: 12px;
		background: var(--txt-first);
		border-radius: 50%;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
		cursor: pointer;
		border: none;
	}

	.band__slider::-moz-range-thumb {
		width: 12px;
		height: 12px;
		background: var(--txt-first);
		border-radius: 50%;
		border: none;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
		cursor: pointer;
	}

	.band__slider::-webkit-slider-runnable-track {
		height: 8px;
		border-radius: 8px;
	}
	.band__slider::-moz-range-track {
		height: 8px;
		border-radius: 8px;
		background: linear-gradient(
			to right,
			var(--txt-first) calc(var(--val, 50%) * 1%),
			color-mix(in srgb, var(--txt-first) 30%, transparent) calc(var(--val, 50%) * 1%)
		);
	}

	.band__value {
		font-size: 0.8rem;
		color: var(--txt-first);
		background: color-mix(in srgb, var(--txt-first) 8%, transparent);
		padding: 4px 6px;
		border-radius: 8px;
		min-width: 40px;
		text-align: center;
		font-weight: 700;
		box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03) inset;
		letter-spacing: 0.2px;
	}

	@media (max-width: 480px) {
		.equalizer {
			padding-left: 1rem;
			padding-right: 1rem;
			gap: 8px;
		}
		.band {
			flex: 0 0 44px;
			min-width: 40px;
		}
		.band__slider {
			width: 100px;
		}
		.band__label {
			font-size: 0.7rem;
		}
		.band__value {
			font-size: 0.75rem;
			min-width: 36px;
			padding: 3px 5px;
		}
	}

	.audio-progress {
		width: 100%;
		height: auto;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
	}

	.audio-progress__slider {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 5px;
		background: var(--txt-first, #ccc);
		opacity: 0.9;
		outline: none;
		transition: opacity 0.2s;
		border-radius: 5px;
	}

	.audio-progress__slider:hover {
		opacity: 1;
	}

	.audio-progress__slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 15px;
		height: 15px;
		background: var(--txt-first, #000);
		cursor: pointer;
		border-radius: 50%;
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
	}

	.audio-progress__slider::-moz-range-thumb {
		width: 15px;
		height: 15px;
		background: var(--txt-first, #000);
		cursor: pointer;
		border-radius: 50%;
		border: none;
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
	}

	.audio-progress__slider::-moz-range-progress {
		background: var(--txt-first, #ccc);
		height: 5px;
	}

	.audio-progress__current-time {
		justify-self: start;
	}

	.audio-progress__total-time {
		justify-self: end;
	}

	button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 6px;
		background: transparent;
		border: none;
		cursor: pointer;
		border-radius: 6px;
	}

	button:focus {
		outline: none;
	}

	.controls .ctrl:hover {
		background: rgba(0, 0, 0, 0.06);
	}

	.controls svg {
		display: block;
		pointer-events: none;
	}

	.track-section {
		display: flex;
		align-items: center;
		gap: 1rem;
		min-width: 0;
		padding-left: 2rem;
	}

	.controls {
		display: flex;
		gap: 10px;
		align-items: center;
		justify-content: center;
		justify-self: center;
	}

	.volume-section {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		justify-self: end;
		padding-right: 2rem;
	}

	.track__info {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		min-width: 10rem;
		flex: 1;
	}

	.info__artists {
		display: flex;
		background: none;
		gap: 0.4rem;
		width: 100%;
	}

	.info__artist {
		color: var(--txt-second);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.info__title {
		font-size: 1.2rem;
		color: var(--txt-first);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 100%;
	}

	.track__cover {
		width: calc(3rem - 1px);
		height: 3rem;
		border-radius: 5%;
		background-color: var(--bg-third);
		flex-shrink: 0;
	}

	.track__time {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		margin-left: auto;
		font-size: 0.875rem;
		color: var(--txt-second);
		white-space: nowrap;
		flex-shrink: 0;
		margin-left: 1rem;
	}

	.audio-progress__separator {
		opacity: 0.6;
	}

	.volume__btn {
		background: transparent;
		border: none;
		padding: 0.25rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: var(--txt-first);
		cursor: pointer;
	}
	.volume__btn:focus {
		outline: 2px solid color-mix(in srgb, var(--txt-first) 40%, transparent);
		outline-offset: 2px;
	}

	.volume__slider {
		-webkit-appearance: none;
		appearance: none;
		width: calc(100% - 3.25rem);
		height: 6px;
		background: color-mix(in srgb, var(--txt-first) 30%, transparent);
		border-radius: 6px;
		outline: none;
	}

	.volume__slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 14px;
		height: 14px;
		background: var(--txt-first);
		border-radius: 50%;
		box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
		cursor: pointer;
		margin-top: -4px;
	}

	.volume__slider::-moz-range-thumb {
		width: 14px;
		height: 14px;
		background: var(--txt-first);
		border-radius: 50%;
		border: none;
		box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
		cursor: pointer;
	}

	.volume__slider::-moz-range-progress {
		background: var(--txt-first);
		height: 6px;
		border-radius: 6px;
	}

	.volume__slider::-webkit-slider-runnable-track {
		height: 6px;
		border-radius: 6px;
		background: linear-gradient(
			to right,
			var(--txt-first) calc(var(--volume-percent, 50%) * 1%),
			color-mix(in srgb, var(--txt-first) 30%, transparent) calc(var(--volume-percent, 50%) * 1%)
		);
	}

	.volume__slider:hover,
	.volume__btn:hover {
		opacity: 0.95;
	}

	.volume__btn svg {
		display: block;
		width: 1rem;
		height: 1rem;
	}

	.eq-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 2000;
		padding: 2rem;
	}

	.eq-window {
		width: 100%;
		max-width: 1100px;
		height: 20%;
		max-height: 900px;
		border-radius: 5px;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
		position: relative;
		overflow: auto;
		padding: 1.5rem;
	}

	.eq-close {
		position: absolute;
		top: 12px;
		right: 12px;
		background: transparent;
		border: none;
		color: var(--txt-second);
		font-size: 1.2rem;
		padding: 8px;
		cursor: pointer;
	}

	.eq-container {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: center;
		align-items: center;
	}

	.eq-panel.equalizer {
		padding: 1rem;
		gap: 16px;
		align-items: flex-end;
		justify-content: center;
	}

	@media (max-width: 720px) {
		.eq-window {
			border-radius: 8px;
			padding: 1rem;
		}

        .volume-section, .track__time {
            display: none;
        }

        .controls {
            gap: .2rem;
        }

        .ctrl-icon {
            width: 25px;
            height: 25px;
        }

        .ctrl-play {
            width: 45px;
            height: 45px;
        }

        .track-section {
            padding-left: 1rem;
        }

        .track__info {
            gap: .3rem;
        }

        .info__title {
            font-size: 16px!important;
        }

        .info__artist {
            font-size: 15px!important;
        }

        .player-content {
            border: none;
        }
	}
</style>