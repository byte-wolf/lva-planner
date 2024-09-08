<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Button from '$lib/components/ui/button/button.svelte';
	import {
		ArrowLeft,
		Check,
		GraduationCap,
		LoaderCircle,
		LoaderIcon,
		Plus,
		TrafficCone,
		Trash
	} from 'lucide-svelte';
	import type { PageData } from './$types';
	import CourseTable from './(components)/CourseTable.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { formSchema } from './schema';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import { cn } from '$lib/utils';
	import { DateField } from 'bits-ui';
	import { CalendarDateTime, parseDateTime, toCalendarDateTime } from '@internationalized/date';
	import { convertToCalendarDateTime } from '$lib';
	import { parseISO } from 'date-fns';
	import { enhance } from '$app/forms';

	export let data: PageData;
	const { semester, courseTypes } = data;

	let selectedRows: typeof semester.courses = [];

	let dialogOpen = false;

	const form = superForm(data.form, {
		validators: zodClient(formSchema),
		onUpdate({ form }) {
			if (form.valid) dialogOpen = false;
		},
		onSubmit({ formData }) {
			formData.set('semesterId', JSON.stringify(semester.id));
		}
	});

	const { form: formData, enhance: enhanceSf, errors, submitting, delayed } = form;

	//$: if (dialogOpen === false) form.reset();

	$: selectedCourseType = {
		label: courseTypes.find((ct) => ct.id === $formData.courseTypeId)?.label ?? undefined,
		value: $formData.courseTypeId
	};

	//$: console.log(data);
</script>

<div class="flex h-full flex-col">
	<div class="flex flex-row">
		<div class="flex w-full items-center gap-4 border-b px-4 py-2">
			<Button variant="outline" href="~/..">
				<ArrowLeft size={16} class="" />
				<span class="pb-0.5 pl-2">Zurück</span>
			</Button>
		</div>
	</div>

	<div class="flex-grow p-4">
		<div>
			<p class="text-sm text-slate-500">Semester</p>
			<h1 class="text-3xl font-bold leading-7">
				{semester.year}{semester.isSummerSemester ? 'S' : 'W'}
			</h1>
		</div>

		<div class="grid grid-cols-4 gap-4 pt-8">
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Completed ECTS</Card.Title>
					<Check class="h-4 w-4 text-muted-foreground" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">0</div>
					<p class="text-xs text-muted-foreground">+{'20.2'}% from last month</p>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Total ECTS</Card.Title>
					<LoaderIcon class="h-4 w-4 text-muted-foreground" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">{data.stats.ects}</div>
					<p class="text-xs text-muted-foreground">
						{((data.stats.ects * 100) / 180.0).toFixed(2)}% towards your graduation
					</p>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Number of Courses</Card.Title>
					<GraduationCap class="h-4 w-4 text-muted-foreground" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">{data.stats.count}</div>
					<p class="text-xs text-muted-foreground">+20.1% from last month</p>
				</Card.Content>
			</Card.Root>
		</div>

		<div>
			<h2 class="pb-2 pt-4 text-xl font-semibold">Course overview</h2>
		</div>

		<div class="grid grid-cols-4">
			<Card.Root class="col-span-4 2xl:col-span-4">
				<Card.Header>
					<div class="flex items-start justify-between">
						<div>
							<Card.Title>Courses</Card.Title>
							<Card.Description>Keep track of all your courses this semester</Card.Description>
						</div>

						<div class="flex gap-4">
							<form method="POST" action="?/deleteCourses" use:enhance>
								<input
									type="hidden"
									name="ids"
									value={JSON.stringify(selectedRows.map((sr) => sr.id))}
								/>
								<Button
									type="submit"
									variant="outline"
									disabled={selectedRows.length === 0 || $submitting === true}
								>
									<Trash size={16} />
									<span class="pl-2">Löschen</span>
								</Button>
							</form>

							<Dialog.Root bind:open={dialogOpen}>
								<Dialog.Trigger class={buttonVariants({ variant: 'default' })}>
									<Plus size={16} />
									<span class="pl-2">Add Course</span>
								</Dialog.Trigger>
								<Dialog.Content>
									<Dialog.Header>
										<Dialog.Title>Add a new Course to semester?</Dialog.Title>
									</Dialog.Header>
									<form
										action="?/createCourse"
										method="POST"
										use:enhanceSf
										class="flex flex-col gap-3"
									>
										<div class="text-sm font-medium text-destructive">
											{#each $errors._errors ?? [] as error}
												<div class="rounded-md bg-red-500/10 p-3">
													{error}
												</div>
											{/each}
										</div>
										<div class="flex gap-4">
											<Form.Field {form} name="courseTypeId" class={cn('w-24 flex-shrink-0')}>
												<Form.Control let:attrs>
													<Form.Label>Course Type</Form.Label>
													<Select.Root
														selected={selectedCourseType}
														onSelectedChange={(s) => {
															s && ($formData.courseTypeId = s.value);
														}}
													>
														<Select.Input name={attrs.name} />
														<Select.Trigger
															data-fs-error={attrs['data-fs-error']}
															class={cn('data-[fs-error]:border-destructive')}
														>
															<Select.Value placeholder="Choose" />
														</Select.Trigger>
														<Select.Content>
															{#each courseTypes as courseType}
																<Select.Item value={courseType.id}>{courseType.label}</Select.Item>
															{/each}
														</Select.Content>
													</Select.Root>
												</Form.Control>
												<Form.FieldErrors />
											</Form.Field>
											<Form.Field {form} name="title" class={cn('w-full')}>
												<Form.Control let:attrs>
													<Form.Label>Course title</Form.Label>
													<Input
														type="text"
														{...attrs}
														bind:value={$formData.title}
														class={cn('data-[fs-error]:border-destructive')}
													/>
												</Form.Control>
												<Form.FieldErrors />
											</Form.Field>

											<Form.Field {form} name="ectsAmount">
												<Form.Control let:attrs>
													<Form.Label>ECTS</Form.Label>
													<Input
														type="number"
														{...attrs}
														bind:value={$formData.ectsAmount}
														class={cn('data-[fs-error]:border-destructive')}
													/>
												</Form.Control>
												<Form.FieldErrors />
											</Form.Field>
										</div>

										<div class="grid grid-cols-2 gap-3">
											<Form.Field {form} name="registerTimestamp" class={cn('flex-shrink-0')}>
												<Form.Control let:attrs>
													<DateField.Root
														locale="de-AT"
														granularity="minute"
														value={convertToCalendarDateTime($formData.registerTimestamp)}
														onValueChange={(v) =>
															v && ($formData.registerTimestamp = parseISO(v?.toString()))}
													>
														<Form.Label>
															<DateField.Label>Start of registration</DateField.Label>
														</Form.Label>

														<DateField.Input
															data-fs-error={attrs['data-fs-error']}
															let:segments
															class={cn(
																'data-[fs-error]:border-destructive',
																'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm uppercase ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
															)}
														>
															{#each segments as { part, value }}
																<DateField.Segment {part} class={cn({ 'ml-1': part === 'hour' })}>
																	{value}
																</DateField.Segment>
															{/each}
														</DateField.Input>
														<input
															type="hidden"
															value={$formData.registerTimestamp}
															name={attrs.name}
														/>
													</DateField.Root>
												</Form.Control>
												<Form.FieldErrors />
											</Form.Field>

											<Form.Field {form} name="registerGroupTimestamp" class={cn('flex-shrink-0')}>
												<Form.Control let:attrs>
													<DateField.Root
														locale="de-AT"
														granularity="minute"
														value={convertToCalendarDateTime($formData.registerGroupTimestamp)}
														onValueChange={(v) =>
															v && ($formData.registerGroupTimestamp = parseISO(v?.toString()))}
													>
														<Form.Label>
															<DateField.Label>Start of group registration</DateField.Label>
														</Form.Label>

														<DateField.Input
															data-fs-error={attrs['data-fs-error']}
															let:segments
															class={cn(
																'data-[fs-error]:border-destructive',
																'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm uppercase ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
															)}
														>
															{#each segments as { part, value }}
																<DateField.Segment {part} class={cn({ 'ml-1': part === 'hour' })}>
																	{value}
																</DateField.Segment>
															{/each}
														</DateField.Input>
														<input
															type="hidden"
															value={$formData.registerGroupTimestamp}
															name={attrs.name}
														/>
													</DateField.Root>
												</Form.Control>
												<Form.FieldErrors />
											</Form.Field>
										</div>

										<Dialog.Footer>
											<Dialog.Close>
												<Button variant="outline" type="button">Back</Button>
											</Dialog.Close>
											<Button variant="default" type="submit" disabled={$submitting}>
												{#if $delayed}
													<LoaderCircle class="animate-spin text-white" size={16} />
													<span class="pb-0.5 pl-2">Loading...</span>
												{:else}
													<span>Add Course</span>
												{/if}
											</Button>
										</Dialog.Footer>
									</form>

									<SuperDebug data={$formData} />
								</Dialog.Content>
							</Dialog.Root>
						</div>
					</div>
				</Card.Header>
				<CourseTable courses={data.semester.courses} bind:selected={selectedRows} />
			</Card.Root>
		</div>

		<div></div>
	</div>
</div>
