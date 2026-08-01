import { useParams, Link } from "react-router-dom";
import { AppAlert } from "../components/AppAlert";
import {
  Award,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Mail,
  Star,
  Trophy,
  Flame,
  Target,
  CheckCircle,
  Bookmark,
  Lightbulb,
  BookOpen,
  Tags,
  ThumbsUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/authService";
import {
  getUserProfile,
  getUserPosts,
  getUserSolutions,
  getUserFields,
  updateUserProfile,
  updateProfilePicture,
  refreshCurrentUser,
} from "../services/userService";

export function UserProfile() {
  const { username } = useParams();

  const [activeTab, setActiveTab] = useState("activity");
  const [profile, setProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userSolutions, setUserSolutions] = useState([]);
  const [userFields, setUserFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [editForm, setEditForm] = useState({
    full_name: "",
    bio: "",
    university_or_organization: "",
  });

  const currentUser = getCurrentUser();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = username || currentUser?.user_id;

        if (!userId) {
          setError("User not found. Please login again.");
          setLoading(false);
          return;
        }

        const [profileData, postsData, solutionsData, fieldsData] =
          await Promise.all([
            getUserProfile(userId),
            getUserPosts(userId),
            getUserSolutions(userId),
            getUserFields(userId),
          ]);

        const finalPosts = Array.isArray(postsData)
          ? postsData
          : postsData.posts || [];
        const finalSolutions = Array.isArray(solutionsData)
          ? solutionsData
          : solutionsData.solutions || [];

        const finalFields = Array.isArray(fieldsData)
          ? fieldsData
          : fieldsData.fields || [];

        setProfile(profileData);
        setUserPosts(finalPosts);
        setUserSolutions(finalSolutions);
        setUserFields(finalFields);

        setEditForm({
          full_name: profileData.full_name || "",
          bio: profileData.bio || "",
          university_or_organization:
            profileData.university_or_organization || "",
        });
      } catch (err) {
        setError(err.message || "Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username, currentUser?.user_id]);

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];

    if (!file || !profile) return;

    try {
      setImageUploading(true);
      setError("");
      setMessage("");

      await updateProfilePicture(profile.user_id, file);

      const updatedProfile = await getUserProfile(profile.user_id);
      setProfile(updatedProfile);

      if (currentUser?.user_id === profile.user_id) {
        await refreshCurrentUser(profile.user_id);
      }

      setMessage("Profile picture updated successfully");
    } catch (err) {
      setError(err.message || "Failed to update profile picture");
    } finally {
      setImageUploading(false);
    }
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async () => {
    try {
      setEditLoading(true);
      setError("");
      setMessage("");

      await updateUserProfile(profile.user_id, {
        full_name: editForm.full_name,
        bio: editForm.bio,
        university_or_organization: editForm.university_or_organization,
      });

      const updatedProfile = await getUserProfile(profile.user_id);
      setProfile(updatedProfile);

      if (currentUser?.user_id === profile.user_id) {
        await refreshCurrentUser(profile.user_id);
      }

      setIsEditing(false);
      setMessage("Profile updated successfully");
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setEditLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";

    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

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

  const defaultBadges = [
    {
      name: "First Solution",
      icon: CheckCircle,
      color: "from-[#10b981] to-[#06b6d4]",
      earned: false,
    },
    {
      name: "Collaborator",
      icon: Star,
      color: "from-[#0ea5e9] to-[#a855f7]",
      earned: false,
    },
    {
      name: "Expert",
      icon: Award,
      color: "from-[#a855f7] to-[#0ea5e9]",
      earned: false,
    },
    {
      name: "Problem Solver",
      icon: Target,
      color: "from-[#06b6d4] to-[#10b981]",
      earned: false,
    },
    {
      name: "Mentor",
      icon: Trophy,
      color: "from-[#f59e0b] to-[#0ea5e9]",
      earned: false,
    },
    {
      name: "Community Hero",
      icon: Flame,
      color: "from-[#0ea5e9] to-[#06b6d4]",
      earned: false,
    },
  ];

  if (loading) {
    return (
      <div className="p-5">
        <div className="max-w-6xl mx-auto rounded-xl border border-gray-200 bg-white p-8 shadow-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
          Loading profile...
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-5">
        <div className="max-w-6xl mx-auto rounded-xl border border-red-200 bg-red-50 p-8 text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300">
          {error || "User profile not found"}
        </div>
      </div>
    );
  }

  const avatar = profile.profile_picture
    ? getImageUrl(profile.profile_picture)
    : "/default-profile.png";

  const reputation = profile.total_points || 0;

  const level =
    profile.level ||
    (reputation >= 500
      ? "Expert"
      : reputation >= 100
      ? "Contributor"
      : "Beginner");

  const earnedBadges = profile.badges || [];

  const displayedBadges = defaultBadges.map((badge) => {
    const earnedBadge = earnedBadges.find(
      (item) => item.badge_name === badge.name
    );

    return {
      ...badge,
      earned: Boolean(earnedBadge),
    };
  });

  const solvedPosts = userPosts.filter(
    (post) => post.status === "solved"
  ).length;

  const openPosts = userPosts.filter((post) => post.status === "open").length;

  const verifiedSolutions = userSolutions.filter(
    (solution) => Number(solution.is_verified) === 1
  );

  const totalSolutionLikes = userSolutions.reduce(
    (sum, solution) => sum + Number(solution.like_count || 0),
    0
  );

  const profileSkills = Array.isArray(profile.skills)
  ? profile.skills
      .map((skill) =>
        typeof skill === "string" ? skill : skill.skill_name
      )
      .filter(Boolean)
  : [];

  return (
    <div className="p-5 lg:p-7 text-slate-900 dark:text-slate-100">
      <div className="mx-auto max-w-6xl space-y-5">
        <div className="space-y-3 mb-5">
          <AppAlert type="success" message={message} onClose={() => setMessage("")} />
          <AppAlert type="error" message={error} onClose={() => setError("")} />
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="h-24 border-b border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800" />

          <div className="px-5 pb-6 sm:px-6">
            <div className="-mt-12 mb-5 flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="relative">
                <img
                  src={avatar}
                  alt={profile.full_name}
                  className="h-24 w-24 rounded-xl border-4 border-white bg-white object-cover shadow-md dark:border-slate-900 dark:bg-slate-800"
                />

                {currentUser?.user_id === profile.user_id && (
                  <label className="absolute bottom-1 right-1 cursor-pointer rounded-md bg-blue-600 px-2 py-1 text-[11px] font-medium text-white transition-colors hover:bg-blue-700">
                    {imageUploading ? "Uploading..." : "Change"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="hidden"
                      disabled={imageUploading}
                    />
                  </label>
                )}
              </div>

              <div className="flex-1 sm:pb-1">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h1 className="mb-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                      {profile.full_name}
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      @{profile.email?.split("@")[0] || "researcher"}
                    </p>
                  </div>

                  {currentUser?.user_id === profile.user_id && (
                    <div className="flex items-center gap-3">
                      <Link
                        to="/app/saved-problems"
                        className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <Bookmark className="w-4 h-4" />
                        Saved Problems
                      </Link>

                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                      >
                        {isEditing ? "Cancel" : "Edit Profile"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-4 mb-6">
                <input
                  type="text"
                  name="full_name"
                  value={editForm.full_name}
                  onChange={handleEditChange}
                  placeholder="Full name"
                  className="w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-blue-900/40"
                />

                <textarea
                  name="bio"
                  value={editForm.bio}
                  onChange={handleEditChange}
                  placeholder="Bio"
                  rows={3}
                  className="w-full resize-none rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-blue-900/40"
                />

                <input
                  type="text"
                  name="university_or_organization"
                  value={editForm.university_or_organization}
                  onChange={handleEditChange}
                  placeholder="University / Organization"
                  className="w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-blue-900/40"
                />

                <button
                  onClick={handleUpdateProfile}
                  disabled={editLoading}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            ) : (
              <p className="mb-4 max-w-3xl text-sm leading-6 text-slate-700 dark:text-slate-300">
                {profile.bio || "No bio added yet."}
              </p>
            )}

            <div className="mb-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {profile.university_or_organization ||
                  "Organization not added"}
              </span>

              <span className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                  CollabSolve Profile
                </a>
              </span>

              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {profile.email}
              </span>

              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Joined {formatDate(profile.created_at)}
              </span>
            </div>

            {profileSkills.length > 0 && (
  <div className="flex flex-wrap gap-2 mb-6">
    {profileSkills.map((skill) => (
      <span
        key={skill}
        className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
      >
        {skill}
      </span>
    ))}
  </div>
)}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-center dark:border-slate-800 dark:bg-slate-800/50">
                <div className="mb-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {reputation}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Reputation
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-center dark:border-slate-800 dark:bg-slate-800/50">
                <div className="mb-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {solvedPosts}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Solved
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-center dark:border-slate-800 dark:bg-slate-800/50">
                <div className="mb-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {userPosts.length}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Problems
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-center dark:border-slate-800 dark:bg-slate-800/50">
                <div className="mb-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {userSolutions.length}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Solutions
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-center dark:border-slate-800 dark:bg-slate-800/50">
                <div className="mb-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {verifiedSolutions.length}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Verified
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-center dark:border-slate-800 dark:bg-slate-800/50">
                <div className="mb-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {openPosts}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Open
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-center dark:border-slate-800 dark:bg-slate-800/50">
                <div className="mb-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {level}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Level
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab("activity")}
              className={`min-w-max flex-1 border-b-2 px-5 py-3.5 text-sm font-medium transition-colors ${
                activeTab === "activity"
                  ? "border-blue-600 bg-blue-50/50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-300"
                  : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              Activity
            </button>

            <button
              onClick={() => setActiveTab("problems")}
              className={`min-w-max flex-1 border-b-2 px-5 py-3.5 text-sm font-medium transition-colors ${
                activeTab === "problems"
                  ? "border-blue-600 bg-blue-50/50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-300"
                  : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              Posted Problems
            </button>

            <button
              onClick={() => setActiveTab("solutions")}
              className={`min-w-max flex-1 border-b-2 px-5 py-3.5 text-sm font-medium transition-colors ${
                activeTab === "solutions"
                  ? "border-blue-600 bg-blue-50/50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-300"
                  : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              Submitted Solutions
            </button>

            <button
              onClick={() => setActiveTab("verified")}
              className={`min-w-max flex-1 border-b-2 px-5 py-3.5 text-sm font-medium transition-colors ${
                activeTab === "verified"
                  ? "border-blue-600 bg-blue-50/50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-300"
                  : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              Verified Solutions
            </button>

            <button
              onClick={() => setActiveTab("fields")}
              className={`min-w-max flex-1 border-b-2 px-5 py-3.5 text-sm font-medium transition-colors ${
                activeTab === "fields"
                  ? "border-blue-600 bg-blue-50/50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-300"
                  : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              Fields
            </button>

            <button
              onClick={() => setActiveTab("badges")}
              className={`min-w-max flex-1 border-b-2 px-5 py-3.5 text-sm font-medium transition-colors ${
                activeTab === "badges"
                  ? "border-blue-600 bg-blue-50/50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-300"
                  : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              Badges
            </button>
          </div>

          <div className="p-5">
            {activeTab === "activity" && (
              <div className="space-y-4">
                {userPosts.length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    No recent activity yet.
                  </div>
                )}

                {userPosts.slice(0, 5).map((post) => (
                  <div
                    key={post.post_id}
                    className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-blue-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-800"
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-300">
                      {post.status === "solved" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Target className="h-4 w-4" />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="mb-1 text-gray-900 dark:text-gray-100">
                        Posted "{post.title}"
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>{formatDate(post.created_at)}</span>

                        <span className="flex items-center gap-1 capitalize">
                          <Star className="w-3 h-3" />
                          {post.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "problems" && (
              <div className="space-y-4">
                {userPosts.length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    Posted problems will appear here.
                  </div>
                )}

                {userPosts.map((post) => (
                  <Link
                    key={post.post_id}
                    to={`/app/problem/${post.post_id}`}
                    className="group block rounded-lg border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-800"
                  >
                    <h3 className="mb-2 text-sm font-semibold text-slate-900 transition-colors group-hover:text-blue-700 dark:text-slate-100 dark:group-hover:text-blue-400">
                      {post.title}
                    </h3>

                    <p className="mb-3 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                      {post.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-100 capitalize dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/60">
                        {post.status}
                      </span>

                      {post.field_name && (
                        <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
                          {post.field_name}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {activeTab === "solutions" && (
              <div className="space-y-4">
                {userSolutions.length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    Submitted solutions will appear here.
                  </div>
                )}

                {userSolutions.map((solution) => (
                  <Link
                    key={solution.solution_id}
                    to={`/app/problem/${solution.post_id}`}
                    className="group block rounded-lg border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-800"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="text-gray-900 dark:text-gray-100 mb-1">
                          {solution.post_title || "Original Problem"}
                        </h3>

                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Answered {formatDate(solution.created_at)}
                        </p>
                      </div>

                      {Number(solution.is_verified) === 1 ? (
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">
                          Verified
                        </span>
                      ) : (
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300">
                          Pending
                        </span>
                      )}
                    </div>

                    <p className="mb-3 line-clamp-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
                      {solution.solution_text}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {solution.field_name && (
                        <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
                          {solution.field_name}
                        </span>
                      )}

                      <span className="px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/60">
                        <ThumbsUp className="w-3 h-3" />
                        {solution.like_count || 0} likes
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {activeTab === "verified" && (
              <div className="space-y-4">
                {verifiedSolutions.length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    Verified solutions will appear here.
                  </div>
                )}

                {verifiedSolutions.map((solution) => (
                  <Link
                    key={solution.solution_id}
                    to={`/app/problem/${solution.post_id}`}
                    className="block rounded-lg border-l-4 border-l-emerald-500 border-y border-r border-y-slate-200 border-r-slate-200 bg-white p-4 transition hover:shadow-sm dark:border-y-slate-800 dark:border-r-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-300">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-gray-900 dark:text-gray-100 mb-1">
                          {solution.post_title || "Original Problem"}
                        </h3>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Verified{" "}
                          {formatDate(
                            solution.verified_at || solution.created_at
                          )}
                        </p>

                        <p className="mb-3 line-clamp-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
                          {solution.solution_text}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {solution.field_name && (
                            <span className="px-3 py-1 rounded-full text-xs bg-white text-gray-700 border border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700">
                              {solution.field_name}
                            </span>
                          )}

                          <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700 border border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-900/60">
                            Verified Solution
                          </span>

                          <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {solution.like_count || 0} likes
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {activeTab === "fields" && (
              <div className="space-y-4">
                {userFields.length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    Fields and interests will appear here based on posted
                    problems and submitted solutions.
                  </div>
                )}

                {userFields.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userFields.map((field) => (
                      <div
                        key={field.field_name}
                        className="rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-blue-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-800"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-300">
                            <Tags className="h-4 w-4" />
                          </div>

                          <div>
                            <h3 className="text-slate-900 dark:text-slate-100">
                              {field.field_name}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {field.activity_count} activities
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "badges" && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {displayedBadges.map((badge, i) => (
                  <div
                    key={i}
                    className={`rounded-lg border p-4 text-center transition-colors ${
                      badge.earned
                        ? "border-blue-200 bg-blue-50/40 dark:border-blue-900/60 dark:bg-blue-950/20"
                        : "border-slate-200 bg-slate-50 opacity-50 dark:border-slate-800 dark:bg-slate-800/50"
                    }`}
                  >
                    <div
                      className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${
                        badge.earned
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                          : "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                      }`}
                    >
                      <badge.icon className="h-5 w-5" />
                    </div>

                    <h3 className="mb-1 text-gray-900 dark:text-gray-100">
                      {badge.name}
                    </h3>

                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {badge.earned ? "Earned" : "Locked"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}