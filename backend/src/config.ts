import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

config({ path: resolve(__dirname, '../../.env') });
config({ path: resolve(__dirname, '../.env') });

export const env = {
  port: Number(process.env.PORT ?? 3001),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  mailtrapApiToken: process.env.MAILTRAP_API_TOKEN ?? '',
  mailtrapFromEmail: process.env.MAILTRAP_FROM_EMAIL ?? 'hello@demomailtrap.co',
  mailtrapFromName: process.env.MAILTRAP_FROM_NAME ?? 'Никита Круглов',
  smtp: {
    host: process.env.SMTP_HOST ?? '',
    port: Number(process.env.SMTP_PORT ?? 587),
    user: process.env.SMTP_USER ?? '',
    pass: process.env.SMTP_PASS ?? '',
  },
  mailFrom: process.env.MAIL_FROM ?? 'noreply@example.com',
  mailOwner: process.env.MAIL_OWNER ?? 'owner@example.com',
  openaiKey: process.env.OPENAI_API_KEY ?? '',
  openaiModel: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
};

export function isMailtrapApiConfigured(): boolean {
  return Boolean(env.mailtrapApiToken);
}

export function isSmtpConfigured(): boolean {
  return Boolean(env.smtp.host && env.smtp.user && env.smtp.pass);
}

export function isEmailConfigured(): boolean {
  return isMailtrapApiConfigured() || isSmtpConfigured();
}

export function isOpenAiConfigured(): boolean {
  return Boolean(env.openaiKey);
}
