import { z } from 'zod';

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Имя — минимум 2 символа')
    .max(100, 'Имя слишком длинное'),
  phone: z
    .string()
    .trim()
    .refine((v) => v.replace(/\D/g, '').length >= 10, 'Укажите корректный телефон'),
  email: z.string().trim().email('Укажите корректный email'),
  comment: z
    .string()
    .trim()
    .min(10, 'Комментарий — минимум 10 символов')
    .max(2000, 'Комментарий слишком длинный'),
});

export type ContactPayload = z.infer<typeof contactSchema>;
