import type { ComponentType } from "svelte";

export type NavRoute = {
    title: string;
    label: string;
    icon: ComponentType<Icon>;
    variant: "default" | "ghost";

};