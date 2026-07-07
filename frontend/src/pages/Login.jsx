import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/axiosClient";

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await apiClient.post("/auth/login", {
        username: formData.identifier,
        email: formData.identifier,
        password: formData.password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setMessage("Login successful");

      // optional parent callback
      onLoginSuccess?.();

      // ✅ NAVIGATE TO HOME
      navigate("/");

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <div className="logo">🎵</div>

        <h1>Spotify Clone</h1>
        <p>Log in to continue listening</p>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Email or Username</label>
            <input
              type="text"
              name="identifier"
              placeholder="Enter email or username"
              value={formData.identifier}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>

        </form>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

      </div>
    </div>
  );
};

export default Login;