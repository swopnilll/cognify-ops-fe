import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import CognigyButton from "../components/ui/CognigyButton";
import CognifyInput from "../components/ui/CognifyInput";

import { useMutation } from "@tanstack/react-query";
import { signUp } from "../services/authService";
import { toast } from "react-toastify";

export const Route = createFileRoute("/signup")({
  component: SignUpComponent,
});

function SignUpComponent() {
  
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const mutation = useMutation({
    mutationFn: signUp,
    onSuccess: (data) => {  
      console.log("Sign Up successful:", data);
      setErrors({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      toast.success("Sign Up successful! Please log in.");

      navigate({to: "/login", replace: true});
    },
    onError: (error: any) => {
      console.error("Sign Up error:", error);
    },
  })

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async () => {
    const newErrors: typeof errors = {
      fullName: form.fullName ? "" : "Full name is required",
      email: /\S+@\S+\.\S+/.test(form.email) ? "" : "Enter a valid email",
      password: form.password.length >= 6 ? "" : "Min 6 characters",
      confirmPassword:
        form.confirmPassword === form.password ? "" : "Passwords do not match",
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((e) => e);

    if (!hasError) {
      mutation.mutate({
        email: form.email,
        password: form.password,
      });
      
    }
  };

  return (
    <section className="max-w-lg mx-auto mt-10 bg-white p-15 shadow-md rounded-xl flex flex-col gap-10 lg:w-1/2">
      <section>
        <p className="text-sm text-gray-500">Start Your Journey</p>
        <p className="text-2xl font-semibold text-black mt-1">
          Create an Account
        </p>
      </section>

      <CognifyInput
        label="Full Name"
        value={form.fullName}
        onChange={(val) => handleChange("fullName", val)}
        error={errors.fullName}
        required
      />
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
      <CognifyInput
        label="Confirm Password"
        type="password"
        value={form.confirmPassword}
        onChange={(val) => handleChange("confirmPassword", val)}
        error={errors.confirmPassword}
        required
      />

      <CognigyButton
        label="Sign Up"
        variant="outlined"
        customColor="blue"
        textColor="white"
        onClick={handleSubmit}
        size="large"
      />

      <section className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500">
            Login
          </a>
        </p>
      </section>
    </section>
  );
}
