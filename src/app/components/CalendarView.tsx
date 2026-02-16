import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from "date-fns";
import type { Task } from "../types/task";

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export function CalendarView({ tasks, onTaskClick }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad start so first day aligns with weekday (e.g. Sunday = 0)
  const startPadding = monthStart.getDay();
  const paddedDays = [...Array(startPadding).fill(null), ...days];

  const getTasksForDay = (day: Date) => {
    return tasks.filter((t) => {
      if (!t.dueDate) return false;
      const d = new Date(t.dueDate);
      return isSameDay(d, day);
    });
  };

  return (
    <div className="rounded-lg border-2 border-border bg-card p-4 brutal-shadow">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 rounded-md border-2 border-border bg-muted hover:bg-primary hover:text-primary-foreground font-bold transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <button
          type="button"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 rounded-md border-2 border-border bg-muted hover:bg-primary hover:text-primary-foreground font-bold transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center text-xs font-bold text-muted-foreground py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {paddedDays.map((day, i) => {
          if (!day) {
            return <div key={`empty-${i}`} className="aspect-square" />;
          }
          const dayTasks = getTasksForDay(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isTodayDate = isToday(day);
          return (
            <div
              key={day.toISOString()}
              className={`aspect-square rounded-md border-2 flex flex-col overflow-hidden ${
                !isCurrentMonth ? "opacity-40" : ""
              } ${
                isTodayDate
                  ? "border-border bg-primary/30"
                  : "border-border bg-muted"
              }`}
            >
              <span className={`text-xs p-0.5 font-bold ${isTodayDate ? "text-foreground" : "text-muted-foreground"}`}>
                {format(day, "d")}
              </span>
              <div className="flex-1 overflow-auto min-h-0">
                {dayTasks.slice(0, 3).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onTaskClick?.(t)}
                    className={`w-full text-left truncate text-[10px] px-0.5 py-0.5 rounded border border-border ${
                      t.completed ? "line-through text-muted-foreground" : "text-foreground font-medium"
                    } ${t.priority === "high" ? "bg-destructive/20" : t.priority === "medium" ? "bg-accent/50" : "bg-card"}`}
                  >
                    {t.title}
                  </button>
                ))}
                {dayTasks.length > 3 && (
                  <span className="text-[10px] text-muted-foreground px-0.5 font-medium">+{dayTasks.length - 3}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
