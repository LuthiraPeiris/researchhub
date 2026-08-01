import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { loginUser } from "../services/authService";
import { AppAlert } from "../components/AppAlert";

export function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((previousData) => ({
      ...previousData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await loginUser(formData);
      navigate("/app");
    } catch (err) {
      setError(err.message || "Login failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex h-screen items-center justify-center overflow-hidden bg-slate-50 px-5 text-slate-900">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-[38rem] -translate-x-1/2 rounded-full bg-blue-100/70 blur-3xl" />

        <div className="absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-cyan-100/70 blur-3xl" />

        <div className="absolute -left-20 top-1/3 h-48 w-48 rounded-full bg-indigo-100/60 blur-3xl" />
      </div>

      {/* Back button */}
      <Link
        to="/"
        className="absolute left-5 top-5 z-20 inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 transition-colors hover:text-blue-700 sm:left-8 sm:top-7"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to home
      </Link>

      <div className="relative z-10 w-full max-w-sm">
        {/* Brand */}
        <Link
          to="/"
          className="mx-auto flex w-fit items-center justify-center gap-2.5"
        >
          <img
            src="/collabsolve-logo.png"
            alt="CollabSolve"
            className="h-9 w-9 rounded-lg object-cover"
          />

          <span className="text-2xl font-bold tracking-tight text-slate-950">
            CollabSolve
          </span>
        </Link>

        {/* Heading */}
        <div className="mt-4 text-center">
          <h1 className="text-xl font-bold tracking-tight text-slate-950">
            Welcome back
          </h1>

          <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-slate-600">
            Sign in to continue to your CollabSolve workspace.
          </p>
        </div>

        {/* Login card */}
        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5 sm:p-6">
          {error && (
            <div className="mb-4">
              <AppAlert
                type="error"
                message={error}
                onClose={() => setError("")}
              />
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-medium text-slate-700"
              >
                Email address
              </label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-xs font-medium text-slate-700"
                >
                  Password
                </label>

                <button
                  type="button"
                  className="text-xs font-medium text-blue-600 transition-colors hover:text-blue-700"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-11 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((currentValue) => !currentValue)
                  }
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />

              Remember me
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />

            <span className="whitespace-nowrap text-[11px] text-slate-500">
              Or continue with
            </span>

            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Social login */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-xs font-medium text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50"
            >
              <FaGoogle className="h-4 w-4" />
              Google
            </button>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-xs font-medium text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50"
            >
              <FaGithub className="h-4 w-4" />
              GitHub
            </button>
          </div>
        </div>

        {/* Register link */}
        <p className="mt-4 text-center text-xs text-slate-600">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}