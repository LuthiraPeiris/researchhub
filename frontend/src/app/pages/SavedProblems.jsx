import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  MessageSquare,
  TrendingUp,
  Bookmark,
  ArrowRight,
  FileText,
} from "lucide-react";

import { getMySavedPosts } from "../services/postService";
import { AppAlert } from "../components/AppAlert";

export function SavedProblems() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMySavedPosts();
        const postList = Array.isArray(data) ? data : data.posts || [];

        setPosts(postList);
      } catch (err) {
        setError(err.message || "Failed to load saved problems");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPosts();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";

    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getDifficultyStyle = (difficulty) => {
    if (difficulty === "advanced") {
      return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
    }

    if (difficulty === "intermediate") {
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-300";
    }

    return "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300";
  };

  return (
    <div className="p-6 space-y-6 text-gray-900 dark:text-gray-100">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl text-gray-900 dark:text-gray-100 mb-2">
            Saved Problems
          </h1>

          <p className="text-gray-600 dark:text-gray-400">
            View all problems you saved for later.
          </p>
        </div>

        <Link
          to="/app"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0ea5e9] text-white hover:bg-[#0284c7] transition-colors shadow-sm"
        >
          Browse Problems
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
          Loading saved problems...
        </div>
      )}

      {error && (
        <div className="mb-5">
          <AppAlert type="error" message={error} onClose={() => setError("")} />
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-10 shadow-sm text-center dark:border-gray-800 dark:bg-gray-900">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0ea5e9]/10 to-[#a855f7]/10 flex items-center justify-center mx-auto mb-4 border border-blue-100 dark:from-[#0ea5e9]/20 dark:to-[#a855f7]/20 dark:border-blue-900/60">
            <Bookmark className="w-7 h-7 text-[#0ea5e9] dark:text-[#38bdf8]" />
          </div>

          <h2 className="text-xl text-gray-900 dark:text-gray-100 mb-2">
            No saved problems yet
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-5">
            Save useful problems and they will appear here.
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

      {!loading && !error && posts.length > 0 && (
        <div className="space-y-4">
          {posts.map((problem) => (
            <Link
              key={problem.post_id}
              to={`/app/problem/${problem.post_id}`}
              className="block rounded-xl border border-gray-200 bg-white p-6 hover:border-blue-300 hover:shadow-lg transition-all shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg mb-2 text-gray-900 hover:text-[#0ea5e9] transition-colors dark:text-gray-100 dark:hover:text-[#38bdf8]">
                    {problem.title}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>by {problem.full_name || "Unknown User"}</span>

                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Saved {formatDate(problem.saved_at)}
                    </span>
                  </div>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-xs capitalize ${getDifficultyStyle(
                    problem.difficulty_level
                  )}`}
                >
                  {problem.difficulty_level || "beginner"}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2 dark:text-gray-400">
                {problem.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {problem.field_name && (
                  <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
                    {problem.field_name}
                  </span>
                )}

                <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200 capitalize dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
                  {problem.post_type || "problem"}
                </span>

                <span className="px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-100 capitalize dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/60">
                  {problem.status || "open"}
                </span>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  Open discussion
                </span>

                <span className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  View details
                </span>

                <span className="flex items-center gap-1 text-[#0ea5e9] dark:text-[#38bdf8]">
                  <FileText className="w-4 h-4" />
                  Saved
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}