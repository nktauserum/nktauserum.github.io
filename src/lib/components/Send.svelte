<script lang="ts">
	import { onDestroy } from 'svelte';

	const API_URL = 'https://auserum.duckdns.org:8443/message';

	let message: string = '';
	let file: File | null = null;
	let previewUrl: string = '';
	let sending: boolean = false;

	// ссылка на input[type="file"]
	let fileInput: HTMLInputElement;

	function onFileChange(event: Event): void {
		const input = event.currentTarget as HTMLInputElement;
		const selected = input.files?.[0] ?? null;

		if (selected) {
			file = selected;
			previewUrl = URL.createObjectURL(selected);
		} else {
			clearFile();
		}
	}

	function clearFile(): void {
		file = null;
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
			previewUrl = '';
		}
		if (fileInput) fileInput.value = '';
	}

	// при размонтировании очищаем URL
	onDestroy(() => {
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
		}
	});

	async function onSubmit(event: Event): Promise<void> {
		event.preventDefault();
		if (!message.trim() && !file) {
			alert('Введите сообщение или прикрепите файл.');
			return;
		}

		sending = true;
		const formData = new FormData();
		formData.append('message', message.trim());
		if (file) {
			formData.append('file', file);
		}

		try {
			const res = await fetch(API_URL, {
				method: 'POST',
				body: formData
			});
			if (!res.ok) {
				const result = await res.json();

				alert('Ошибка от сервера: ' + (result.error || 'Unknown'));
			} else {
				message = '';
				clearFile();
			}
		} catch (err: any) {
			console.error(err);
			alert('Произошла ошибка при отправке: ' + err?.message);
		} finally {
			sending = false;
		}
	}
</script>

<div class="send-container container">
	<form class="send-form" on:submit={onSubmit}>
		<div class="send-title">
			<p>send your anonymous message</p>
		</div>

		<input
			id="text"
			name="message"
			type="text"
			class="send-text"
			placeholder="type your message here..."
			bind:value={message}
		/>

		{#if previewUrl}
			<div class="preview-container">
				<img id="img_preview" class="img-preview" src={previewUrl} alt="Preview" />
			</div>
		{/if}

		<input
			bind:this={fileInput}
			id="file"
			name="file"
			type="file"
			accept="image/*"
			class="send-image"
			on:change={onFileChange}
			hidden
		/>

		<div class="form-buttons flex">
			<div class="send-file flex">
				<button
					id="file_btn"
					type="button"
					class="btn send-file-button"
					on:click={() => fileInput.click()}
					aria-label="true"
				>
					<svg
						viewBox="0 0 24 24"
						aria-hidden="true"
						class="btn-img"
						fill="currentColor"
						width="24"
						height="24"
					>
						<path
							d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119
                         21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21
                         3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3
                         3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19
                         15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276
                         0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8
                         8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716
                         7 9.75 7z"
						></path>
					</svg>
				</button>

				{#if file}
					<div id="filename" class="filename">{file.name}</div>
					<button
						id="clear_btn"
						type="button"
						class="btn clear_btn"
						title="Clear file"
						on:click={clearFile}
						aria-label="true"
					>
						<svg
							viewBox="0 0 24 24"
							aria-hidden="true"
							class="btn-img"
							fill="currentColor"
							width="24"
							height="24"
						>
							<path
								d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05
                    1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04
                    6.05-1.42-1.42L10.59 12z"
							>
							</path>
						</svg>
					</button>
				{/if}
			</div>

			<button id="send-button" type="submit" class="btn send-button" disabled={sending}>
				{sending ? 'sending...' : 'send'}
			</button>
		</div>
	</form>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');

	@media screen and (max-width: 576px) {
		.container {
			width: 30rem !important;
		}
	}

	.send-container {
		display: flex;
		align-items: center;
		min-height: 100vh;
		width: 50%;
	}

	.send-form {
		background-color: #303030;
		width: 100%;
		border-radius: 1rem;
	}

	.send-title {
		display: flex;
		justify-content: center;
		text-align: center;
		height: 4rem;
	}

	.send-text {
		background-color: #555555;
		width: 100%;
		outline: none;
		border: none;
		height: 10rem;

		text-align: center;
		font-size: 28px;
		color: #d9d9d9;
	}

	.send-image {
		display: none;
	}

	.form-buttons {
		align-items: center;
		width: 100%;
		height: 3.5rem;
		padding: 5px;
	}

	.btn {
		outline: none;
		border-radius: 0;
		border: none;
		background: none;
		padding: 0;
	}

	.btn:hover {
		cursor: pointer;
	}

	.send-file-button {
		height: 30px;
		width: 30px;
		color: #ffffff;
	}

	.btn-img {
		margin-top: 5px;
		height: 20px;
	}

	.filename {
		margin-top: 5px;
		margin-right: 0.5rem;
		font-size: 0.9rem;
		margin-left: 0.5rem;
	}

	.clear_btn {
		height: 30px;
		width: 30px;
		fill: currentColor;
		color: #ffffff;
		margin-top: 7px;
	}

	.send-button {
		margin-left: auto;
		margin-right: 1rem;
		color: #22221d;
		background-color: #d9d9d9;
		padding: 7px;
		width: 6rem;
		border-radius: 1.5rem;
		font-size: 1rem;
		font-style: italic;
	}

	.preview-container {
		margin-top: 1rem;
		text-align: center;
	}

	.img-preview {
		max-width: 100%;
		max-height: 300px;
		border-radius: 0.5rem;
		object-fit: contain;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
	}

	#filename {
		display: inline-block; /* или block */
		max-width: 15em; /* подберите ширину под ~20 символов */
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	@media screen and (max-width: 768px) {
		.send-text {
			font-size: 20px;
		}
	}
</style>
