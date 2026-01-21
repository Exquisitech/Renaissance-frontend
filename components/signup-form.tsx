"use client";

import { useState, useCallback } from "react";

interface FormData {
  username: string;
  email: string;
  password: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

const calculatePasswordStrength = (password: string): PasswordStrength => {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) {
    return { score, label: "Weak", color: "var(--strength-weak)" };
  } else if (score <= 3) {
    return { score, label: "Fair", color: "var(--strength-fair)" };
  } else if (score <= 4) {
    return { score, label: "Good", color: "var(--strength-good)" };
  } else {
    return { score, label: "Strong", color: "var(--strength-strong)" };
  }
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function SignupForm() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const passwordStrength = calculatePasswordStrength(formData.password);

  const validateField = useCallback(
    (name: keyof FormData, value: string): string | undefined => {
      switch (name) {
        case "username":
          if (!value.trim()) return "Username is required";
          if (value.length < 3) return "Username must be at least 3 characters";
          if (!/^[a-zA-Z0-9_]+$/.test(value))
            return "Username can only contain letters, numbers, and underscores";
          return undefined;

        case "email":
          if (!value.trim()) return "Email is required";
          if (!validateEmail(value))
            return "Please enter a valid email address";
          return undefined;

        case "password":
          if (!value) return "Password is required";
          if (value.length < 8) return "Password must be at least 8 characters";
          return undefined;

        default:
          return undefined;
      }
    },
    [],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name as keyof FormData, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name as keyof FormData, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof FormData>).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({ username: true, email: true, password: true });
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitSuccess(true);

    // Reset form after success
    setTimeout(() => {
      setFormData({ username: "", email: "", password: "" });
      setTouched({});
      setSubmitSuccess(false);
    }, 2000);
  };

  const isFormValid =
    formData.username &&
    formData.email &&
    formData.password &&
    !errors.username &&
    !errors.email &&
    !errors.password;

  return (
    <form onSubmit={handleSubmit} className="signup-form" noValidate>
      {submitSuccess && (
        <div className="success-message">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="success-icon"
          >
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
              clipRule="evenodd"
            />
          </svg>
          Account created successfully!
        </div>
      )}

      <div className="form-group">
        <label htmlFor="username" className="form-label">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`form-input ${errors.username && touched.username ? "input-error" : ""}`}
          placeholder="Enter your username"
          autoComplete="username"
          aria-describedby={errors.username ? "username-error" : undefined}
          aria-invalid={errors.username && touched.username ? "true" : "false"}
        />
        {errors.username && touched.username && (
          <span id="username-error" className="error-message" role="alert">
            {errors.username}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`form-input ${errors.email && touched.email ? "input-error" : ""}`}
          placeholder="Enter your email"
          autoComplete="email"
          aria-describedby={errors.email ? "email-error" : undefined}
          aria-invalid={errors.email && touched.email ? "true" : "false"}
        />
        {errors.email && touched.email && (
          <span id="email-error" className="error-message" role="alert">
            {errors.email}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <div className="password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${errors.password && touched.password ? "input-error" : ""}`}
            placeholder="Create a password"
            autoComplete="new-password"
            aria-describedby={
              errors.password
                ? "password-error password-strength"
                : "password-strength"
            }
            aria-invalid={
              errors.password && touched.password ? "true" : "false"
            }
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="toggle-icon"
              >
                <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
                <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
                <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="toggle-icon"
              >
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                <path
                  fillRule="evenodd"
                  d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
        {errors.password && touched.password && (
          <span id="password-error" className="error-message" role="alert">
            {errors.password}
          </span>
        )}

        {formData.password && (
          <div id="password-strength" className="password-strength">
            <div className="strength-bar-container">
              <div
                className="strength-bar"
                style={{
                  width: `${(passwordStrength.score / 6) * 100}%`,
                  backgroundColor: passwordStrength.color,
                }}
              />
            </div>
            <span
              className="strength-label"
              style={{ color: passwordStrength.color }}
            >
              {passwordStrength.label}
            </span>
          </div>
        )}

        <ul className="password-requirements">
          <li className={formData.password.length >= 8 ? "met" : ""}>
            At least 8 characters
          </li>
          <li className={/[A-Z]/.test(formData.password) ? "met" : ""}>
            One uppercase letter
          </li>
          <li className={/[a-z]/.test(formData.password) ? "met" : ""}>
            One lowercase letter
          </li>
          <li className={/[0-9]/.test(formData.password) ? "met" : ""}>
            One number
          </li>
          <li className={/[^a-zA-Z0-9]/.test(formData.password) ? "met" : ""}>
            One special character
          </li>
        </ul>
      </div>

      <button
        type="submit"
        className="submit-button"
        disabled={!isFormValid || isSubmitting}
      >
        {isSubmitting ? <span className="loading-spinner" /> : "Create Account"}
      </button>

      <p className="login-link">
        Already have an account?{" "}
        <a href="/login" className="link">
          Sign in
        </a>
      </p>
    </form>
  );
}
