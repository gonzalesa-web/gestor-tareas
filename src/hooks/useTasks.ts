import { useEffect, useState } from "react";
import {
  createTask,
  deleteTask,
  subscribeToTasks,
  toggleTask,
  updateTask,
} from "../services/tasks.service";
import type { Task, TaskFormValues } from "../types/task";

export function useTasks(userId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToTasks(
      userId,
      (data) => {
        setTasks(data);
        setError(null);
        setLoading(false);
      },
      () => {
        setError("No se pudieron cargar las tareas.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const add = async (values: TaskFormValues) => {
    if (!userId) return;
    try {
      await createTask(userId, values);
    } catch {
      setError("No se pudo crear la tarea.");
    }
  };

  const edit = async (taskId: string, values: Partial<TaskFormValues>) => {
    try {
      await updateTask(taskId, values);
    } catch {
      setError("No se pudo editar la tarea.");
    }
  };

  const toggle = async (taskId: string, completed: boolean) => {
    try {
      await toggleTask(taskId, completed);
    } catch {
      setError("No se pudo actualizar la tarea.");
    }
  };

  const remove = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch {
      setError("No se pudo eliminar la tarea.");
    }
  };

  return { tasks, loading, error, add, edit, toggle, remove };
}