import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

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

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [submitError, setSubmitError] = useState("");

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log("Login successful:", data);
      setErrors({
        email: "",
        password: "",
      });

      auth.signIn(data);
      
      navigate({ to: "/projects", replace: true });
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      setSubmitError(error.message || "Login failed");
    },
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setSubmitError("");
  };

  const handleSubmit = async () => {
    const newErrors: typeof errors = {
      email: /\S+@\S+\.\S+/.test(form.email) ? "" : "Enter a valid email",
      password: form.password.length >= 6 ? "" : "Min 6 characters",
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((e) => e);

    if (!hasError) { 
      // try {
      //   await login({ email: form.email, password: form.password });

      //   navigate({ to: "/projects", replace: true });
      // } catch (err: any) {
      //   setSubmitError(err.message || "Login failed");
      // }

      mutation.mutate({ email: form.email, password: form.password });
    }
  };

  return (
    <section className="max-w-lg mx-auto mt-10 bg-white p-15 shadow-md rounded-xl flex flex-col gap-10 lg:w-1/2">
      <section>
        <p className="text-sm text-gray-500">Welcome Back</p>
        <p className="text-2xl font-semibold text-black mt-1">
          Login to Your Account
        </p>
      </section>

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

      {submitError && <p className="text-red-500 text-sm">{submitError}</p>}

      <CognigyButton
        label="Login"
        variant="outlined"
        customColor="blue"
        textColor="white"
        onClick={handleSubmit}
        size="large"
      />

      <section className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-500">
            Sign Up
          </Link>
        </p>
      </section>
    </section>
  );
}
