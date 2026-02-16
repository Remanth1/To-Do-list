import { motion } from "motion/react";
import { ListTodo, Calendar, Clock, CheckCircle } from "lucide-react";

export type FilterType = "all" | "today" | "upcoming" | "completed";

type FilterVariant = "default" | "compact" | "chips";

interface FilterTabsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: Record<FilterType, number>;
  variant?: FilterVariant;
}

export function FilterTabs({ activeFilter, onFilterChange, counts, variant = "default" }: FilterTabsProps) {
  const filters: Array<{ key: FilterType; label: string; icon: React.ReactNode; shortLabel?: string }> = [
    { key: "all", label: "All", shortLabel: "All", icon: <ListTodo className="h-4 w-4" /> },
    { key: "today", label: "Today", shortLabel: "Today", icon: <Calendar className="h-4 w-4" /> },
    { key: "upcoming", label: "Upcoming", shortLabel: "Later", icon: <Clock className="h-4 w-4" /> },
    { key: "completed", label: "Completed", shortLabel: "Done", icon: <CheckCircle className="h-4 w-4" /> },
  ];

  // Variant-specific styles
  const variantStyles = {
    default: {
      container: "flex flex-wrap gap-2",
      button: "relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-all hover:scale-105 active:scale-95",
      showIcon: true,
      showCount: true,
      useShortLabel: false,
    },
    compact: {
      container: "flex flex-wrap gap-1.5",
      button: "relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-all hover:scale-105 active:scale-95",
      showIcon: false,
      showCount: true,
      useShortLabel: true,
    },
    chips: {
      container: "flex overflow-x-auto gap-2 pb-2 scrollbar-hide",
      button: "relative flex items-center gap-2 rounded-full px-4 py-2 text-sm whitespace-nowrap transition-all hover:scale-105 active:scale-95",
      showIcon: true,
      showCount: true,
      useShortLabel: false,
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={styles.container}>
      {filters.map((filter) => {
        const isActive = activeFilter === filter.key;
        const label = styles.useShortLabel ? filter.shortLabel : filter.label;

        return (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={`${styles.button} border-2 border-border font-bold ${
              isActive
                ? "bg-primary text-primary-foreground brutal-shadow-sm"
                : "bg-card text-foreground brutal-shadow-sm hover:bg-muted"
            }`}
            aria-label={`Filter by ${filter.label}`}
            aria-pressed={isActive}
          >
            {/* Icon - conditionally shown */}
            {styles.showIcon && (
              <span className="flex-shrink-0">{filter.icon}</span>
            )}

            {/* Label - responsive text */}
            <span className="hidden sm:inline">{filter.label}</span>
            <span className="sm:hidden">{filter.shortLabel}</span>

            {/* Count badge - conditionally shown */}
            {styles.showCount && (
              <span
                className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs ${
                  isActive
                    ? "bg-primary-foreground text-primary"
                    : "bg-muted text-foreground"
                }`}
              >
                {counts[filter.key]}
              </span>
            )}

            {/* Animated background for active state */}
            {isActive && (
              <motion.div
                layoutId={`activeTab-${variant}`}
                className={`absolute inset-0 bg-primary ${
                  variant === "chips" ? "rounded-full" : "rounded-lg"
                }`}
                style={{ zIndex: -1 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}