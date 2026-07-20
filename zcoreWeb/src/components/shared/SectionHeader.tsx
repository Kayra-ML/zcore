import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  center = false,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn(center && "text-center", className)}>
      {eyebrow && (
        <p className="text-xs font-semibold tracking-widest text-emerald-500 uppercase mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-zinc-400 leading-relaxed max-w-2xl text-sm sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
