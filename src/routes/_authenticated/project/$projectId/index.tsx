import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/project/$projectId/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6">
      <img
        src="/images/under-construction.gif"
        alt="Under Construction"
        className="w-[500px] mb-6"
      />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        This page is still under construction!
      </h1>
      <p className="text-gray-600 text-lg">
        Please navigate to the{" "}
        <span className="font-semibold">Kanban View</span> for more features.
      </p>
    </div>
  );
}
