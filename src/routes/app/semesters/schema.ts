import dayjs from 'dayjs';
import { z } from 'zod';

export const formSchema = z.object({
    year: z.coerce.number().gte(1900).lt(3000).default(dayjs().year()),
    isSummerSemester: z.boolean(),
});

export type FormSchema = typeof formSchema;
