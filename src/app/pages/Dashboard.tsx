import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  LayoutDashboard,
  Calendar,
  CheckCircle2,
  Target,
  TrendingUp,
  Sun,
  CalendarDays,
  CalendarRange,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import type { Task } from "../components/TaskCard";
import { format } from "date-fns";
import { getPeriodRange, isInPeriod, type Period } from "../utils/dateUtils";

const PERIODS: { key: Period; label: string; icon: React.ReactNode; sublabel: string }[] = [
  { key: "day", label: "Today", icon: <Sun className="h-5 w-5" />, sublabel: "End of day" },
  { key: "week", label: "This week", icon: <CalendarDays className="h-5 w-5" />, sublabel: "End of week" },
  { key: "month", label: "This month", icon: <CalendarRange className="h-5 w-5" />, sublabel: "End of month" },
  { key: "year", label: "This year", icon: <Calendar className="h-5 w-5" />, sublabel: "End of year" },
];

function getPeriodTitle(period: Period): string {
  const { start, end } = getPeriodRange(period);
  if (period === "day") return format(start, "EEEE, MMM d");
  if (period === "week") return `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`;
  if (period === "month") return format(start, "MMMM yyyy");
  return format(start, "yyyy");
}

function loadTasksFromStorage(userEmail: string): Task[] {
  const storageKey = `tasks_${userEmail}`;
  const saved = localStorage.getItem(storageKey);
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

export function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [period, setPeriod] = useState<Period>("day");

  const refreshTasks = useCallback(() => {
    if (!user) return;
    setTasks(loadTasksFromStorage(user.email));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    refreshTasks();
  }, [user, refreshTasks]);

  useEffect(() => {
    if (!user) return;
    const storageKey = `tasks_${user.email}`;
    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue !== null) {
        try {
          setTasks(JSON.parse(e.newValue));
        } catch {
          refreshTasks();
        }
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") refreshTasks();
    };
    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [user, refreshTasks]);

  const { tasksInPeriod, completedInPeriod, total, completed, completionRate, pending } = useMemo(() => {
    const inPeriod = tasks.filter((t) => t.dueDate && isInPeriod(t.dueDate, period));
    const completedList = inPeriod.filter((t) => t.completed);
    const totalCount = inPeriod.length;
    const completedCount = completedList.length;
    return {
      tasksInPeriod: inPeriod,
      completedInPeriod: completedList,
      total: totalCount,
      completed: completedCount,
      completionRate: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
      pending: totalCount - completedCount,
    };
  }, [tasks, period]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to tasks
          </Link>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary border-2 border-border p-2.5 brutal-shadow-sm">
              <LayoutDashboard className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Progress dashboard</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {user?.name} · End of period progress
              </p>
            </div>
          </div>
        </motion.div>

        {/* Period selector */}
        <div className="mb-6">
          <p className="text-sm font-bold text-muted-foreground mb-2">View progress for</p>
          <div className="flex flex-wrap gap-2">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setPeriod(p.key)}
                className={`flex items-center gap-2 rounded-lg border-2 border-border px-4 py-2.5 text-sm font-bold transition-all ${
                  period === p.key
                    ? "bg-primary text-primary-foreground brutal-shadow-sm"
                    : "bg-card text-foreground brutal-shadow-sm hover:bg-muted"
                }`}
              >
                {p.icon}
                {p.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground font-medium">
            {getPeriodTitle(period)}
          </p>
        </div>

        {/* Stats cards */}
        <motion.div
          key={period}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="rounded-lg border-2 border-border bg-card p-6 brutal-shadow mb-6"
        >
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            {period === "day" ? "End of day" : period === "week" ? "End of week" : period === "month" ? "End of month" : "End of year"} progress
          </h2>

          {total === 0 ? (
            <div className="py-8 text-center rounded-md border-2 border-dashed border-border bg-muted/50">
              <Sparkles className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-bold text-foreground">No tasks due in this period</p>
              <p className="text-xs text-muted-foreground mt-1">
                Add tasks with due dates to track your progress here.
              </p>
              <Link
                to="/"
                className="inline-block mt-3 rounded-md bg-primary border-2 border-border px-4 py-2 text-sm font-bold text-primary-foreground brutal-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
              >
                Go to tasks
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="rounded-md border-2 border-border bg-muted p-4 text-center brutal-shadow-sm">
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">{total}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">Total due</p>
                </div>
                <div className="rounded-md border-2 border-border bg-primary/20 p-4 text-center brutal-shadow-sm">
                  <CheckCircle2 className="h-6 w-6 text-primary mx-auto mb-1" />
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">{completed}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">Completed</p>
                </div>
                <div className="rounded-md border-2 border-border bg-destructive/10 p-4 text-center brutal-shadow-sm">
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">{pending}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">Pending</p>
                </div>
                <div className="rounded-md border-2 border-border bg-accent/50 p-4 text-center brutal-shadow-sm">
                  <TrendingUp className="h-6 w-6 text-accent-foreground mx-auto mb-1" />
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">{completionRate}%</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">Completion rate</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs font-bold text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{completed} / {total} tasks</span>
                </div>
                <div className="h-4 rounded-md border-2 border-border bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completionRate}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-full bg-primary border-r-2 border-border"
                  />
                </div>
              </div>

              {/* Task list summary */}
              <div>
                <p className="text-sm font-bold text-foreground mb-2">Tasks in this period</p>
                <ul className="space-y-1.5 max-h-48 overflow-auto">
                  {tasksInPeriod.map((t) => (
                    <li
                      key={t.id}
                      className={`flex items-center gap-2 rounded-md border-2 border-border px-3 py-2 text-sm ${
                        t.completed ? "bg-primary/10 line-through text-muted-foreground" : "bg-muted/50 text-foreground font-medium"
                      }`}
                    >
                      {t.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      ) : (
                        <span className="w-4 h-4 rounded border-2 border-border flex-shrink-0" />
                      )}
                      <span className="truncate">{t.title}</span>
                      {t.dueDate && (
                        <span className="text-xs text-muted-foreground ml-auto flex-shrink-0">
                          {format(new Date(t.dueDate), "MMM d")}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </motion.div>

        {/* Quick tip */}
        <p className="text-center text-xs text-muted-foreground font-medium">
          Switch the period above to see your progress for today, this week, month, or year.
        </p>
      </div>
    </div>
  );
}
