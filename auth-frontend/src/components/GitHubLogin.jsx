import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const GithubLogin = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  // Handle redirect back from GitHub
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const name = params.get("name");
    const email = params.get("email");
    const image = params.get("image");
    const isVerified = params.get("isVerified") === "true";
    const role = params.get("role") || "user"; // Default to 'user'

    if (token && email) {
      const user = {
        name: decodeURIComponent(name || ""),
        email: decodeURIComponent(email || ""),
        image: decodeURIComponent(image || ""),
        role: decodeURIComponent(role || "user"),
        isVerified: true,
      };

      localStorage.setItem("user-info", JSON.stringify({ token, user }));
      setAuth({ token, user });

      // Clean the URL
      window.history.replaceState(null, "", window.location.pathname);
      console.log("GitHub login successful:", { token, user });

      const storedUser = JSON.parse(localStorage.getItem("user-info"));

      let path = "/home"; // default for regular user
      if (!isVerified) {
        path = "/verify-otp";
      } else if (role === "admin") {
        path = "/admin/dashboard";
      } else if (role === "moderator") {
        path = "/moderator/dashboard";
      }

      setTimeout(() => {
        navigate(path); // or "/dashboard"
      }, 100);
    }
  }, []);

  const handleGithubLogin = () => {
    // Redirect to GitHub auth via backend (same tab)
    window.location.replace("http://localhost:5000/api/auth/github");
  };

  return (
    <button
      type="button"
      onClick={handleGithubLogin}
      className="flex items-center justify-center gap-3 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg shadow hover:shadow-md hover:bg-gray-100 transition-all duration-200 active:scale-95 w-full"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          d="M12 0C5.37 0 0 5.373 0 12c0 5.304 3.438 9.8 8.205 11.387.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.612-4.042-1.612-.546-1.386-1.333-1.755-1.333-1.755-1.09-.745.082-.729.082-.729 1.205.084 1.838 1.237 1.838 1.237 1.07 1.832 2.807 1.303 3.495.996.108-.775.418-1.303.76-1.603-2.665-.305-5.466-1.335-5.466-5.932 0-1.31.468-2.38 1.236-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.803 5.624-5.475 5.922.43.37.814 1.102.814 2.222 0 1.606-.014 2.898-.014 3.293 0 .319.218.694.825.576C20.565 21.796 24 17.302 24 12c0-6.627-5.373-12-12-12z"
          clipRule="evenodd"
        />
      </svg>
      <span className="text-sm font-medium">Sign in with GitHub</span>
    </button>
  );
};

export default GithubLogin;
