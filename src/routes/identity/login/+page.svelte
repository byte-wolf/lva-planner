<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<div class="p-4">
	<h1 class="pb-6 text-lg font-semibold">Log in</h1>

	<form method="post" use:enhance class="flex flex-col gap-4">
		<div>
			<label for="username" class="block text-sm font-semibold">Username</label>
			<input name="username" id="username" class="rounded-xl border px-2.5 py-1.5" />
		</div>

		<div>
			<label for="password" class="block text-sm font-semibold">Password</label>
			<input
				type="password"
				name="password"
				id="password"
				class="rounded-xl border px-2.5 py-1.5"
			/>
		</div>

		<div>
			<Button type="submit">Continue</Button>
		</div>
	</form>
</div>
