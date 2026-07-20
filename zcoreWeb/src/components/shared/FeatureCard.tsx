import { type Feature } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Package,
  FileSpreadsheet,
  BarChart3,
  LucideProps,
} from "lucide-react";
import { type ElementType } from "react";

const iconMap: Record<string, ElementType<LucideProps>> = {
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Package,
  FileSpreadsheet,
  BarChart3,
};

interface FeatureCardProps extends Feature {
  className?: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  const Icon = iconMap[icon] ?? Package;

  return (
    <div
      className={cn(
        "group rounded-xl border border-white/[0.07] bg-[#111111] p-6",
        "transition-all duration-200 hover:border-white/[0.14] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30",
        className
      )}
    >
      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:bg-emerald-500/15 transition-colors">
        <Icon className="w-5 h-5 text-emerald-400" />
      </div>
      <h3 className="font-semibold text-white mb-2 text-sm sm:text-base">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
