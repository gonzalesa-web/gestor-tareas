import { useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";
import { logout } from "../services/auth.service";
import { TaskForm } from "../components/TaskForm";
import { TaskList } from "../components/TaskList";
import { TaskFilters } from "../components/TaskFilters";
import { SummaryButton } from "../components/SummaryButton";
import { buildSummary, filterTasks } from "../utils/taskSummary";
import type { TaskFilter } from "../types/task";

export function Tasks() {
  const { user } = useAuth();
  const { tasks, loading, error, add, edit, toggle, remove } = useTasks(user?.uid);
  const [filter, setFilter] = useState<TaskFilter>("all");

  const visibleTasks = useMemo(() => filterTasks(tasks, filter), [tasks, filter]);
  const summary = useMemo(() => buildSummary(tasks), [tasks]);

  return (
    <main className="tasks-page">
      <header className="topbar">
        <div>
          <h1>Mis tareas</h1>
          <p className="user-email">{user?.email}</p>
        </div>
        <button className="secondary" onClick={() => logout()}>
          Cerrar sesión
        </button>
      </header>

      <section className="stats">
        <span>Total: {summary.total}</span>
        <span>Pendientes: {summary.pending}</span>
        <span>Completadas: {summary.completed}</span>
      </section>

      <TaskForm onSubmit={add} />

      <TaskFilters value={filter} onChange={setFilter} />

      {error && <p className="error">{error}</p>}

      <TaskList
        tasks={visibleTasks}
        loading={loading}
        onToggle={toggle}
        onDelete={remove}
        onEdit={edit}
      />

      {user?.email && <SummaryButton email={user.email} tasks={tasks} />}
    </main>
  );
}