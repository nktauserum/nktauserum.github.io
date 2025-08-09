<script lang="ts">
	import { onMount } from 'svelte';
	import { validate } from '$lib/auth';
	import { goto } from '$app/navigation';
	import Spinner from './Spinner.svelte';

	let is_authorized: boolean | undefined = undefined;

	async function check_access() {
		is_authorized = await validate();
		if (!is_authorized) {
			goto(`/?unauthorized`);
		}
	}

	onMount(check_access);
</script>

{#if is_authorized === undefined}
	<Spinner />
{:else if is_authorized}
	<slot />
{/if}
