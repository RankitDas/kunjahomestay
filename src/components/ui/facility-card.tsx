"use client";

import { ReactNode } from "react";

export interface FacilityCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  included?: boolean;
}

export const FacilityCard = ({
  icon,
  title,
  description,
  included,
}: FacilityCardProps) => {
  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white border border-gray-200/50 transition-all duration-200 hover:border-[var(--primary-terracotta)]">
      <div className="w-10 h-10 rounded-lg bg-[var(--muted-ivory)] flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-medium text-[var(--dark-charcoal)] mt-1">{title}</h3>
      <p className="text-xs text-[var(--dark-charcoal)/60]">{description}</p>
      {included !== undefined && (
        <span className={`text-xs rounded px-2 py-1 ${
          included ? "bg-[var(--primary-terracotta)] text-[var(--warm-cream)]" : "bg-[var(--muted-ivory)] text-[var(--dark-charcoal)]"
        }`}
        >
          {included ? "Included" : "Available at extra cost"}
        </span>
      )}
    </div>
  );
};

FacilityCard.displayName = "FacilityCard";