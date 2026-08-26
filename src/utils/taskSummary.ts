import type { Task, TaskFilter, TaskSummary } from "../types/task";

export function buildSummary(tasks: Task[]): TaskSummary {
  const completed = tasks.filter((t) => t.completed).length;
  return {
    total: tasks.length,
    completed,
    pending: tasks.length - completed,
  };
}

export function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  if (filter === "completed") return tasks.filter((t) => t.completed);
  if (filter === "pending") return tasks.filter((t) => !t.completed);
  return tasks;
}

export function validateTaskForm(title: string): string | null {
  const clean = title.trim();
  if (clean.length === 0) return "El título es obligatorio.";
  if (clean.length > 80) return "El título no puede superar los 80 caracteres.";
  return null;
}