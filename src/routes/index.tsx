import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth";
import Header from "../components/ui/Header";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  useAuth();

  return (
    <>
      <Header />
      <main className="p-4">
        <h1 className="text-2xl font-bold">Home Page</h1>
        <p className="mt-4">Welcome to the home page!</p>
      </main>
    </>
  );
}
