import { Router } from 'express';
import { ZodError } from 'zod';
import { contactSchema } from '../validation/contactSchema.js';
import { sendContactEmails } from '../services/emailService.js';

export const contactRouter = Router();

contactRouter.post('/', async (req, res) => {
  try {
    const data = contactSchema.parse(req.body);
    await sendContactEmails(data);

    res.json({
      success: true,
      message: 'Сообщение отправлено! Проверьте почту — мы отправили вам копию.',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.flatten().fieldErrors;
      res.status(400).json({
        success: false,
        message: 'Проверьте поля формы',
        errors: {
          name: errors.name?.[0],
          phone: errors.phone?.[0],
          email: errors.email?.[0],
          comment: errors.comment?.[0],
        },
      });
      return;
    }

    console.error('[contact]', error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Ошибка отправки. Попробуйте позже.',
    });
  }
});
