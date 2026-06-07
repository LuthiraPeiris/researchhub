import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  TrendingUp,
  Star,
  FileText,
  Download,
  User,
  Lightbulb,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getArchiveItems } from "../services/archiveService";
import { AppAlert } from "../components/AppAlert";

export function KnowledgeArchive() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [archiveItems, setArchiveItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = [
    { id: "all", name: "All Categories" },
    ...Array.from(
      new Set(
        archiveItems
          .map((item) => item.field_name)
          .filter((fieldName) => Boolean(fieldName))
      )
    ).map((fieldName) => ({
      id: fieldName,
      name: fieldName,
    })),
  ];

  useEffect(() => {
    const fetchArchiveItems = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getArchiveItems();
        const archiveList = Array.isArray(data) ? data : data.archiveItems || [];

        setArchiveItems(archiveList);
      } catch (err) {
        setError(err.message || "Failed to load archive items");
      } finally {
        setLoading(false);
      }
    };

    fetchArchiveItems();
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

  const getFileUrl = (filePath) => {
    if (!filePath) return "#";

    if (filePath.startsWith("http")) {
      return filePath;
    }

    return `http://localhost:5000${filePath}`;
  };

  const filteredArchiveItems = archiveItems.filter((item) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      item.title?.toLowerCase().includes(search) ||
      item.summary?.toLowerCase().includes(search) ||
      item.solution_text?.toLowerCase().includes(search) ||
      item.description?.toLowerCase().includes(search) ||
      item.field_name?.toLowerCase().includes(search) ||
      item.post_author?.toLowerCase().includes(search) ||
      item.solution_author?.toLowerCase().includes(search);

    const matchesDifficulty =
      selectedDifficulty === "all" ||
      item.difficulty_level === selectedDifficulty;

    const matchesCategory =
      selectedCategory === "all" || item.field_name === selectedCategory;

    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  return (
    <div className="p-6 text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl mb-2 text-gray-900 dark:text-gray-100">
            Knowledge Archive
          </h1>

          <p className="text-gray-600 dark:text-gray-400">
            Browse solved problems with verified solutions and supporting
            documents.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Filter className="w-5 h-5" />
                Filters
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                    Difficulty
                  </label>

                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#0ea5e9] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:focus:ring-blue-900/40"
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-4 text-gray-900 dark:text-gray-100">Fields</h3>

              <div className="space-y-2">
                {categories.map((category) => {
                  const count =
                    category.id === "all"
                      ? archiveItems.length
                      : archiveItems.filter(
                          (item) => item.field_name === category.id
                        ).length;

                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                        selectedCategory === category.id
                          ? "bg-gradient-to-r from-[#0ea5e9]/10 to-[#a855f7]/10 border border-[#0ea5e9] text-[#0ea5e9] shadow-sm dark:from-[#0ea5e9]/20 dark:to-[#a855f7]/20 dark:text-[#38bdf8]"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{category.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {count}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <div className="lg:col-span-3 space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search solved problems, solutions, fields, or authors..."
                  className="w-full pl-11 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#0ea5e9] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-900/40"
                />
              </div>
            </div>

            {loading && (
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                Loading archive...
              </div>
            )}

            <div className="space-y-3 mb-5">
              <AppAlert type="error" message={error} onClose={() => setError("")} />
            </div>

            {!loading && !error && filteredArchiveItems.length === 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                No archived solved problems found.
              </div>
            )}

            <div className="space-y-5">
              {filteredArchiveItems.map((problem) => {
                const postAttachments = problem.post_attachments || [];
                const solutionAttachments =
                  problem.solution_attachments || [];
                const totalAttachments =
                  postAttachments.length + solutionAttachments.length;

                return (
                  <div
                    key={problem.archive_id}
                    className="rounded-xl border border-gray-200 bg-white p-6 hover:border-blue-300 hover:shadow-lg transition-all shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 border border-green-200 flex items-center justify-center flex-shrink-0 dark:from-green-950/40 dark:to-emerald-950/30 dark:border-green-900/60">
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="text-xl mb-2 text-gray-900 dark:text-gray-100">
                              {problem.title}
                            </h3>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                              <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                Problem by{" "}
                                {problem.post_author || "Unknown User"}
                              </span>

                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                Verified{" "}
                                {formatDate(
                                  problem.verified_at || problem.archived_at
                                )}
                              </span>
                            </div>
                          </div>

                          <div
                            className={`px-3 py-1 rounded-full text-xs ml-4 capitalize ${getDifficultyStyle(
                              problem.difficulty_level
                            )}`}
                          >
                            {problem.difficulty_level || "beginner"}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {problem.field_name && (
                            <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
                              {problem.field_name}
                            </span>
                          )}

                          <span className="px-3 py-1 rounded-full text-xs bg-green-50 text-green-700 border border-green-100 dark:bg-green-950/40 dark:text-green-300 dark:border-green-900/60">
                            Verified Solution
                          </span>

                          {problem.solution_author && (
                            <span className="px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/60">
                              Solution by {problem.solution_author}
                            </span>
                          )}
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 mb-4 dark:border-gray-800 dark:bg-gray-800/70">
                          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                            <FileText className="w-4 h-4 text-[#0ea5e9] dark:text-[#38bdf8]" />
                            Problem Summary
                          </h4>

                          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                            {problem.summary || problem.description}
                          </p>
                        </div>

                        <div className="rounded-lg border border-green-100 bg-green-50/60 p-4 mb-4 dark:border-green-900/60 dark:bg-green-950/30">
                          <h4 className="flex items-center gap-2 text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                            <Lightbulb className="w-4 h-4" />
                            Final Verified Solution
                          </h4>

                          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line line-clamp-4">
                            {problem.solution_text ||
                              "No verified solution text found."}
                          </p>
                        </div>

                        {totalAttachments > 0 && (
                          <div className="rounded-lg border border-gray-200 bg-white p-4 mb-4 dark:border-gray-800 dark:bg-gray-900">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                              Attached Documents ({totalAttachments})
                            </h4>

                            <div className="space-y-2">
                              {postAttachments.map((attachment) => (
                                <a
                                  key={`post-${attachment.attachment_id}`}
                                  href={getFileUrl(attachment.file_path)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                >
                                  <div className="flex items-center gap-3">
                                    <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    <div>
                                      <div className="text-sm text-gray-900 dark:text-gray-100">
                                        {attachment.file_name}
                                      </div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400">
                                        Problem attachment
                                      </div>
                                    </div>
                                  </div>

                                  <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                </a>
                              ))}

                              {solutionAttachments.map((attachment) => (
                                <a
                                  key={`solution-${attachment.attachment_id}`}
                                  href={getFileUrl(attachment.file_path)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-100 hover:bg-green-100 transition-colors dark:bg-green-950/30 dark:border-green-900/60 dark:hover:bg-green-950/50"
                                >
                                  <div className="flex items-center gap-3">
                                    <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    <div>
                                      <div className="text-sm text-gray-900 dark:text-gray-100">
                                        {attachment.file_name}
                                      </div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400">
                                        Verified solution attachment
                                      </div>
                                    </div>
                                  </div>

                                  <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex flex-wrap items-center gap-5">
                            <span className="flex items-center gap-1">
                              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                              Final solution verified
                            </span>

                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4" />
                              {problem.solution_like_count || 0} solution likes
                            </span>

                            <span className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              {totalAttachments} documents
                            </span>
                          </div>

                          <Link
                            to={`/app/problem/${problem.post_id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 text-[#0ea5e9] hover:bg-blue-100 transition-colors dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-[#38bdf8] dark:hover:bg-blue-950/60"
                          >
                            <TrendingUp className="w-4 h-4" />
                            View Original Problem
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredArchiveItems.length > 0 && (
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                Showing {filteredArchiveItems.length} solved archived problems
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}