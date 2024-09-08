import { z } from 'zod';

export const formSchema = z.object({
    courseTypeId: z.coerce.number().int().gte(1),
    title: z.string().min(1).max(64),
    ectsAmount: z.coerce.number().int().gte(0).default(0),
    registerTimestamp: z.date().optional(),
    registerGroupTimestamp: z.date().optional(),
});

export type FormSchema = typeof formSchema;
