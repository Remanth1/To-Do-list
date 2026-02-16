import { useState, useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckSquare, LogOut, ListTodo, Calendar, UserCircle, Moon, Sun, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router";
import { TaskCard, Task } from "../components/TaskCard";
import { TaskInput, type AddTaskPayload } from "../components/TaskInput";
import { FilterTabs, FilterType } from "../components/FilterTabs";
import { CalendarView } from "../components/CalendarView";
import { MineView } from "../components/MineView";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { isToday, isUpcoming } from "../utils/dateUtils";

type MainTab = "tasks" | "calendar" | "mine";

export function Home() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [mainTab, setMainTab] = useState<MainTab>("tasks");
  const [showUserMenu, setShowUserMenu] = useState(false);

  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;

  useEffect(() => {
    if (!user) return;
    const storageKey = `tasks_${user.email}`;
    const load = () => {
      const savedTasks = localStorage.getItem(storageKey);
      if (savedTasks) setTasks(JSON.parse(savedTasks));
    };
    load();
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        load();
      } else {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
        localStorage.setItem(storageKey, JSON.stringify(tasksRef.current));
      }
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue !== null) {
        try {
          setTasks(JSON.parse(e.newValue));
        } catch {
          load();
        }
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("storage", onStorage);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("storage", onStorage);
    };
  }, [user]);

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!user) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      const storageKey = `tasks_${user.email}`;
      localStorage.setItem(storageKey, JSON.stringify(tasksRef.current));
      saveTimeoutRef.current = null;
    }, 400);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [tasks, user]);

  const addTask = (payload: AddTaskPayload) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: payload.title,
      completed: false,
      dueDate: payload.dueDate || undefined,
      priority: payload.priority,
      createdAt: new Date().toISOString(),
      starred: payload.starred ?? false,
      category: payload.category,
      subTasks: payload.subTasks?.length ? payload.subTasks : undefined,
      repeat: payload.repeat,
    };
    setTasks([newTask, ...tasks]);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const toggleStar = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, starred: !task.starred } : task
      )
    );
  };

  const toggleSubTask = (taskId: string, subTaskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId || !task.subTasks) return task;
        return {
          ...task,
          subTasks: task.subTasks.map((st) =>
            st.id === subTaskId ? { ...st, completed: !st.completed } : st
          ),
        };
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      switch (activeFilter) {
        case "today":
          return task.dueDate && isToday(task.dueDate) && !task.completed;
        case "upcoming":
          return task.dueDate && isUpcoming(task.dueDate) && !task.completed;
        case "completed":
          return task.completed;
        case "all":
        default:
          return true;
      }
    });
  }, [tasks, activeFilter]);

  const counts = useMemo(
    () => ({
      all: tasks.length,
      today: tasks.filter((t) => t.dueDate && isToday(t.dueDate) && !t.completed).length,
      upcoming: tasks.filter((t) => t.dueDate && isUpcoming(t.dueDate) && !t.completed).length,
      completed: tasks.filter((t) => t.completed).length,
    }),
    [tasks]
  );

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const tabs: { key: MainTab; label: string; icon: React.ReactNode }[] = [
    { key: "tasks", label: "Tasks", icon: <ListTodo className="h-5 w-5" /> },
    { key: "calendar", label: "Calendar", icon: <Calendar className="h-5 w-5" /> },
    { key: "mine", label: "Mine", icon: <UserCircle className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary border-2 border-border p-2.5 sm:p-3 brutal-shadow">
                <CheckSquare className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">TaskFlow</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Welcome back, {user?.name?.split(" ")[0]}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-card border-2 border-border brutal-shadow-sm transition-transform hover:translate-x-0 hover:translate-y-0 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-accent-foreground" />
                ) : (
                  <Moon className="h-5 w-5 text-foreground" />
                )}
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 rounded-full bg-card border-2 border-border p-2 brutal-shadow-sm"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary border-2 border-border flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {user && getInitials(user.name)}
                  </div>
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-card rounded-lg brutal-shadow border-2 border-border overflow-hidden z-10"
                    >
                      <div className="p-4 border-b-2 border-border">
                        <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => { setShowUserMenu(false); navigate("/dashboard"); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Dashboard</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-foreground hover:bg-muted transition-colors border-t-2 border-border"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          <p className="text-center text-sm sm:text-base text-muted-foreground font-medium">
            Stay organized, stay productive
          </p>
        </motion.div>

        {/* Bottom nav - Neo-Brutalist tabs */}
        <div className="flex rounded-lg bg-card border-2 border-border p-1 mb-6 brutal-shadow">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setMainTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-sm font-bold transition-all ${
                mainTab === tab.key
                  ? "bg-primary text-primary-foreground border-2 border-border brutal-shadow-sm"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {mainTab === "tasks" && (
          <>
            <div className="mb-4 sm:mb-6">
              <TaskInput onAddTask={addTask} />
            </div>
            <div className="mb-4 sm:mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
              <FilterTabs
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                counts={counts}
              />
            </div>
            <div className="space-y-2 sm:space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredTasks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-lg border-2 border-dashed border-border bg-card p-8 sm:p-12 text-center brutal-shadow"
                  >
                    <div className="mx-auto mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-lg bg-muted border-2 border-border">
                      <CheckSquare className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mb-2 text-base sm:text-lg font-bold text-foreground">No tasks yet</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {activeFilter === "all"
                        ? "Add a task to get started"
                        : `No ${activeFilter} tasks found`}
                    </p>
                  </motion.div>
                ) : (
                  filteredTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={toggleTask}
                      onDelete={deleteTask}
                      onToggleStar={toggleStar}
                      onToggleSubTask={toggleSubTask}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>
            {tasks.length > 0 && mainTab === "tasks" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 sm:mt-8 text-center text-xs sm:text-sm font-medium text-muted-foreground"
              >
                {counts.completed} of {tasks.length} tasks completed
              </motion.div>
            )}
          </>
        )}

        {mainTab === "calendar" && (
          <CalendarView tasks={tasks} />
        )}

        {mainTab === "mine" && <MineView tasks={tasks} />}
      </div>

      {showUserMenu && (
        <div className="fixed inset-0 z-0" onClick={() => setShowUserMenu(false)} />
      )}
    </div>
  );
}
