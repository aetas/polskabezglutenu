const API_URL = import.meta.env.PUBLIC_API_URL || "https://api.polskabezglutenu.pl";

export async function submitForm(
  endpoint: string,
  data: Record<string, string>,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch {
    return { ok: false, error: "Nie można połączyć się z serwerem. Spróbuj ponownie później." };
  }
}
