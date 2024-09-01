<script lang="ts">
	import type { NavRoute } from '$lib/types';
	import { Gauge, LayoutDashboard, Pencil, UserRound } from 'lucide-svelte';
	import Nav from './(components)/nav.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	let routes: NavRoute[] = [
		{
			icon: Gauge,
			title: 'Dashboard',
			variant: 'default',
			label: '',
			href: '/app/'
		},
		{
			icon: LayoutDashboard,
			title: 'Semester',
			variant: 'ghost',
			label: '',
			href: '/app/semesters'
		}
	];
</script>

<div class="flex h-screen w-screen">
	<div class="flex w-72 flex-shrink-0 flex-col justify-between border-r">
		<div>
			<div class="p-4">
				<h1 class=" font-bold">LVA planner</h1>
			</div>
			<Separator />
			<div class="p-4">
				<Nav {routes} />
			</div>
		</div>

		<div>
			<Separator />
			<div class="p-4">
				<div class="flex items-center gap-2 rounded-md">
					<UserRound class="size-4" />
					{data.username}
				</div>
			</div>
		</div>
	</div>
	<div class="w-full overflow-y-scroll">
		<slot />
	</div>
</div>
