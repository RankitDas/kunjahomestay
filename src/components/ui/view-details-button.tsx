"use client";

export const ViewDetailsButton = ({ roomId }: { roomId: string }) => (
  <button
    type="button"
    className="mt-2 w-full py-2 px-3 text-sm font-medium text-white bg-[var(--primary-terracotta)] rounded-lg hover:bg-[var(--deep-burnt-sienna)] transition-colors"
    onClick={() => alert(`View details for room ${roomId}`)}
  >
    View Details
  </button>
);

export default ViewDetailsButton;
