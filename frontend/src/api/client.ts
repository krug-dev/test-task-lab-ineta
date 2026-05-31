const API_BASE = import.meta.env.VITE_API_URL ?? '';

export async function apiPost<TResponse>(
  path: string,
  body: unknown
): Promise<TResponse> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = (await response.json()) as TResponse & { message?: string };

  if (!response.ok) {
    throw Object.assign(new Error(data.message ?? 'Request failed'), {
      status: response.status,
      data,
    });
  }

  return data;
}
