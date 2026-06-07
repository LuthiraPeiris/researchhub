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
    <div className="p-6 space-y-6 text-gray-900 dark:text-gray-100">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl text-gray-900 dark:text-gray-100 mb-2">
            My Problems
          </h1>

          <p className="text-gray-600 dark:text-gray-400">
            View and manage the problems and discussions you posted.
          </p>
        </div>

        <Link
          to="/app/post-problem"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0ea5e9] text-white hover:bg-[#0284c7] transition-colors shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          Post Problem
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
                {posts.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                My Posts
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#06b6d4] to-[#a855f7] flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>

            <div>
              <div className="text-2xl text-gray-900 dark:text-gray-100">
                {solvedPosts}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Solved
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#a855f7] to-[#0ea5e9] flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Flame className="w-5 h-5 text-white" />
            </div>

            <div>
              <div className="text-2xl text-gray-900 dark:text-gray-100">
                {openPosts}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Open
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#10b981] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-green-500/20">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>

            <div>
              <div className="text-2xl text-gray-900 dark:text-gray-100">
                {discussionPosts}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
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
        <div className="rounded-xl border border-gray-200 bg-white p-10 shadow-sm text-center dark:border-gray-800 dark:bg-gray-900">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0ea5e9]/10 to-[#a855f7]/10 flex items-center justify-center mx-auto mb-4 border border-blue-100 dark:from-[#0ea5e9]/20 dark:to-[#a855f7]/20 dark:border-blue-900/60">
            <FileText className="w-7 h-7 text-[#0ea5e9] dark:text-[#38bdf8]" />
          </div>

          <h2 className="text-xl text-gray-900 dark:text-gray-100 mb-2">
            You have not posted any problems yet
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-5">
            Start by sharing a research problem or discussion with the
            community.
          </p>

          <Link
            to="/app/post-problem"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0ea5e9] text-white hover:bg-[#0284c7] transition-colors"
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
              className="block rounded-xl border border-gray-200 bg-white p-6 hover:border-blue-300 hover:shadow-lg transition-all shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg mb-2 text-gray-900 hover:text-[#0ea5e9] transition-colors dark:text-gray-100 dark:hover:text-[#38bdf8]">
                    {problem.title}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
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