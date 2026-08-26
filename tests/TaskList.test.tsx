import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskList } from "../src/components/TaskList";
import type { Task } from "../src/types/task";

const tasks: Task[] = [
  {
    id: "1",
    userId: "u1",
    title: "Tarea pendiente",
    description: "detalle",
    completed: false,
    createdAt: 1,
  },
];

describe("TaskList", () => {
  it("muestra el estado de carga", () => {
    render(
      <TaskList tasks={[]} loading onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />
    );
    expect(screen.getByText("Cargando tareas...")).toBeInTheDocument();
  });

  it("muestra el estado vacío cuando no hay tareas", () => {
    render(
      <TaskList tasks={[]} loading={false} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />
    );
    expect(screen.getByText(/todavía no tienes tareas/i)).toBeInTheDocument();
  });

  it("llama a onDelete con el id de la tarea", async () => {
    const onDelete = vi.fn();
    render(
      <TaskList tasks={tasks} loading={false} onToggle={vi.fn()} onDelete={onDelete} onEdit={vi.fn()} />
    );

    await userEvent.click(screen.getByRole("button", { name: /eliminar/i }));
    expect(onDelete).toHaveBeenCalledWith("1");
  });
});