import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth";
import Header from "../components/Header";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  useAuth();

  return (
    <>
      <Header />
      <main className="w-full p-8 bg-gradient-to-b from-blue-100 to-blue-500 min-h-[calc(100vh-5rem)] flex items-center justify-between">
        {/* Left Content Section */}
        <section className="max-w-2xl">
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
            Revolutionize Project Management <br /> with{" "}
            <span className="text-blue-600">AI-Powered Efficiency</span>
          </h1>
          <p className="mt-6 text-lg text-gray-700 leading-relaxed">
            Track your tasks seamlessly and unknowingly build a knowledge hub.
            Boost productivity, automate workflows, and simplify collaboration.
          </p>
          <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
            Get Started
          </button>
        </section>

        {/* Right Image Section */}
        <section className="w-full max-w-lg">
          <img
            src="/images/home-page-hero.png"
            alt="AI Project Management"
            className="w-full h-auto object-cover"
          />
        </section>
      </main>
    </>
  );
}

export default HomePage;
