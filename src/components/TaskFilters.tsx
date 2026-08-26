import type { TaskFilter } from "../types/task";

interface TaskFiltersProps {
  value: TaskFilter;
  onChange: (filter: TaskFilter) => void;
}

const OPTIONS: { value: TaskFilter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "pending", label: "Pendientes" },
  { value: "completed", label: "Completadas" },
];

export function TaskFilters({ value, onChange }: TaskFiltersProps) {
  return (
    <div className="filters">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          className={value === option.value ? "filter active" : "filter"}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}