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
      Expert: "from-[#a855f7] to-[#0ea5e9]",
      Mentor: "from-[#f59e0b] to-[#0ea5e9]",
      Collaborator: "from-[#0ea5e9] to-[#a855f7]",
      "Problem Solver": "from-[#06b6d4] to-[#10b981]",
      Beginner: "from-[#0ea5e9] to-[#06b6d4]",
    };

    return colors[badge] || "from-[#0ea5e9] to-[#06b6d4]";
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
    <div className="p-6 max-w-6xl mx-auto text-gray-900 dark:text-gray-100">
      <div className="mb-8">
        <h1 className="text-3xl mb-2 text-gray-900 dark:text-gray-100">
          Leaderboard
        </h1>

        <p className="text-gray-600 dark:text-gray-400">
          Top contributors in the research community
        </p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setTimeframe("week")}
            className={`px-4 py-2 rounded-lg transition-all ${
              timeframe === "week"
                ? "bg-gradient-to-r from-[#0ea5e9]/10 to-[#a855f7]/10 border border-[#0ea5e9] text-[#0ea5e9] shadow-sm dark:from-[#0ea5e9]/20 dark:to-[#a855f7]/20 dark:text-[#38bdf8]"
                : "border border-gray-200 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            This Week
          </button>

          <button
            onClick={() => setTimeframe("month")}
            className={`px-4 py-2 rounded-lg transition-all ${
              timeframe === "month"
                ? "bg-gradient-to-r from-[#0ea5e9]/10 to-[#a855f7]/10 border border-[#0ea5e9] text-[#0ea5e9] shadow-sm dark:from-[#0ea5e9]/20 dark:to-[#a855f7]/20 dark:text-[#38bdf8]"
                : "border border-gray-200 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            This Month
          </button>

          <button
            onClick={() => setTimeframe("all")}
            className={`px-4 py-2 rounded-lg transition-all ${
              timeframe === "all"
                ? "bg-gradient-to-r from-[#0ea5e9]/10 to-[#a855f7]/10 border border-[#0ea5e9] text-[#0ea5e9] shadow-sm dark:from-[#0ea5e9]/20 dark:to-[#a855f7]/20 dark:text-[#38bdf8]"
                : "border border-gray-200 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            All Time
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <TrendingUp className="w-4 h-4" />
          {isSwitching ? "Updating..." : "Updated from database"}
        </div>
      </div>

      {loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
          Loading leaderboard...
        </div>
      )}

      <div className="space-y-3 mb-5">
        <AppAlert type="error" message={error} onClose={() => setError("")} />
      </div>

      {!loading && !error && topUsers.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
          No leaderboard data available yet.
        </div>
      )}

      {!loading && !error && topUsers.length > 0 && (
        <div
          className={`transition-all duration-300 ${
            isSwitching ? "opacity-50 scale-[0.99]" : "opacity-100 scale-100"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {topUsers.slice(0, 3).map((user, i) => (
              <div
                key={user.user_id}
                className={`rounded-xl border overflow-hidden shadow-lg ${
                  i === 0
                    ? "border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 dark:border-yellow-900/70 dark:from-yellow-950/40 dark:to-orange-950/30"
                    : i === 1
                    ? "border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 dark:border-gray-700 dark:from-gray-800 dark:to-gray-900"
                    : "border-orange-300 bg-gradient-to-br from-orange-50 to-red-50 dark:border-orange-900/70 dark:from-orange-950/40 dark:to-red-950/30"
                }`}
              >
                <div
                  className={`h-2 ${
                    i === 0
                      ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                      : i === 1
                      ? "bg-gradient-to-r from-gray-300 to-gray-400"
                      : "bg-gradient-to-r from-orange-400 to-red-400"
                  }`}
                />

                <div className="p-6 text-center">
                  <div className="relative inline-block mb-4">
                    <img
                      src={user.avatar}
                      alt={user.full_name}
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-white dark:ring-gray-800"
                    />

                    <div
                      className={`absolute -top-2 -right-2 w-8 h-8 rounded-full ${
                        i === 0
                          ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                          : i === 1
                          ? "bg-gradient-to-br from-gray-300 to-gray-400"
                          : "bg-gradient-to-br from-orange-400 to-red-400"
                      } flex items-center justify-center text-white shadow-lg`}
                    >
                      {i === 0 ? <Trophy className="w-4 h-4" /> : i + 1}
                    </div>
                  </div>

                  <h3 className="text-xl mb-1 text-gray-900 dark:text-gray-100">
                    {user.full_name}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    @{user.username}
                  </p>

                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs bg-gradient-to-r ${getBadgeColor(
                        user.badge
                      )} text-white shadow-sm`}
                    >
                      {user.badge}
                    </span>

                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Level {user.level}
                    </span>
                  </div>

                  <div className="text-2xl bg-gradient-to-r from-[#0ea5e9] to-[#a855f7] bg-clip-text text-transparent">
                    {user.reputation.toLocaleString()}
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    reputation
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/70">
                    <th className="px-6 py-4 text-left text-sm text-gray-600 dark:text-gray-400">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600 dark:text-gray-400">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600 dark:text-gray-400">
                      Badge
                    </th>
                    <th className="px-6 py-4 text-right text-sm text-gray-600 dark:text-gray-400">
                      Level
                    </th>
                    <th className="px-6 py-4 text-right text-sm text-gray-600 dark:text-gray-400">
                      Reputation
                    </th>
                    <th className="px-6 py-4 text-right text-sm text-gray-600 dark:text-gray-400">
                      Solutions
                    </th>
                    <th className="px-6 py-4 text-right text-sm text-gray-600 dark:text-gray-400">
                      Verified
                    </th>
                    <th className="px-6 py-4 text-right text-sm text-gray-600 dark:text-gray-400">
                      Badges
                    </th>
                    <th className="px-6 py-4 text-right text-sm text-gray-600 dark:text-gray-400">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {topUsers.map((user, i) => (
                    <tr
                      key={user.user_id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors dark:border-gray-800 dark:hover:bg-gray-800/70"
                    >
                      <td className="px-6 py-4">
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

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.full_name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                          />

                          <div>
                            <div className="text-gray-900 dark:text-gray-100">
                              {user.full_name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              @{user.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs bg-gradient-to-r ${getBadgeColor(
                            user.badge
                          )} text-white shadow-sm`}
                        >
                          {user.badge}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <span className="text-[#0ea5e9] dark:text-[#38bdf8] font-medium">
                          Level {user.level}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <span className="bg-gradient-to-r from-[#0ea5e9] to-[#a855f7] bg-clip-text text-transparent font-medium">
                          {user.reputation.toLocaleString()}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right text-gray-900 dark:text-gray-100">
                        {user.solutions || 0}
                      </td>

                      <td className="px-6 py-4 text-right text-green-600 dark:text-green-400 font-medium">
                        {user.verifiedSolutions || 0}
                      </td>

                      <td className="px-6 py-4 text-right text-gray-900 dark:text-gray-100">
                        {user.badge_count || 0}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <span className="flex items-center justify-end gap-1 text-green-600 dark:text-green-400 font-medium">
                          <TrendingUp className="w-4 h-4" />
                          {user.trend}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0ea5e9] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Zap className="w-5 h-5 text-white" />
                </div>

                <div>
                  <h3 className="text-gray-900 dark:text-gray-100">
                    Most Active
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {mostActive}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#06b6d4] to-[#a855f7] flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <Award className="w-5 h-5 text-white" />
                </div>

                <div>
                  <h3 className="text-gray-900 dark:text-gray-100">
                    Top Contributor
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {topContributor}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#a855f7] to-[#0ea5e9] flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <Trophy className="w-5 h-5 text-white" />
                </div>

                <div>
                  <h3 className="text-gray-900 dark:text-gray-100">
                    Rising Star
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
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