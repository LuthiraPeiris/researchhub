import { Trophy, TrendingUp, Award, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { getLeaderboard } from "../services/reputationService";
import { AppAlert } from "../components/AppAlert";

export function Leaderboard() {
  const [timeframe, setTimeframe] = useState("all");
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);
  const [error, setError] = useState("");

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

        const rankedUsers = data.map((user, index) => ({
          ...user,
          rank: index + 1,
          username: user.email ? user.email.split("@")[0] : "user",
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
          verifiedSolutions: Number(user.verified_solution_count || 0),
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

  const mostActive = topUsers[0]?.full_name || "No users yet";
  const topContributor = topUsers[1]?.full_name || "No users yet";
  const risingStar = topUsers[2]?.full_name || "No users yet";

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/default-profile.png";

    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    if (imagePath.startsWith("/uploads")) {
      return `http://localhost:5000${imagePath}`;
    }

    return imagePath;
  };

  return (
    <div className="mx-auto max-w-6xl p-5 lg:p-7 text-slate-900 dark:text-slate-100">
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

      {loading && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          Loading leaderboard...
        </div>
      )}

      <div className="space-y-3 mb-5">
        <AppAlert type="error" message={error} onClose={() => setError("")} />
      </div>

      {!loading && !error && topUsers.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          No leaderboard data available yet.
        </div>
      )}

      {!loading && !error && topUsers.length > 0 && (
        <div
          className={`transition-all duration-300 ${
            isSwitching ? "opacity-50 scale-[0.99]" : "opacity-100 scale-100"
          }`}
        >
          <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            {topUsers.slice(0, 3).map((user, i) => (
              <div
                key={user.user_id}
                className={`overflow-hidden rounded-xl border bg-white shadow-sm dark:bg-slate-900 ${
                  i === 0
                    ? "border-amber-300 dark:border-amber-900/70"
                    : i === 1
                    ? "border-slate-300 dark:border-slate-700"
                    : "border-orange-300 dark:border-orange-900/70"
                }`}
              >
                <div
                  className={`h-1 ${
                    i === 0
                      ? "bg-amber-400"
                      : i === 1
                      ? "bg-slate-300 dark:bg-slate-600"
                      : "bg-orange-400"
                  }`}
                />

                <div className="p-5 text-center">
                  <div className="relative inline-block mb-4">
                    <img
                      src={user.avatar}
                      alt={user.full_name}
                      className="h-16 w-16 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                    />

                    <div
                      className={`absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                        i === 0
                          ? "bg-amber-400 text-white"
                          : i === 1
                          ? "bg-slate-300 text-slate-700 dark:bg-slate-600 dark:text-slate-100"
                          : "bg-orange-400 text-white"
                      }`}
                    >
                      {i === 0 ? <Trophy className="w-4 h-4" /> : i + 1}
                    </div>
                  </div>

                  <h3 className="mb-1 text-base font-semibold text-slate-900 dark:text-slate-100">
                    {user.full_name}
                  </h3>

                  <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
                    @{user.username}
                  </p>

                  <div className="flex items-center justify-center gap-2 mb-2">
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
                </div>
              </div>
            ))}
          </div>

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
                  {topUsers.map((user, i) => (
                    <tr
                      key={user.user_id}
                      className="border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {i < 3 ? (
                            <Trophy
                              className={`w-5 h-5 ${
                                i === 0
                                  ? "text-yellow-500"
                                  : i === 1
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
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.full_name}
                            className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                          />

                          <div>
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {user.full_name}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              @{user.username}
                            </div>
                          </div>
                        </div>
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
                        {user.solutions || 0}
                      </td>

                      <td className="px-4 py-3 text-right text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        {user.verifiedSolutions || 0}
                      </td>

                      <td className="px-4 py-3 text-right text-sm text-slate-700 dark:text-slate-300">
                        {user.badge_count || 0}
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

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
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
                    {mostActive}
                  </p>
                </div>
              </div>
            </div>

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
                    {topContributor}
                  </p>
                </div>
              </div>
            </div>

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
                    {risingStar}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}