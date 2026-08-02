import { Trophy, TrendingUp, Award, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getLeaderboard } from "../services/reputationService";
import { AppAlert } from "../components/AppAlert";
import { API_ORIGIN } from "../services/api";

export function Leaderboard() {
  const [timeframe, setTimeframe] = useState("all");
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);
  const [error, setError] = useState("");

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return "/default-profile.png";
    }

    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    if (imagePath.startsWith("/uploads")) {
      return `${API_ORIGIN}${imagePath}`;
    }

    return `${API_ORIGIN}/uploads/s3/${imagePath}`;
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        if (topUsers.length === 0) {
          setLoading(true);
        } else {
          setIsSwitching(true);
        }

        setError("");

        const data = await getLeaderboard(timeframe);

        const leaderboardData = Array.isArray(data)
          ? data
          : data?.users || data?.leaderboard || [];

        const rankedUsers = leaderboardData.map((user, index) => ({
          ...user,
          rank: index + 1,

          username: user.email
            ? user.email.split("@")[0]
            : `user-${user.user_id}`,

          avatar: user.profile_picture
            ? getImageUrl(user.profile_picture)
            : "/default-profile.png",

          reputation: Number(user.total_points || 0),

          badge: user.level || "Beginner",

          level: Math.max(
            1,
            Math.floor(Number(user.total_points || 0) / 100) + 1
          ),

          solutions: Number(user.solution_count || 0),

          verifiedSolutions: Number(
            user.verified_solution_count || 0
          ),

          comments: Number(user.comment_count || 0),

          trend:
            timeframe === "week"
              ? `${user.total_points || 0} points this week`
              : timeframe === "month"
                ? `${user.total_points || 0} points this month`
                : `${user.verified_solution_count || 0} verified`,
        }));

        setTopUsers(rankedUsers);
      } catch (err) {
        setError(err.message || "Failed to load leaderboard");
      } finally {
        setLoading(false);
        setIsSwitching(false);
      }
    };

    fetchLeaderboard();
  }, [timeframe]);

  const getBadgeColor = (badge) => {
    const colors = {
      Expert:
        "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/60 dark:bg-violet-950/30 dark:text-violet-300",

      Mentor:
        "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300",

      Collaborator:
        "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-300",

      "Problem Solver":
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300",

      Beginner:
        "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
    };

    return (
      colors[badge] ||
      "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
    );
  };

  const mostActiveUser = topUsers[0] || null;
  const topContributorUser = topUsers[1] || null;
  const risingStarUser = topUsers[2] || null;

  return (
    <div className="mx-auto max-w-6xl p-5 text-slate-900 dark:text-slate-100 lg:p-7">
      <div className="mb-6">
        <h1 className="mb-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Leaderboard
        </h1>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Top contributors in the research community
        </p>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTimeframe("week")}
            className={`rounded-md border px-3.5 py-2 text-sm font-medium transition-colors ${
              timeframe === "week"
                ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-300"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            This Week
          </button>

          <button
            type="button"
            onClick={() => setTimeframe("month")}
            className={`rounded-md border px-3.5 py-2 text-sm font-medium transition-colors ${
              timeframe === "month"
                ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-300"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            This Month
          </button>

          <button
            type="button"
            onClick={() => setTimeframe("all")}
            className={`rounded-md border px-3.5 py-2 text-sm font-medium transition-colors ${
              timeframe === "all"
                ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-300"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            All Time
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <TrendingUp className="h-4 w-4" />

          {isSwitching ? "Updating..." : "Updated from database"}
        </div>
      </div>

      <div className="mb-5 space-y-3">
        <AppAlert
          type="error"
          message={error}
          onClose={() => setError("")}
        />
      </div>

      {loading && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          Loading leaderboard...
        </div>
      )}

      {!loading && !error && topUsers.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          No leaderboard data available yet.
        </div>
      )}

      {!loading && !error && topUsers.length > 0 && (
        <div
          className={`transition-all duration-300 ${
            isSwitching
              ? "scale-[0.99] opacity-50"
              : "scale-100 opacity-100"
          }`}
        >
          {/* Top three contributors */}
          <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            {topUsers.slice(0, 3).map((user, index) => (
              <Link
                key={user.user_id}
                to={`/app/profile/${user.user_id}`}
                className={`group block overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-slate-900 dark:focus:ring-offset-slate-950 ${
                  index === 0
                    ? "border-amber-300 dark:border-amber-900/70"
                    : index === 1
                      ? "border-slate-300 dark:border-slate-700"
                      : "border-orange-300 dark:border-orange-900/70"
                }`}
              >
                <div
                  className={`h-1 ${
                    index === 0
                      ? "bg-amber-400"
                      : index === 1
                        ? "bg-slate-300 dark:bg-slate-600"
                        : "bg-orange-400"
                  }`}
                />

                <div className="p-5 text-center">
                  <div className="relative mb-4 inline-block">
                    <img
                      src={user.avatar}
                      alt={user.full_name || "User"}
                      className="h-16 w-16 rounded-full object-cover ring-2 ring-slate-200 transition group-hover:ring-blue-400 dark:ring-slate-700"
                    />

                    <div
                      className={`absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                        index === 0
                          ? "bg-amber-400 text-white"
                          : index === 1
                            ? "bg-slate-300 text-slate-700 dark:bg-slate-600 dark:text-slate-100"
                            : "bg-orange-400 text-white"
                      }`}
                    >
                      {index === 0 ? (
                        <Trophy className="h-4 w-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                  </div>

                  <h3 className="mb-1 text-base font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
                    {user.full_name || "Unknown User"}
                  </h3>

                  <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
                    @{user.username}
                  </p>

                  <div className="mb-2 flex items-center justify-center gap-2">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getBadgeColor(
                        user.badge
                      )}`}
                    >
                      {user.badge}
                    </span>

                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Level {user.level}
                    </span>
                  </div>

                  <div className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {user.reputation.toLocaleString()}
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    reputation
                  </div>

                  <div className="mt-4 text-xs font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-blue-400">
                    View profile
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Complete leaderboard table */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Rank
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      User
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Badge
                    </th>

                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Level
                    </th>

                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Reputation
                    </th>

                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Solutions
                    </th>

                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Verified
                    </th>

                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Badges
                    </th>

                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {topUsers.map((user, index) => (
                    <tr
                      key={user.user_id}
                      className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {index < 3 ? (
                            <Trophy
                              className={`h-5 w-5 ${
                                index === 0
                                  ? "text-yellow-500"
                                  : index === 1
                                    ? "text-gray-400"
                                    : "text-orange-500"
                              }`}
                            />
                          ) : (
                            <span className="text-gray-600 dark:text-gray-400">
                              #{user.rank}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <Link
                          to={`/app/profile/${user.user_id}`}
                          className="group inline-flex items-center gap-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                        >
                          <img
                            src={user.avatar}
                            alt={user.full_name || "User"}
                            className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200 transition group-hover:ring-2 group-hover:ring-blue-400 dark:ring-slate-700"
                          />

                          <div>
                            <div className="text-sm font-medium text-slate-900 transition-colors group-hover:text-blue-600 group-hover:underline dark:text-slate-100 dark:group-hover:text-blue-400">
                              {user.full_name || "Unknown User"}
                            </div>

                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              @{user.username}
                            </div>
                          </div>
                        </Link>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full border px-2.5 py-1 text-xs font-medium ${getBadgeColor(
                            user.badge
                          )}`}
                        >
                          {user.badge}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <span className="font-medium text-blue-600 dark:text-blue-400">
                          Level {user.level}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {user.reputation.toLocaleString()}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right text-sm text-slate-700 dark:text-slate-300">
                        {user.solutions}
                      </td>

                      <td className="px-4 py-3 text-right text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        {user.verifiedSolutions}
                      </td>

                      <td className="px-4 py-3 text-right text-sm text-slate-700 dark:text-slate-300">
                        {Number(user.badge_count || 0)}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <span className="flex items-center justify-end gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          <TrendingUp className="h-4 w-4" />

                          {user.trend}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Community highlights */}
          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
            {mostActiveUser ? (
              <Link
                to={`/app/profile/${mostActiveUser.user_id}`}
                className="group rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-800"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-300">
                    <Zap className="h-4 w-4" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Most Active
                    </h3>

                    <p className="text-xs text-slate-500 transition-colors group-hover:text-blue-600 dark:text-slate-400 dark:group-hover:text-blue-400">
                      {mostActiveUser.full_name}
                    </p>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-300">
                    <Zap className="h-4 w-4" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Most Active
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      No users yet
                    </p>
                  </div>
                </div>
              </div>
            )}

            {topContributorUser ? (
              <Link
                to={`/app/profile/${topContributorUser.user_id}`}
                className="group rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-emerald-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-800"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-300">
                    <Award className="h-4 w-4" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Top Contributor
                    </h3>

                    <p className="text-xs text-slate-500 transition-colors group-hover:text-emerald-600 dark:text-slate-400 dark:group-hover:text-emerald-400">
                      {topContributorUser.full_name}
                    </p>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-300">
                    <Award className="h-4 w-4" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Top Contributor
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      No users yet
                    </p>
                  </div>
                </div>
              </div>
            )}

            {risingStarUser ? (
              <Link
                to={`/app/profile/${risingStarUser.user_id}`}
                className="group rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-violet-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-800"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-300">
                    <Trophy className="h-4 w-4" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Rising Star
                    </h3>

                    <p className="text-xs text-slate-500 transition-colors group-hover:text-violet-600 dark:text-slate-400 dark:group-hover:text-violet-400">
                      {risingStarUser.full_name}
                    </p>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-300">
                    <Trophy className="h-4 w-4" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Rising Star
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      No users yet
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
