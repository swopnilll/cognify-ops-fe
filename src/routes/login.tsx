import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import AuthCard from "../components/AuthCard";
import Button from "../components/ui/Button";
import TextField from "../components/ui/TextField";
import { useAuth } from "../hooks/useAuthV2";
import { login } from "../services/authService";

export const Route = createFileRoute("/login")({
  component: LoginComponent,
});

function LoginComponent() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [submitError, setSubmitError] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      await auth.signIn(data);
      navigate({ to: "/projects", replace: true });
    },
    onError: (error: any) => {
      setSubmitError(error?.response?.data?.error || "Login failed. Please try again.");
    },
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setSubmitError("");
  };

  const handleSubmit = () => {
    const newErrors = {
      email: /\S+@\S+\.\S+/.test(form.email) ? "" : "Enter a valid email",
      password: form.password ? "" : "Enter your password",
    };
    setErrors(newErrors);

    if (!Object.values(newErrors).some(Boolean)) {
      mutate({ email: form.email, password: form.password });
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to your Cognify Ops account"
      onSubmit={handleSubmit}
      footer={
        <>
          Don’t have an account?{" "}
          <Link to="/signup" className="font-medium text-brand-600 hover:text-brand-700">
            Sign up
          </Link>
        </>
      }
    >
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        autoFocus
        value={form.email}
        onChange={(val) => handleChange("email", val)}
        error={errors.email}
        required
      />
      <TextField
        label="Password"
        type="password"
        autoComplete="current-password"
        value={form.password}
        onChange={(val) => handleChange("password", val)}
        error={errors.password}
        required
      />

      {submitError && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </p>
      )}

      <Button type="submit" size="lg" fullWidth loading={isPending} className="mt-1">
        Log in
      </Button>
    </AuthCard>
  );
}
