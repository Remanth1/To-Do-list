import { useState } from "react";
import { CheckCircle2, Circle, Trash2, Calendar, Flag, Star, Repeat, ListChecks } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { Task, SubTask } from "../types/task";
import { TASK_CATEGORIES, TASK_REPEAT_LABELS, type TaskCategory, type TaskRepeat } from "../types/task";

type TaskCardVariant = "default" | "compact" | "detailed";

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStar?: (id: string) => void;
  onToggleSubTask?: (taskId: string, subTaskId: string) => void;
  variant?: TaskCardVariant;
}

export type { Task } from "../types/task";

export function TaskCard({
  task,
  onToggle,
  onDelete,
  onToggleStar,
  onToggleSubTask,
  variant = "default",
}: TaskCardProps) {
  const [showSubTasks, setShowSubTasks] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    if (date.getTime() === today.getTime()) return "Today";
    if (date.getTime() === tomorrow.getTime()) return "Tomorrow";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const variantStyles = {
    default: { padding: "p-4", iconSize: "h-6 w-6", titleSize: "text-base", metaSize: "text-sm" },
    compact: { padding: "p-3", iconSize: "h-5 w-5", titleSize: "text-sm", metaSize: "text-xs" },
    detailed: { padding: "p-5", iconSize: "h-7 w-7", titleSize: "text-lg", metaSize: "text-sm" },
  };

  const priorityVariants = {
    low: { color: "text-muted-foreground", bg: "bg-muted", border: "border-border" },
    medium: { color: "text-foreground", bg: "bg-accent/80", border: "border-border" },
    high: { color: "text-foreground", bg: "bg-destructive/20", border: "border-border" },
  };

  const styles = variantStyles[variant];
  const priorityStyle = priorityVariants[task.priority];
  const subTasks = task.subTasks ?? [];
  const subTasksCompleted = subTasks.filter((s) => s.completed).length;
  const hasSubTasks = subTasks.length > 0;
  const repeat = task.repeat ?? "none";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className={`group relative rounded-lg border-2 bg-card brutal-shadow transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:shadow-none ${
        task.completed ? "opacity-70" : ""
      } ${priorityStyle.border} ${styles.padding}`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(task.id)}
          className="mt-0.5 flex-shrink-0 transition-transform hover:scale-110 active:scale-95"
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed ? (
            <CheckCircle2 className={`${styles.iconSize} text-primary`} />
          ) : (
            <Circle className={`${styles.iconSize} text-muted-foreground hover:text-primary`} />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <h3
              className={`${styles.titleSize} transition-all break-words flex-1 min-w-0 ${
                task.completed ? "text-muted-foreground line-through" : "text-foreground font-medium"
              }`}
            >
              {task.title}
            </h3>
            {onToggleStar && (
              <button
                onClick={(e) => { e.stopPropagation(); onToggleStar(task.id); }}
                className="flex-shrink-0 p-0.5 rounded transition-colors"
                aria-label={task.starred ? "Unstar" : "Star"}
              >
                <Star
                  className={`h-5 w-5 ${
                    task.starred ? "fill-accent text-accent-foreground" : "text-muted-foreground hover:text-accent"
                  }`}
                />
              </button>
            )}
          </div>

          <div className={`mt-2 flex flex-wrap items-center gap-2 sm:gap-3 ${styles.metaSize}`}>
            {task.dueDate && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span className="whitespace-nowrap">{formatDate(task.dueDate)}</span>
              </div>
            )}
            {task.category && (
              <span className="rounded-md px-2 py-0.5 bg-primary/30 text-foreground text-xs font-medium border border-border">
                {TASK_CATEGORIES[task.category as TaskCategory]}
              </span>
            )}
            <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 ${priorityStyle.bg} ${priorityStyle.color}`}>
              <Flag className="h-3 w-3 flex-shrink-0" />
              <span className="capitalize whitespace-nowrap">{task.priority}</span>
            </div>
            {repeat !== "none" && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Repeat className="h-3 w-3" />
                <span>{TASK_REPEAT_LABELS[repeat as TaskRepeat]}</span>
              </div>
            )}
            {hasSubTasks && (
              <button
                onClick={() => setShowSubTasks(!showSubTasks)}
                className="flex items-center gap-1 text-muted-foreground hover:text-primary font-medium"
              >
                <ListChecks className="h-4 w-4" />
                <span>{subTasksCompleted}/{subTasks.length}</span>
              </button>
            )}
          </div>

          <AnimatePresence>
            {showSubTasks && hasSubTasks && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 pt-3 border-t-2 border-border"
              >
                <ul className="space-y-1.5">
                  {subTasks.map((st: SubTask) => (
                    <li key={st.id} className="flex items-center gap-2">
                      <button
                        onClick={() => onToggleSubTask?.(task.id, st.id)}
                        className="flex-shrink-0"
                      >
                        {st.completed ? (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                      <span className={`text-sm ${st.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {st.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className="flex-shrink-0 transition-all hover:scale-110 active:scale-95 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
          aria-label="Delete task"
        >
          <Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive" />
        </button>
      </div>
    </motion.div>
  );
}
