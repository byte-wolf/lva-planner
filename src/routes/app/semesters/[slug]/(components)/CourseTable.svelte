<script lang="ts">
	import { writable } from 'svelte/store';
	import {
		createSvelteTable,
		flexRender,
		getCoreRowModel,
		getSortedRowModel,
		renderComponent
	} from '@tanstack/svelte-table';
	import type { ColumnDef, OnChangeFn, SortingState, TableOptions } from '@tanstack/svelte-table';
	import { ChevronDown, ChevronsDown, ChevronsUp, ChevronsUpDown, ChevronUp } from 'lucide-svelte';
	import RowCheckbox from './RowCheckbox.svelte';
	import type { Course } from '$lib/server/schema/business';
	import { compareAsc, format, isValid } from 'date-fns';
	import { fade } from 'svelte/transition';

	type CourseData = Course & {
		courseType: {
			id: number;
			label: string | null;
		} | null;
	};

	export let courses: CourseData[] = [];
	export let selected: CourseData[] = [];

	const defaultColumns: ColumnDef<CourseData>[] = [
		{
			id: 'select',
			header: ({ table }) => {
				return renderComponent(RowCheckbox, {
					checked: table.getIsSomeRowsSelected() ? 'indeterminate' : table.getIsAllRowsSelected(),
					onChange: table.getToggleAllRowsSelectedHandler()
				});
			},
			cell: ({ row }) => {
				return renderComponent(RowCheckbox, {
					checked: row.getIsSelected(),
					onChange: row.getToggleSelectedHandler()
				});
			}
		},
		{
			id: 'courseType',
			header: 'Course type',
			accessorFn: (course) => course.courseType?.label,
			cell: (info) => info.getValue()
		},
		{
			accessorKey: 'title',
			header: 'Title',
			cell: (info) => info.getValue()
		},
		{
			accessorFn: (course) =>
				course.registerCourseTimestamp
					? format(course.registerCourseTimestamp, 'dd.MM.yyyy HH:mm')
					: 'N/A',
			header: 'Start of registration',
			cell: (info) => info.getValue() ?? 'N/A',
			sortingFn: (
				{ original: { registerCourseTimestamp: a } },
				{ original: { registerCourseTimestamp: b } }
			) => sortDates(a, b)
		},
		{
			accessorFn: (course) =>
				course.registerGroupTimestamp
					? format(course.registerGroupTimestamp, 'dd.MM.yyyy HH:mm')
					: 'N/A',
			header: 'Start of group registration',
			cell: (info) => info.getValue() ?? 'N/A',
			sortingFn: (
				{ original: { registerGroupTimestamp: a } },
				{ original: { registerGroupTimestamp: b } }
			) => sortDates(a, b)
		},
		{
			accessorKey: 'ectsAmount',
			header: 'ECTS',
			cell: (info) => info.getValue()
		}
	];

	function sortDates(a: Date | null, b: Date | null) {
		if (a === null && b === null) return 0;
		if (a === null) return 1;
		if (b === null) return -1;

		return compareAsc(a, b);
	}

	let sorting: SortingState = [];

	const setSorting: OnChangeFn<SortingState> = (updater) => {
		if (updater instanceof Function) {
			sorting = updater(sorting);
		} else {
			sorting = updater;
		}
		options.update((old) => ({
			...old,
			state: {
				...old.state,
				sorting
			}
		}));
	};

	const options = writable<TableOptions<CourseData>>({
		data: courses,
		columns: defaultColumns,
		state: {
			sorting
		},
		getRowId: (row) => row.id.toString(),
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel()
	});

	const rerender = (data: CourseData[]) => {
		options.update((options) => ({
			...options,
			data: courses
		}));
	};

	const table = createSvelteTable(options);

	$: rerender(courses);

	$: selected = $table.getFilteredSelectedRowModel().rows.map((r) => r.original);
</script>

<div class="overflow-hidden rounded-b-md">
	<table class="w-full">
		<thead class="border-y border-neutral-300 bg-neutral-50">
			{#each $table.getHeaderGroups() as headerGroup}
				<tr>
					{#each headerGroup.headers as header}
						<th class="px-1.5 pb-1 pt-1.5 text-left text-sm font-semibold text-neutral-500">
							{#if !header.isPlaceholder}
								{#if header.column.getCanSort()}
									<button
										class="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-neutral-50"
										class:cursor-pointer={header.column.getCanSort()}
										class:select-none={header.column.getCanSort()}
										on:click={header.column.getToggleSortingHandler()}
									>
										<span class="truncate">
											<svelte:component
												this={flexRender(header.column.columnDef.header, header.getContext())}
											/>
										</span>

										{#if header.column.getIsSorted().toString() === 'asc'}
											<ChevronUp size={16} class="text-black" />
										{:else if header.column.getIsSorted().toString() === 'desc'}
											<ChevronDown size={16} class="text-black" />
										{:else}
											<ChevronsUpDown size={16} class="text-black" />
										{/if}
									</button>
								{:else}
									<div class="pl-1.5 pr-0">
										<svelte:component
											this={flexRender(header.column.columnDef.header, header.getContext())}
										/>
									</div>
								{/if}
							{/if}
						</th>
					{/each}
				</tr>
			{/each}
		</thead>
		<tbody>
			{#each $table.getRowModel().rows as row}
				<tr class:bg-slate-50={row.getIsSelected()} class="hover:bg-slate-50">
					{#each row.getVisibleCells() as cell}
						<td class="border-b px-3 py-2" in:fade>
							<div class="flex items-center truncate">
								<svelte:component
									this={flexRender(cell.column.columnDef.cell, cell.getContext())}
								/>
							</div>
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
		<!--<tfoot>
			{#each $table.getFooterGroups() as footerGroup}
				<tr>
					{#each footerGroup.headers as header}
						<th>
							{#if !header.isPlaceholder}
								<svelte:component
									this={flexRender(header.column.columnDef.footer, header.getContext())}
								/>
							{/if}
						</th>
					{/each}
				</tr>
			{/each}
		</tfoot>-->
	</table>
</div>
