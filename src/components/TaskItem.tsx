import { useState } from "react";
import type { Task } from "../types/task";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, values: { title: string; description: string }) => void;
}

export function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const save = () => {
    if (!title.trim()) return;
    onEdit(task.id, { title: title.trim(), description: description.trim() });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <li className="task-item">
        <input value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Editar título" />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-label="Editar descripción"
          rows={2}
        />
        <div className="task-actions">
          <button onClick={save}>Guardar</button>
          <button className="secondary" onClick={() => setIsEditing(false)}>
            Cancelar
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className={`task-item ${task.completed ? "done" : ""}`}>
      <label className="task-check">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id, !task.completed)}
        />
        <span className="task-title">{task.title}</span>
      </label>

      {task.description && <p className="task-desc">{task.description}</p>}

      <div className="task-actions">
        <button className="secondary" onClick={() => setIsEditing(true)}>
          Editar
        </button>
        <button className="danger" onClick={() => onDelete(task.id)}>
          Eliminar
        </button>
      </div>
    </li>
  );
}