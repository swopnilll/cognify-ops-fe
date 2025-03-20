import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  useAuth();

  return (
    <>
      <h1>Home Page</h1>
    </>
  );
}
