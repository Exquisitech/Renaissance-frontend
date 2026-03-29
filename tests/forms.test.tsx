import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import LoginForm from "@/components/login-form";
import SignupForm from "@/components/signup-form";
import { mockRouter } from "./next-mocks";

describe("auth forms", () => {
  it("submits login form and routes to dashboard", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "secret");
    await user.click(screen.getByRole("button", { name: /login to stellar/i }));

    expect(mockRouter.push).toHaveBeenCalledWith("/dashboard");
  });

  it("submits signup form and routes to team selection", async () => {
    const user = userEvent.setup();
    const { container } = render(<SignupForm />);

    await user.type(screen.getByLabelText(/username/i), "johndoe");
    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "secret");
    await user.type(screen.getByLabelText(/confirm password/i), "secret");
    await user.click(screen.getByRole("checkbox"));
    await user.click(
      screen.getByRole("button", { name: /create account on stellar/i }),
    );

    expect(mockRouter.push).toHaveBeenCalledWith("/select-teams");
    expect(container.firstChild).toMatchSnapshot();
  });
});