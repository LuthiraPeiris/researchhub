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
    <div className="p-6 space-y-6 text-gray-900 dark:text-gray-100">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl text-gray-900 dark:text-gray-100 mb-2">
            My Solutions
          </h1>

          <p className="text-gray-600 dark:text-gray-400">
            View the solutions you submitted, their verification status, and
            likes.
          </p>
        </div>

        <Link
          to="/app"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0ea5e9] text-white hover:bg-[#0284c7] transition-colors shadow-sm"
        >
          Find Problems
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0ea5e9] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Target className="w-5 h-5 text-white" />
            </div>

            <div>
              <div className="text-2xl text-gray-900 dark:text-gray-100">
                {solutions.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                My Solutions
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#10b981] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-green-500/20">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>

            <div>
              <div className="text-2xl text-gray-900 dark:text-gray-100">
                {verifiedCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Verified
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#f59e0b] to-[#a855f7] flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <XCircle className="w-5 h-5 text-white" />
            </div>

            <div>
              <div className="text-2xl text-gray-900 dark:text-gray-100">
                {pendingCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Pending
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#a855f7] to-[#0ea5e9] flex items-center justify-center shadow-lg shadow-purple-500/20">
              <ThumbsUp className="w-5 h-5 text-white" />
            </div>

            <div>
              <div className="text-2xl text-gray-900 dark:text-gray-100">
                {totalLikes}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
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
        <div className="rounded-xl border border-gray-200 bg-white p-10 shadow-sm text-center dark:border-gray-800 dark:bg-gray-900">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0ea5e9]/10 to-[#a855f7]/10 flex items-center justify-center mx-auto mb-4 border border-blue-100 dark:from-[#0ea5e9]/20 dark:to-[#a855f7]/20 dark:border-blue-900/60">
            <FileText className="w-7 h-7 text-[#0ea5e9] dark:text-[#38bdf8]" />
          </div>

          <h2 className="text-xl text-gray-900 dark:text-gray-100 mb-2">
            You have not submitted any solutions yet
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-5">
            Help others by answering research problems in the community.
          </p>

          <Link
            to="/app"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0ea5e9] text-white hover:bg-[#0284c7] transition-colors"
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
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-all dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg text-gray-900 dark:text-gray-100">
                        {solution.post_title || "Original Problem"}
                      </h3>

                      {isVerified ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-green-50 text-green-700 border border-green-100 dark:bg-green-950/40 dark:text-green-300 dark:border-green-900/60">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-yellow-50 text-yellow-700 border border-yellow-100 dark:bg-yellow-950/40 dark:text-yellow-300 dark:border-yellow-900/60">
                          <XCircle className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
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
                    <div className="w-10 h-10 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center dark:bg-green-950/40 dark:border-green-900/60">
                      <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3 dark:text-gray-400">
                  {solution.solution_text}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200 capitalize dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
                    {solution.post_type || "problem"}
                  </span>

                  <span className="px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-100 capitalize dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/60">
                    Problem: {solution.post_status || "open"}
                  </span>

                  {solution.difficulty_level && (
                    <span className="px-3 py-1 rounded-full text-xs bg-purple-50 text-purple-700 border border-purple-100 capitalize dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/60">
                      {solution.difficulty_level}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to={`/app/problem/${solution.post_id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 text-[#0ea5e9] hover:bg-blue-100 transition-colors text-sm dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-[#38bdf8] dark:hover:bg-blue-950/60"
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