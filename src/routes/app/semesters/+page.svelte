<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	import { fade, fly } from 'svelte/transition';
</script>

<div class="border-b px-4 py-2">
	<form action="?/create" method="post" use:enhance in:fade>
		<Button type="submit">Add current Semester</Button>
	</form>
</div>
