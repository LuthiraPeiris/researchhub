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
      return "border-blue-100 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-300";
    }

    if (difficulty === "intermediate") {
      return "border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300";
    }

    return "border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300";
  };

  return (
    <div className="mx-auto max-w-6xl space-y-5 p-5 lg:p-7 text-slate-900 dark:text-slate-100">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Saved Problems
          </h1>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            View all problems you saved for later.
          </p>
        </div>

        <Link
          to="/app"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Browse Problems
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {loading && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          Loading saved problems...
        </div>
      )}

      {error && (
        <div className="mb-5">
          <AppAlert type="error" message={error} onClose={() => setError("")} />
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
            <Bookmark className="h-6 w-6" />
          </div>

          <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
            No saved problems yet
          </h2>

          <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
            Save useful problems and they will appear here.
          </p>

          <Link
            to="/app"
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Browse Problems
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="space-y-4">
          {posts.map((problem) => (
            <Link
              key={problem.post_id}
              to={`/app/problem/${problem.post_id}`}
              className="group block rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-800"
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="mb-2 text-base font-semibold leading-6 text-slate-900 transition-colors group-hover:text-blue-700 dark:text-slate-100 dark:group-hover:text-blue-400">
                    {problem.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <span>by {problem.full_name || "Unknown User"}</span>

                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Saved {formatDate(problem.saved_at)}
                    </span>
                  </div>
                </div>

                <div
                  className={`rounded-md border px-2.5 py-1 text-xs font-medium capitalize ${getDifficultyStyle(
                    problem.difficulty_level
                  )}`}
                >
                  {problem.difficulty_level || "beginner"}
                </div>
              </div>

              <p className="mb-4 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {problem.description}
              </p>

              <div className="mb-4 flex flex-wrap gap-2">
                {problem.field_name && (
                  <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {problem.field_name}
                  </span>
                )}

                <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs capitalize text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                  {problem.post_type || "problem"}
                </span>

                <span className="rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-medium capitalize text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-300">
                  {problem.status || "open"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-5 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  Open discussion
                </span>

                <span className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  View details
                </span>

                <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                  <FileText className="h-4 w-4" />
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
