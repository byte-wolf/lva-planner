import { z } from 'zod';

export const formSchema = z.object({
    year: z.number().min(1900).max(3000),
    isSummerSemester: z.boolean(),
});

export type FormSchema = typeof formSchema;