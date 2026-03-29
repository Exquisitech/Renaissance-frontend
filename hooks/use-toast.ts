"use client";

import { toast as sonnerToast } from "sonner";

type ToastInput = {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
};

export function useToast() {
  return {
    toast: ({ title, description, variant }: ToastInput) => {
      const message = description ? `${title}: ${description}` : title;

      if (variant === "destructive") {
        sonnerToast.error(message);
        return;
      }

      sonnerToast.success(message);
    },
  };
}