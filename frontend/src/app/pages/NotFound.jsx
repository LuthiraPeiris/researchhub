import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="text-8xl mb-4 bg-gradient-to-r from-[#0ea5e9] to-[#a855f7] bg-clip-text text-transparent">
            404
          </div>
          <h1 className="text-3xl mb-2 text-gray-900">Page Not Found</h1>
          <p className="text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#0ea5e9] to-[#a855f7] text-white hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/30"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <Link
            to="/app"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Search className="w-5 h-5" />
            Browse Problems
          </Link>
        </div>
      </div>
    </div>
  );
}
