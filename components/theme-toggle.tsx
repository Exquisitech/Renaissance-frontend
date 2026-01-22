"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="size-4" aria-hidden="true" />;
      case "dark":
        return <Moon className="size-4" aria-hidden="true" />;
      case "system":
        return <Monitor className="size-4" aria-hidden="true" />;
      default:
        return <Sun className="size-4" aria-hidden="true" />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case "light":
        return "Light mode";
      case "dark":
        return "Dark mode";
      case "system":
        return "System mode";
      default:
        return "Light mode";
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      aria-label={`Current theme: ${getThemeLabel()}. Click to cycle themes.`}
      title={`Switch theme (current: ${getThemeLabel()})`}
      className="relative"
    >
      {getThemeIcon()}
      <span className="sr-only">{getThemeLabel()}</span>
    </Button>
  );
}
