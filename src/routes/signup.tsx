import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

import CognigyButton from "../components/ui/CognigyButton";
import CognifyInput from "../components/ui/CognifyInput";
import { signUp } from "../services/authService";

export const Route = createFileRoute("/signup")({
  component: SignUpComponent,
});

function SignUpComponent() {
  const navigate = useNavigate();

  // State for form inputs, error messages, and submit error
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

  const [submitError, setSubmitError] = useState("");

  // Mutation hook for handling signup
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
      navigate({ to: "/login", replace: true });
    },
    onError: (error: any) => {
      console.error("Sign Up error:", error);
      setSubmitError(error.response?.data?.error || "Signup failed");
    },
  });

  // Handle form field changes
  const handleChange = (field: string, value: string) => {
    setSubmitError(""); // Clear submit error on input change
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors: typeof errors = {
      fullName: form.fullName ? "" : "Full name is required",
      email: /\S+@\S+\.\S+/.test(form.email) ? "" : "Enter a valid email",
      password: form.password.length >= 6 ? "" : "Password must be at least 6 characters",
      confirmPassword: form.confirmPassword === form.password ? "" : "Passwords do not match",
    };
    setErrors(newErrors);

    return !Object.values(newErrors).some((e) => e);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (validateForm()) {
      mutation.mutate({
        email: form.email,
        password: form.password,
        fullName: form.fullName,
      });
    }
  };

  return (
    <section className="max-w-lg mx-auto mt-10 bg-white p-15 shadow-md rounded-xl flex flex-col gap-10 lg:w-1/2">
      {/* Heading */}
      <section>
        <p className="text-sm text-gray-500">Start Your Journey</p>
        <p className="text-2xl font-semibold text-black mt-1">Create an Account</p>
      </section>

      {/* Form Fields */}
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

      {/* Display Submit Error */}
      {submitError && <p className="text-red-500 text-sm">{submitError}</p>}

      {/* Loader or Button */}
      {mutation.isPending ? (
        <div className="flex justify-center items-center py-2">
          <ClipLoader color="#3b82f6" size={32} />
        </div>
      ) : (
        <CognigyButton
          label="Sign Up"
          variant="outlined"
          customColor="blue"
          textColor="white"
          onClick={handleSubmit}
          size="large"
        />
      )}

      {/* Footer */}
      <section className="flex justify-between items-center mt-4">
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
