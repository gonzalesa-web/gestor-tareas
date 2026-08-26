const MESSAGES: Record<string, string> = {
  "auth/invalid-email": "El correo no tiene un formato válido.",
  "auth/user-disabled": "Esta cuenta está deshabilitada.",
  "auth/user-not-found": "No existe una cuenta con ese correo.",
  "auth/wrong-password": "La contraseña es incorrecta.",
  "auth/invalid-credential": "Correo o contraseña incorrectos.",
  "auth/email-already-in-use": "Ese correo ya está registrado.",
  "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
  "auth/too-many-requests": "Demasiados intentos. Espera unos minutos.",
  "auth/popup-closed-by-user": "Cerraste la ventana de Google antes de terminar.",
  "auth/network-request-failed": "Sin conexión. Revisa tu internet.",
};

export function getAuthErrorMessage(code: string): string {
  return MESSAGES[code] ?? "Ocurrió un error inesperado. Intenta de nuevo.";
}