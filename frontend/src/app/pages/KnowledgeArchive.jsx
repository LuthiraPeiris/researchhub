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
    <div className="p-5 lg:p-7 text-slate-900 dark:text-slate-100">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="mb-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Knowledge Archive
          </h1>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Browse solved problems with verified solutions and supporting
            documents.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                <Filter className="h-4 w-4 text-slate-500" />
                Filters
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Difficulty
                  </label>

                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-blue-900/40"
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-200">Fields</h3>

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
                      className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                       selectedCategory === category.id
                         ? "bg-blue-50 font-medium text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
                         : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{category.name}</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {count}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search solved problems, solutions, fields, or authors..."
                  className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-blue-900/40"
                />
              </div>
            </div>

            {loading && (
              <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                Loading archive...
              </div>
            )}

            <div className="space-y-3 mb-5">
              <AppAlert type="error" message={error} onClose={() => setError("")} />
            </div>

            {!loading && !error && filteredArchiveItems.length === 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                No archived solved problems found.
              </div>
            )}

            <div className="space-y-4">
              {filteredArchiveItems.map((problem) => {
                const postAttachments = problem.post_attachments || [];
                const solutionAttachments =
                  problem.solution_attachments || [];
                const totalAttachments =
                  postAttachments.length + solutionAttachments.length;

                return (
                  <div
                    key={problem.archive_id}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-800"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-300">
                        <CheckCircle className="h-4 w-4" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="mb-2 text-lg font-semibold leading-7 text-slate-900 dark:text-slate-100">
                              {problem.title}
                            </h3>

                            <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                              <span className="flex items-center gap-1">
                                <User className="h-3.5 w-3.5" />
                                Problem by{" "}
                                {problem.post_author || "Unknown User"}
                              </span>

                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                Verified{" "}
                                {formatDate(
                                  problem.verified_at || problem.archived_at
                                )}
                              </span>
                            </div>
                          </div>

                          <div
                            className={`ml-4 rounded-md px-2.5 py-1 text-xs font-medium capitalize ${getDifficultyStyle(
                              problem.difficulty_level
                            )}`}
                          >
                            {problem.difficulty_level || "beginner"}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {problem.field_name && (
                            <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                              {problem.field_name}
                            </span>
                          )}

                          <span className="rounded-md border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">
                            Verified Solution
                          </span>

                          {problem.solution_author && (
                            <span className="rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-300">
                              Solution by {problem.solution_author}
                            </span>
                          )}
                        </div>

                        <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                          <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            <FileText className="h-4 w-4 text-slate-400" />
                            Problem Summary
                          </h4>

                          <p className="whitespace-pre-line text-sm leading-6 text-slate-700 dark:text-slate-300">
                            {problem.summary || problem.description}
                          </p>
                        </div>

                        <div className="mb-4 rounded-lg border-l-4 border-l-emerald-500 border-y border-r border-y-slate-200 border-r-slate-200 bg-white p-4 dark:border-y-slate-800 dark:border-r-slate-800 dark:bg-slate-900">
                          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                            <Lightbulb className="w-4 h-4" />
                            Final Verified Solution
                          </h4>

                          <p className="line-clamp-4 whitespace-pre-line text-sm leading-6 text-slate-700 dark:text-slate-300">
                            {problem.solution_text ||
                              "No verified solution text found."}
                          </p>
                        </div>

                        {totalAttachments > 0 && (
                          <div className="mb-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                            <h4 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
                              Attached Documents ({totalAttachments})
                            </h4>

                            <div className="space-y-2">
                              {postAttachments.map((attachment) => (
                                <a
                                  key={`post-${attachment.attachment_id}`}
                                  href={getFileUrl(attachment.file_path)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
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
                                  className="flex items-center justify-between rounded-md border border-emerald-100 bg-emerald-50/60 px-3 py-2.5 transition-colors hover:bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/20"
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

                        <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex flex-wrap items-center gap-4">
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
                            className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
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
              <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                Showing {filteredArchiveItems.length} solved archived problems
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}