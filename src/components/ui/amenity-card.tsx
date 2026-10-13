"use client";

import { ReactNode } from "react";

export interface AmenityCardProps {
  name: string;
  description: string;
}

export const AmenityCard = ({ name, description }: AmenityCardProps) => {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--muted-ivory)] transition-colors hover:bg-[var(--warm-cream)]">
      <div className="w-8 h-8 rounded bg-[var(--primary-terracotta)] flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-[var(--warm-cream)]" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V5a2 2 0 002-2h2a2 2 0 002 2v14m-6-7a2 2 0 012-2h2a2 2 0 012 2v-3m-3 3a2 2 0 012-2h2a2 2 0 012 2v-3m3 3a2 2 0 012-2h2a2 2 0 012 2v-3"/>
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-[var(--dark-charcoal)]">{name}</h3>
        <p className="text-xs text-[var(--dark-charcoal)/60]">{description}</p>
      </div>
    </div>
  );
};

AmenityCard.displayName = "AmenityCard";