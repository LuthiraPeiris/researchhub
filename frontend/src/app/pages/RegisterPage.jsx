import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  Bookmark,
  Building2,
  Eye,
  EyeOff,
  Lightbulb,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { registerUser, startGoogleOAuth } from "../services/authService";
import { AppAlert } from "../components/AppAlert";

export function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    university_or_organization: "",
    role: "student",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((previousData) => ({
      ...previousData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!acceptedTerms) {
      setError("Please accept the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);

    try {
      await registerUser(formData);

      setSuccess(
        "Account created successfully. Redirecting you to the sign-in page..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    try {
      setError("");
      startGoogleOAuth();
    } catch (err) {
      setError(err.message || "Unable to start Google authentication");
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-slate-50 text-slate-900">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0">
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

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-6xl items-center gap-12 px-5 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        {/* Left feature section */}
        <section className="hidden lg:block">
          <Link to="/" className="inline-flex items-center gap-4">
            <img
              src="/collabsolve-logo.png"
              alt="CollabSolve"
              className="h-14 w-14 rounded-xl object-cover"
            />

            <span className="text-4xl font-bold tracking-tight text-slate-950">
              CollabSolve
            </span>
          </Link>

          <div className="mt-10 space-y-7">
            <div className="flex items-center gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-600 text-white shadow-sm">
                <Lightbulb className="h-5 w-5" />
              </div>

              <p className="text-base font-medium text-slate-800">
                Get unstuck by asking real problems
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-600 text-white shadow-sm">
                <Bookmark className="h-5 w-5" />
              </div>

              <p className="text-base font-medium text-slate-800">
                Save useful problems and solutions
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-600 text-white shadow-sm">
                <Award className="h-5 w-5" />
              </div>

              <p className="text-base font-medium text-slate-800">
                Contribute solutions and build reputation
              </p>
            </div>
          </div>
        </section>

        {/* Registration content */}
        <div className="mx-auto w-full max-w-xl">
          {/* Mobile brand */}
          <Link
            to="/"
            className="mx-auto mb-5 flex w-fit items-center gap-2.5 lg:hidden"
          >
            <img
              src="/collabsolve-logo.png"
              alt="CollabSolve"
              className="h-10 w-10 rounded-lg object-cover"
            />

            <span className="text-2xl font-bold tracking-tight text-slate-950">
              CollabSolve
            </span>
          </Link>

          {/* Heading */}
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight text-slate-950">
              Create your account
            </h1>

            <p className="mx-auto mt-1.5 max-w-md text-xs leading-5 text-slate-600">
              Join the community to post problems, share solutions, and build
              reusable knowledge.
            </p>
          </div>

          {/* Social sign-up buttons */}
          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="inline-flex w-full max-w-[calc(50%-0.375rem)] items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-xs font-medium text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:bg-slate-50"
            >
              <FaGoogle className="h-4 w-4" />
              Sign up with Google
            </button>
          </div>

          {/* Divider */}
          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />

            <span className="whitespace-nowrap text-[11px] text-slate-500">
              Or create an account with email
            </span>

            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Registration card */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5 sm:p-6">
            {(error || success) && (
              <div className="mb-4 space-y-3">
                <AppAlert
                  type="error"
                  message={error}
                  onClose={() => setError("")}
                />

                <AppAlert
                  type="success"
                  message={success}
                  onClose={() => setSuccess("")}
                />
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Full name and email */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="full_name"
                    className="mb-1.5 block text-xs font-medium text-slate-700"
                  >
                    Full name
                  </label>

                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      id="full_name"
                      name="full_name"
                      type="text"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      autoComplete="name"
                      required
                      className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

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
              </div>

              {/* Organization and role */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="university_or_organization"
                    className="mb-1.5 block text-xs font-medium text-slate-700"
                  >
                    University or organization
                  </label>

                  <div className="relative">
                    <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      id="university_or_organization"
                      name="university_or_organization"
                      type="text"
                      value={formData.university_or_organization}
                      onChange={handleChange}
                      placeholder="University or company"
                      autoComplete="organization"
                      className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="role"
                    className="mb-1.5 block text-xs font-medium text-slate-700"
                  >
                    Your role
                  </label>

                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="student">Student</option>
                    <option value="researcher">Researcher</option>
                    <option value="engineer">Engineer</option>
                  </select>
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs font-medium text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    minLength={6}
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

                <p className="mt-1.5 text-[11px] text-slate-500">
                  Use at least 6 characters.
                </p>
              </div>

              {/* Terms */}
              <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />

                <span className="text-[11px] leading-5 text-slate-600">
                  I agree to the{" "}
                  <button
                    type="button"
                    className="font-medium text-blue-600 hover:text-blue-700"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="font-medium text-blue-600 hover:text-blue-700"
                  >
                    Privacy Policy
                  </button>
                  .
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>
          </div>

          {/* Login link */}
          <p className="mt-4 text-center text-xs text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
