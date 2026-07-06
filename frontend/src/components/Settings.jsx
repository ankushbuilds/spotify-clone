import React, { useState } from "react";

const Settings = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [darkMode, setDarkMode] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const [highQuality, setHighQuality] = useState(true);

  return (
    <div className="container text-white py-5">

      {/* HEADER */}
      <div className="mb-4">
        <h1 className="fw-bold">Settings ⚙️</h1>
        <p className="text-secondary">
          Manage your account preferences and app behavior.
        </p>
      </div>

      <div className="row g-3">

        {/* USER INFO */}
        <div className="col-md-6">
          <div className="about-card">
            <h4>👤 Profile</h4>

            <p><strong>Username:</strong> {user?.username}</p>
            <p><strong>Email:</strong> {user?.email}</p>

            <button className="btn btn-sm btn-outline-success mt-2">
              Edit Profile
            </button>
          </div>
        </div>

        {/* APP SETTINGS */}
        <div className="col-md-6">
          <div className="about-card">
            <h4>🎛️ App Preferences</h4>

            <div className="form-check form-switch mt-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <label className="form-check-label">
                Dark Mode
              </label>
            </div>

            <div className="form-check form-switch mt-2">
              <input
                className="form-check-input"
                type="checkbox"
                checked={autoplay}
                onChange={() => setAutoplay(!autoplay)}
              />
              <label className="form-check-label">
                Autoplay Songs
              </label>
            </div>

            <div className="form-check form-switch mt-2">
              <input
                className="form-check-input"
                type="checkbox"
                checked={highQuality}
                onChange={() => setHighQuality(!highQuality)}
              />
              <label className="form-check-label">
                High Quality Audio
              </label>
            </div>
          </div>
        </div>

        {/* ACCOUNT ACTIONS */}
        <div className="col-md-12">
          <div className="about-card">
            <h4>🔒 Account Actions</h4>

            <button className="btn btn-outline-warning me-2">
              Change Password
            </button>

            <button className="btn btn-outline-danger">
              Delete Account
            </button>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <div className="text-center mt-5 pt-3 border-top border-secondary">
        <h6 className="text-secondary">
          Spotify Clone Settings Panel 🎵
        </h6>
      </div>

    </div>
  );
};

export default Settings;