<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowLeft, Check, GraduationCap, TrafficCone } from 'lucide-svelte';
	import type { PageData } from './$types';
	import CourseTable from './(components)/CourseTable.svelte';

	export let data: PageData;
	const { semester } = data;
</script>

<div class="flex h-full flex-col">
	<div class="flex flex-row">
		<div class="flex w-full items-center gap-6 border-b px-4 py-2">
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
					<div class="text-2xl font-bold">16</div>
					<p class="text-xs text-muted-foreground">+20.1% from last month</p>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Planned ECTS</Card.Title>
					<TrafficCone class="h-4 w-4 text-muted-foreground" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">30</div>
					<p class="text-xs text-muted-foreground">+20.1% from last month</p>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Number of Courses</Card.Title>
					<GraduationCap class="h-4 w-4 text-muted-foreground" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">30</div>
					<p class="text-xs text-muted-foreground">+20.1% from last month</p>
				</Card.Content>
			</Card.Root>
		</div>

		<div>
			<h2 class="pb-2 pt-4 text-xl font-semibold">Courses</h2>
		</div>

		<div class="grid grid-cols-4">
			<Card.Root class="col-span-3">
				<CourseTable />
				<!--<Card.Header class="pb-0">
					<Card.Title></Card.Title>
				</Card.Header>
				<Card.Content></Card.Content>-->
			</Card.Root>
		</div>
	</div>
</div>
