import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import type { VercelRequest, VercelResponse } from "@vercel/node";

interface TaskPayload {
  title: string;
  completed: boolean;
}

const isValidEmail = (value: unknown): value is string =>
  typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isValidTaskList = (value: unknown): value is TaskPayload[] =>
  Array.isArray(value) &&
  value.every(
    (item) =>
      typeof item?.title === "string" && typeof item?.completed === "boolean"
  );

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido." });
  }

  const { email, tasks } = req.body ?? {};

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Email inválido." });
  }
  if (!isValidTaskList(tasks)) {
    return res.status(400).json({ error: "Lista de tareas inválida." });
  }

  const completed = tasks.filter((t) => t.completed).length;
  const pending = tasks.length - completed;

  const rows = tasks
    .map(
      (t) =>
        `<li>${t.completed ? "✅" : "⏳"} ${t.title.replace(/</g, "&lt;")}</li>`
    )
    .join("");

  const html = `
    <h2>Resumen de tus tareas</h2>
    <p>Total: <b>${tasks.length}</b> &middot; Completadas: <b>${completed}</b> &middot; Pendientes: <b>${pending}</b></p>
    <ul>${rows || "<li>No tienes tareas registradas.</li>"}</ul>
    <p style="color:#888;font-size:12px">Enviado por Gestor estratégico de tareas</p>
  `;

  try {
    const client = new SESClient({
      region: process.env.AWS_SES_REGION ?? "us-east-1",
      credentials: {
        accessKeyId: process.env.SES_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.SES_SECRET_ACCESS_KEY as string,
      },
    });

    await client.send(
      new SendEmailCommand({
        Source: process.env.SES_SENDER_EMAIL as string,
        Destination: { ToAddresses: [email] },
        Message: {
          Subject: { Data: "Resumen de tus tareas", Charset: "UTF-8" },
          Body: { Html: { Data: html, Charset: "UTF-8" } },
        },
      })
    );

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("SES error:", error);
    return res.status(500).json({ error: "No se pudo enviar el email." });
  }
}