import { apiPost } from '../api/client';
import type { ApiErrorBody, ApiSuccessBody, ContactFormData, FormField } from '../types';

const FIELD_IDS: Record<FormField, string> = {
  name: 'name',
  phone: 'phone',
  email: 'email',
  comment: 'comment',
};

function getFieldElements(): Record<FormField, HTMLInputElement | HTMLTextAreaElement> {
  return {
    name: document.getElementById('name') as HTMLInputElement,
    phone: document.getElementById('phone') as HTMLInputElement,
    email: document.getElementById('email') as HTMLInputElement,
    comment: document.getElementById('comment') as HTMLTextAreaElement,
  };
}

function validateClient(data: ContactFormData): Partial<Record<FormField, string>> {
  const errors: Partial<Record<FormField, string>> = {};

  if (!data.name.trim() || data.name.trim().length < 2) {
    errors.name = 'Укажите имя (минимум 2 символа)';
  }

  const phoneDigits = data.phone.replace(/\D/g, '');
  if (phoneDigits.length < 10) {
    errors.phone = 'Укажите корректный телефон';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Укажите корректный email';
  }

  if (!data.comment.trim() || data.comment.trim().length < 10) {
    errors.comment = 'Комментарий — минимум 10 символов';
  }

  return errors;
}

function setFieldError(field: FormField, message: string): void {
  const input = getFieldElements()[field];
  const errorEl = document.getElementById(`error-${field}`);
  if (errorEl) errorEl.textContent = message;
  if (input) input.classList.toggle('is-invalid', Boolean(message));
}

function clearErrors(): void {
  (Object.keys(FIELD_IDS) as FormField[]).forEach((field) => setFieldError(field, ''));
}

function setFormStatus(
  message: string,
  variant: 'success' | 'error' | 'loading' | ''
): void {
  const status = document.getElementById('form-status');
  if (!status) return;

  status.textContent = message;
  status.className = 'form-status';
  if (variant) status.classList.add(`form-status--${variant}`);
}

function setLoading(isLoading: boolean): void {
  const btn = document.getElementById('submit-btn');
  const spinner = btn?.querySelector<HTMLElement>('.btn__spinner');
  const label = btn?.querySelector<HTMLElement>('.btn__label');

  if (btn) {
    btn.classList.toggle('is-loading', isLoading);
    (btn as HTMLButtonElement).disabled = isLoading;
  }
  if (spinner) spinner.hidden = !isLoading;
  if (label) label.textContent = isLoading ? 'Отправка…' : 'Отправить';
}

export function initContactForm(): void {
  const form = document.getElementById('contact-form') as HTMLFormElement | null;
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors();

    const fields = getFieldElements();
    const data: ContactFormData = {
      name: fields.name.value.trim(),
      phone: fields.phone.value.trim(),
      email: fields.email.value.trim(),
      comment: fields.comment.value.trim(),
    };

    const clientErrors = validateClient(data);
    if (Object.keys(clientErrors).length > 0) {
      Object.entries(clientErrors).forEach(([field, msg]) =>
        setFieldError(field as FormField, msg)
      );
      setFormStatus('Проверьте поля формы', 'error');
      return;
    }

    setLoading(true);
    setFormStatus('Отправляем сообщение…', 'loading');

    try {
      const result = await apiPost<ApiSuccessBody>('/api/contact', data);
      setFormStatus(result.message, 'success');
      form.reset();
    } catch (err) {
      const error = err as Error & { data?: ApiErrorBody; status?: number };
      const body = error.data;

      if (body?.errors) {
        Object.entries(body.errors).forEach(([field, msg]) => {
          if (msg) setFieldError(field as FormField, msg);
        });
      }

      setFormStatus(
        body?.message ?? 'Не удалось отправить. Попробуйте позже.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  });
}
