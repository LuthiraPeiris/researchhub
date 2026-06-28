import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { applyTheme } from "../utils/theme";
import { AppAlert } from "../components/AppAlert";
import {
  Lock,
  Bell,
  Palette,
  Trash2,
  Save,
  AlertTriangle,
  Tags,
} from "lucide-react";

import {
  changePassword,
  getNotificationPreferences,
  updateNotificationPreferences,
  getUserSettings,
  updateUserSettings,
  deleteAccount,
} from "../services/settingsService";

import { getCurrentUser, logoutUser } from "../services/authService";
import { getUserProfile, updateUserSkills } from "../services/userService";

const AVAILABLE_SKILLS = [
  "Java",
  "React",
  "IoT",
  "Machine Learning",
  "Cybersecurity",
  "Research Writing",
  "Database",
];

export function SettingsPage() {
  const navigate = useNavigate();

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationPrefs, setNotificationPrefs] = useState({
    comment_notifications: true,
    solution_notifications: true,
    badge_notifications: true,
    verification_notifications: true,
    system_notifications: true,
  });

  const [theme, setTheme] = useState("light");
  const [deletePassword, setDeletePassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const currentUser = getCurrentUser();
  const [selectedSkills, setSelectedSkills] = useState([]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [notificationData, userSettingsData, profileData] = await Promise.all([
          getNotificationPreferences(),
          getUserSettings(),
          currentUser?.user_id
            ? getUserProfile(currentUser.user_id)
            : Promise.resolve({ skills: [] }),
        ]);

        setNotificationPrefs({
          comment_notifications: Boolean(notificationData.comment_notifications),
          solution_notifications: Boolean(notificationData.solution_notifications),
          badge_notifications: Boolean(notificationData.badge_notifications),
          verification_notifications: Boolean(
            notificationData.verification_notifications
          ),
          system_notifications: Boolean(notificationData.system_notifications),
        });

        const savedTheme = userSettingsData.theme || "light";
        setTheme(savedTheme);
        applyTheme(savedTheme);
        setSelectedSkills(profileData.skills || []);
      } catch (err) {
        setError(err.message || "Failed to load settings");
      }
    };

    fetchSettings();
  }, []);

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await changePassword(passwordData);

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setMessage("Password changed successfully");
    } catch (err) {
      setError(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationToggle = (name) => {
    setNotificationPrefs((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleSaveNotifications = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      await updateNotificationPreferences(notificationPrefs);

      setMessage("Notification preferences updated successfully");
    } catch (err) {
      setError(err.message || "Failed to update notification preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTheme = async () => {
  try {
    setLoading(true);
    setError("");
    setMessage("");

    applyTheme(theme);

    await updateUserSettings({ theme });

    setMessage("Theme preference saved successfully");
  } catch (err) {
    setError(err.message || "Failed to save theme preference");
  } finally {
    setLoading(false);
  }
};

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await deleteAccount(deletePassword);

      logoutUser();
      navigate("/register");
    } catch (err) {
      setError(err.message || "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  const handleSkillToggle = (skill) => {
  setSelectedSkills((prev) =>
    prev.includes(skill)
      ? prev.filter((item) => item !== skill)
      : [...prev, skill]
  );
};

const handleSaveSkills = async () => {
  try {
    setLoading(true);
    setError("");
    setMessage("");

    await updateUserSkills(currentUser.user_id, selectedSkills);

    setMessage("Skills updated successfully");
  } catch (err) {
    setError(err.message || "Failed to update skills");
  } finally {
    setLoading(false);
  }
};

  const notificationItems = [
    {
      key: "comment_notifications",
      title: "Comment notifications",
      desc: "Get notified when someone comments on your posts.",
    },
    {
      key: "solution_notifications",
      title: "Solution notifications",
      desc: "Get notified when someone submits a solution.",
    },
    {
      key: "badge_notifications",
      title: "Badge notifications",
      desc: "Get notified when you earn badges.",
    },
    {
      key: "verification_notifications",
      title: "Verification notifications",
      desc: "Get notified when your solution is verified.",
    },
    {
      key: "system_notifications",
      title: "System notifications",
      desc: "Receive important platform updates.",
    },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 text-gray-900 dark:text-gray-100">
      <div>
        <h1 className="text-3xl text-gray-900 dark:text-gray-100 mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account security, notifications, and preferences.
        </p>
      </div>

      <AppAlert type="error" message={error} onClose={() => setError("")} />
      <AppAlert type="success" message={message} onClose={() => setMessage("")} />

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100 dark:bg-blue-950/40 dark:border-blue-900/60">
            <Lock className="w-5 h-5 text-[#0ea5e9]" />
          </div>

          <div>
            <h2 className="text-xl text-gray-900 dark:text-gray-100">Change Password</h2>
            <p className="text-sm text-gray-600">
              Update your account password securely.
            </p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <input
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            placeholder="Current password"
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#0ea5e9] focus:ring-2 focus:ring-blue-100 focus:outline-none text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-900/40"
          />

          <input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            placeholder="New password"
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#0ea5e9] focus:ring-2 focus:ring-blue-100 focus:outline-none text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-900/40"
          />

          <input
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            placeholder="Confirm new password"
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#0ea5e9] focus:ring-2 focus:ring-blue-100 focus:outline-none text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-900/40"
          />

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 rounded-lg bg-gradient-to-r from-[#0ea5e9] to-[#a855f7] text-white hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? "Saving..." : "Change Password"}
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
  <div className="flex items-center gap-3 mb-5">
    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100 dark:bg-blue-950/40 dark:border-blue-900/60">
      <Tags className="w-5 h-5 text-[#0ea5e9]" />
    </div>

    <div>
      <h2 className="text-xl text-gray-900 dark:text-gray-100">Skill Tags</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Choose the skills and fields you want to show on your profile.
      </p>
    </div>
  </div>

  <div className="flex flex-wrap gap-3">
    {AVAILABLE_SKILLS.map((skill) => {
      const isSelected = selectedSkills.includes(skill);

      return (
        <button
          key={skill}
          type="button"
          onClick={() => handleSkillToggle(skill)}
          className={`px-4 py-2 rounded-full text-sm border transition-all ${
            isSelected
              ? "bg-blue-50 text-[#0ea5e9] border-blue-200 dark:bg-blue-950/40 dark:text-[#38bdf8] dark:border-blue-900/60"
              : "bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
          }`}
        >
          {skill}
        </button>
      );
    })}
  </div>

  <button
    type="button"
    onClick={handleSaveSkills}
    disabled={loading}
    className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-[#0ea5e9] to-[#a855f7] text-white hover:opacity-90 transition-opacity disabled:opacity-60"
  >
    <Save className="w-4 h-4" />
    Save Skills
  </button>
</div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100 dark:bg-blue-950/40 dark:border-blue-900/60">
            <Bell className="w-5 h-5 text-[#0ea5e9]" />
          </div>

          <div>
            <h2 className="text-xl text-gray-900 dark:text-gray-100">Notification Preferences</h2>
            <p className="text-sm text-gray-600">
              Choose which notifications you want to receive.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {notificationItems.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/70"
            >
              <div>
                <h3 className="text-sm text-gray-900 dark:text-gray-100">{item.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>

              <button
                type="button"
                onClick={() => handleNotificationToggle(item.key)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  notificationPrefs[item.key] ? "bg-[#0ea5e9]" : "bg-gray-300 dark:bg-gray-700"
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                    notificationPrefs[item.key]
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleSaveNotifications}
          disabled={loading}
          className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-[#0ea5e9] to-[#a855f7] text-white hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          Save Notifications
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100 dark:bg-blue-950/40 dark:border-blue-900/60">
            <Palette className="w-5 h-5 text-[#0ea5e9]" />
          </div>

          <div>
            <h2 className="text-xl text-gray-900 dark:text-gray-100">Theme Options</h2>
            <p className="text-sm text-gray-600">
              Save your preferred theme option.
            </p>
          </div>
        </div>

        <select
  value={theme}
  onChange={(e) => {
    setTheme(e.target.value);
    applyTheme(e.target.value);
  }}
  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#0ea5e9] focus:ring-2 focus:ring-blue-100 focus:outline-none text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-900/40"
>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>

        <button
          type="button"
          onClick={handleSaveTheme}
          disabled={loading}
          className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-[#0ea5e9] to-[#a855f7] text-white hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          Save Theme
        </button>
      </div>

      <div className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm dark:border-red-900/70 dark:bg-red-950/30">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-red-200 dark:bg-red-950/60 dark:border-red-800">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>

          <div>
            <h2 className="text-xl text-red-700 dark:text-red-300">Delete Account</h2>
            <p className="text-sm text-red-600 dark:text-red-400">
              Permanently delete your account and all related data.
            </p>
          </div>
        </div>

        <input
          type="password"
          value={deletePassword}
          onChange={(e) => setDeletePassword(e.target.value)}
          placeholder="Enter password to confirm"
          className="w-full px-4 py-3 rounded-lg bg-white border border-red-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 focus:outline-none text-gray-900 dark:bg-gray-900 dark:border-red-900/70 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-red-900/40"
        />

        <button
          type="button"
          onClick={handleDeleteAccount}
          disabled={loading || !deletePassword}
          className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-60"
        >
          <Trash2 className="w-4 h-4" />
          Delete Account
        </button>
      </div>
    </div>
  );
}