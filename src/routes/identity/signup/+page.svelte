<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<div class="p-4">
	<h1 class="pb-6 text-lg font-semibold">Sign up</h1>

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
			<button class="rounded-xl bg-black px-3 py-2 font-bold text-white hover:opacity-50">
				Continue
			</button>
		</div>
	</form>
</div>
