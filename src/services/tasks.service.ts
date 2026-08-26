import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Task, TaskFormValues } from "../types/task";

const COLLECTION = "tasks";

export function subscribeToTasks(
  userId: string,
  onData: (tasks: Task[]) => void,
  onError: (error: Error) => void
): Unsubscribe {
  const q = query(collection(db, COLLECTION), where("userId", "==", userId));

  return onSnapshot(
    q,
    (snapshot) => {
      const tasks: Task[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Task, "id">),
      }));
      tasks.sort((a, b) => b.createdAt - a.createdAt);
      onData(tasks);
    },
    (error) => onError(error)
  );
}

export async function createTask(
  userId: string,
  values: TaskFormValues
): Promise<void> {
  await addDoc(collection(db, COLLECTION), {
    userId,
    title: values.title.trim(),
    description: values.description.trim(),
    completed: false,
    createdAt: Date.now(),
  });
}

export async function updateTask(
  taskId: string,
  values: Partial<TaskFormValues>
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, taskId), values);
}

export async function toggleTask(
  taskId: string,
  completed: boolean
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, taskId), { completed });
}

export async function deleteTask(taskId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, taskId));
}