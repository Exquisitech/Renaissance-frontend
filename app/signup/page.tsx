import type { Metadata } from "next";
import SignupForm from "@/components/signup-form";

export const metadata: Metadata = {
  title: "Sign Up | Renaissance",
  description: "Create your Renaissance account and get started today.",
};

export default function SignupPage() {
  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <h1 className="signup-title">Create Account</h1>
          <p className="signup-subtitle">
            Join Renaissance and start your journey
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
