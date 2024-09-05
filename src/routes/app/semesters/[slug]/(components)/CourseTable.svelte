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
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { ChevronDown, ChevronsDown, ChevronsUp, ChevronsUpDown, ChevronUp } from 'lucide-svelte';
	import RowCheckbox from './RowCheckbox.svelte';

	type Person = {
		firstName: string;
		lastName: string;
		age: number;
		visits: number;
		status: string;
		progress: number;
	};

	const defaultData: Person[] = [
		{
			firstName: 'tanner',
			lastName: 'linsley',
			age: 24,
			visits: 100,
			status: 'In Relationship',
			progress: 50
		},
		{
			firstName: 'tandy',
			lastName: 'miller',
			age: 40,
			visits: 40,
			status: 'Single',
			progress: 80
		},
		{
			firstName: 'joe',
			lastName: 'dirte',
			age: 45,
			visits: 20,
			status: 'Complicated',
			progress: 10
		}
	];

	const defaultColumns: ColumnDef<Person>[] = [
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
			accessorKey: 'firstName',
			cell: (info) => info.getValue(),
			footer: (info) => info.column.id
		},
		{
			accessorFn: (row) => row.lastName,
			id: 'lastName',
			cell: (info) => info.getValue(),
			header: () => 'Last Name',
			footer: (info) => info.column.id
		},
		{
			accessorKey: 'age',
			header: () => 'Age',
			footer: (info) => info.column.id
		},
		{
			accessorKey: 'visits',
			header: () => 'Visits',
			footer: (info) => info.column.id
		},
		{
			accessorKey: 'status',
			header: 'Status',
			footer: (info) => info.column.id
		},
		{
			accessorKey: 'progress',
			header: 'Profile Progress',
			footer: (info) => info.column.id
		}
	];

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

	const options = writable<TableOptions<Person>>({
		data: defaultData,
		columns: defaultColumns,
		state: {
			sorting
		},
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel()
	});

	const rerender = () => {
		options.update((options) => ({
			...options,
			data: defaultData
		}));
	};

	const table = createSvelteTable(options);
</script>

<div class="overflow-hidden rounded-md">
	<table class="w-full">
		<thead>
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
				<tr class:bg-slate-50={row.getIsSelected()}>
					{#each row.getVisibleCells() as cell}
						<td class="border-t px-3 py-2">
							<span class="truncate">
								<svelte:component
									this={flexRender(cell.column.columnDef.cell, cell.getContext())}
								/>
							</span>
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
