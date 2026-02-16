export type TaskPriority = "low" | "medium" | "high";
export type TaskRepeat = "none" | "daily" | "weekly" | "monthly" | "yearly";
export type TaskCategory = "personal" | "work" | "study" | "fitness" | "shopping" | "other";

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority: TaskPriority;
  createdAt: string;
  starred?: boolean;
  category?: TaskCategory;
  subTasks?: SubTask[];
  repeat?: TaskRepeat;
}

export const TASK_CATEGORIES: Record<TaskCategory, string> = {
  personal: "Personal",
  work: "Work",
  study: "Study",
  fitness: "Fitness",
  shopping: "Shopping",
  other: "Other",
};

export const TASK_REPEAT_LABELS: Record<TaskRepeat, string> = {
  none: "No repeat",
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
};
