import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { loginWithEmail, loginWithGoogle } from "../services/auth.service";
import { getAuthErrorMessage } from "../utils/authErrors";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Completa el correo y la contraseña.");
      return;
    }

    setLoading(true);
    try {
      await loginWithEmail(email.trim(), password);
    } catch (err) {
      const code = err instanceof FirebaseError ? err.code : "";
      setError(getAuthErrorMessage(code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
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
        <h1>Iniciar sesión</h1>

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
          placeholder="••••••"
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        <button type="button" className="secondary" onClick={handleGoogle} disabled={loading}>
          Continuar con Google
        </button>

        <p className="hint">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </form>
    </main>
  );
}