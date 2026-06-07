import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  TrendingUp,
  Clock,
  CheckCircle,
  MessageSquare,
  ArrowRight,
  Flame,
  Target,
  FileText,
  Inbox,
} from "lucide-react";

import { getAllPosts, searchPosts } from "../services/postService";
import { getCurrentUser } from "../services/authService";
import { getFields } from "../services/fieldService";
import { getDashboardSummary } from "../services/dashboardService";
import { AppAlert } from "../components/AppAlert";

export function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("search");

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [fields, setFields] = useState([]);
  const [summary, setSummary] = useState(null);

  const [filters, setFilters] = useState({
    field_id: searchParams.get("field_id") || "all",
    status: searchParams.get("status") || "all",
    difficulty_level: searchParams.get("difficulty_level") || "all",
    post_type: searchParams.get("post_type") || "all",
    sort: searchParams.get("sort") || "newest",
  });

  const currentUser = getCurrentUser();

  const displayName =
    currentUser?.full_name ||
    currentUser?.name ||
    currentUser?.username ||
    "Researcher";

  useEffect(() => {
  const fetchFields = async () => {
    try {
      const data = await getFields();
      const fieldList = Array.isArray(data) ? data : data.fields || [];
      setFields(fieldList);
    } catch (err) {
      console.error("Failed to load fields", err);
    }
  };

  fetchFields();
}, []);

  useEffect(() => {
  const fetchDashboardSummary = async () => {
    try {
      const data = await getDashboardSummary();
      setSummary(data);
    } catch (err) {
      console.error("Failed to load dashboard summary", err);
    }
  };

  fetchDashboardSummary();
}, []);

  useEffect(() => {
  setFilters({
    field_id: searchParams.get("field_id") || "all",
    status: searchParams.get("status") || "all",
    difficulty_level: searchParams.get("difficulty_level") || "all",
    post_type: searchParams.get("post_type") || "all",
    sort: searchParams.get("sort") || "newest",
  });
}, [searchParams]);

  useEffect(() => {
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const hasFilters =
        searchQuery ||
        filters.field_id !== "all" ||
        filters.status !== "all" ||
        filters.difficulty_level !== "all" ||
        filters.post_type !== "all" ||
        filters.sort !== "newest";

      const data = hasFilters
        ? await searchPosts({
            query: searchQuery || "",
            field_id: filters.field_id,
            status: filters.status,
            difficulty_level: filters.difficulty_level,
            post_type: filters.post_type,
            sort: filters.sort,
          })
        : await getAllPosts();

      const postList = Array.isArray(data) ? data : data.posts || [];

      setPosts(postList);
    } catch (err) {
      setError(err.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  fetchPosts();
}, [searchQuery, filters.field_id, filters.status, filters.difficulty_level, filters.post_type, filters.sort]);

  const handleFilterChange = (e) => {
  const { name, value } = e.target;

  const updatedFilters = {
    ...filters,
    [name]: value,
  };

  setFilters(updatedFilters);

  const params = new URLSearchParams(searchParams);

  Object.entries(updatedFilters).forEach(([key, filterValue]) => {
    if (
      filterValue &&
      filterValue !== "all" &&
      !(key === "sort" && filterValue === "newest")
    ) {
      params.set(key, filterValue);
    } else {
      params.delete(key);
    }
  });

  setSearchParams(params);
};

const resetFilters = () => {
  setFilters({
    field_id: "all",
    status: "all",
    difficulty_level: "all",
    post_type: "all",
    sort: "newest",
  });

  const params = new URLSearchParams(searchParams);

  params.delete("field_id");
  params.delete("status");
  params.delete("difficulty_level");
  params.delete("post_type");
  params.delete("sort");

  setSearchParams(params);
};

const hasActiveFilters =
  filters.field_id !== "all" ||
  filters.status !== "all" ||
  filters.difficulty_level !== "all" ||
  filters.post_type !== "all" ||
  filters.sort !== "newest";

  const getActivityIcon = (activityType) => {
  if (activityType === "solution") {
    return CheckCircle;
  }

  if (activityType === "comment") {
    return MessageSquare;
  }

  return FileText;
};

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

  const solvedPosts = summary?.solvedProblems ?? posts.filter((post) => post.status === "solved").length;

  const openPosts = summary?.openProblems ?? posts.filter((post) => post.status === "open").length;

  const totalProblems = summary?.totalProblems ?? posts.length;

  const pendingReceivedSolutions = summary?.pendingReceivedSolutions ?? 0;

  return (
    <div className="p-6 space-y-6 text-gray-900 dark:text-gray-100">
      <div>
        <h1 className="text-3xl text-gray-900 dark:text-gray-100 mb-2">
          Welcome back, {displayName}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's what's happening in your research community
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0ea5e9] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl text-gray-900 dark:text-gray-100">{totalProblems}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Problems</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#06b6d4] to-[#a855f7] flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl text-gray-900 dark:text-gray-100">{solvedPosts}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Solved</div>
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
              <div className="text-sm text-gray-600 dark:text-gray-400">Open</div>
            </div>
          </div>
        </div>

        <Link
  to="/app/received-solutions"
  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all block dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
>
  <div className="flex items-center gap-3 mb-2">
    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#10b981] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-green-500/20">
      <Inbox className="w-5 h-5 text-white" />
    </div>

    <div>
      <div className="text-2xl text-gray-900 dark:text-gray-100">
        {pendingReceivedSolutions}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Pending Solutions
      </div>
    </div>
  </div>

  <p className="text-xs text-gray-500 mt-2 dark:text-gray-400">
    Solutions waiting for your review
  </p>
</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
  <h2 className="text-2xl text-gray-900 dark:text-gray-100">
    {searchQuery || hasActiveFilters
      ? `Filtered Results ${searchQuery ? `for "${searchQuery}"` : ""}`
      : "Recent Problems"}
  </h2>

  <Link
    to="/app/post-problem"
    className="text-[#0ea5e9] hover:underline flex items-center gap-1 font-medium"
  >
    Post Problem <ArrowRight className="w-4 h-4" />
  </Link>
</div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
    <select
      name="field_id"
      value={filters.field_id}
      onChange={handleFilterChange}
      className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-700 focus:border-[#0ea5e9] focus:ring-2 focus:ring-blue-100 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:focus:ring-blue-900/40"
    >
      <option value="all">All Fields</option>
      {fields.map((field) => (
        <option key={field.field_id} value={field.field_id}>
          {field.field_name}
        </option>
      ))}
    </select>

    <select
      name="status"
      value={filters.status}
      onChange={handleFilterChange}
      className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-700 focus:border-[#0ea5e9] focus:ring-2 focus:ring-blue-100 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:focus:ring-blue-900/40"
    >
      <option value="all">All Status</option>
      <option value="open">Open</option>
      <option value="solved">Solved</option>
      <option value="closed">Closed</option>
    </select>

    <select
      name="difficulty_level"
      value={filters.difficulty_level}
      onChange={handleFilterChange}
      className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-700 focus:border-[#0ea5e9] focus:ring-2 focus:ring-blue-100 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:focus:ring-blue-900/40"
    >
      <option value="all">All Difficulty</option>
      <option value="beginner">Beginner</option>
      <option value="intermediate">Intermediate</option>
      <option value="advanced">Advanced</option>
    </select>

    <select
      name="post_type"
      value={filters.post_type}
      onChange={handleFilterChange}
      className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-700 focus:border-[#0ea5e9] focus:ring-2 focus:ring-blue-100 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:focus:ring-blue-900/40"
    >
      <option value="all">All Types</option>
      <option value="problem">Problem</option>
      <option value="research">Research</option>
      <option value="experiment">Experiment</option>
      <option value="question">Question</option>
    </select>

    <select
      name="sort"
      value={filters.sort}
      onChange={handleFilterChange}
      className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-700 focus:border-[#0ea5e9] focus:ring-2 focus:ring-blue-100 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:focus:ring-blue-900/40"
    >
      <option value="newest">Newest</option>
      <option value="most_solved">Most Solved</option>
      <option value="most_active">Most Active</option>
    </select>

    <button
      type="button"
      onClick={resetFilters}
      disabled={!hasActiveFilters}
      className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
    >
      Reset
    </button>
  </div>
</div>

          {loading && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
              Loading problems...
            </div>
          )}

          <div className="space-y-3 mb-5">
            <AppAlert type="error" message={error} onClose={() => setError("")} />
          </div>

          {!loading && !error && posts.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
              {searchQuery
                ? "No matching problems found."
                : "No problems posted yet. Be the first to post one."}
            </div>
          )}

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
                      <span>
                        by {problem.full_name || problem.name || problem.author_name || "Unknown User"}
                      </span>

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
                    {problem.solution_count || 0} Solutions
                  </span>

                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    View details
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
  <h2 className="text-2xl mb-4 text-gray-900 dark:text-gray-100">My Recent Activity</h2>

  <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    {!summary?.myRecentActivity || summary.myRecentActivity.length === 0 ? (
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Your recent posts, comments, and solutions will appear here.
      </div>
    ) : (
      summary.myRecentActivity.map((activity, i) => {
        const ActivityIcon = getActivityIcon(activity.activity_type);

        return (
          <Link
            key={i}
            to={`/app/problem/${activity.post_id || activity.reference_id}`}
            className="flex items-start gap-3 rounded-lg hover:bg-gray-50 transition-colors p-2 -m-2 dark:hover:bg-gray-800"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0ea5e9]/10 to-[#a855f7]/10 flex items-center justify-center flex-shrink-0 border border-blue-200 dark:from-[#0ea5e9]/20 dark:to-[#a855f7]/20 dark:border-blue-900/60">
              <ActivityIcon className="w-4 h-4 text-[#0ea5e9]" />
            </div>

            <div className="flex-1">
              <p className="text-sm mb-1 text-gray-900 dark:text-gray-100">
                {activity.message}
              </p>

              <p className="text-xs text-gray-600 line-clamp-1 dark:text-gray-400">
                {activity.title}
              </p>

              <span className="text-xs text-gray-500 dark:text-gray-500">
                {formatDate(activity.created_at)}
              </span>
            </div>
          </Link>
        );
      })
    )}
  </div>
</div>

          <div>
            <h2 className="text-2xl mb-4 text-gray-900 dark:text-gray-100">Quick Actions</h2>

            <div className="space-y-3">
  <Link
    to="/app/post-problem"
    className="block rounded-xl border border-blue-200 bg-gradient-to-r from-[#0ea5e9]/10 to-[#a855f7]/10 p-4 hover:border-blue-300 hover:shadow-md transition-all dark:border-blue-900/60 dark:from-[#0ea5e9]/20 dark:to-[#a855f7]/20 dark:hover:border-blue-700"
  >
    <h3 className="mb-1 text-gray-900 dark:text-gray-100">Post a Problem</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">
      Share a challenge with the community
    </p>
  </Link>

  <Link
    to="/app/received-solutions"
    className="block rounded-xl border border-green-200 bg-green-50 p-4 hover:border-green-300 hover:shadow-md transition-all dark:border-green-900/70 dark:bg-green-950/30 dark:hover:border-green-700"
  >
    <h3 className="mb-1 text-gray-900 dark:text-gray-100">
      Review Received Solutions
    </h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">
      {pendingReceivedSolutions} solution
      {pendingReceivedSolutions === 1 ? "" : "s"} waiting for review
    </p>
  </Link>

  <Link
    to="/app/my-problems"
    className="block rounded-xl border border-gray-200 bg-white p-4 hover:border-blue-300 hover:shadow-md transition-all shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700"
  >
    <h3 className="mb-1 text-gray-900 dark:text-gray-100">My Problems</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">
      Manage your posted problems
    </p>
  </Link>

  <Link
    to="/app/archive"
    className="block rounded-xl border border-gray-200 bg-white p-4 hover:border-blue-300 hover:shadow-md transition-all shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700"
  >
    <h3 className="mb-1 text-gray-900 dark:text-gray-100">Explore Archive</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">Browse solved problems</p>
  </Link>
</div>
          </div>
        </div>
      </div>
    </div>
  );
}