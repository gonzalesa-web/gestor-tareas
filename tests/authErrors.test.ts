import { describe, expect, it } from "vitest";
import { getAuthErrorMessage } from "../src/utils/authErrors";

describe("getAuthErrorMessage", () => {
  it("traduce un código conocido de Firebase", () => {
    expect(getAuthErrorMessage("auth/wrong-password")).toBe(
      "La contraseña es incorrecta."
    );
  });

  it("devuelve un mensaje genérico ante un código desconocido", () => {
    expect(getAuthErrorMessage("auth/lo-que-sea")).toBe(
      "Ocurrió un error inesperado. Intenta de nuevo."
    );
  });
});