import { Link } from "react-router-dom";
import { AppAlert } from "../components/AppAlert";
import {
  Users,
  Zap,
  Trophy,
  Search,
  BookOpen,
  ArrowRight,
  FileText,
} from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-[#eef6ff] via-[#f8fbff] to-[#f3efff] text-slate-900">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#dbeafe_1px,transparent_1px),linear-gradient(to_bottom,#dbeafe_1px,transparent_1px)] bg-[size:80px_80px] opacity-45" />

        <div className="absolute -top-40 left-1/2 h-[560px] w-[820px] -translate-x-1/2 rounded-full bg-blue-200/70 blur-3xl" />

        <div className="absolute top-52 -right-40 h-[460px] w-[460px] rounded-full bg-violet-200/70 blur-3xl" />

        <div className="absolute top-[720px] -left-40 h-[460px] w-[460px] rounded-full bg-cyan-200/70 blur-3xl" />

        <div className="absolute top-[1250px] right-10 h-[420px] w-[420px] rounded-full bg-indigo-200/60 blur-3xl" />

        <div className="absolute bottom-20 left-1/3 h-[460px] w-[460px] rounded-full bg-sky-200/60 blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shadow-lg shadow-blue-500/20 bg-white">
              <img
                src="/collabsolve-logo.png"
                alt="CollabSolve Logo"
                className="w-full h-full object-cover"
              />
            </div>

            <span className="text-xl font-bold tracking-tight text-slate-950">
              CollabSolve
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-all"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-slate-950 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-14 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left content */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm mb-6">
                <div className="w-5 h-5 rounded-md overflow-hidden flex items-center justify-center bg-white">
                  <img
                    src="/collabsolve-logo.png"
                    alt="CollabSolve Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                Solve problems together. Build knowledge together.
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.2] tracking-tight mb-8 text-slate-950">
                Collaborative
                <span className="block bg-gradient-to-r from-blue-600 via-cyan-500 to-violet-600 bg-clip-text text-transparent pb-2">
                  Problem Solving
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed mb-9">
                Where researchers, engineers, and students unite to tackle
                complex challenges together.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all"
                >
                  Start Collaborating
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-7 py-4 rounded-2xl bg-white text-slate-800 font-semibold border border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm"
                >
                  Explore Platform
                </Link>
              </div>

              <div className="mt-8 grid sm:grid-cols-3 gap-4 max-w-xl">
                <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                  <div className="text-2xl font-extrabold text-blue-600">
                    10K+
                  </div>
                  <div className="text-sm text-slate-500">Active Users</div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                  <div className="text-2xl font-extrabold text-violet-600">
                    5K+
                  </div>
                  <div className="text-sm text-slate-500">Solved Problems</div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                  <div className="text-2xl font-extrabold text-cyan-600">
                    15K+
                  </div>
                  <div className="text-sm text-slate-500">Collaborations</div>
                </div>
              </div>
            </div>

            {/* Right workflow visual */}
            <div className="relative">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-r from-blue-300/50 via-cyan-300/40 to-violet-300/50 blur-2xl" />

              <div className="relative rounded-[2rem] border border-white bg-white/85 backdrop-blur-xl shadow-2xl shadow-slate-900/10 p-6">
                <div className="rounded-3xl bg-slate-950 p-6 text-white mb-5 overflow-hidden relative">
                  <div className="absolute -top-20 -right-16 h-48 w-48 rounded-full bg-blue-500/30 blur-3xl" />
                  <div className="absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-violet-500/30 blur-3xl" />

                  <div className="relative">
                    <p className="text-sm text-blue-200 mb-2">
                      Platform Workflow
                    </p>
                    <h3 className="text-2xl font-bold mb-6">
                      From problem to solution
                    </h3>

                    <div className="space-y-4">
                      {[
                        {
                            step: "01",
                            title: "Share your challenge",
                            desc: "Post your academic or technical problem and explain what support you need.",
                            color: "bg-blue-500",
                        },
                        {
                          step: "02",
                          title: "Discuss with contributors",
                          desc: "Students and experts collaborate together.",
                          color: "bg-cyan-500",
                        },
                        {
                          step: "03",
                          title: "Build verified knowledge",
                          desc: "Useful answers become reusable solutions.",
                          color: "bg-violet-500",
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur-sm"
                        >
                          <div
                            className={`h-11 w-11 shrink-0 rounded-xl ${item.color} flex items-center justify-center text-sm font-bold`}
                          >
                            {item.step}
                          </div>

                          <div>
                            <h4 className="font-semibold text-white">
                              {item.title}
                            </h4>
                            <p className="text-sm text-slate-300 mt-1">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-200 bg-blue-50 p-5">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4">
                      <Users className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-950">
                      Team Collaboration
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Work together on real problems.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-violet-50 p-5">
                    <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center mb-4">
                      <Search className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-950">Smart Discovery</h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Find relevant discussions faster.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Brand trust strip */}
          <div className="mt-12 rounded-3xl border border-slate-200 bg-white/75 backdrop-blur-xl p-6 shadow-xl shadow-slate-900/5">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">
                  Built for
                </p>
                <p className="text-lg font-bold text-slate-950">
                  Students, Researchers & Developers
                </p>
              </div>

              <div className="md:border-x border-slate-200">
                <p className="text-sm font-medium text-slate-500 mb-1">
                  Focused on
                </p>
                <p className="text-lg font-bold text-slate-950">
                  Practical Problem Solving
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">
                  Powered by
                </p>
                <p className="text-lg font-bold text-slate-950">
                  Collaboration & Knowledge
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-gradient-to-b from-white/60 via-blue-50/70 to-violet-50/60">
        <div className="container mx-auto max-w-7xl">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <div className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 mb-4">
              Platform Features
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-950 mb-4">
              Why CollabSolve?
            </h2>

            <p className="text-lg text-slate-600">
              A complete problem-solving workspace for students, researchers, and developers to collaborate, verify solutions, and grow shared knowledge.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-7">
            {[
              {
                icon: Users,
                title: "Collaborative",
                desc: "Work together with experts worldwide",
                color: "bg-blue-100 text-blue-600",
                line: "from-blue-500 to-cyan-400",
              },
              {
                icon: Zap,
                title: "Real-time",
                desc: "Instant discussions and updates",
                color: "bg-violet-100 text-violet-600",
                line: "from-violet-500 to-fuchsia-400",
              },
              {
                icon: Trophy,
                title: "Gamified",
                desc: "Earn reputation and achievements",
                color: "bg-amber-100 text-amber-600",
                line: "from-amber-400 to-orange-400",
              },
              {
                icon: Search,
                title: "Smart Search",
                desc: "AI-powered recommendations",
                color: "bg-cyan-100 text-cyan-600",
                line: "from-cyan-500 to-blue-400",
              },
              {
                icon: BookOpen,
                title: "Knowledge Base",
                desc: "Access thousands of solutions",
                color: "bg-emerald-100 text-emerald-600",
                line: "from-emerald-500 to-cyan-400",
              },
              {
                icon: FileText,
                title: "Advanced Tools",
                desc: "Rich editor, file uploads, datasets",
                color: "bg-fuchsia-100 text-fuchsia-600",
                line: "from-fuchsia-500 to-violet-500",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-lg shadow-slate-900/5 hover:shadow-2xl hover:shadow-slate-900/10 hover:-translate-y-1 transition-all"
              >
                <div
                  className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${feature.line}`}
                />

                <div
                  className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-7 h-7" />
                </div>

                <h3 className="text-xl font-bold mb-2 text-slate-950">
                  {feature.title}
                </h3>

                <p className="text-slate-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 bg-gradient-to-b from-violet-50/40 via-white/70 to-cyan-50/50">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 mb-4">
                How it works
              </div>

              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-950 mb-5">
                Turn questions into shared knowledge.
              </h2>

              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                CollabSolve helps users move from confusion to clarity through
                structured discussion, contribution, and solution sharing.
              </p>

              <Link
                to="/register"
                className="group inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-slate-950 text-white font-semibold hover:bg-slate-800 transition-all shadow-lg"
              >
                Join CollabSolve
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="space-y-5">
              {[
                {
                  number: "01",
                  title: "Share or discover a challenge",
                  desc: "Post an academic or technical problem, or explore existing challenges already discussed by the community.",
                },
                {
                  number: "02",
                  title: "Collaborate through discussion",
                  desc: "The community can contribute ideas, resources, and possible solutions.",
                },
                {
                  number: "03",
                  title: "Build a reusable knowledge base",
                  desc: "Solved problems become helpful references for future users.",
                },
              ].map((step, i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-lg shadow-slate-900/5 hover:-translate-y-1 transition-all"
                >
                  <div className="flex gap-5">
                    <div className="h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white flex items-center justify-center font-bold">
                      {step.number}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-slate-950 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
<section className="py-16 px-6 bg-gradient-to-br from-cyan-50/40 via-blue-50/50 to-violet-50/50">
  <div className="container mx-auto max-w-5xl">
    <div className="relative">
      {/* Outer glowing border like workflow card */}
      <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-r from-blue-300/50 via-cyan-300/40 to-violet-300/50 blur-2xl" />

      {/* Main CTA card */}
      <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white/85 backdrop-blur-xl px-8 py-12 text-center shadow-2xl shadow-slate-900/10">
        {/* Soft inner background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/60 to-violet-50/50" />

        {/* Light professional glows */}
        <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute -bottom-28 right-0 h-72 w-72 rounded-full bg-violet-200/35 blur-3xl" />
        <div className="absolute top-1/2 -left-28 h-72 w-72 -translate-y-1/2 rounded-full bg-cyan-200/35 blur-3xl" />

        <div className="relative mx-auto max-w-3xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl overflow-hidden bg-white shadow-xl shadow-blue-300/40">
            <img
              src="/collabsolve-logo.png"
              alt="CollabSolve Logo"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-cyan-500" />
            Start building knowledge together
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold mb-5 text-slate-950">
            Ready to Start?
          </h2>

          <p className="text-lg md:text-xl text-slate-600 mb-9 max-w-2xl mx-auto leading-relaxed">
            Join a community where students, researchers, and developers solve real challenges and turn verified solutions into shared knowledge.
          </p>

          <Link
            to="/register"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#1e3a8a] text-white font-bold hover:-translate-y-1 hover:bg-[#1d4ed8] hover:shadow-2xl hover:shadow-blue-300/50 transition-all"
          >
          Create Free Account
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  </div>
</section>

      <footer className="border-t border-slate-200 py-6 px-6 bg-gradient-to-r from-white via-blue-50 to-violet-50">
        <div className="container mx-auto text-center text-slate-500">
          <p>
            &copy; 2026 CollabSolve. Building the future of collaborative
            research.
          </p>
        </div>
      </footer>
    </div>
  );
}