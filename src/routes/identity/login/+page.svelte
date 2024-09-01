<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
</script>

<div class="p-4">
	<h1 class="pb-6 text-lg font-semibold">Log in</h1>

	<form
		method="post"
		use:enhance
		class="flex w-96 flex-col gap-4 rounded-lg border border-slate-200 p-4"
	>
		<div>
			<Label for="username">Username</Label>
			<Input name="username" id="username" />
		</div>

		<div>
			<Label for="password">Password</Label>
			<Input type="password" name="password" id="password" />
		</div>

		<div>
			<Button type="submit">Continue</Button>
		</div>
	</form>
</div>
