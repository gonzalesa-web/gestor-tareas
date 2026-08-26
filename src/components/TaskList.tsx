import type { Task } from "../types/task";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, values: { title: string; description: string }) => void;
}

export function TaskList({ tasks, loading, onToggle, onDelete, onEdit }: TaskListProps) {
  if (loading) return <p className="state-msg">Cargando tareas...</p>;
  if (tasks.length === 0)
    return <p className="state-msg">Todavía no tienes tareas. ¡Crea la primera!</p>;

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}