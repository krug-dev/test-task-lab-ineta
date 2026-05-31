import { env } from '../config.js';

const SEND_URL = 'https://send.api.mailtrap.io/api/send';

export interface MailtrapSendPayload {
  from: { email: string; name: string };
  to: { email: string; name?: string }[];
  subject: string;
  text: string;
  html: string;
  category?: string;
  custom_variables?: Record<string, string>;
}

export async function sendViaMailtrapApi(payload: MailtrapSendPayload): Promise<void> {
  const token = env.mailtrapApiToken;
  if (!token) {
    throw new Error('MAILTRAP_API_TOKEN не задан в .env');
  }

  const response = await fetch(SEND_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Mailtrap API ${response.status}: ${body}`);
  }
}
