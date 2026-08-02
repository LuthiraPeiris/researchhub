import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  MessageSquare,
  ThumbsUp,
  User,
  ArrowRight,
} from "lucide-react";

import { getReceivedSolutions } from "../services/userService";
import { verifySolution } from "../services/solutionService";
import { AppAlert } from "../components/AppAlert";

export function ReceivedSolutions() {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchReceivedSolutions = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getReceivedSolutions();

      const finalSolutions = Array.isArray(data)
        ? data
        : data.solutions || [];

      setSolutions(finalSolutions);
    } catch (err) {
      setError(err.message || "Failed to load received solutions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceivedSolutions();
  }, []);

  const handleMarkAsSolved = async (solutionId) => {
    const confirmVerify = window.confirm(
      "Are you sure you want to mark this solution as solved?"
    );

    if (!confirmVerify) return;

    try {
      setActionLoading(true);
      setError("");
      setMessage("");

      await verifySolution(solutionId);

      setMessage("Solution marked as solved successfully");
      fetchReceivedSolutions();
    } catch (err) {
      setError(err.message || "Failed to mark solution as solved");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";

    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const pendingCount = solutions.filter(
    (solution) => Number(solution.is_verified) !== 1
  ).length;

  const solvedCount = solutions.filter(
    (solution) => Number(solution.is_verified) === 1
  ).length;

  return (
    <div className="mx-auto max-w-6xl space-y-5 p-5 lg:p-7 text-slate-900 dark:text-slate-100">
      <div>
        <h1 className="mb-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Received Solutions
        </h1>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Review solutions submitted for your posted problems
        </p>
      </div>

      <div className="space-y-3 mb-5">
        <AppAlert type="error" message={error} onClose={() => setError("")} />
        <AppAlert type="success" message={message} onClose={() => setMessage("")} />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 transition-colors hover:border-slate-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center dark:bg-blue-950/40 dark:border-blue-900/60">
              <MessageSquare className="h-4 w-4 text-[#0ea5e9] dark:text-[#38bdf8]" />
            </div>

            <div>
              <div className="text-lg font-semibold leading-none text-slate-900 dark:text-gray-100">
                {solutions.length}
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-gray-400">
                Total Solutions
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 transition-colors hover:border-slate-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-yellow-50 border border-yellow-100 flex items-center justify-center dark:bg-yellow-950/40 dark:border-yellow-900/60">
              <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-300" />
            </div>

            <div>
              <div className="text-lg font-semibold leading-none text-slate-900 dark:text-gray-100">
                {pendingCount}
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-gray-400">
                Pending Review
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 transition-colors hover:border-slate-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-green-50 border border-green-100 flex items-center justify-center dark:bg-green-950/40 dark:border-green-900/60">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>

            <div>
              <div className="text-lg font-semibold leading-none text-slate-900 dark:text-gray-100">
                {solvedCount}
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-gray-400">
                Marked Solved
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
          Loading received solutions...
        </div>
      )}

      {!loading && solutions.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
          No solutions have been submitted to your problems yet.
        </div>
      )}

      <div className="space-y-4">
        {solutions.map((solution) => {
          const isVerified = Number(solution.is_verified) === 1;

          return (
            <div
              key={solution.solution_id}
              className={`rounded-lg border bg-white p-5 shadow-sm transition-colors dark:bg-slate-900 ${
                isVerified
                  ? "border-l-4 border-l-emerald-500 border-y-slate-200 border-r-slate-200 dark:border-y-slate-800 dark:border-r-slate-800"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Problem
                  </div>

                  <h2 className="text-base font-semibold leading-6 text-slate-900 dark:text-slate-100">
                    {solution.post_title}
                  </h2>
                </div>

                {isVerified ? (
  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">
    Marked Solved
  </span>
) : (
  <span className="rounded-full border border-yellow-200 bg-yellow-50 px-2.5 py-1 text-xs font-medium text-yellow-700 dark:border-yellow-900/60 dark:bg-yellow-950/30 dark:text-yellow-300">
    Pending Review
  </span>
)}
              </div>

              <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-gray-400 mb-4">
                <Link
  to={`/app/profile/${solution.solution_user_id}`}
  aria-label={`View ${
    solution.solution_author_name || "user"
  } profile`}
>
  <User className="h-4 w-4 transition-colors hover:text-blue-600" />
</Link>

                <span className="flex items-center gap-1">
  Submitted by{" "}
  <Link
    to={`/app/profile/${solution.solution_user_id}`}
    className="font-medium text-blue-600 hover:underline dark:text-blue-400"
  >
    {solution.solution_author_name ||
      solution.solution_author_email ||
      "Unknown User"}
  </Link>
</span>

                <span>•</span>

                <span>{formatDate(solution.created_at)}</span>

                <span>•</span>

                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  {solution.like_count || 0}
                </span>
              </div>

              <p className="mb-5 whitespace-pre-line text-sm leading-6 text-slate-700 dark:text-slate-300">
                {solution.solution_text}
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/app/problem/${solution.post_id}`}
                  className="flex items-center gap-2 rounded-md border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  View Problem
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {!isVerified && (
                  <button
                    onClick={() => handleMarkAsSolved(solution.solution_id)}
                    disabled={actionLoading}
                    className="flex items-center gap-2 rounded-md bg-emerald-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Solved
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}