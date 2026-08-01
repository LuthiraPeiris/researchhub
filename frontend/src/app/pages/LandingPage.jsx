import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  FileText,
  MessageSquare,
  Search,
  ShieldCheck,
  Trophy,
} from "lucide-react";


const sampleProblems = [
  {
    title: "How can we improve MQTT reliability in unstable networks?",
    description:
      "Looking for practical approaches to retry logic, offline buffering, and message delivery guarantees for IoT devices.",
    field: "IoT",
    difficulty: "Intermediate",
    solutions: 8,
    status: "Open",
  },
  {
    title: "Best approach for detecting similar research problems",
    description:
      "Comparing keyword matching, embeddings, and vector search for identifying previously discussed problems.",
    field: "Machine Learning",
    difficulty: "Advanced",
    solutions: 5,
    status: "Open",
  },
  {
    title: "Designing a secure CI/CD pipeline for a student project",
    description:
      "Need guidance on Docker image scanning, secrets management, deployment approvals, and rollback strategy.",
    field: "DevOps",
    difficulty: "Intermediate",
    solutions: 12,
    status: "Solved",
  },
];

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
      "The most useful solution is verified and added to the Knowledge Archive for future users.",
  },
];

const principles = [
  {
    icon: CheckCircle,
    title: "Verified solutions",
    description:
      "Problem owners can select a final verified solution instead of leaving discussions unresolved.",
  },
  {
    icon: Users,
    title: "Professional contributors",
    description:
      "Profiles show skills, activity, reputation, badges, and verified contributions.",
  },
  {
    icon: BookOpen,
    title: "Reusable knowledge",
    description:
      "Solved problems become searchable references instead of being lost inside old discussions.",
  },
  {
    icon: ShieldCheck,
    title: "Structured collaboration",
    description:
      "Fields, difficulty levels, comments, attachments, and verification keep discussions organized.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="/collabsolve-logo.png"
              alt="CollabSolve"
              className="h-9 w-9 rounded-lg object-cover"
            />
            <span className="text-lg font-semibold tracking-tight text-slate-950">
              CollabSolve
            </span>
          </Link>

          <div className="hidden items-center gap-7 text-sm text-slate-600 md:flex">
            <a href="#problems" className="transition-colors hover:text-slate-950">
              Problems
            </a>
            <a href="#archive" className="transition-colors hover:text-slate-950">
              Knowledge Archive
            </a>
            <a href="#how-it-works" className="transition-colors hover:text-slate-950">
              How it Works
            </a>
            <a href="#community" className="transition-colors hover:text-slate-950">
              Community
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-md px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Join CollabSolve
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-cyan-100/70 blur-3xl" />
          <div className="absolute left-0 top-24 h-44 w-44 rounded-full bg-indigo-100/60 blur-3xl" />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1fr_0.95fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Solve real problems through{" "}
              <span className="relative inline-block text-blue-700">
                shared knowledge
                <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-blue-200" />
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              CollabSolve connects students, researchers, engineers, and
              professionals to post problems, exchange solutions, verify useful
              answers, and build a reusable knowledge archive.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md"
              >
                Join the Community
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50"
              >
                Explore Problems
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                Structured problem posts
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                Verified final solutions
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                Public reputation profiles
              </span>
            </div>
          </div>

          {/* Product preview */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-blue-100/70 via-white to-cyan-100/70 blur-2xl" />
            <div className="relative rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Open Problems
                </div>
                <div className="text-xs text-slate-500">
                  Recent challenges from the community
                </div>
              </div>

              <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
                Workspace preview
              </span>
            </div>

            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <div className="rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-400">
                  Search problems, fields, or contributors
                </div>
              </div>

              <div className="space-y-3">
                {sampleProblems.slice(0, 2).map((problem) => (
                  <div
                    key={problem.title}
                    className="rounded-lg border border-slate-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-semibold leading-6 text-slate-900">
                          {problem.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">
                          {problem.description}
                        </p>
                      </div>

                      <span
                        className={`rounded-md border px-2 py-1 text-xs font-medium ${
                          problem.status === "Solved"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-blue-200 bg-blue-50 text-blue-700"
                        }`}
                      >
                        {problem.status}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-600">
                        {problem.field}
                      </span>
                      <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600">
                        {problem.difficulty}
                      </span>
                      <span className="ml-auto flex items-center gap-1 text-xs text-slate-500">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {problem.solutions} solutions
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-emerald-900">
                      Verified solution selected
                    </div>
                    <div className="text-xs text-emerald-700">
                      Added to the Knowledge Archive
                    </div>
                  </div>
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
                Problem discovery
              </span>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                Problems waiting for solutions
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Explore structured challenges, understand the context, and contribute
                a solution that helps the wider community.
              </p>
            </div>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View all problems
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {sampleProblems.map((problem) => (
              <div
                key={problem.title}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-base font-semibold leading-6 text-slate-900">
                    {problem.title}
                  </h3>

                  <span
                    className={`rounded-md border px-2 py-1 text-xs font-medium ${
                      problem.status === "Solved"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-blue-200 bg-blue-50 text-blue-700"
                    }`}
                  >
                    {problem.status}
                  </span>
                </div>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                  {problem.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
                    {problem.field}
                  </span>
                  <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600">
                    {problem.difficulty}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {problem.solutions} solutions
                  </span>
                  <span>Updated recently</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-y border-slate-200 bg-white py-16">
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
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-sm font-semibold text-blue-700">
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

      {/* Archive */}
      <section id="archive" className="bg-slate-50 py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="flex flex-col justify-center">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-600">
              Knowledge Archive
            </span>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Verified knowledge that stays useful
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
              Solved problems and their verified solutions are preserved in a
              searchable archive, helping future users learn from previous
              discussions instead of solving the same problem again.
            </p>

            <div className="mt-6 space-y-3">
              {[
                "Searchable solved problems",
                "Verified final solutions",
                "Supporting files and attachments",
                "Contributor and verification history",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  {item}
                </div>
              ))}
            </div>

            <Link
              to="/login"
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Explore the Archive
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
                <CheckCircle className="h-4 w-4" />
              </div>

              <div className="flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Improving telemetry reliability for ESP32 devices
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Problem by A. Perera · Verified recently
                    </p>
                  </div>

                  <span className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                    Intermediate
                  </span>
                </div>

                <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <FileText className="h-4 w-4" />
                    Problem summary
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    Devices frequently lose connectivity and telemetry messages
                    are missed during unstable network conditions.
                  </p>
                </div>

                <div className="mt-4 rounded-lg border-l-4 border-l-emerald-500 border-y border-r border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                    <CheckCircle className="h-4 w-4" />
                    Final verified solution
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    Use local message buffering, exponential backoff, QoS-aware
                    MQTT delivery, and a server-side deduplication strategy.
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
                  <span>12 solution likes</span>
                  <span>3 attached documents</span>
                  <span>Verified by problem owner</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
              Platform quality
            </span>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Designed for useful collaboration
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {principles.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                  <item.icon className="h-4 w-4" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <div className="rounded-xl border border-blue-200 bg-blue-50 px-6 py-10 text-center sm:px-10">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white">
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
                Explore the Community
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
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
                A collaborative problem-solving platform for sharing challenges,
                developing solutions, and preserving verified knowledge.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Platform</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-400">
                <a href="#problems" className="block hover:text-white">
                  Problems
                </a>
                <a href="#archive" className="block hover:text-white">
                  Knowledge Archive
                </a>
                <a href="#community" className="block hover:text-white">
                  Contributors
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Community</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-400">
                <a href="#how-it-works" className="block hover:text-white">
                  How it Works
                </a>
                <Link to="/login" className="block hover:text-white">
                  Leaderboard
                </Link>
                <Link to="/register" className="block hover:text-white">
                  Join Community
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Account</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-400">
                <Link to="/login" className="block hover:text-white">
                  Sign In
                </Link>
                <Link to="/register" className="block hover:text-white">
                  Register
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-800 pt-6 text-sm text-slate-500">
            © 2026 CollabSolve. Collaborative problem solving and verified knowledge.
          </div>
        </div>
      </footer>
    </div>
  );
}
