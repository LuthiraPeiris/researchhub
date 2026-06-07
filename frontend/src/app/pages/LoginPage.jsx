import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { loginUser } from "../services/authService";
import { AppAlert } from "../components/AppAlert";

export function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginUser(formData);
      navigate("/app");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#eef6ff] via-[#f8fbff] to-[#f3efff] text-slate-900 flex items-center justify-center px-6 py-12">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#dbeafe_1px,transparent_1px),linear-gradient(to_bottom,#dbeafe_1px,transparent_1px)] bg-[size:80px_80px] opacity-45" />
        <div className="absolute -top-40 left-1/2 h-[560px] w-[820px] -translate-x-1/2 rounded-full bg-blue-200/70 blur-3xl" />
        <div className="absolute top-52 -right-40 h-[460px] w-[460px] rounded-full bg-violet-200/70 blur-3xl" />
        <div className="absolute bottom-[-140px] -left-40 h-[460px] w-[460px] rounded-full bg-cyan-200/70 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-xl border border-slate-200 bg-white/80 text-sm font-semibold text-slate-700 shadow-sm hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all"
        >
          ← Back to Home
        </Link>

        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-7">
            <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center shadow-lg shadow-blue-500/20 bg-white">
              <img
                src="/researchhub-logo.png"
                alt="ResearchHub Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-950">
              ResearchHub
            </span>
          </Link>

          <h1 className="text-4xl font-extrabold tracking-tight mb-3 text-slate-950">
            Welcome Back
          </h1>

          <p className="text-slate-600">
            Sign in to continue your research journey
          </p>
        </div>

        <div className="relative">
          <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-r from-blue-300/45 via-cyan-300/35 to-violet-300/45 blur-2xl" />

          <div className="relative rounded-[2rem] border border-white bg-white/85 backdrop-blur-xl p-8 shadow-2xl shadow-slate-900/10">
            <div className="space-y-3 mb-5">
              <AppAlert type="error" message={error} onClose={() => setError("")} />
            </div>

            <form className="space-y-5" onSubmit={handleLogin}>
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Email
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50/80 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50/80 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm mt-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-600">Remember me</span>
                </label>

                <a
                  href="#"
                  className="text-blue-700 font-medium hover:text-blue-800 hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 block w-full py-3.5 rounded-xl bg-[#1e3a8a] text-white font-semibold hover:bg-[#1d4ed8] hover:-translate-y-0.5 transition-all text-center shadow-xl shadow-blue-300/40 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-sm text-slate-500">Or continue with</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3.5 rounded-xl border border-slate-200 bg-white/80 hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-700 font-medium shadow-sm">
                <FaGithub className="w-5 h-5" />
                GitHub
              </button>

              <button className="flex items-center justify-center gap-2 py-3.5 rounded-xl border border-slate-200 bg-white/80 hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-700 font-medium shadow-sm">
                <FaGoogle className="w-5 h-5" />
                Google
              </button>
            </div>

            <p className="mt-7 text-center text-sm text-slate-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-700 hover:text-blue-800 hover:underline font-semibold"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}