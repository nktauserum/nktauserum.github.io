<script lang="ts">
	import PostList from '$lib/components/PostList.svelte';
	import Header from '$lib/components/Header.svelte';
	import Unauthorized from '$lib/components/Unauthorized.svelte';
	import { onMount } from 'svelte';

	let is_callback: boolean | null;

	onMount(() => {
		const params = new URLSearchParams(window.location.search);

		is_callback = params.has('unauthorized');
	});
</script>

{#if is_callback}
	<Unauthorized />
{/if}

<Header />

<PostList />
