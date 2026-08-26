import { describe, expect, it } from "vitest";
import { buildSummary, filterTasks, validateTaskForm } from "../src/utils/taskSummary";
import type { Task } from "../src/types/task";

const makeTask = (id: string, completed: boolean): Task => ({
  id,
  userId: "user-1",
  title: `Tarea ${id}`,
  description: "",
  completed,
  createdAt: 1,
});

describe("buildSummary", () => {
  it("cuenta completadas y pendientes", () => {
    const tasks = [makeTask("1", true), makeTask("2", false), makeTask("3", false)];
    expect(buildSummary(tasks)).toEqual({ total: 3, completed: 1, pending: 2 });
  });

  it("maneja la lista vacía", () => {
    expect(buildSummary([])).toEqual({ total: 0, completed: 0, pending: 0 });
  });
});

describe("filterTasks", () => {
  const tasks = [makeTask("1", true), makeTask("2", false)];

  it("devuelve solo las pendientes", () => {
    expect(filterTasks(tasks, "pending")).toHaveLength(1);
  });

  it("devuelve todas cuando el filtro es 'all'", () => {
    expect(filterTasks(tasks, "all")).toHaveLength(2);
  });
});

describe("validateTaskForm", () => {
  it("rechaza un título vacío o con solo espacios", () => {
    expect(validateTaskForm("   ")).toBe("El título es obligatorio.");
  });

  it("rechaza títulos demasiado largos", () => {
    expect(validateTaskForm("a".repeat(81))).not.toBeNull();
  });

  it("acepta un título válido", () => {
    expect(validateTaskForm("Estudiar React")).toBeNull();
  });
});