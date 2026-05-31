import { apiPost } from '../api/client';
import type { AiSummaryRequest } from '../types';

interface AiTextResponse {
  success: true;
  text: string;
}

export function initAiSummaryButtons(): void {
  document.querySelectorAll<HTMLButtonElement>('.ai-summary-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const card = btn.closest('.card--case');
      const output = card?.querySelector<HTMLElement>('.ai-summary-output');
      if (!output) return;

      const title = btn.dataset.title ?? '';
      const description = btn.dataset.description ?? '';

      btn.disabled = true;
      output.hidden = false;
      output.className = 'ai-summary-output is-loading';
      output.textContent = 'Генерируем краткое резюме…';

      try {
        const result = await apiPost<AiTextResponse>('/api/ai/summary', {
          title,
          description,
        } satisfies AiSummaryRequest);

        output.className = 'ai-summary-output';
        output.textContent = result.text;
      } catch {
        output.className = 'ai-summary-output is-error';
        output.textContent =
          'AI summary недоступен. Проверьте OPENAI_API_KEY на сервере.';
      } finally {
        btn.disabled = false;
      }
    });
  });
}
