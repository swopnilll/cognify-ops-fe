import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import ClipLoader from "react-spinners/ClipLoader";

import CognigyButton from "../components/ui/CognigyButton";
import CognifyInput from "../components/ui/CognifyInput";
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

  const {
    mutate,
    isPending,
  } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setErrors({ email: "", password: "" });
      auth.signIn(data);
      navigate({ to: "/projects", replace: true });
    },
    onError: (error: any) => {
      setSubmitError(error?.response?.data?.error || "Login failed");
    },
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setSubmitError("");
  };

  const validateForm = () => {
    const newErrors = {
      email: /\S+@\S+\.\S+/.test(form.email) ? "" : "Enter a valid email",
      password: form.password.length >= 6 ? "" : "Min 6 characters",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      mutate({ email: form.email, password: form.password });
    }
  };

  return (
    <section className="max-w-lg mx-auto mt-10 bg-white p-10 shadow-md rounded-xl flex flex-col gap-6 lg:w-1/2">
      <header>
        <p className="text-sm text-gray-500">Welcome Back</p>
        <h1 className="text-2xl font-semibold text-black mt-1">
          Login to Your Account
        </h1>
      </header>

      <CognifyInput
        label="Email"
        type="email"
        value={form.email}
        onChange={(val) => handleChange("email", val)}
        error={errors.email}
        required
      />

      <CognifyInput
        label="Password"
        type="password"
        value={form.password}
        onChange={(val) => handleChange("password", val)}
        error={errors.password}
        required
      />

      {submitError && (
        <p className="text-red-500 text-sm text-center">{submitError}</p>
      )}

      {isPending ? (
        <div className="flex justify-center items-center py-2">
          <ClipLoader color="#3b82f6" size={32} />
        </div>
      ) : (
        <CognigyButton
          label="Login"
          variant="outlined"
          customColor="blue"
          textColor="white"
          onClick={handleSubmit}
          size="large"
        />
      )}

      <footer className="flex justify-center items-center">
        <p className="text-sm text-gray-500">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-500">
            Sign Up
          </Link>
        </p>
      </footer>
    </section>
  );
}
