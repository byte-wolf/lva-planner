<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { fade, fly } from 'svelte/transition';
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card/index.js';
	import { cn } from '$lib/utils';
	import Snowflake from 'lucide-svelte/icons/snowflake';
	import Plus from 'lucide-svelte/icons/plus';
	import Sun from 'lucide-svelte/icons/sun';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { formSchema } from './schema';
	import Input from '$lib/components/ui/input/input.svelte';

	export let data: PageData;

	const form = superForm(data.form, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;
</script>

<div class="flex h-full flex-col">
	<div class="flex flex-row">
		<div class="flex gap-3 border-b px-4 py-2">
			<form action="?/createCurrent" method="post" use:enhance in:fade>
				<Button variant="outline" type="submit">
					<Plus class="size-5" />
					<span class="pl-2">Add current Semester</span>
				</Button>
			</form>
		</div>
		<Separator orientation="vertical" />
		<div class="flex gap-3 border-b px-4 py-2">
			<form method="post" use:enhance>
				<Form.Field {form} name="year">
					<Form.Control let:attrs>
						<Form.Label>Jahr</Form.Label>
						<Input type="number" {...attrs} bind:value={$formData.year} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="isSummerSemester">
					<Form.Control let:attrs>
						<Form.Label>Sommersemester</Form.Label>
						<Input {...attrs} bind:value={$formData.isSummerSemester} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Button variant="outline" type="submit">Add specific Semester</Button>
			</form>
		</div>
	</div>

	<div class="flex-grow bg-slate-50 p-4">
		<div class="grid grid-cols-3">
			{#each data.semesters as semester}
				<button class="w-full text-left" on:click={() => console.log('Fisch')}>
					<Card.Root class={cn('transition hover:bg-slate-100')}>
						<Card.Header>
							<!--class={cn('flex flex-row items-center justify-between')}-->
							<Card.Title>
								{semester.year}{semester.isSummerSemester ? 'S' : 'W'}
							</Card.Title>
							<div class="flex flex-row items-center gap-2">
								{#if semester.isCurrentSemester}
									<span
										class="inline-flex items-center gap-2 rounded-md bg-yellow-200 px-2 py-0.5 text-yellow-800"
									>
										Aktuelles Semester
									</span>
								{/if}
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
	</div>
</div>
