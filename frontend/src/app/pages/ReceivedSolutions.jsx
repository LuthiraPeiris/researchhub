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
    <div className="p-6 space-y-6 text-gray-900 dark:text-gray-100">
      <div>
        <h1 className="text-3xl text-gray-900 dark:text-gray-100 mb-2">
          Received Solutions
        </h1>

        <p className="text-gray-600 dark:text-gray-400">
          Review solutions submitted for your posted problems
        </p>
      </div>

      <div className="space-y-3 mb-5">
        <AppAlert type="error" message={error} onClose={() => setError("")} />
        <AppAlert type="success" message={message} onClose={() => setMessage("")} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center dark:bg-blue-950/40 dark:border-blue-900/60">
              <MessageSquare className="w-6 h-6 text-[#0ea5e9] dark:text-[#38bdf8]" />
            </div>

            <div>
              <div className="text-2xl text-gray-900 dark:text-gray-100">
                {solutions.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Solutions
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-50 border border-yellow-100 flex items-center justify-center dark:bg-yellow-950/40 dark:border-yellow-900/60">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
            </div>

            <div>
              <div className="text-2xl text-gray-900 dark:text-gray-100">
                {pendingCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Pending Review
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center dark:bg-green-950/40 dark:border-green-900/60">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>

            <div>
              <div className="text-2xl text-gray-900 dark:text-gray-100">
                {solvedCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
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
              className={`rounded-xl border p-6 shadow-sm transition-all ${
                isVerified
                  ? "border-green-200 bg-green-50 dark:border-green-900/70 dark:bg-green-950/30"
                  : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Problem
                  </div>

                  <h2 className="text-xl text-gray-900 dark:text-gray-100">
                    {solution.post_title}
                  </h2>
                </div>

                {isVerified ? (
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm dark:bg-green-950/40 dark:text-green-300 dark:border dark:border-green-900/60">
                    Marked as Solved
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm dark:bg-yellow-950/40 dark:text-yellow-300 dark:border dark:border-yellow-900/60">
                    Pending Review
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <User className="w-4 h-4" />

                <span>
                  Submitted by{" "}
                  {solution.solution_author_name ||
                    solution.solution_author_email ||
                    "Unknown User"}
                </span>

                <span>•</span>

                <span>{formatDate(solution.created_at)}</span>

                <span>•</span>

                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  {solution.like_count || 0}
                </span>
              </div>

              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line mb-5">
                {solution.solution_text}
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/app/problem/${solution.post_id}`}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  View Problem
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {!isVerified && (
                  <button
                    onClick={() => handleMarkAsSolved(solution.solution_id)}
                    disabled={actionLoading}
                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-60 flex items-center gap-2"
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