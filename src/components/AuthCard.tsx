import React from "react";

interface AuthCardProps {
  title: string;
  subtitle: string;
  footer: React.ReactNode;
  onSubmit: () => void;
  children: React.ReactNode;
}

// Shared frame for the login and sign-up forms.
const AuthCard: React.FC<AuthCardProps> = ({ title, subtitle, footer, onSubmit, children }) => {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <img src="/images/main-logo.svg" alt="" className="mx-auto h-12 w-12" />
          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>
        </div>

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          {children}
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">{footer}</p>
      </div>
    </div>
  );
};

export default AuthCard;
