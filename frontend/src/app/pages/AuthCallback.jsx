import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API_BASE_URL from "../services/api";

export function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Authenticating with Google...");
  const processedCodeRef = useRef(null);
  const redirectTimerRef = useRef(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state"); // Expecting "google"

    if (!code || state !== "google") {
      setStatus("Authentication code or invalid state configuration.");
      redirectTimerRef.current = setTimeout(
        () => navigate("/login", { replace: true }),
        3000
      );
      return;
    }

    // Google authorization codes are single-use. React Strict Mode may run
    // this effect more than once in development, so exchange each code once.
    if (processedCodeRef.current === code) {
      return () => {
        if (redirectTimerRef.current) {
          clearTimeout(redirectTimerRef.current);
        }
      };
    }

    processedCodeRef.current = code;

    const exchangeCode = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Google OAuth exchange failed");
        }

        // Store JWT token and user info in LocalStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setStatus("Google Login successful! Redirecting...");

        // Redirect to main application dashboard
        redirectTimerRef.current = setTimeout(
          () => navigate("/app", { replace: true }),
          1500
        );
      } catch (err) {
        console.error(err);
        setStatus(`Authentication failed: ${err.message}`);
        redirectTimerRef.current = setTimeout(
          () => navigate("/login", { replace: true }),
          4000
        );
      }
    };

    exchangeCode();

    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-800">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center max-w-sm w-full text-center">
        {/* Loading Spinner */}
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Google Login</h2>
        <p className="text-slate-600">{status}</p>
      </div>
    </div>
  );
}
