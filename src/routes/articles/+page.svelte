<script lang="ts">
	import { onMount } from "svelte";
    import Post from "$lib/components/Post.svelte";

    let uuid: string | null;

    onMount(() => {
        const params = new URLSearchParams(window.location.search);

        uuid = params.get("post");
    });
</script>

{#if uuid}
<Post uuid={uuid} />
{/if}