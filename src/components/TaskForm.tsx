import { useState, type FormEvent } from "react";
import type { TaskFormValues } from "../types/task";
import { validateTaskForm } from "../utils/taskSummary";

interface TaskFormProps {
  onSubmit: (values: TaskFormValues) => void | Promise<void>;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationError = validateTaskForm(title);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    await onSubmit({ title, description });
    setTitle("");
    setDescription("");
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label htmlFor="title">Título</label>
      <input
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="¿Qué hay que hacer?"
      />

      <label htmlFor="description">Descripción</label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Detalles (opcional)"
        rows={2}
      />

      {error && <p className="error">{error}</p>}

      <button type="submit">Agregar tarea</button>
    </form>
  );
}