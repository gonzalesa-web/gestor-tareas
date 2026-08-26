import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SummaryButton } from "../src/components/SummaryButton";
import { sendTaskSummary } from "../src/services/email.service";

vi.mock("../src/services/email.service", () => ({
  sendTaskSummary: vi.fn(),
}));

const mockedSend = vi.mocked(sendTaskSummary);

describe("SummaryButton", () => {
  beforeEach(() => vi.clearAllMocks());

  it("muestra mensaje de éxito tras enviar el resumen", async () => {
    mockedSend.mockResolvedValueOnce(undefined);
    render(<SummaryButton email="test@mail.com" tasks={[]} />);

    await userEvent.click(screen.getByRole("button"));

    expect(mockedSend).toHaveBeenCalledWith({ email: "test@mail.com", tasks: [] });
    expect(await screen.findByText(/resumen enviado/i)).toBeInTheDocument();
  });

  it("muestra el error cuando el envío falla", async () => {
    mockedSend.mockRejectedValueOnce(new Error("No se pudo enviar el email."));
    render(<SummaryButton email="test@mail.com" tasks={[]} />);

    await userEvent.click(screen.getByRole("button"));

    expect(await screen.findByText("No se pudo enviar el email.")).toBeInTheDocument();
  });
});