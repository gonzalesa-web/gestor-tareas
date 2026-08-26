import type { Task } from "../types/task";

interface SendSummaryPayload {
  email: string;
  tasks: Pick<Task, "title" | "completed">[];
}

export async function sendTaskSummary(payload: SendSummaryPayload): Promise<void> {
  const response = await fetch("/api/send-summary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? "No se pudo enviar el email.");
  }
}