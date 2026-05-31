import nodemailer from 'nodemailer';
import type { ContactPayload } from '../validation/contactSchema.js';
import { env, isMailtrapApiConfigured, isSmtpConfigured } from '../config.js';
import { sendViaMailtrapApi } from './mailtrapApi.js';

function createSmtpTransport() {
  if (!isSmtpConfigured()) {
    return null;
  }

  return nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass,
    },
  });
}

function buildHtml(data: ContactPayload, heading: string): string {
  return `
    <h2>${heading}</h2>
    <p><strong>Имя:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Телефон:</strong> ${escapeHtml(data.phone)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Комментарий:</strong></p>
    <p>${escapeHtml(data.comment).replace(/\n/g, '<br>')}</p>
  `;
}

function buildText(data: ContactPayload, heading: string): string {
  return `${heading}

Имя: ${data.name}
Телефон: ${data.phone}
Email: ${data.email}

Комментарий:
${data.comment}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function sendOneMailtrapApi(
  to: string,
  subject: string,
  data: ContactPayload,
  heading: string
): Promise<void> {
  await sendViaMailtrapApi({
    from: {
      email: env.mailtrapFromEmail,
      name: env.mailtrapFromName,
    },
    to: [{ email: to }],
    subject,
    text: buildText(data, heading),
    html: buildHtml(data, heading),
    category: 'Contact Form',
  });
}

async function sendViaSmtp(
  to: string,
  subject: string,
  data: ContactPayload,
  heading: string,
  replyTo?: string
): Promise<void> {
  const transport = createSmtpTransport();
  if (!transport) {
    throw new Error(
      'Почта не настроена. Задайте MAILTRAP_API_TOKEN или SMTP_* в .env'
    );
  }

  await transport.sendMail({
    from: env.mailFrom,
    to,
    subject,
    html: buildHtml(data, heading),
    text: buildText(data, heading),
    replyTo,
  });
}

export async function sendContactEmails(data: ContactPayload): Promise<void> {
  const ownerSubject = `Новая заявка с лендинга — ${data.name}`;
  const userSubject = 'Копия вашего сообщения — Никита Круглов';

  if (isMailtrapApiConfigured()) {
    await sendOneMailtrapApi(
      env.mailOwner,
      ownerSubject,
      data,
      'Новое сообщение с формы'
    );
    await sendOneMailtrapApi(
      data.email,
      userSubject,
      data,
      'Спасибо! Мы получили ваше сообщение. Ниже копия отправленных данных.'
    );
    return;
  }

  await sendViaSmtp(
    env.mailOwner,
    ownerSubject,
    data,
    'Новое сообщение с формы',
    data.email
  );
  await sendViaSmtp(
    data.email,
    userSubject,
    data,
    'Спасибо! Мы получили ваше сообщение. Ниже копия отправленных данных.'
  );
}
