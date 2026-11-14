import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Kanban, Sparkles } from "lucide-react";

import { useAuth } from "../hooks/useAuthV2";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const features = [
  {
    icon: Kanban,
    title: "Boards that stay out of your way",
    body: "Create tasks, assign them and drag them across columns. Nothing to configure first.",
  },
  {
    icon: BookOpen,
    title: "A knowledge base that builds itself",
    body: "Every project and task you write is indexed in the background as you work.",
  },
  {
    icon: Sparkles,
    title: "Ask Intellecta",
    body: "Ask questions in plain language and get answers grounded in your own project data.",
  },
];

// A small static preview of the product, drawn in CSS.
const previewColumns = [
  { name: "To Do", dot: "bg-slate-400", cards: ["Draft onboarding flow", "Set up billing page"] },
  { name: "In Progress", dot: "bg-amber-500", cards: ["Search across tickets"] },
  { name: "Done", dot: "bg-emerald-500", cards: ["Login and sign-up", "Project settings"] },
];

function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-brand-900/5">
        <div className="mb-4 flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {previewColumns.map((column) => (
            <div key={column.name} className="min-w-0 rounded-xl bg-slate-100 p-1.5 sm:p-2">
              <div className="mb-2 flex items-center gap-1.5 px-1 text-xs font-medium text-slate-600">
                <span className={`h-2 w-2 shrink-0 rounded-full ${column.dot}`} />
                <span className="truncate">{column.name}</span>
              </div>
              <div className="flex flex-col gap-2">
                {column.cards.map((card) => (
                  <div
                    key={card}
                    className="rounded-lg border border-slate-200 bg-white p-2 text-xs font-medium sm:p-2.5 text-slate-700 shadow-sm"
                  >
                    {card}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute -bottom-8 right-0 w-56 rounded-2xl sm:w-64 border border-slate-200 bg-white p-4 shadow-xl shadow-brand-900/10 sm:-right-6">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-brand-700">
          <Sparkles className="h-3.5 w-3.5" />
          Intellecta
        </div>
        <p className="text-xs leading-relaxed text-slate-600">
          Two tasks are still open for the launch: the onboarding flow and the billing page.
        </p>
      </div>
    </div>
  );
}

function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-white">
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-10 sm:gap-16 sm:px-6 sm:pb-24 sm:pt-16 lg:grid-cols-2 lg:pt-24">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-600/20">
            <Sparkles className="h-3.5 w-3.5" />
            Project management with built-in AI
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Track the work.
            <br />
            <span className="text-brand-600">Ask it questions.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed sm:text-lg text-slate-600">
            Cognify Ops turns your tasks into a knowledge base as you go, so answers about
            your project are one question away.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to={isAuthenticated ? "/projects" : "/signup"}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-600 px-5 text-base font-medium text-white shadow-sm transition-colors hover:bg-brand-700"
            >
              {isAuthenticated ? "Go to your projects" : "Get started"}
              <ArrowRight className="h-4 w-4" />
            </Link>
            {!isAuthenticated && (
              <Link
                to="/login"
                className="inline-flex h-11 items-center rounded-lg px-5 text-base font-medium text-slate-700 ring-1 ring-inset ring-slate-300 transition-colors hover:bg-slate-50"
              >
                Log in
              </Link>
            )}
          </div>
        </div>

        <ProductPreview />
      </section>

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-10 sm:gap-6 sm:px-6 sm:py-16 md:grid-cols-3">
          {features.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-base font-semibold text-slate-900">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
