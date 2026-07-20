import { type PricingPlan } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Check, Sparkles } from "lucide-react";
import CTAButton from "./CTAButton";

interface PricingCardProps extends PricingPlan {
  className?: string;
}

export default function PricingCard({
  name,
  price,
  period,
  description,
  features,
  isPopular,
  cta,
  className,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border p-7 flex flex-col gap-6 transition-all duration-200",
        isPopular
          ? "border-emerald-500/40 bg-[#0d1a12] shadow-xl shadow-emerald-950/30"
          : "border-white/[0.07] bg-[#111111] hover:border-white/[0.14] hover:-translate-y-0.5",
        className
      )}
    >
      {isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-semibold shadow-lg shadow-emerald-900/40">
            <Sparkles className="w-3 h-3" />
            En Popüler
          </span>
        </div>
      )}

      <div>
        <p className="text-sm font-semibold text-zinc-400 mb-1">{name}</p>
        <div className="flex items-end gap-1">
          <span className={cn("text-4xl font-bold", isPopular ? "text-emerald-400" : "text-white")}>
            {price}
          </span>
          <span className="text-zinc-500 text-sm mb-1">{period}</span>
        </div>
        <p className="text-zinc-500 text-sm mt-2 leading-relaxed">{description}</p>
      </div>

      <ul className="flex flex-col gap-2.5">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm">
            <Check
              className={cn(
                "w-4 h-4 mt-0.5 flex-shrink-0",
                isPopular ? "text-emerald-400" : "text-zinc-400"
              )}
            />
            <span className="text-zinc-300">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-2">
        <CTAButton
          variant={isPopular ? "primary" : "secondary"}
          className="w-full justify-center"
          size="md"
        >
          {cta}
        </CTAButton>
      </div>
    </div>
  );
}
