import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RenaissanceLogo } from "@/components/renaissance-logo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

describe("UI components", () => {
  it("renders button variants and supports asChild", () => {
    const { container } = render(
      <div>
        <Button>Primary</Button>
        <Button asChild variant="link">
          <a href="/docs">Docs</a>
        </Button>
      </div>,
    );

    expect(screen.getByRole("button", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute(
      "href",
      "/docs",
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders badge, card, input, label, scroll area, separator, and logo", () => {
    render(
      <div>
        <Badge variant="secondary">New</Badge>
        <Card>
          <CardHeader>
            <CardTitle>Card title</CardTitle>
            <CardDescription>Card description</CardDescription>
          </CardHeader>
          <CardContent>Body</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>
        <Label htmlFor="email">Email</Label>
        <Input id="email" defaultValue="test@example.com" />
        <ScrollArea className="max-h-12">
          <div>Scrollable content</div>
        </ScrollArea>
        <Separator orientation="vertical" data-testid="separator" />
        <RenaissanceLogo className="h-6 w-6" />
      </div>,
    );

    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.getByText("Card title")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveValue("test@example.com");
    expect(screen.getByText("Scrollable content")).toBeInTheDocument();
    expect(screen.getByTestId("separator")).toHaveClass("w-px");
    expect(screen.getByRole("img", { name: "Renaissance logo" })).toBeInTheDocument();
  });

  it("toggles checkbox state through user interaction", async () => {
    const user = userEvent.setup();
    render(<Checkbox aria-label="Accept terms" />);

    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});