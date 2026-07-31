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
    <div className="mx-auto max-w-5xl space-y-5 p-5 lg:p-7 text-slate-900 dark:text-slate-100">
      <div>
        <h1 className="mb-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage your account security, notifications, and preferences.
        </p>
      </div>

      <AppAlert type="error" message={error} onClose={() => setError("")} />
      <AppAlert type="success" message={message} onClose={() => setMessage("")} />

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-300">
            <Lock className="h-4 w-4" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Change Password</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
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
            className="w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-blue-900/40"
          />

          <input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            placeholder="New password"
            className="w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-blue-900/40"
          />

          <input
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            placeholder="Confirm new password"
            className="w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-blue-900/40"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Saving..." : "Change Password"}
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
  <div className="mb-5 flex items-center gap-3">
    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-300">
      <Tags className="h-4 w-4" />
    </div>

    <div>
      <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Skill Tags</h2>
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
          className={`rounded-md border px-3 py-2 text-sm transition-colors ${
            isSelected
              ? "border-blue-200 bg-blue-50 font-medium text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-300"
              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
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
    className="mt-5 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
  >
    <Save className="h-4 w-4" />
    Save Skills
  </button>
</div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-300">
            <Bell className="h-4 w-4" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Notification Preferences</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Choose which notifications you want to receive.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {notificationItems.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40"
            >
              <div>
                <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>

              <button
                type="button"
                onClick={() => handleNotificationToggle(item.key)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  notificationPrefs[item.key] ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    notificationPrefs[item.key]
                      ? "translate-x-5"
                      : "translate-x-0"
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
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          Save Notifications
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-300">
            <Palette className="h-4 w-4" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Theme Options</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
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
  className="w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-blue-900/40"
>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>

        <button
          type="button"
          onClick={handleSaveTheme}
          disabled={loading}
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          Save Theme
        </button>
      </div>

      <div className="rounded-xl border border-red-200 bg-white p-5 shadow-sm dark:border-red-900/70 dark:bg-slate-900">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-300">
            <AlertTriangle className="h-4 w-4" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-red-700 dark:text-red-300">Delete Account</h2>
            <p className="text-sm text-red-500 dark:text-red-400">
              Permanently delete your account and all related data.
            </p>
          </div>
        </div>

        <input
          type="password"
          value={deletePassword}
          onChange={(e) => setDeletePassword(e.target.value)}
          placeholder="Enter password to confirm"
          className="w-full rounded-md border border-red-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:border-red-900/70 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-red-900/40"
        />

        <button
          type="button"
          onClick={handleDeleteAccount}
          disabled={loading || !deletePassword}
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Trash2 className="h-4 w-4" />
          Delete Account
        </button>
      </div>
    </div>
  );
}