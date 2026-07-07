import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/home");
    }
  }, []);

  return (
    <div className="landing-container">

      <div className="landing-content">
        <div className="logo">🎵</div>

        <h1>Music for everyone.</h1>

        <p>
          Millions of songs. Listen freely. Discover your vibe instantly.
        </p>

        <div className="btn-group">
          <button
            className="primary-btn"
            onClick={() => navigate("/register")}
          >
            Sign up free
          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate("/login")}
          >
            Log in
          </button>
        </div>

      </div>

    </div>
  );
};

export default Landing;