<script lang="ts">
	import { page } from '$app/stores';
	import Link from '$lib/components/Link.svelte';

	$: message = $page.error?.message;
</script>

<h1>{message}</h1>

{#if $page.status == 404}
	<h1>You must be lost</h1>
	<Link label={"Go Home"} shadow="shadow-md" color="variant-soft-secondary" href="/">Go Home</Link>
{:else if $page.status == 500}
	<h1>Whoops</h1>
	<p>We are investigating this issue</p>
{/if}
