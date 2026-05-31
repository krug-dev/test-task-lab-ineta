import { Router } from 'express';
import { z } from 'zod';
import { generateCaseSummary } from '../services/aiService.js';
import { isOpenAiConfigured } from '../config.js';

export const aiRouter = Router();

const summarySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

aiRouter.post('/summary', async (req, res) => {
  if (!isOpenAiConfigured()) {
    res.status(503).json({
      success: false,
      message: 'AI summary недоступен: не задан OPENAI_API_KEY',
    });
    return;
  }

  try {
    const { title, description } = summarySchema.parse(req.body);
    const text = await generateCaseSummary(title, description);
    res.json({ success: true, text });
  } catch (error) {
    console.error('[ai/summary]', error);
    res.status(500).json({
      success: false,
      message: 'Не удалось сгенерировать summary',
    });
  }
});
