<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { fade, fly } from 'svelte/transition';
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import { cn } from '$lib/utils';
	import Snowflake from 'lucide-svelte/icons/snowflake';
	import Plus from 'lucide-svelte/icons/plus';
	import Sun from 'lucide-svelte/icons/sun';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { formSchema } from './schema';
	import Input from '$lib/components/ui/input/input.svelte';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import { error } from '@sveltejs/kit';
	import { buttonVariants } from '$lib/components/ui/button';
	import { LoaderCircle } from 'lucide-svelte';

	export let data: PageData;
	let dialogOpen = false;

	const form = superForm(data.form, {
		validators: zodClient(formSchema),
		onUpdate({ form }) {
			if (form.valid) dialogOpen = false;
		}
	});

	const { form: formData, enhance, errors, submitting, delayed } = form;
</script>

<div class="flex h-full flex-col">
	<div class="flex flex-row">
		<div class="flex gap-3 border-b px-4 py-2">
			<Dialog.Root bind:open={dialogOpen}>
				<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>
					<Plus class="size-5" />
					<span class="pl-2">Add Semester</span>
				</Dialog.Trigger>

				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Add Semester</Dialog.Title>
					</Dialog.Header>
					<form action="?/create" method="POST" use:enhance class="flex flex-col gap-3">
						<div class="text-sm font-medium text-destructive">
							{#each $errors._errors ?? [] as error}
								<div class="rounded-md bg-red-500/10 p-3">
									{error}
								</div>
							{/each}
						</div>
						<Form.Field {form} name="year" class={cn('flex flex-col gap-1.5 space-y-0')}>
							<Form.Control let:attrs>
								<Form.Label>Calendar year</Form.Label>
								<Input type="number" {...attrs} bind:value={$formData.year} />
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field {form} name="isSummerSemester">
							<Form.Control let:attrs>
								<div class="flex items-center gap-4 rounded-md border p-4">
									<Switch includeInput {...attrs} bind:checked={$formData.isSummerSemester} />
									<Form.Label class={cn('pb-0.5')}>Summer semester</Form.Label>
								</div>
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Dialog.Footer>
							<Dialog.Close>
								<Button variant="outline" type="button">Back</Button>
							</Dialog.Close>
							<Button variant="default" type="submit" disabled={$submitting}>
								{#if $delayed}
									<LoaderCircle class="animate-spin text-white" size={16} />
									<span class="pb-0.5 pl-2">Loading...</span>
								{:else}
									<span>Add Semester</span>
								{/if}
							</Button>
						</Dialog.Footer>
					</form>
				</Dialog.Content>
			</Dialog.Root>
		</div>

		<Separator orientation="vertical" />

		<div class="w-full border-b px-4 py-2"></div>
	</div>

	<div class="flex-grow bg-slate-50 p-4">
		<div class="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
			{#each data.semesters as semester}
				<a class="w-full text-left" href="semesters/{semester.id}">
					<Card.Root class={cn('transition hover:bg-slate-100')}>
						<Card.Header>
							<!--class={cn('flex flex-row items-center justify-between')}-->
							<Card.Title>
								{semester.year}{semester.isSummerSemester ? 'S' : 'W'}
							</Card.Title>
							<div class="flex flex-row items-center gap-2">
								<span class="inline-flex items-center gap-2 rounded-md bg-slate-100 px-2 py-0.5">
									{#if semester.isSummerSemester}
										<Sun class="size-4" />
										Sommersemester
									{:else}
										<Snowflake class="size-4" />
										Wintersemester
									{/if}
								</span>

								{#if semester.isCurrentSemester}
									<span
										class="inline-flex items-center gap-2 rounded-md bg-yellow-200/50 px-2 py-0.5 text-yellow-800"
									>
										Aktuelles Semester
									</span>
								{/if}
							</div>
						</Card.Header>
					</Card.Root>
				</a>
			{/each}
		</div>
	</div>
</div>
