/**
 * Тест отправки через Mailtrap API (как в curl на дашборде).
 * npm run test:email --prefix backend
 */
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { sendViaMailtrapApi } from '../src/services/mailtrapApi.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
config({ path: resolve(root, '.env') });

const token = process.env.MAILTRAP_API_TOKEN ?? '';
const owner = process.env.MAIL_OWNER ?? 'hotdemen@gmail.com';
const fromEmail = process.env.MAILTRAP_FROM_EMAIL ?? 'hello@demomailtrap.co';
const fromName = process.env.MAILTRAP_FROM_NAME ?? 'Никита Круглов';

if (!token) {
  console.error('Задайте MAILTRAP_API_TOKEN в .env');
  process.exit(1);
}

console.log(`Отправка теста на ${owner} через Mailtrap API…`);

try {
  await sendViaMailtrapApi({
    from: { email: fromEmail, name: fromName },
    to: [{ email: owner }],
    subject: 'Тест — developer-landing',
    text: 'Если вы видите это письмо — Mailtrap API подключён.',
    html: '<p>Если вы видите это письмо — <strong>Mailtrap API</strong> подключён.</p>',
    category: 'Integration Test',
  });
  console.log('OK! Проверьте почту:', owner);
} catch (err) {
  console.error('Ошибка:', err instanceof Error ? err.message : err);
  process.exit(1);
}
