<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import { cn } from '$lib/utils';

	export let onChange;
	export let checked: boolean | 'indeterminate' | undefined;
	let checkboxElement: Checkbox;

	//$: if (checked !== undefined && onChange !== undefined) onChange({ target: { checked } });
</script>

<Checkbox
	bind:checked
	bind:this={checkboxElement}
	on:click={() => onChange({ target: { ...checkboxElement, checked: !checked } })}
/>
