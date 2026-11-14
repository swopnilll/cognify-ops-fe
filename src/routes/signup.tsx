import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import AuthCard from "../components/AuthCard";
import Button from "../components/ui/Button";
import TextField from "../components/ui/TextField";
import { signUp } from "../services/authService";

export const Route = createFileRoute("/signup")({
  component: SignUpComponent,
});

const emptyForm = { fullName: "", email: "", password: "", confirmPassword: "" };

function SignUpComponent() {
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState(emptyForm);
  const [submitError, setSubmitError] = useState("");

  const mutation = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      toast.success("Account created. Please log in.");
      navigate({ to: "/login", replace: true });
    },
    onError: (error: any) => {
      setSubmitError(error.response?.data?.error || "Sign-up failed. Please try again.");
    },
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setSubmitError("");
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = () => {
    const newErrors: typeof errors = {
      fullName: form.fullName.trim() ? "" : "Enter your name",
      email: /\S+@\S+\.\S+/.test(form.email) ? "" : "Enter a valid email",
      password: form.password.length >= 8 ? "" : "Use at least 8 characters",
      confirmPassword: form.confirmPassword === form.password ? "" : "Passwords do not match",
    };
    setErrors(newErrors);

    if (!Object.values(newErrors).some(Boolean)) {
      mutation.mutate({
        email: form.email,
        password: form.password,
        fullName: form.fullName,
      });
    }
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start tracking projects in a couple of minutes"
      onSubmit={handleSubmit}
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
            Log in
          </Link>
        </>
      }
    >
      <TextField
        label="Full name"
        autoComplete="name"
        autoFocus
        value={form.fullName}
        onChange={(val) => handleChange("fullName", val)}
        error={errors.fullName}
        required
      />
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        value={form.email}
        onChange={(val) => handleChange("email", val)}
        error={errors.email}
        required
      />
      <TextField
        label="Password"
        type="password"
        autoComplete="new-password"
        value={form.password}
        onChange={(val) => handleChange("password", val)}
        error={errors.password}
        hint="At least 8 characters"
        required
      />
      <TextField
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        value={form.confirmPassword}
        onChange={(val) => handleChange("confirmPassword", val)}
        error={errors.confirmPassword}
        required
      />

      {submitError && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </p>
      )}

      <Button type="submit" size="lg" fullWidth loading={mutation.isPending} className="mt-1">
        Create account
      </Button>
    </AuthCard>
  );
}
