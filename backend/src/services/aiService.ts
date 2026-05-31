import OpenAI from 'openai';
import { env, isOpenAiConfigured } from '../config.js';

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!isOpenAiConfigured()) {
    throw new Error('OPENAI_API_KEY не задан');
  }
  if (!client) {
    client = new OpenAI({ apiKey: env.openaiKey });
  }
  return client;
}

export async function generateCaseSummary(
  title: string,
  description: string
): Promise<string> {
  const openai = getClient();

  const response = await openai.chat.completions.create({
    model: env.openaiModel,
    temperature: 0.4,
    max_tokens: 180,
    messages: [
      {
        role: 'system',
        content:
          'Ты помощник для портфолио разработчика. Пиши кратко на русском, 2-3 предложения, без воды.',
      },
      {
        role: 'user',
        content: `Сделай краткое резюме кейса.\nНазвание: ${title}\nОписание: ${description}`,
      },
    ],
  });

  return response.choices[0]?.message?.content?.trim() ?? 'Не удалось сгенерировать текст.';
}
