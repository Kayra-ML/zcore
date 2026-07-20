import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type StatusType = "healthy" | "critical" | "risk" | "loss";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig: Record<StatusType, { label: string; colorClass: string }> = {
    healthy: {
      label: "Sağlıklı",
      colorClass: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
    risk: {
      label: "Riskli",
      colorClass: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    },
    critical: {
      label: "Kritik",
      colorClass: "bg-red-500/10 text-red-500 border-red-500/20",
    },
    loss: {
      label: "Zarar",
      colorClass: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium",
        config.colorClass,
        className
      )}
    >
      {config.label}
    </span>
  );
}
