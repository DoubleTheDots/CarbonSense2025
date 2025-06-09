import type { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  isSpinning?: boolean;
}

export function SectionHeader({
  icon: Icon,
  title,
  description,
  isSpinning = false,
}: SectionHeaderProps) {
  return (
    <div className="bg-emerald-900 px-6 py-5">
      <div className="flex items-center">
        <Icon
          className={`h-6 w-6 text-white ${isSpinning ? "animate-spin" : ""}`}
        />
        <h2 className="ml-3 text-xl font-semibold text-white">{title}</h2>
      </div>
      <p className="mt-1 max-w-2xl text-sm text-white/70">{description}</p>
    </div>
  );
}
