import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  MessageSquare,
  TrendingUp,
  PlusCircle,
  Target,
  CheckCircle,
  Flame,
  FileText,
} from "lucide-react";

import { getUserPosts } from "../services/userService";
import { getCurrentUser } from "../services/authService";
import { AppAlert } from "../components/AppAlert";

export function MyProblems() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentUser = getCurrentUser();

  useEffect(() => {
    const fetchMyProblems = async () => {
      try {
        setLoading(true);
        setError("");

        if (!currentUser?.user_id) {
          setError("User not found. Please login again.");
          return;
        }

        const data = await getUserPosts(currentUser.user_id);

        const postList = Array.isArray(data) ? data : data.posts || [];

        setPosts(postList);
      } catch (err) {
        setError(err.message || "Failed to load your problems");
      } finally {
        setLoading(false);
      }
    };

    fetchMyProblems();
  }, [currentUser?.user_id]);

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
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

  const solvedPosts = posts.filter((post) => post.status === "solved").length;
  const openPosts = posts.filter((post) => post.status === "open").length;

  const discussionPosts = posts.filter(
    (post) => post.post_type === "discussion"
  ).length;

  return (
    <div className="mx-auto max-w-6xl space-y-5 p-5 lg:p-7 text-slate-900 dark:text-slate-100">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="mb-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            My Problems
          </h1>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            View and manage the problems and discussions you posted.
          </p>
        </div>

        <Link
          to="/app/post-problem"
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <PlusCircle className="w-4 h-4" />
          Post Problem
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
                {posts.length}
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                My Posts
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
                {solvedPosts}
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Solved
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300">
              <Flame className="h-4 w-4" />
            </div>

            <div>
              <div className="text-lg font-semibold leading-none text-slate-900 dark:text-slate-100">
                {openPosts}
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Open
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300">
              <MessageSquare className="h-4 w-4" />
            </div>

            <div>
              <div className="text-lg font-semibold leading-none text-slate-900 dark:text-slate-100">
                {discussionPosts}
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Discussions
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
          Loading your problems...
        </div>
      )}

      {error && (
        <div className="mb-5">
            <AppAlert type="error" message={error} onClose={() => setError("")} />
        </div>
        )}

      {!loading && !error && posts.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
            <FileText className="h-6 w-6 text-slate-500 dark:text-slate-400" />
          </div>

          <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
            You have not posted any problems yet
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-5">
            Start by sharing a research problem or discussion with the
            community.
          </p>

          <Link
            to="/app/post-problem"
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <PlusCircle className="w-4 h-4" />
            Post Your First Problem
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
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="mb-2 text-base font-semibold leading-6 text-slate-900 transition-colors group-hover:text-blue-700 dark:text-slate-100 dark:group-hover:text-blue-400">
                    {problem.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <span>You posted this</span>

                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDate(problem.created_at)}
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

              <p className="mb-4 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {problem.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
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

              <div className="flex items-center gap-5 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  View discussions
                </span>

                <span className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  View details
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}