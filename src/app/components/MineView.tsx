import { useMemo } from "react";
import { TrendingUp, CheckCircle2, Star, Calendar, Target } from "lucide-react";
import type { Task } from "../types/task";
import { format, startOfDay, subDays } from "date-fns";

interface MineViewProps {
  tasks: Task[];
}

export function MineView({ tasks }: MineViewProps) {
  const { completed, total, starred, completionRate, last7Days, completedByDay, maxCompleted } = useMemo(() => {
    const completedCount = tasks.filter((t) => t.completed).length;
    const totalCount = tasks.length;
    const starredCount = tasks.filter((t) => t.starred && !t.completed).length;
    const rate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const days = Array.from({ length: 7 }, (_, i) => subDays(startOfDay(new Date()), 6 - i));
    const byDay = days.map((day) => {
      const dayStr = format(day, "yyyy-MM-dd");
      return tasks.filter(
        (t) => t.dueDate && format(new Date(t.dueDate), "yyyy-MM-dd") === dayStr && t.completed
      ).length;
    });
    return {
      completed: completedCount,
      total: totalCount,
      starred: starredCount,
      completionRate: rate,
      last7Days: days,
      completedByDay: byDay,
      maxCompleted: Math.max(1, ...byDay),
    };
  }, [tasks]);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border-2 border-border bg-card p-6 brutal-shadow">
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Your progress
        </h2>
        <p className="text-sm text-muted-foreground mb-4 font-medium">
          Tracking your daily planners completion status — you're getting better and better.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-md border-2 border-border bg-primary/20 p-4 text-center brutal-shadow-sm">
            <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{completed}</p>
            <p className="text-xs text-muted-foreground font-medium">Completed</p>
          </div>
          <div className="rounded-md border-2 border-border bg-muted p-4 text-center brutal-shadow-sm">
            <p className="text-2xl font-bold text-foreground">{total}</p>
            <p className="text-xs text-muted-foreground font-medium">Total tasks</p>
          </div>
          <div className="rounded-md border-2 border-border bg-accent/50 p-4 text-center brutal-shadow-sm">
            <Star className="h-8 w-8 text-accent-foreground mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{starred}</p>
            <p className="text-xs text-muted-foreground font-medium">Starred</p>
          </div>
          <div className="rounded-md border-2 border-border bg-muted p-4 text-center brutal-shadow-sm">
            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{completionRate}%</p>
            <p className="text-xs text-muted-foreground font-medium">Completion rate</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border-2 border-border bg-card p-6 brutal-shadow">
        <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          Last 7 days
        </h3>
        <div className="flex items-end gap-2 h-24">
          {last7Days.map((day, i) => (
            <div key={day.toISOString()} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-primary border-2 border-border rounded-t min-h-[4px] transition-all"
                style={{ height: `${(completedByDay[i] / maxCompleted) * 80}px` }}
              />
              <span className="text-[10px] text-muted-foreground font-medium">{format(day, "EEE")}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
