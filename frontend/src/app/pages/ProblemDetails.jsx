import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppAlert } from "../components/AppAlert";
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  Bookmark,
  CheckCircle,
  Clock,
  FileText,
  Download,
  Eye,
} from "lucide-react";

import {
  getPostById,
  updatePost,
  deletePost,
  toggleSavePost,
  getPostSaveStatus,
} from "../services/postService";


import { getCurrentUser } from "../services/authService";
import {
  getPostAttachments,
  deletePostAttachment,
} from "../services/uploadService";

import {
  getCommentsByPost,
  addComment,
  deleteComment,
  toggleCommentLike,
} from "../services/commentService";

import {
  getSolutionsByPost,
  addSolution,
  verifySolution,
  deleteSolution,
  deleteSolutionAttachment,
  toggleSolutionLike,
} from "../services/solutionService";

export function ProblemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("discussion");
  const [problem, setProblem] = useState(null);
  const [comments, setComments] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [isSaved, setIsSaved] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  const [solutionText, setSolutionText] = useState("");
  const [solutionFiles, setSolutionFiles] = useState([]);

  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editPostData, setEditPostData] = useState({
    title: "",
    description: "",
    post_type: "problem",
    difficulty_level: "beginner",
    status: "open",
  });

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const currentUser = getCurrentUser();

  const fetchProblemData = async () => {
  try {
    setLoading(true);
    setError("");

    const [postData, commentData, solutionData, attachmentData] =
      await Promise.all([
        getPostById(id),
        getCommentsByPost(id),
        getSolutionsByPost(id),
        getPostAttachments(id),
      ]);

    const finalPost = postData?.post || postData;
    const finalComments = Array.isArray(commentData)
      ? commentData
      : commentData?.comments || [];

    const finalSolutions = Array.isArray(solutionData)
      ? solutionData
      : solutionData?.solutions || [];

    const finalAttachments = Array.isArray(attachmentData)
      ? attachmentData
      : attachmentData?.attachments || [];

    setProblem(finalPost);
    setComments(finalComments);
    setSolutions(finalSolutions);
    setAttachments(finalAttachments);

    if (currentUser?.user_id) {
      const saveStatusData = await getPostSaveStatus(id);
      setIsSaved(saveStatusData.saved);
    }

    setEditPostData({
      title: finalPost?.title || "",
      description: finalPost?.description || "",
      post_type: finalPost?.post_type || "problem",
      difficulty_level: finalPost?.difficulty_level || "beginner",
      status: finalPost?.status || "open",
    });
  } catch (err) {
    setError(err.message || "Failed to load problem details");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProblemData();
  }, [id]);

  const handleEditPostChange = (e) => {
    setEditPostData({
      ...editPostData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdatePost = async () => {
    if (!editPostData.title.trim() || !editPostData.description.trim()) {
      setError("Title and description are required");
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setMessage("");

      await updatePost(id, editPostData);

      setIsEditingPost(false);
      setMessage("Post updated successfully");
      fetchProblemData();
    } catch (err) {
      setError(err.message || "Failed to update post");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePost = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) return;

    try {
      setActionLoading(true);
      setError("");
      setMessage("");

      await deletePost(id);

      navigate("/app");
    } catch (err) {
      setError(err.message || "Failed to delete post");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setMessage("");

      await addComment(id, commentText);

      setCommentText("");
      setMessage("Comment posted successfully");
      fetchProblemData();
    } catch (err) {
      setError(err.message || "Failed to post comment");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddReply = async (parentCommentId) => {
  if (!replyText.trim()) {
    setError("Reply cannot be empty");
    return;
  }

  try {
    setActionLoading(true);
    setError("");
    setMessage("");

    await addComment(id, replyText, parentCommentId);

    setReplyText("");
    setReplyingTo(null);
    setMessage("Reply posted successfully");
    fetchProblemData();
  } catch (err) {
    setError(err.message || "Failed to post reply");
  } finally {
    setActionLoading(false);
  }
};

  const handleAddSolution = async () => {
  if (!solutionText.trim()) {
    setError("Solution cannot be empty");
    return;
  }

  try {
    setActionLoading(true);
    setError("");
    setMessage("");

    await addSolution(id, solutionText, solutionFiles);

    const updatedSolutions = await getSolutionsByPost(id);
    const finalSolutions = Array.isArray(updatedSolutions)
      ? updatedSolutions
      : updatedSolutions?.solutions || [];

    setSolutions(finalSolutions);
    setSolutionText("");
    setSolutionFiles([]);
    setActiveTab("solutions");
    setMessage("Solution submitted successfully");
  } catch (err) {
    setError(err.message || "Failed to submit solution");
  } finally {
    setActionLoading(false);
  }
};

  const handleVerifySolution = async (solutionId) => {
  const confirmVerify = window.confirm(
    "Are you sure you want to mark this solution as solved?"
  );

  if (!confirmVerify) return;

  try {
    setActionLoading(true);
    setError("");
    setMessage("");

    await verifySolution(solutionId);

    await fetchProblemData();

    setActiveTab("solutions");
    setMessage("Solution marked as solved successfully");
  } catch (err) {
    setError(err.message || "Failed to verify solution");
  } finally {
    setActionLoading(false);
  }
};

  const handleDeleteComment = async (commentId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
  if (!confirmDelete) return;

  try {
    setActionLoading(true);
    setError("");
    setMessage("");

    await deleteComment(commentId);

    setMessage("Comment deleted successfully");
    fetchProblemData();
  } catch (err) {
    setError(err.message || "Failed to delete comment");
  } finally {
    setActionLoading(false);
  }
};

const handleCommentLike = async (commentId) => {
  try {
    setError("");
    setMessage("");

    const data = await toggleCommentLike(commentId);

    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.comment_id === commentId
          ? {
              ...comment,
              like_count: data.like_count,
            }
          : comment
      )
    );
  } catch (err) {
    setError(err.message || "Failed to like comment");
  }
};

const handleDeleteSolution = async (solutionId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this solution?");
  if (!confirmDelete) return;

  try {
    setActionLoading(true);
    setError("");
    setMessage("");

    await deleteSolution(solutionId);

    setMessage("Solution deleted successfully");
    fetchProblemData();
  } catch (err) {
    setError(err.message || "Failed to delete solution");
  } finally {
    setActionLoading(false);
  }
};

const handleDeleteSolutionAttachment = async (attachmentId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this solution attachment?"
  );

  if (!confirmDelete) return;

  try {
    setActionLoading(true);
    setError("");
    setMessage("");

    await deleteSolutionAttachment(attachmentId);

    setMessage("Solution attachment deleted successfully");
    fetchProblemData();
  } catch (err) {
    setError(err.message || "Failed to delete solution attachment");
  } finally {
    setActionLoading(false);
  }
};

const handleSolutionLike = async (solutionId) => {
  try {
    setError("");
    setMessage("");

    const data = await toggleSolutionLike(solutionId);

    setSolutions((prevSolutions) =>
      prevSolutions.map((solution) =>
        solution.solution_id === solutionId
          ? {
              ...solution,
              like_count: data.like_count,
            }
          : solution
      )
    );
  } catch (err) {
    setError(err.message || "Failed to like solution");
  }
};

const handleSavePost = async () => {
  try {
    setActionLoading(true);
    setError("");
    setMessage("");

    const data = await toggleSavePost(id);

    setIsSaved(data.saved);
    setMessage(data.saved ? "Problem saved successfully" : "Problem removed from saved");
  } catch (err) {
    setError(err.message || "Failed to save problem");
  } finally {
    setActionLoading(false);
  }
};

const handleDeletePostAttachment = async (attachmentId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this attachment?"
  );

  if (!confirmDelete) return;

  try {
    setActionLoading(true);
    setError("");
    setMessage("");

    await deletePostAttachment(attachmentId);

    setMessage("Attachment deleted successfully");
    fetchProblemData();
  } catch (err) {
    setError(err.message || "Failed to delete attachment");
  } finally {
    setActionLoading(false);
  }
};

const handleSharePost = async () => {
  try {
    const shareUrl = window.location.href;

    if (navigator.share) {
      await navigator.share({
        title: problem?.title || "ResearchHub Problem",
        text: problem?.description || "Check this problem on ResearchHub",
        url: shareUrl,
      });

      return;
    }

    await navigator.clipboard.writeText(shareUrl);
    setMessage("Problem link copied to clipboard");
  } catch (err) {
    setError("Failed to share problem");
  }
};

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

  const getFileSizeText = (attachment) => {
    if (attachment.file_size) {
      return `${(attachment.file_size / 1024).toFixed(2)} KB`;
    }

    return attachment.file_type || "Uploaded file";
  };

  const MAX_FILE_SIZE = 10 * 1024 * 1024;
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

const validateSolutionFiles = (selectedFiles) => {
  if (solutionFiles.length + selectedFiles.length > MAX_FILE_COUNT) {
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

const handleSolutionFileChange = (e) => {
  setError("");

  const selectedFiles = Array.from(e.target.files);
  const validFiles = validateSolutionFiles(selectedFiles);

  setSolutionFiles([...solutionFiles, ...validFiles]);

  e.target.value = "";
};

const removeSolutionFile = (index) => {
  setSolutionFiles(solutionFiles.filter((_, i) => i !== index));
};

  const buildCommentTree = (commentList) => {
  const commentMap = {};
  const rootComments = [];

  commentList.forEach((comment) => {
    commentMap[comment.comment_id] = {
      ...comment,
      replies: [],
    };
  });

  commentList.forEach((comment) => {
    if (comment.parent_comment_id) {
      const parent = commentMap[comment.parent_comment_id];

      if (parent) {
        parent.replies.push(commentMap[comment.comment_id]);
      }
    } else {
      rootComments.push(commentMap[comment.comment_id]);
    }
  });

  return rootComments;
};

const nestedComments = buildCommentTree(comments);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";

    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    if (imagePath.startsWith("/uploads")) {
      return `http://localhost:5000${imagePath}`;
    }

    return imagePath;
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto text-gray-900 dark:text-gray-100">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
          Loading problem details...
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="p-6 max-w-6xl mx-auto text-gray-900 dark:text-gray-100">
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300">
          Problem not found.
        </div>
      </div>
    );
  }

  const isPostOwner =
    currentUser?.user_id === problem.user_id || currentUser?.role === "admin";

  const renderComment = (comment, level = 0) => (
  <div
    key={comment.comment_id}
    className={`rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-800/70 ${
      level > 0 ? "ml-8 mt-4 border-l-4 border-l-blue-200 dark:border-l-blue-800" : ""
    }`}
  >
    <div className="flex items-start gap-4 mb-4">
      <img
  src={
    comment.profile_picture
      ? getImageUrl(comment.profile_picture)
      : "/default-profile.png"
  }
  alt={comment.full_name}
  className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
/>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-gray-900 font-medium dark:text-gray-100">
            {comment.full_name || "Unknown User"}
          </span>

          {level > 0 && (
            <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/60">
              Reply
            </span>
          )}
        </div>

        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(comment.created_at)}
        </span>
      </div>
    </div>

    <p className="text-gray-700 mb-4 whitespace-pre-line dark:text-gray-300">
      {comment.comment_text}
    </p>

    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
      <button
        onClick={() => handleCommentLike(comment.comment_id)}
        disabled={actionLoading}
        className="flex items-center gap-1 hover:text-[#0ea5e9] transition-colors disabled:opacity-60"
      >
        <ThumbsUp className="w-4 h-4" />
        {comment.like_count || 0}
      </button>

      <button
        onClick={() => {
          setReplyingTo(comment.comment_id);
          setReplyText("");
        }}
        className="flex items-center gap-1 hover:text-[#0ea5e9] transition-colors"
      >
        <MessageSquare className="w-4 h-4" />
        Reply
      </button>

      {(currentUser?.user_id === comment.user_id ||
        currentUser?.role === "admin") && (
        <button
          onClick={() => handleDeleteComment(comment.comment_id)}
          disabled={actionLoading}
          className="flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors"
        >
          Delete
        </button>
      )}
    </div>

    {replyingTo === comment.comment_id && (
      <div className="mt-4 rounded-lg border border-blue-100 bg-white p-4 dark:border-blue-900/60 dark:bg-gray-900">
        <textarea
          rows={3}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder={`Reply to ${comment.full_name || "this comment"}...`}
          className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#0ea5e9] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all resize-none mb-3 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-900/40"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setReplyingTo(null);
              setReplyText("");
            }}
            disabled={actionLoading}
            className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            onClick={() => handleAddReply(comment.comment_id)}
            disabled={actionLoading}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#0ea5e9] to-[#a855f7] text-white hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20 disabled:opacity-60"
          >
            {actionLoading ? "Replying..." : "Post Reply"}
          </button>
        </div>
      </div>
    )}

    {comment.replies && comment.replies.length > 0 && (
      <div className="mt-4 space-y-4">
        {comment.replies.map((reply) => renderComment(reply, level + 1))}
      </div>
    )}
  </div>
);

  return (
    <div className="p-6 max-w-6xl mx-auto text-gray-900 dark:text-gray-100">
      <div className="space-y-3 mb-5">
        <AppAlert type="error" message={error} onClose={() => setError("")} />
        <AppAlert type="success" message={message} onClose={() => setMessage("")} />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-8 mb-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {isEditingPost ? (
              <div className="space-y-4 mb-4">
                <input
                  type="text"
                  name="title"
                  value={editPostData.title}
                  onChange={handleEditPostChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#0ea5e9] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-900/40"
                />

                <textarea
                  rows={6}
                  name="description"
                  value={editPostData.description}
                  onChange={handleEditPostChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#0ea5e9] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all resize-none text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-900/40"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select
                    name="difficulty_level"
                    value={editPostData.difficulty_level}
                    onChange={handleEditPostChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#0ea5e9] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-900/40"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>

                  <select
                    name="post_type"
                    value={editPostData.post_type}
                    onChange={handleEditPostChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#0ea5e9] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-900/40"
                  >
                    <option value="problem">Problem</option>
                    <option value="research">Research</option>
                    <option value="experiment">Experiment</option>
                    <option value="question">Question</option>
                  </select>

                  <select
                    name="status"
                    value={editPostData.status}
                    onChange={handleEditPostChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#0ea5e9] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-900/40"
                  >
                    <option value="open">Open</option>
                    <option value="solved">Solved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleUpdatePost}
                    disabled={actionLoading}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#0ea5e9] to-[#a855f7] text-white hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20 disabled:opacity-60"
                  >
                    {actionLoading ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    onClick={() => setIsEditingPost(false)}
                    disabled={actionLoading}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div
                  className={`inline-block px-3 py-1 rounded-full text-xs mb-3 capitalize ${getDifficultyStyle(
                    problem.difficulty_level
                  )}`}
                >
                  {problem.difficulty_level}
                </div>

                <h1 className="text-3xl mb-4 text-gray-900 dark:text-gray-100">
                  {problem.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <img
  src={
    problem.profile_picture
      ? getImageUrl(problem.profile_picture)
      : "/default-profile.png"
  }
  alt={problem.full_name}
  className="w-6 h-6 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
/>

                    <span>{problem.full_name || "Unknown User"}</span>
                  </div>

                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDate(problem.created_at)}
                  </span>

                  <span className="flex items-center gap-1 capitalize">
                    <Eye className="w-4 h-4" />
                    {problem.status}
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isPostOwner && !isEditingPost && (
              <>
                <button
                  onClick={() => setIsEditingPost(true)}
                  className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Edit
                </button>

                <button
                  onClick={handleDeletePost}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 transition-colors text-red-500 disabled:opacity-60 dark:border-red-900/70 dark:bg-red-950/30 dark:hover:bg-red-950/50 dark:text-red-300"
                >
                  Delete
                </button>
              </>
            )}

            <button
  onClick={handleSavePost}
  disabled={actionLoading}
  title={isSaved ? "Remove from saved" : "Save problem"}
  className={`p-3 rounded-lg border transition-colors disabled:opacity-60 ${
  isSaved
    ? "border-blue-200 bg-blue-50 text-[#0ea5e9] dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300"
    : "border-gray-200 hover:bg-gray-50 text-gray-700 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
}`}
>
  <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
</button>

<button
  onClick={handleSharePost}
  title="Share problem"
  className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
>
  <Share2 className="w-5 h-5" />
</button>
          </div>
        </div>

        {!isEditingPost && (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {problem.field_name && (
                <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
                  {problem.field_name}
                </span>
              )}

              <span className="px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-100 capitalize dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/60">
                {problem.post_type}
              </span>

              <span className="px-3 py-1 rounded-full text-sm bg-green-50 text-green-700 border border-green-100 capitalize dark:bg-green-950/40 dark:text-green-300 dark:border-green-900/60">
                {problem.status}
              </span>
            </div>

            <div className="prose prose-gray max-w-none mb-6">
              <p className="text-gray-700 whitespace-pre-line dark:text-gray-300">
                {problem.description}
              </p>
            </div>
          </>
        )}

        <div className="space-y-2">
          <h3 className="text-sm text-gray-600 mb-2 dark:text-gray-400">Attachments</h3>

          {attachments.length === 0 && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200 dark:bg-gray-800/70 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0ea5e9]/10 to-[#a855f7]/10 flex items-center justify-center border border-blue-200 dark:from-[#0ea5e9]/20 dark:to-[#a855f7]/20 dark:border-blue-900/60">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>

                <div>
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    No attachments uploaded
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Files uploaded with this problem will appear here
                  </div>
                </div>
              </div>
            </div>
          )}

          {attachments.map((attachment) => (
            <div
              key={attachment.attachment_id}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200 dark:bg-gray-800/70 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#0ea5e9]/10 to-[#a855f7]/10 flex items-center justify-center border border-blue-200 overflow-hidden dark:from-[#0ea5e9]/20 dark:to-[#a855f7]/20 dark:border-blue-900/60">
  {attachment.file_type?.startsWith("image/") ? (
    <img
      src={getFileUrl(attachment.file_path)}
      alt={attachment.file_name}
      className="w-full h-full object-cover"
    />
  ) : (
    <FileText className="w-5 h-5 text-blue-600" />
  )}
</div>

                <div>
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    {attachment.file_name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {getFileSizeText(attachment)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
  <div className="flex items-center gap-2">
  <a
    href={getFileUrl(attachment.file_path)}
    target="_blank"
    rel="noreferrer"
    download
    className="p-2 rounded-lg hover:bg-gray-100 transition-colors dark:hover:bg-gray-800"
  >
    <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
  </a>

</div>

  {isPostOwner && (
    <button
      type="button"
      onClick={() => handleDeletePostAttachment(attachment.attachment_id)}
      disabled={actionLoading}
      className="p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-60"
    >
      <span className="text-red-500 text-sm">Delete</span>
    </button>
  )}
</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab("discussion")}
            className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition-all ${
              activeTab === "discussion"
                ? "bg-gradient-to-r from-[#0ea5e9]/10 to-[#a855f7]/10 border-b-2 border-[#0ea5e9] text-[#0ea5e9] dark:from-[#0ea5e9]/20 dark:to-[#a855f7]/20 dark:text-[#38bdf8]"
                : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            Discussion ({comments.length})
          </button>

          <button
            onClick={() => setActiveTab("solutions")}
            className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition-all ${
              activeTab === "solutions"
                ? "bg-gradient-to-r from-[#0ea5e9]/10 to-[#a855f7]/10 border-b-2 border-[#0ea5e9] text-[#0ea5e9] dark:from-[#0ea5e9]/20 dark:to-[#a855f7]/20 dark:text-[#38bdf8]"
                : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            Solutions ({solutions.length})
          </button>
        </div>

        <div className="p-6">
          {activeTab === "discussion" && (
            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/70">
                <textarea
                  rows={4}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts, suggestions, or questions..."
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-[#0ea5e9] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all resize-none mb-3 text-gray-900 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-900/40"
                />

                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleAddComment}
                    disabled={actionLoading}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#0ea5e9] to-[#a855f7] text-white hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20 disabled:opacity-60"
                  >
                    {actionLoading ? "Posting..." : "Post Comment"}
                  </button>
                </div>
              </div>

              {comments.length === 0 && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-gray-600 dark:border-gray-800 dark:bg-gray-800/70 dark:text-gray-400">
                  No comments yet. Be the first to start the discussion.
                </div>
              )}

              {nestedComments.map((comment) => renderComment(comment))}
            </div>
          )}

          {activeTab === "solutions" && (
            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/70">
                <textarea
                  rows={5}
                  value={solutionText}
                  onChange={(e) => setSolutionText(e.target.value)}
                  placeholder="Submit your possible solution..."
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-[#0ea5e9] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all resize-none mb-3 text-gray-900 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-900/40"
                />

                <div className="mb-3">
  <label className="block text-sm text-gray-700 mb-2 dark:text-gray-300">
    Attach supporting documents or images optional
  </label>

  <input
    type="file"
    multiple
    accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,.txt,.zip"
    onChange={handleSolutionFileChange}
    className="block w-full text-sm text-gray-700 bg-white border border-gray-200 rounded-lg cursor-pointer focus:outline-none dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300"
  />

  {solutionFiles.length > 0 && (
    <div className="mt-3 space-y-2">
      {solutionFiles.map((file, index) => (
        <div
          key={index}
          className="flex items-center justify-between rounded-lg bg-white border border-gray-200 px-3 py-2 text-sm text-gray-600 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400"
        >
          <div className="flex items-center gap-3">
            {file.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-10 h-10 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
              />
            ) : (
              <FileText className="w-5 h-5 text-blue-600" />
            )}

            <div>
              <div className="text-sm text-gray-900 dark:text-gray-100">{file.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {(file.size / 1024).toFixed(2)} KB
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => removeSolutionFile(index)}
            className="text-red-500 hover:text-red-600"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  )}
</div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleAddSolution}
                    disabled={actionLoading}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#0ea5e9] to-[#a855f7] text-white hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20 disabled:opacity-60"
                  >
                    {actionLoading ? "Submitting..." : "Submit Solution"}
                  </button>
                </div>
              </div>

              {solutions.length === 0 && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-gray-600 dark:border-gray-800 dark:bg-gray-800/70 dark:text-gray-400">
                  No solutions submitted yet.
                </div>
              )}

              {solutions.map((solution) => (
                <div
                  key={solution.solution_id}
                  className={`rounded-lg border-2 p-6 ${
                    Number(solution.is_verified) === 1
                      ? "border-green-200 bg-gradient-to-br from-green-50 to-transparent dark:border-green-900/70 dark:from-green-950/40 dark:to-transparent"
                      : "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/70"
                  }`}
                >
                  {Number(solution.is_verified) === 1 && (
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-green-700 font-medium dark:text-green-300">
                        Marked as Solved
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={
                        solution.profile_picture
                          ? getImageUrl(solution.profile_picture)
                          : "/default-profile.png"
                      }
                      alt={solution.full_name || "User"}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                    />

                    <span className="text-gray-900 dark:text-gray-100">
                      {solution.full_name || "Unknown User"}
                    </span>

                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(solution.created_at)}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4 whitespace-pre-line dark:text-gray-300">
                    {solution.solution_text || solution.content}
                  </p>

                  {solution.attachments && solution.attachments.length > 0 && (
  <div className="mb-4 space-y-2">
    <h4 className="text-sm text-gray-600 dark:text-gray-400">Attached files</h4>

    {solution.attachments.map((attachment) => (
      <div
        key={attachment.attachment_id}
        className="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100 overflow-hidden dark:bg-blue-950/40 dark:border-blue-900/60">
  {attachment.file_type?.startsWith("image/") ? (
    <img
      src={getFileUrl(attachment.file_path)}
      alt={attachment.file_name}
      className="w-full h-full object-cover"
    />
  ) : (
    <FileText className="w-4 h-4 text-blue-600" />
  )}
</div>

          <div>
            <div className="text-sm text-gray-900 dark:text-gray-100">
              {attachment.file_name}
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400">
              {getFileSizeText(attachment)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
  <a
    href={getFileUrl(attachment.file_path)}
    target="_blank"
    rel="noreferrer"
    download
    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
  >
    <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
  </a>

</div>
      </div>
    ))}
  </div>
)}

<div className="flex items-center gap-4">
  <button
    onClick={() => handleSolutionLike(solution.solution_id)}
    disabled={actionLoading}
    className="flex items-center gap-1 text-gray-600 hover:text-[#0ea5e9] transition-colors disabled:opacity-60 dark:text-gray-400 dark:hover:text-[#38bdf8]"
  >
    <ThumbsUp className="w-4 h-4" />
    {solution.like_count || 0}
  </button>

  {isPostOwner && Number(solution.is_verified) !== 1 && (
    <button
      onClick={() => handleVerifySolution(solution.solution_id)}
      disabled={actionLoading}
      className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-60"
    >
      Mark as Solved
    </button>
  )}

  {(currentUser?.user_id === solution.user_id ||
    currentUser?.role === "admin") && (
    <button
      onClick={() => handleDeleteSolution(solution.solution_id)}
      disabled={actionLoading}
      className="px-4 py-2 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 transition-colors text-red-500 disabled:opacity-60 dark:border-red-900/70 dark:bg-red-950/30 dark:hover:bg-red-950/50 dark:text-red-300"
    >
      Delete
    </button>
  )}
</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}