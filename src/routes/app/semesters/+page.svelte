<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	import { fade, fly } from 'svelte/transition';
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card/index.js';
	import { cn } from '$lib/utils';
	import Snowflake from 'lucide-svelte/icons/snowflake';
	import Sun from 'lucide-svelte/icons/sun';

	export let data: PageData;
</script>

<div class="flex gap-3 border-b px-4 py-2">
	<form action="?/create" method="post" use:enhance in:fade>
		<Button type="submit">Add current Semester</Button>
	</form>

	<form action="?/create" method="post" use:enhance in:fade>
		<Button variant="outline" type="submit">Add specific Semester</Button>
	</form>
</div>

<div class="p-4">
	{#each data.semesters as semester}
		<button class="w-full text-left" on:click={() => console.log('Fisch')}>
			<Card.Root class={cn('hover:bg-slate-50')}>
				<Card.Header>
					<!--class={cn('flex flex-row items-center justify-between')}-->
					<Card.Title>
						{semester.year}
					</Card.Title>
					<div>
						<span class="inline-flex items-center gap-2 rounded-md bg-slate-100 px-2 py-0.5">
							{#if semester.isSummerSemester}
								<Sun class="size-4" />
								Sommersemester
							{:else}
								<Snowflake class="size-4" />
								Wintersemester
							{/if}
						</span>
					</div>
				</Card.Header>
			</Card.Root>
		</button>
	{/each}
</div>
