import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  FileText,
  Menu,
  MessageSquare,
  Trophy,
  X,
} from "lucide-react";
import API_BASE_URL from "../services/api";

const workflow = [
  {
    number: "01",
    title: "Post a clear problem",
    description:
      "Share the context, field, difficulty, attachments, and the exact challenge you need help solving.",
  },
  {
    number: "02",
    title: "Collaborate on solutions",
    description:
      "Community members contribute explanations, technical approaches, resources, and supporting files.",
  },
  {
    number: "03",
    title: "Verify and preserve knowledge",
    description:
      "The problem owner verifies the most useful solution, which can then be preserved in the Knowledge Archive.",
  },
];

const formatLabel = (value, fallback = "Not specified") => {
  if (!value) return fallback;

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatRelativeTime = (dateValue) => {
  if (!dateValue) return "Recently updated";

  const date = new Date(dateValue);
  const now = new Date();

  if (Number.isNaN(date.getTime())) {
    return "Recently updated";
  }

  const differenceInSeconds = Math.floor(
    (now.getTime() - date.getTime()) / 1000
  );

  if (differenceInSeconds < 60) {
    return "Updated just now";
  }

  const minutes = Math.floor(differenceInSeconds / 60);

  if (minutes < 60) {
    return `Updated ${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `Updated ${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `Updated ${days} day${days === 1 ? "" : "s"} ago`;
  }

  return `Updated ${date.toLocaleDateString()}`;
};

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [problems, setProblems] = useState([]);
  const [problemsLoading, setProblemsLoading] = useState(true);
  const [problemsError, setProblemsError] = useState("");

  const [solvedProblems, setSolvedProblems] = useState([]);
  const [solvedProblemsLoading, setSolvedProblemsLoading] = useState(true);
  const [solvedProblemsError, setSolvedProblemsError] = useState("");

  const activeProblems = problems.filter(
  (problem) =>
    problem.status === "open" || problem.status === "in_progress"
  );

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const scrollToHero = (event) => {
  event.preventDefault();

  setMobileMenuOpen(false);

  document
    .getElementById("hero")
    ?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
  const fetchActiveProblems = async () => {
    try {
      setProblemsLoading(true);
      setProblemsError("");

      const response = await fetch(
        `${API_BASE_URL}/posts/public/active`
      );

      if (!response.ok) {
        throw new Error("Unable to load active problems");
      }

      const data = await response.json();
      setProblems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch active problems error:", error);
      setProblemsError("Active problems are temporarily unavailable.");
    } finally {
      setProblemsLoading(false);
    }
  };

  fetchActiveProblems();
}, []);

useEffect(() => {
  const fetchSolvedProblems = async () => {
    try {
      setSolvedProblemsLoading(true);
      setSolvedProblemsError("");

      const response = await fetch(
        `${API_BASE_URL}/posts/public/solved`
      );

      if (!response.ok) {
        throw new Error("Unable to load solved problems");
      }

      const data = await response.json();
      setSolvedProblems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch solved problems error:", error);
      setSolvedProblemsError(
        "Solved examples are temporarily unavailable."
      );
    } finally {
      setSolvedProblemsLoading(false);
    }
  };

  fetchSolvedProblems();
}, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link
              to="/"
              onClick={scrollToHero}
              aria-label="Scroll to CollabSolve home section"
              className="group flex items-center gap-2.5"
            >
              <img
                src="/collabsolve-logo.png"
                alt="CollabSolve"
                className="h-9 w-9 rounded-lg object-cover transition-transform duration-200 group-hover:scale-[1.03]"
              />

              <span className="text-lg font-semibold tracking-tight text-slate-950 transition-colors duration-200 group-hover:text-blue-700">
                CollabSolve
              </span>
            </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-7 text-sm text-slate-600 md:flex">
            <a
              href="#problems"
              className="transition-colors hover:text-slate-950"
            >
              Problems
            </a>

            <a
              href="#how-it-works"
              className="transition-colors hover:text-slate-950"
            >
              How it Works
            </a>

            <a
              href="#archive"
              className="transition-colors hover:text-slate-950"
            >
              Knowledge Archive
            </a>
          </div>

          {/* Desktop account actions */}
          <div className="hidden items-center gap-2 md:flex">
            <Link
              to="/login"
              className="rounded-md px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="group inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-md hover:shadow-blue-600/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Join CollabSolve

              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((currentValue) => !currentValue)}
            aria-label={
              mobileMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={mobileMenuOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-5 py-4 shadow-lg md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              <a
                href="#problems"
                onClick={closeMobileMenu}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Problems
              </a>

              <a
                href="#how-it-works"
                onClick={closeMobileMenu}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                How it Works
              </a>

              <a
                href="#archive"
                onClick={closeMobileMenu}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Knowledge Archive
              </a>

              <div className="my-2 border-t border-slate-200" />

              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="rounded-md px-3 py-2.5 text-center text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                onClick={closeMobileMenu}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Join CollabSolve
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section id="hero" className="relative scroll-mt-16 overflow-hidden border-b border-slate-200 bg-slate-50">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-cyan-100/70 blur-3xl" />
          <div className="absolute left-0 top-24 h-44 w-44 rounded-full bg-indigo-100/60 blur-3xl" />
        </div>

        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-5 py-8 lg:grid-cols-[1fr_0.95fr] lg:px-8 lg:py-10">
          {/* Hero content */}
          <div className="flex flex-col justify-center">
            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Solve real problems through{" "}
              <span className="text-blue-700">shared knowledge</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              CollabSolve connects students, researchers, engineers, and
              professionals to post problems, exchange solutions, verify useful
              answers, and build a reusable knowledge archive.
            </p>

            <div className="mt-8">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md"
              >
                Join the Community

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                Structured problem discussions
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                Owner-verified solutions
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                Contributor profiles and badges
              </span>
            </div>
          </div>

          {/* Platform preview */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-blue-100/70 via-white to-cyan-100/70 blur-2xl" />

            <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/10">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    Recently Solved
                  </div>

                  <div className="text-xs text-slate-500">
                    Real problems with owner-verified solutions
                  </div>
                </div>

                <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
                  Verified knowledge
                </span>
              </div>

              <div className="p-4">
                <div className="space-y-3">

                    <div className="space-y-3">
  {solvedProblemsLoading &&
    [1, 2].map((item) => (
      <div
        key={item}
        className="animate-pulse rounded-lg border border-slate-200 bg-white p-4"
      >
        <div className="h-4 w-3/4 rounded bg-slate-200" />

        <div className="mt-3 h-3 w-full rounded bg-slate-100" />
        <div className="mt-2 h-3 w-4/5 rounded bg-slate-100" />

        <div className="mt-4 rounded-md bg-emerald-50 p-3">
          <div className="h-3 w-1/3 rounded bg-emerald-100" />
          <div className="mt-2 h-3 w-full rounded bg-emerald-100" />
        </div>
      </div>
    ))}

  {!solvedProblemsLoading && solvedProblemsError && (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
      {solvedProblemsError}
    </div>
  )}

  {!solvedProblemsLoading &&
    !solvedProblemsError &&
    solvedProblems.length === 0 && (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-center">
        <p className="text-sm font-medium text-slate-700">
          No verified solutions are available yet.
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Verified problem-solving examples will appear here.
        </p>
      </div>
    )}

  {!solvedProblemsLoading &&
    !solvedProblemsError &&
    solvedProblems.map((problem) => (
      <article
        key={problem.post_id}
        className="group rounded-lg border border-slate-200 bg-white p-4 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
      >
        {/* Problem */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              Problem
            </p>

            <h3 className="mt-1 text-sm font-semibold leading-5 text-slate-900">
              {problem.title}
            </h3>
          </div>

          <span className="shrink-0 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700">
            Solved
          </span>
        </div>

        <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">
          {problem.description}
        </p>

        {/* Verified solution */}
        <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <CheckCircle className="h-3.5 w-3.5" />
            Verified solution
          </div>

          <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-emerald-900/80">
            {problem.solution_text}
          </p>

          {problem.solution_author && (
            <p className="mt-2 text-[10px] text-emerald-700">
              Solution by {problem.solution_author}
            </p>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
          <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
            {problem.field_name || "General"}
          </span>

          <span className="rounded border border-slate-200 bg-white px-2 py-1">
            {formatLabel(problem.difficulty_level)}
          </span>
        </div>
      </article>
    ))}
</div>

                </div>

                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems */}
      <section id="problems" className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
                Active challenges
              </span>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                Explore community challenges
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Discover open and in-progress problems that still need ideas,
                discussion, and practical solutions from the community.
              </p>
            </div>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
            >
              Sign in to view all problems
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {problemsLoading &&
    [1, 2, 3].map((item) => (
      <div
        key={item}
        className="animate-pulse rounded-xl border border-slate-200 bg-white p-5"
      >
        <div className="h-5 w-3/4 rounded bg-slate-200" />

        <div className="mt-4 space-y-2">
          <div className="h-3 w-full rounded bg-slate-100" />
          <div className="h-3 w-full rounded bg-slate-100" />
          <div className="h-3 w-2/3 rounded bg-slate-100" />
        </div>

        <div className="mt-5 flex gap-2">
          <div className="h-6 w-20 rounded bg-slate-100" />
          <div className="h-6 w-24 rounded bg-slate-100" />
        </div>
      </div>
    ))}

  {!problemsLoading && problemsError && (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-700 lg:col-span-3">
      {problemsError}
    </div>
  )}

  {!problemsLoading &&
    !problemsError &&
    activeProblems.length === 0 && (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center lg:col-span-3">
        <h3 className="text-base font-semibold text-slate-900">
          No active challenges right now
        </h3>

        <p className="mt-2 text-sm text-slate-600">
          All current problems have been solved or closed. Join the community
          to post a new challenge.
        </p>

        <Link
          to="/register"
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Join CollabSolve
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    )}

  {!problemsLoading &&
    !problemsError &&
    activeProblems.map((problem) => (
      <article
        key={problem.post_id}
        className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-900/5"
      >
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-base font-semibold leading-6 text-slate-900">
            {problem.title}
          </h3>

          <span
            className={`shrink-0 rounded-md border px-2 py-1 text-xs font-medium ${
              problem.status === "solved"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : problem.status === "closed"
                  ? "border-slate-200 bg-slate-100 text-slate-700"
                  : "border-blue-200 bg-blue-50 text-blue-700"
            }`}
          >
            {formatLabel(problem.status)}
          </span>
        </div>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
          {problem.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
            {problem.field_name || "General"}
          </span>

          <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600">
            {formatLabel(problem.difficulty_level)}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            {Number(problem.solution_count || 0)} solutions
          </span>

          <span>
            {formatRelativeTime(
              problem.updated_at || problem.created_at
            )}
          </span>
        </div>
      </article>
    ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-y border-slate-200 bg-white py-16"
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
              How CollabSolve works
            </span>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              From a problem to reusable knowledge
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Every useful discussion should lead to clarity, verification, and
              knowledge that future users can find again.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {workflow.map((step) => (
              <div
                key={step.number}
                className="group rounded-xl border border-slate-200 bg-slate-50 p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-sm font-semibold text-blue-700 transition-transform duration-300 group-hover:scale-105">
                  {step.number}
                </div>

                <h3 className="mt-4 text-base font-semibold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Knowledge Archive */}
      <section id="archive" className="bg-slate-50 py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="flex flex-col justify-center">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-600">
              Knowledge Archive
            </span>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Find proven solutions when you need them
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
              Verified solutions are organized as searchable archive entries,
              helping users find relevant knowledge, review previous discussions,
              and avoid solving the same problem again.
            </p>

            <div className="mt-6 space-y-3">
              {[
                "Search by problem title, field, or keyword",
                "Review owner-verified solutions",
                "Access supporting files and attachments",
                "See contributor and verification details",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm text-slate-700"
                >
                  <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600 transition-transform duration-300 group-hover:scale-110" />
                  {item}
                </div>
              ))}
            </div>

            <Link
              to="/login"
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Sign in to access the Archive
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5">
  <div className="border-b border-slate-200 px-5 py-4">
    <div className="flex items-center justify-between gap-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">
          Knowledge Archive
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Search and revisit verified community knowledge
        </p>
      </div>

      <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
        Verified entries
      </span>
    </div>
  </div>

  <div className="p-5">
    {/* Search preview */}
    <div className="flex items-center gap-3 rounded-lg border border-slate-300 bg-slate-50 px-4 py-3">
      <FileText className="h-4 w-4 shrink-0 text-slate-400" />

      <span className="text-sm text-slate-400">
        Archive search preview
      </span>
    </div>

    {/* Archive filters */}
    <div className="mt-4 flex flex-wrap gap-2">
      {["All fields", "IoT", "Software Engineering", "AI"].map(
        (filter, index) => (
          <span
            key={filter}
            className={`rounded-md border px-2.5 py-1 text-xs font-medium ${
              index === 0
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            {filter}
          </span>
        )
      )}
    </div>

    {/* Archive entries */}
    <div className="mt-5 space-y-3">
      <div className="group rounded-lg border border-slate-200 bg-white p-4 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50/30 hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="text-sm font-semibold leading-5 text-slate-900">
              Improving telemetry reliability for ESP32 devices
            </h4>

            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">
              Local buffering, exponential backoff, and message
              deduplication for unstable network conditions.
            </p>
          </div>

          <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600 transition-transform duration-300 group-hover:scale-110" />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
            IoT
          </span>

          <span>Verified solution</span>
          <span>3 attachments</span>
        </div>
      </div>

      <div className="group rounded-lg border border-slate-200 bg-white p-4 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50/30 hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="text-sm font-semibold leading-5 text-slate-900">
              Structuring automated tests for a React application
            </h4>

            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">
              A reusable testing approach covering components,
              integrations, validation, and regression checks.
            </p>
          </div>

          <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600 transition-transform duration-300 group-hover:scale-110" />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
            Software Engineering
          </span>

          <span>Verified solution</span>
          <span>2 contributors</span>
        </div>
      </div>
    </div>

    <div className="mt-4 border-t border-slate-100 pt-4">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Example archive interface</span>

        <span className="font-medium text-emerald-700">
          Searchable knowledge
        </span>
      </div>
    </div>
  </div>
</div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <div className="group rounded-xl border border-blue-200 bg-blue-50 px-6 py-10 text-center transition-all duration-300 ease-out hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/10 sm:px-10">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105">
              <Trophy className="h-5 w-5" />
            </div>

            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
              Have a problem worth solving?
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Share it with a community of learners, researchers, engineers, and
              professionals who are ready to contribute.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Create Free Account
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
            <div>
              <div className="flex items-center gap-2.5">
                <img
                  src="/collabsolve-logo.png"
                  alt="CollabSolve"
                  className="h-9 w-9 rounded-lg object-cover"
                />

                <span className="text-lg font-semibold text-white">
                  CollabSolve
                </span>
              </div>

              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
                A collaborative problem-solving platform for sharing
                challenges, developing solutions, and preserving verified
                knowledge.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Platform</h3>

              <div className="mt-4 space-y-3 text-sm text-slate-400">
                <a
                  href="#problems"
                  className="block transition-colors hover:text-white"
                >
                  Problems
                </a>

                <a
                  href="#archive"
                  className="block transition-colors hover:text-white"
                >
                  Knowledge Archive
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Community</h3>

              <div className="mt-4 space-y-3 text-sm text-slate-400">
                <a
                  href="#how-it-works"
                  className="block transition-colors hover:text-white"
                >
                  How It Works
                </a>

                <Link
                  to="/login"
                  className="block transition-colors hover:text-white"
                >
                  Leaderboard
                </Link>

                <Link
                  to="/register"
                  className="block transition-colors hover:text-white"
                >
                  Join Community
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Account</h3>

              <div className="mt-4 space-y-3 text-sm text-slate-400">
                <Link
                  to="/login"
                  className="block transition-colors hover:text-white"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="block transition-colors hover:text-white"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-800 pt-6 text-sm text-slate-500">
            © 2026 CollabSolve. Collaborative problem solving and verified
            knowledge.
          </div>
        </div>
      </footer>
    </div>
  );
}
