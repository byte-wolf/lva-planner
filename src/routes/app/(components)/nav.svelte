<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { NavRoute } from '$lib/types';
	import { cn } from '$lib/utils';

	export let routes: NavRoute[];
</script>

<nav class="flex flex-col gap-2 py-2">
	{#each routes as route}
		<Button
			href={route.href}
			variant={route.variant}
			size="sm"
			class={cn('flex flex-row justify-start gap-2', {
				'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white':
					route.variant === 'default'
			})}
		>
			<svelte:component this={route.icon} class="size-4" />
			{route.title}
			{#if route.label}
				<span
					class={cn('ml-auto', {
						'text-background dark:text-white': route.variant === 'default'
					})}
				>
					{route.label}
				</span>
			{/if}
		</Button>
	{/each}
</nav>
