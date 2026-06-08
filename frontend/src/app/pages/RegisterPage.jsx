import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, User, Lock } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { registerUser } from "../services/authService";
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

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!acceptedTerms) {
      setError("Please accept the Terms of Service and Privacy Policy");
      return;
    }

    setLoading(true);

    try {
      await registerUser(formData);
      setSuccess("Account created successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(err.message || "Registration failed");
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
                src="/collabsolve-logo.png"
                alt="CollabSolve Logo"
                className="w-full h-full object-cover"
              />
            </div>

            <span className="text-2xl font-bold tracking-tight text-slate-950">
              CollabSolve
            </span>
          </Link>

          <h1 className="text-4xl font-extrabold tracking-tight mb-3 text-slate-950">
            Create Account
          </h1>

          <p className="text-slate-600">
            Join a community where students, researchers, and developers solve problems together
          </p>
        </div>

        <div className="relative">
          <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-r from-blue-300/45 via-cyan-300/35 to-violet-300/45 blur-2xl" />

          <div className="relative rounded-[2rem] border border-white bg-white/85 backdrop-blur-xl p-8 shadow-2xl shadow-slate-900/10">
            <div className="space-y-3 mb-5">
              <AppAlert type="error" message={error} onClose={() => setError("")} />
              <AppAlert
                type="success"
                message={success}
                onClose={() => setSuccess("")}
              />
            </div>

            <form className="space-y-5" onSubmit={handleRegister}>
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Full Name
                </label>

                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    name="full_name"
                    type="text"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50/80 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

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
                  University / Organization
                </label>

                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    name="university_or_organization"
                    type="text"
                    value={formData.university_or_organization}
                    onChange={handleChange}
                    placeholder="Sabaragamuwa University"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50/80 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Role
                </label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-50/80 border border-slate-200 text-slate-900 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all"
                >
                  <option value="student">Student</option>
                  <option value="researcher">Researcher</option>
                  <option value="engineer">Engineer</option>
                </select>
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
                    placeholder="Create a strong password"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50/80 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <label className="flex items-start gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />

                <span className="text-slate-600">
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-blue-700 hover:text-blue-800 hover:underline font-medium"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-blue-700 hover:text-blue-800 hover:underline font-medium"
                  >
                    Privacy Policy
                  </a>
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="block w-full py-3.5 rounded-xl bg-[#1e3a8a] text-white font-semibold hover:bg-[#1d4ed8] hover:-translate-y-0.5 transition-all text-center shadow-xl shadow-blue-300/40 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-sm text-slate-500">Or sign up with</span>
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
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-700 hover:text-blue-800 hover:underline font-semibold"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}