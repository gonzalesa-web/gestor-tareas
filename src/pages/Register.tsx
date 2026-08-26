import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { registerWithEmail } from "../services/auth.service";
import { getAuthErrorMessage } from "../utils/authErrors";

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) return setError("El correo es obligatorio.");
    if (password.length < 6)
      return setError("La contraseña debe tener al menos 6 caracteres.");
    if (password !== confirm) return setError("Las contraseñas no coinciden.");

    setLoading(true);
    try {
      await registerWithEmail(email.trim(), password);
    } catch (err) {
      const code = err instanceof FirebaseError ? err.code : "";
      setError(getAuthErrorMessage(code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="card" onSubmit={handleSubmit}>
        <h1>Crear cuenta</h1>

        <label htmlFor="email">Correo</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tucorreo@mail.com"
        />

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label htmlFor="confirm">Repetir contraseña</label>
        <input
          id="confirm"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creando..." : "Registrarme"}
        </button>

        <p className="hint">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </main>
  );
}