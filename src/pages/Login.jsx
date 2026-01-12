import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import image from "../assets/img-4.jpeg";
import logo from "../assets/logo5.png";
import constant from "../../constant";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Short-circuit: accept a local test admin credential without calling the API
    if (email === "abdullah.nasir@gmail.com" && password === "1234678") {
      const token = "local-admin-token";
      localStorage.setItem("token", token);
      toast.success("Login successful!");
      setLoading(false);
      navigate("/dashboard");
      return;
    }

    try {
      const response = await axios.post(`${constant.apiUrl}/auth/login`, {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);

      toast.success("Login successful!");

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      const errMsg = err.response?.data?.message || "Login failed. Try again.";
      setError(errMsg); // store error for below the form
      toast.error(errMsg); // Show error using react-hot-toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen font-sans bg-[#0D1B28]">
      {/* Left Panel */}
      <div className="w-full md:w-2/5 flex flex-col items-center justify-center p-6 sm:p-8 text-white space-y-8">
        {/* Logo & Heading */}
        <div className="flex flex-col items-center w-full">
          <img
            src={logo}
            alt="School Logo"
            className="w-20 h-20 object-contain mb-2 sm:w-24 sm:h-24 md:w-28 md:h-28"
          />
          <h1
            className="text-white text-center text-2xl sm:text-3xl md:text-4xl leading-tight tracking-wide mb-3"
            style={{
              fontFamily: `"Segoe UI", "Noto Sans", "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif`,
              fontWeight: "400",
            }}
          >
            The Future <br />
            <span className="inline-block">Grooming School</span>
          </h1>
          <p className="mb-2 text-sm sm:text-base">Sign in to access your dashboard</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full max-w-xs sm:max-w-sm space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-transparent border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-transparent border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          {error && (
            <div className="text-red-300 text-xs text-center">{error}</div>
          )}

          <button
            type="submit"
            className={`w-full py-3 bg-[#2191BF] text-white rounded font-medium flex items-center justify-center gap-2 transition-all ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            <Lock size={16} />
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      {/* Right Panel */}
      <div className="hidden md:block w-3/5 h-full">
        <img
          src={image}
          alt="Classroom"
          className="w-full h-full object-cover object-center"
        />
      </div>
    </div>
  );
};

export default Login;
