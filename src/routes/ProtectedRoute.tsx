import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="state-msg">Verificando sesión...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

export function PublicRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="state-msg">Cargando...</p>;
  if (user) return <Navigate to="/tasks" replace />;

  return <>{children}</>;
}