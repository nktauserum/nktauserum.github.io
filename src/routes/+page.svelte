<script lang="ts">
	import Header from '$lib/components/Header.svelte';
</script>

<Header />

<svelte:head>
	<title>nktauserum' homepage</title>
</svelte:head>

<div class="container">
	<a class="block top" href="#todo">
		<div class="markup">#</div>Todo
	</a>
</div>

<style>
	.container {
		width: 100%;
		border-radius: 1%;
		min-height: 50rem;
		padding: 2rem;
	}

	.block {
		display: flex;
		align-items: center;
	}

	.markup {
		color: #ff9b9b;
		font-size: 3rem;
		margin-right: 1rem;
	}

	.top {
		font-size: 2rem;
		border-bottom: 1px solid #3d444db3;
		padding-bottom: 1rem;
	}
</style>