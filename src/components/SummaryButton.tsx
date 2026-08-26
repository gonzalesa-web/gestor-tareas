import { useState } from "react";
import { sendTaskSummary } from "../services/email.service";
import type { Task } from "../types/task";

interface SummaryButtonProps {
  email: string;
  tasks: Task[];
}

type Status = "idle" | "loading" | "success" | "error";

export function SummaryButton({ email, tasks }: SummaryButtonProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const handleClick = async () => {
    setStatus("loading");
    setMessage("");
    try {
      await sendTaskSummary({
        email,
        tasks: tasks.map((t) => ({ title: t.title, completed: t.completed })),
      });
      setStatus("success");
      setMessage("Resumen enviado a tu correo.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Error al enviar.");
    }
  };

  return (
    <div className="summary">
      <button onClick={handleClick} disabled={status === "loading"}>
        {status === "loading" ? "Enviando..." : "Enviarme el resumen por email"}
      </button>
      {message && (
        <p className={status === "error" ? "error" : "success"}>{message}</p>
      )}
    </div>
  );
}