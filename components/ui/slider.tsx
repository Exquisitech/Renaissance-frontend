"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function Slider({
  className,
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> & {
  value?: number[];
  onValueChange?: (value: number[]) => void;
}) {
  const currentValue = value?.[0] ?? min;

  return (
    <input
      type="range"
      className={cn("w-full accent-primary", className)}
      min={min}
      max={max}
      step={step}
      value={currentValue}
      onChange={(event) => onValueChange?.([Number(event.target.value)])}
      {...props}
    />
  );
}

export { Slider };