export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
}

export interface TaskFormValues {
  title: string;
  description: string;
}

export type TaskFilter = "all" | "pending" | "completed";

export interface TaskSummary {
  total: number;
  completed: number;
  pending: number;
}