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
      <div className="p-6">
        <div className="max-w-6xl mx-auto rounded-xl border border-gray-200 bg-white p-8 shadow-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
          Loading profile...
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-6">
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

  return (
    <div className="p-6 text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-3 mb-5">
          <AppAlert type="success" message={message} onClose={() => setMessage("")} />
          <AppAlert type="error" message={error} onClose={() => setError("")} />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="h-32 bg-gradient-to-r from-[#0ea5e9] to-[#a855f7]" />

          <div className="px-8 pb-8">
            <div className="flex items-end gap-6 -mt-16 mb-6">
              <div className="relative">
                <img
                  src={avatar}
                  alt={profile.full_name}
                  className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl bg-white object-cover dark:border-gray-900 dark:bg-gray-800"
                />

                {currentUser?.user_id === profile.user_id && (
                  <label className="absolute bottom-2 right-2 px-3 py-1 rounded-lg bg-[#0ea5e9] text-white text-xs cursor-pointer hover:bg-blue-600 transition">
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

              <div className="flex-1 mt-16">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl mb-1 text-gray-900 dark:text-gray-100">
                      {profile.full_name}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                      @{profile.email?.split("@")[0] || "researcher"}
                    </p>
                  </div>

                  {currentUser?.user_id === profile.user_id && (
                    <div className="flex items-center gap-3">
                      <Link
                        to="/app/saved-problems"
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-lg border border-blue-200 bg-blue-50 text-[#0ea5e9] hover:bg-blue-100 transition-colors dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-[#38bdf8] dark:hover:bg-blue-950/60"
                      >
                        <Bookmark className="w-4 h-4" />
                        Saved Problems
                      </Link>

                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#0ea5e9] to-[#a855f7] text-white hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/30"
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
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#0ea5e9] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-900/40"
                />

                <textarea
                  name="bio"
                  value={editForm.bio}
                  onChange={handleEditChange}
                  placeholder="Bio"
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#0ea5e9] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all text-gray-900 resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-900/40"
                />

                <input
                  type="text"
                  name="university_or_organization"
                  value={editForm.university_or_organization}
                  onChange={handleEditChange}
                  placeholder="University / Organization"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#0ea5e9] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-900/40"
                />

                <button
                  onClick={handleUpdateProfile}
                  disabled={editLoading}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#0ea5e9] to-[#a855f7] text-white hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/30 disabled:opacity-60"
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            ) : (
              <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">
                {profile.bio || "No bio added yet."}
              </p>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {profile.university_or_organization ||
                  "Organization not added"}
              </span>

              <span className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                <a href="#" className="text-[#0ea5e9] hover:underline dark:text-[#38bdf8]">
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

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-800 dark:bg-gray-800/70">
                <div className="text-2xl mb-1 bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] bg-clip-text text-transparent">
                  {reputation}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Reputation
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-800 dark:bg-gray-800/70">
                <div className="text-2xl mb-1 bg-gradient-to-r from-[#06b6d4] to-[#a855f7] bg-clip-text text-transparent">
                  {solvedPosts}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Solved
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-800 dark:bg-gray-800/70">
                <div className="text-2xl mb-1 bg-gradient-to-r from-[#a855f7] to-[#0ea5e9] bg-clip-text text-transparent">
                  {userPosts.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Problems
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-800 dark:bg-gray-800/70">
                <div className="text-2xl mb-1 bg-gradient-to-r from-[#10b981] to-[#06b6d4] bg-clip-text text-transparent">
                  {userSolutions.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Solutions
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-800 dark:bg-gray-800/70">
                <div className="text-2xl mb-1 bg-gradient-to-r from-[#f59e0b] to-[#a855f7] bg-clip-text text-transparent">
                  {verifiedSolutions.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Verified
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-800 dark:bg-gray-800/70">
                <div className="text-2xl mb-1 bg-gradient-to-r from-[#10b981] to-[#06b6d4] bg-clip-text text-transparent">
                  {openPosts}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Open
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-800 dark:bg-gray-800/70">
                <div className="text-2xl mb-1 bg-gradient-to-r from-[#0ea5e9] to-[#a855f7] bg-clip-text text-transparent">
                  {level}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Level
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex border-b border-gray-200 overflow-x-auto dark:border-gray-800">
            <button
              onClick={() => setActiveTab("activity")}
              className={`flex-1 min-w-max px-6 py-4 transition-all ${
                activeTab === "activity"
                  ? "bg-gradient-to-r from-[#0ea5e9]/10 to-[#a855f7]/10 border-b-2 border-[#0ea5e9] text-[#0ea5e9] dark:from-[#0ea5e9]/20 dark:to-[#a855f7]/20 dark:text-[#38bdf8]"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              Activity
            </button>

            <button
              onClick={() => setActiveTab("problems")}
              className={`flex-1 min-w-max px-6 py-4 transition-all ${
                activeTab === "problems"
                  ? "bg-gradient-to-r from-[#0ea5e9]/10 to-[#a855f7]/10 border-b-2 border-[#0ea5e9] text-[#0ea5e9] dark:from-[#0ea5e9]/20 dark:to-[#a855f7]/20 dark:text-[#38bdf8]"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              Posted Problems
            </button>

            <button
              onClick={() => setActiveTab("solutions")}
              className={`flex-1 min-w-max px-6 py-4 transition-all ${
                activeTab === "solutions"
                  ? "bg-gradient-to-r from-[#0ea5e9]/10 to-[#a855f7]/10 border-b-2 border-[#0ea5e9] text-[#0ea5e9] dark:from-[#0ea5e9]/20 dark:to-[#a855f7]/20 dark:text-[#38bdf8]"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              Submitted Solutions
            </button>

            <button
              onClick={() => setActiveTab("verified")}
              className={`flex-1 min-w-max px-6 py-4 transition-all ${
                activeTab === "verified"
                  ? "bg-gradient-to-r from-[#0ea5e9]/10 to-[#a855f7]/10 border-b-2 border-[#0ea5e9] text-[#0ea5e9] dark:from-[#0ea5e9]/20 dark:to-[#a855f7]/20 dark:text-[#38bdf8]"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              Verified Solutions
            </button>

            <button
              onClick={() => setActiveTab("fields")}
              className={`flex-1 min-w-max px-6 py-4 transition-all ${
                activeTab === "fields"
                  ? "bg-gradient-to-r from-[#0ea5e9]/10 to-[#a855f7]/10 border-b-2 border-[#0ea5e9] text-[#0ea5e9] dark:from-[#0ea5e9]/20 dark:to-[#a855f7]/20 dark:text-[#38bdf8]"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              Fields
            </button>

            <button
              onClick={() => setActiveTab("badges")}
              className={`flex-1 min-w-max px-6 py-4 transition-all ${
                activeTab === "badges"
                  ? "bg-gradient-to-r from-[#0ea5e9]/10 to-[#a855f7]/10 border-b-2 border-[#0ea5e9] text-[#0ea5e9] dark:from-[#0ea5e9]/20 dark:to-[#a855f7]/20 dark:text-[#38bdf8]"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              Badges
            </button>
          </div>

          <div className="p-6">
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
                    className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 bg-gray-50 hover:border-blue-300 hover:shadow-md transition-all dark:border-gray-800 dark:bg-gray-800/70 dark:hover:border-blue-700"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0ea5e9]/10 to-[#a855f7]/10 flex items-center justify-center flex-shrink-0 border border-blue-200 dark:from-[#0ea5e9]/20 dark:to-[#a855f7]/20 dark:border-blue-900/60">
                      {post.status === "solved" ? (
                        <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
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
                    className="block p-4 rounded-lg border border-gray-200 bg-gray-50 hover:border-blue-300 hover:shadow-md transition-all dark:border-gray-800 dark:bg-gray-800/70 dark:hover:border-blue-700"
                  >
                    <h3 className="text-gray-900 dark:text-gray-100 mb-2">
                      {post.title}
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
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
                    className="block p-4 rounded-lg border border-gray-200 bg-gray-50 hover:border-blue-300 hover:shadow-md transition-all dark:border-gray-800 dark:bg-gray-800/70 dark:hover:border-blue-700"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="text-gray-900 dark:text-gray-100 mb-1">
                          {solution.post_title || "Original Problem"}
                        </h3>

                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Answered {formatDate(solution.created_at)}
                        </p>
                      </div>

                      {Number(solution.is_verified) === 1 ? (
                        <span className="px-3 py-1 rounded-full text-xs bg-green-50 text-green-700 border border-green-100 dark:bg-green-950/40 dark:text-green-300 dark:border-green-900/60">
                          Verified
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs bg-yellow-50 text-yellow-700 border border-yellow-100 dark:bg-yellow-950/40 dark:text-yellow-300 dark:border-yellow-900/60">
                          Pending
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-3">
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
                    className="block p-4 rounded-lg border border-green-200 bg-green-50/60 hover:border-green-300 hover:shadow-md transition-all dark:border-green-900/70 dark:bg-green-950/30 dark:hover:border-green-700"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-green-100 border border-green-200 flex items-center justify-center dark:bg-green-950/40 dark:border-green-900/60">
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

                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-3">
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

                          <span className="px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/60">
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
                        className="rounded-xl border border-gray-200 bg-gray-50 p-5 hover:border-blue-300 hover:shadow-md transition-all dark:border-gray-800 dark:bg-gray-800/70 dark:hover:border-blue-700"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0ea5e9]/10 to-[#a855f7]/10 flex items-center justify-center border border-blue-200 dark:from-[#0ea5e9]/20 dark:to-[#a855f7]/20 dark:border-blue-900/60">
                            <Tags className="w-5 h-5 text-[#0ea5e9] dark:text-[#38bdf8]" />
                          </div>

                          <div>
                            <h3 className="text-gray-900 dark:text-gray-100">
                              {field.field_name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
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
                    className={`rounded-xl border p-6 text-center transition-all ${
                      badge.earned
                        ? "border-blue-200 bg-gradient-to-br from-white to-blue-50 hover:scale-105 shadow-sm hover:shadow-lg dark:border-blue-900/60 dark:from-gray-900 dark:to-blue-950/30"
                        : "border-gray-200 bg-gray-50 opacity-50 dark:border-gray-800 dark:bg-gray-800/70"
                    }`}
                  >
                    <div
                      className={`w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br ${badge.color} flex items-center justify-center shadow-lg`}
                    >
                      <badge.icon className="w-8 h-8 text-white" />
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