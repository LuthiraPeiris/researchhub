import { useEffect, useState } from "react";
import {
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  Code,
  Database,
} from "lucide-react";
import { createPost, getSimilarProblems } from "../services/postService";
import { uploadPostAttachments } from "../services/uploadService";
import { getFields } from "../services/fieldService";
import { AppAlert } from "../components/AppAlert";

export function PostProblem() {
  const [files, setFiles] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [fields, setFields] = useState([]);

  const [formData, setFormData] = useState({
  title: "",
  description: "",
  field_id: "",
  difficulty_level: "",
  post_type: "problem",
});

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [similarProblems, setSimilarProblems] = useState([]);
  const [checkingSimilar, setCheckingSimilar] = useState(false);

  const availableTags = [
    "Machine Learning",
    "Data Science",
    "Web Development",
    "Python",
    "JavaScript",
    "Algorithms",
    "Database",
    "Cloud Computing",
    "Security",
    "DevOps",
    "Research",
    "Optimization",
  ];

  useEffect(() => {
  const fetchFields = async () => {
    try {
      const data = await getFields();

      const fieldList = Array.isArray(data) ? data : data.fields || [];

      setFields(fieldList);
    } catch (err) {
      setError(err.message || "Failed to load fields");
    }
  };

  fetchFields();
}, []);

useEffect(() => {
  const title = formData.title.trim();
  const description = formData.description.trim();

  if (title.length < 3 && description.length < 10) {
    setSimilarProblems([]);
    setCheckingSimilar(false);
    return;
  }

  const timeoutId = setTimeout(async () => {
    try {
      setCheckingSimilar(true);

      const data = await getSimilarProblems({
        title,
        description,
        field_id: formData.field_id,
      });

      setSimilarProblems(data);
    } catch (err) {
      console.error("Failed to check similar problems:", err);
      setSimilarProblems([]);
    } finally {
      setCheckingSimilar(false);
    }
  }, 600);

  return () => clearTimeout(timeoutId);
}, [formData.title, formData.description, formData.field_id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILE_COUNT = 5;

const allowedFileTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "application/zip",
];

const validateFiles = (selectedFiles) => {
  if (files.length + selectedFiles.length > MAX_FILE_COUNT) {
    setError(`You can upload maximum ${MAX_FILE_COUNT} files`);
    return [];
  }

  const validFiles = [];

  for (const file of selectedFiles) {
    if (!allowedFileTypes.includes(file.type)) {
      setError(`${file.name} is not an allowed file type`);
      continue;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(`${file.name} is larger than 10MB`);
      continue;
    }

    validFiles.push(file);
  }

  return validFiles;
};

  const handleFileChange = (e) => {
  setError("");

  const selectedFiles = Array.from(e.target.files);
  const validFiles = validateFiles(selectedFiles);

  setFiles([...files, ...validFiles]);

  e.target.value = "";
};

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const getFileIcon = (fileName) => {
    const lowerName = fileName.toLowerCase();

    if (lowerName.endsWith(".csv") || lowerName.endsWith(".json")) {
      return <Database className="w-5 h-5 text-blue-600" />;
    }

    if (lowerName.endsWith(".pdf") || lowerName.endsWith(".txt")) {
      return <FileText className="w-5 h-5 text-blue-600" />;
    }

    return <ImageIcon className="w-5 h-5 text-blue-600" />;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!formData.title || !formData.description) {
      setError("Title and description are required");
      return;
    }

    if (!formData.field_id) {
      setError("Please select a field");
      return;
    }

    if (!formData.difficulty_level) {
      setError("Please select a difficulty level");
      return;
    }

    setLoading(true);

    try {
      const postResponse = await createPost({
        title: formData.title,
        description: formData.description,
        post_type: formData.post_type,
        field_id: formData.field_id,
        difficulty_level: formData.difficulty_level,
      });

      const postId = postResponse.post_id;

      if (files.length > 0) {
        await uploadPostAttachments(postId, files);
      }

      setMessage("Problem published successfully!");
      setSimilarProblems([]);

      setFormData({
        title: "",
        description: "",
        field_id: "",
        difficulty_level: "",
        post_type: "problem",
      });

      setSelectedTags([]);
      setFiles([]);
    } catch (err) {
      setError(err.message || "Failed to publish problem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto text-gray-900 dark:text-gray-100">
      <div className="mb-8">
        <h1 className="text-3xl mb-2 text-gray-900 dark:text-gray-100">Post a Problem</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Share your challenge with the research community
        </p>
      </div>

      <div className="space-y-3 mb-5">
        <AppAlert type="error" message={error} onClose={() => setError("")} />
        <AppAlert type="success" message={message} onClose={() => setMessage("")} />
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <label className="block mb-2 text-gray-900 dark:text-gray-100">Problem Title</label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Describe your problem in one clear sentence..."
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#0ea5e9] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-900/40"
          />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <label className="block mb-2 text-gray-900 dark:text-gray-100">Description</label>

          <div className="mb-3 flex gap-2 p-2 rounded-lg bg-gray-50 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <button
              type="button"
              className="px-3 py-1 rounded hover:bg-gray-200 transition-colors text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <strong>B</strong>
            </button>

            <button
              type="button"
              className="px-3 py-1 rounded hover:bg-gray-200 transition-colors text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <em>I</em>
            </button>

            <button
              type="button"
              className="px-3 py-1 rounded hover:bg-gray-200 transition-colors text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Code className="w-4 h-4" />
            </button>

            <button
              type="button"
              className="px-3 py-1 rounded hover:bg-gray-200 transition-colors text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <FileText className="w-4 h-4" />
            </button>
          </div>

          <textarea
            rows={10}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide detailed context, what you've tried, error messages, expected vs actual results..."
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#0ea5e9] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all resize-none text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-900/40"
          />

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Tip: Include code snippets, datasets, or research papers for better
            context
          </p>
        </div>

        {(checkingSimilar || similarProblems.length > 0) && (
  <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/30">
    <h3 className="mb-2 text-lg font-semibold text-blue-900 dark:text-blue-100">
      Similar problems already discussed
    </h3>

    {checkingSimilar ? (
      <p className="text-sm text-blue-700 dark:text-blue-300">
        Checking similar problems...
      </p>
    ) : (
      <div className="space-y-3">
        {similarProblems.map((problem) => (
          <div
            key={problem.post_id}
            className="rounded-lg border border-blue-100 bg-white p-4 dark:border-blue-900/60 dark:bg-gray-900"
          >
            <h4 className="font-medium text-gray-900 dark:text-gray-100">
              {problem.title}
            </h4>

            <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
              {problem.description}
            </p>

            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {problem.field_name && (
                <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200">
                  {problem.field_name}
                </span>
              )}

              <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {problem.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <label className="block mb-4 text-gray-900 dark:text-gray-100">Attachments</label>

          <label className="block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-800/70 dark:border-gray-700 dark:hover:border-blue-600">
            <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" />

            <p className="mb-2 text-gray-900 dark:text-gray-100">
              Drag and drop files here, or click to browse
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Support for PDFs, images, datasets, and code files
            </p>

            <span className="inline-block mt-4 px-6 py-2 rounded-lg bg-gray-100 border border-gray-200 hover:bg-gray-200 transition-colors text-gray-700 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
              Upload Files
            </span>

            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.csv,.json,.txt,.zip"
            />
          </label>

          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200 dark:bg-gray-800/70 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#0ea5e9]/10 to-[#a855f7]/10 flex items-center justify-center border border-blue-200 overflow-hidden dark:from-[#0ea5e9]/20 dark:to-[#a855f7]/20 dark:border-blue-900/60">
  {file.type.startsWith("image/") ? (
    <img
      src={URL.createObjectURL(file)}
      alt={file.name}
      className="w-full h-full object-cover"
    />
  ) : (
    getFileIcon(file.name)
  )}
</div>

                    <div>
                      <span className="block text-sm text-gray-900 dark:text-gray-100">
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {(file.size / 1024).toFixed(2)} KB
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="p-1 rounded hover:bg-gray-200 transition-colors dark:hover:bg-gray-700"
                  >
                    <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <label className="block mb-4 text-gray-900 dark:text-gray-100">Tags</label>

          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  selectedTags.includes(tag)
                    ? "bg-gradient-to-r from-[#0ea5e9]/10 to-[#a855f7]/10 border border-[#0ea5e9] text-[#0ea5e9] shadow-sm dark:from-[#0ea5e9]/20 dark:to-[#a855f7]/20 dark:text-[#38bdf8]"
                    : "bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <label className="block mb-2 text-gray-900 dark:text-gray-100">Field / Category</label>

    <select
      name="field_id"
      value={formData.field_id}
      onChange={handleChange}
      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#0ea5e9] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-900/40"
    >
      <option value="">Select field...</option>

      {fields.map((field) => (
        <option key={field.field_id} value={field.field_id}>
          {field.field_name}
        </option>
      ))}
    </select>

    {fields.length === 0 && (
      <p className="mt-2 text-xs text-red-500 dark:text-red-400">
        No fields found. Please add fields from admin panel first.
      </p>
    )}
  </div>

  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <label className="block mb-2 text-gray-900 dark:text-gray-100">
      Difficulty Level
    </label>

    <select
      name="difficulty_level"
      value={formData.difficulty_level}
      onChange={handleChange}
      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#0ea5e9] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-900/40"
    >
      <option value="">Select difficulty...</option>
      <option value="beginner">Beginner</option>
      <option value="intermediate">Intermediate</option>
      <option value="advanced">Advanced</option>
    </select>
  </div>

  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <label className="block mb-2 text-gray-900 dark:text-gray-100">Post Type</label>

    <select
      name="post_type"
      value={formData.post_type}
      onChange={handleChange}
      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#0ea5e9] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-900/40"
    >
      <option value="problem">Problem</option>
      <option value="research">Research</option>
      <option value="experiment">Experiment</option>
      <option value="question">Question</option>
    </select>
  </div>
</div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="px-6 py-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Save as Draft
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#0ea5e9] to-[#a855f7] text-white hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Publishing..." : "Publish Problem"}
          </button>
        </div>
      </form>
    </div>
  );
}