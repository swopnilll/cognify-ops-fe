import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import Logo from "../components/ui/Logo";
import CognigyButton from "../components/ui/CognigyButton";
import CognifyInput from "../components/ui/CognifyInput";

export const Route = createFileRoute("/login")({
  component: LoginComponent,
});

function LoginComponent() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = () => {
    const newErrors: typeof errors = {
      email: /\S+@\S+\.\S+/.test(form.email) ? "" : "Enter a valid email",
      password: form.password.length >= 6 ? "" : "Min 6 characters",
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((e) => e);

    if (!hasError) {
      console.log("Login form submitted:", form);
      // TODO: Add actual API call here
    }
  };

  return (
    <>
      <header className="p-4 flex justify-between items-center bg-white shadow-neutral-400">
       <Link to="/"><Logo src="images/logo.jpeg" /></Link>
      </header>

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
            <a href="/signup" className="text-blue-500">
              Sign Up
            </a>
          </p>
        </section>
      </section>
    </>
  );
}
