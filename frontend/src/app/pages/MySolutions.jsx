import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  ThumbsUp,
  CheckCircle,
  XCircle,
  MessageSquare,
  ArrowRight,
  FileText,
  Award,
  Target,
} from "lucide-react";

import { getMySolutions } from "../services/userService";
import { AppAlert } from "../components/AppAlert";

export function MySolutions() {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMySolutions = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMySolutions();

        const solutionList = Array.isArray(data)
          ? data
          : data.solutions || [];

        setSolutions(solutionList);
      } catch (err) {
        setError(err.message || "Failed to load your solutions");
      } finally {
        setLoading(false);
      }
    };

    fetchMySolutions();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const verifiedCount = solutions.filter(
    (solution) =>
      solution.is_verified === 1 || solution.is_verified === true
  ).length;

  const pendingCount = solutions.length - verifiedCount;

  const totalLikes = solutions.reduce(
    (sum, solution) => sum + Number(solution.like_count || 0),
    0
  );

  return (
    <div className="mx-auto max-w-6xl space-y-5 p-5 lg:p-7 text-slate-900 dark:text-slate-100">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="mb-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            My Solutions
          </h1>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            View the solutions you submitted, their verification status, and
            likes.
          </p>
        </div>

        <Link
          to="/app"
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Find Problems
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
              <Target className="h-4 w-4" />
            </div>

            <div>
              <div className="text-lg font-semibold leading-none text-slate-900 dark:text-slate-100">
                {solutions.length}
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                My Solutions
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
              <CheckCircle className="h-4 w-4" />
            </div>

            <div>
              <div className="text-lg font-semibold leading-none text-slate-900 dark:text-slate-100">
                {verifiedCount}
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Verified
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300">
              <XCircle className="h-4 w-4" />
            </div>

            <div>
              <div className="text-lg font-semibold leading-none text-slate-900 dark:text-slate-100">
                {pendingCount}
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Pending
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300">
              <ThumbsUp className="h-4 w-4" />
            </div>

            <div>
              <div className="text-lg font-semibold leading-none text-slate-900 dark:text-slate-100">
                {totalLikes}
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Total Likes
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
          Loading your solutions...
        </div>
      )}

      {error && (
        <div className="mb-5">
            <AppAlert type="error" message={error} onClose={() => setError("")} />
        </div>
        )}

      {!loading && !error && solutions.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
            <FileText className="h-6 w-6 text-slate-500 dark:text-slate-400" />
          </div>

          <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
            You have not submitted any solutions yet
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-5">
            Help others by answering research problems in the community.
          </p>

          <Link
            to="/app"
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Browse Problems
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {!loading && !error && solutions.length > 0 && (
        <div className="space-y-4">
          {solutions.map((solution) => {
            const isVerified =
              solution.is_verified === 1 || solution.is_verified === true;

            return (
              <div
                key={solution.solution_id}
                className={`rounded-lg border bg-white p-5 shadow-sm transition-colors dark:bg-slate-900 ${
                  isVerified
                    ? "border-l-4 border-l-emerald-500 border-y-slate-200 border-r-slate-200 dark:border-y-slate-800 dark:border-r-slate-800"
                    : "border-slate-200 hover:border-blue-200 dark:border-slate-800 dark:hover:border-blue-800"
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-base font-semibold leading-6 text-slate-900 dark:text-slate-100">
                        {solution.post_title || "Original Problem"}
                      </h3>

                      {isVerified ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300">
                          <XCircle className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <span>Your solution</span>

                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(solution.created_at)}
                      </span>

                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        {solution.like_count || 0} likes
                      </span>
                    </div>
                  </div>

                  {isVerified && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-300">
                      <Award className="h-4 w-4" />
                    </div>
                  )}
                </div>

                <p className="mb-4 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {solution.solution_text}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs capitalize text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {solution.post_type || "problem"}
                  </span>

                  <span className="rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-medium capitalize text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-300">
                    Problem: {solution.post_status || "open"}
                  </span>

                  {solution.difficulty_level && (
                    <span className="rounded-md border border-violet-100 bg-violet-50 px-2.5 py-1 text-xs capitalize text-violet-700 dark:border-violet-900/60 dark:bg-violet-950/30 dark:text-violet-300">
                      {solution.difficulty_level}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to={`/app/problem/${solution.post_id}`}
                    className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Open Original Problem
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}