<div class="spinner-container">
	<div class="spinner"></div>
</div>

<style>
	.spinner-container {
		margin: 0;
		height: 30vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.spinner {
		width: 50px;
		height: 50px;
		border: 4px solid rgba(0, 0, 0, 0.1);
		border-top-color: #333;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
