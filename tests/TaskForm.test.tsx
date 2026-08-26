import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskForm } from "../src/components/TaskForm";

describe("TaskForm", () => {
  it("envía los datos cuando el título es válido", async () => {
    const onSubmit = vi.fn();
    render(<TaskForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText("Título"), "Estudiar TypeScript");
    await userEvent.type(screen.getByLabelText("Descripción"), "Repasar tipos");
    await userEvent.click(screen.getByRole("button", { name: /agregar tarea/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: "Estudiar TypeScript",
      description: "Repasar tipos",
    });
  });

  it("muestra un error y no envía si el título está vacío", async () => {
    const onSubmit = vi.fn();
    render(<TaskForm onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole("button", { name: /agregar tarea/i }));

    expect(await screen.findByText("El título es obligatorio.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});