import { useState } from "react";
import { Plus, Calendar, Flag, Star, Repeat, Tag, ListChecks } from "lucide-react";
import { motion } from "motion/react";
import type { TaskPriority, TaskCategory, TaskRepeat, SubTask } from "../types/task";
import { TASK_CATEGORIES, TASK_REPEAT_LABELS } from "../types/task";

export interface AddTaskPayload {
  title: string;
  dueDate: string;
  priority: TaskPriority;
  starred?: boolean;
  category?: TaskCategory;
  repeat?: TaskRepeat;
  subTasks?: SubTask[];
}

interface TaskInputProps {
  onAddTask: (payload: AddTaskPayload) => void;
}

const CATEGORY_OPTIONS: TaskCategory[] = ["personal", "work", "study", "fitness", "shopping", "other"];
const REPEAT_OPTIONS: TaskRepeat[] = ["none", "daily", "weekly", "monthly", "yearly"];

export function TaskInput({ onAddTask }: TaskInputProps) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [starred, setStarred] = useState(false);
  const [category, setCategory] = useState<TaskCategory | "">("");
  const [repeat, setRepeat] = useState<TaskRepeat>("none");
  const [showOptions, setShowOptions] = useState(false);
  const [subTaskTitle, setSubTaskTitle] = useState("");
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask({
        title: title.trim(),
        dueDate,
        priority,
        starred,
        category: category || undefined,
        repeat: repeat === "none" ? undefined : repeat,
        subTasks: subTasks.length > 0 ? subTasks : undefined,
      });
      setTitle("");
      setDueDate("");
      setPriority("medium");
      setStarred(false);
      setCategory("");
      setRepeat("none");
      setSubTaskTitle("");
      setSubTasks([]);
      setShowOptions(false);
    }
  };

  const addSubTask = () => {
    if (!subTaskTitle.trim()) return;
    setSubTasks((prev) => [
      ...prev,
      { id: Date.now().toString(), title: subTaskTitle.trim(), completed: false },
    ]);
    setSubTaskTitle("");
  };

  const removeSubTask = (id: string) => {
    setSubTasks((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-lg border-2 border-border bg-card p-3 sm:p-4 brutal-shadow"
    >
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 sm:gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setShowOptions(true)}
            placeholder="Add a new task..."
            className="flex-1 min-w-0 border-none bg-transparent text-sm sm:text-base text-foreground placeholder-muted-foreground outline-none font-medium"
          />
          <button
            type="button"
            onClick={() => setStarred(!starred)}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors"
            aria-label={starred ? "Unstar" : "Star"}
          >
            <Star className={`h-5 w-5 ${starred ? "fill-accent text-accent-foreground" : "text-muted-foreground hover:text-accent"}`} />
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className="flex h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground border-2 border-border brutal-shadow-sm font-bold transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0"
            aria-label="Add task"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {showOptions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 sm:mt-4 flex flex-col gap-3 border-t-2 border-border pt-3 sm:pt-4"
          >
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="flex-1 min-w-0 rounded-md border-2 border-border bg-background px-3 py-1.5 text-xs sm:text-sm text-foreground outline-none focus:ring-2 focus:ring-primary font-medium"
                />
              </div>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Flag className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="flex-1 min-w-0 rounded-md border-2 border-border bg-background px-3 py-1.5 text-xs sm:text-sm text-foreground outline-none focus:ring-2 focus:ring-primary font-medium"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Tag className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <select
                  value={category}
                  onChange={(e) => setCategory((e.target.value || "") as TaskCategory | "")}
                  className="flex-1 min-w-0 rounded-md border-2 border-border bg-background px-3 py-1.5 text-xs sm:text-sm text-foreground outline-none focus:ring-2 focus:ring-primary font-medium"
                >
                  <option value="">No category</option>
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>{TASK_CATEGORIES[c]}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Repeat className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <select
                  value={repeat}
                  onChange={(e) => setRepeat(e.target.value as TaskRepeat)}
                  className="flex-1 min-w-0 rounded-md border-2 border-border bg-background px-3 py-1.5 text-xs sm:text-sm text-foreground outline-none focus:ring-2 focus:ring-primary font-medium"
                >
                  {REPEAT_OPTIONS.map((r) => (
                    <option key={r} value={r}>{TASK_REPEAT_LABELS[r]}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <ListChecks className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-medium">Checklist (optional)</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={subTaskTitle}
                  onChange={(e) => setSubTaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSubTask())}
                  placeholder="Add sub-task..."
                  className="flex-1 rounded-md border-2 border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder-muted-foreground outline-none focus:ring-2 focus:ring-primary font-medium"
                />
                <button
                  type="button"
                  onClick={addSubTask}
                  disabled={!subTaskTitle.trim()}
                  className="rounded-md bg-muted border-2 border-border px-3 py-1.5 text-sm text-foreground font-bold hover:bg-primary hover:text-primary-foreground disabled:opacity-50 transition-colors"
                >
                  Add
                </button>
              </div>
              {subTasks.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {subTasks.map((st) => (
                    <li key={st.id} className="flex items-center justify-between text-sm text-foreground">
                      <span>{st.title}</span>
                      <button type="button" onClick={() => removeSubTask(st.id)} className="text-destructive hover:underline text-xs font-bold">Remove</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
}
