import React, { useState } from "react";

const Account = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = (e) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    const updatedUser = {
      ...user,
      username,
      email,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    setMessage("✅ Account updated successfully 🎉");

    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="container text-white py-5">

      {/* HEADER */}
      <div className="mb-5">
        <h1 className="fw-bold display-6">Account Settings 👤</h1>
        <p className="text-secondary">
          Manage your profile, security and personal preferences.
        </p>

        {message && (
          <p className="mt-2 text-success fw-semibold">{message}</p>
        )}
      </div>

      <div className="row g-4">

        {/* PROFILE */}
        <div className="col-md-6">
          <div className="premium-card">

            <h4 className="card-title">🧑 Profile Information</h4>

            <form onSubmit={handleSave}>

              <div className="mt-4">
                <label className="form-label small text-secondary">
                  Username
                </label>
                <input
                  type="text"
                  className="premium-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="mt-3">
                <label className="form-label small text-secondary">
                  Email
                </label>
                <input
                  type="email"
                  className="premium-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button type="submit" className="premium-btn mt-4">
                Save Changes
              </button>

            </form>

          </div>
        </div>

        {/* SECURITY */}
        <div className="col-md-6">
          <div className="premium-card">

            <h4 className="card-title">🔒 Security</h4>

            {/* PASSWORD */}
            <div className="mt-4">
              <label className="form-label small text-secondary">
                New Password
              </label>

              <input
                type={showPassword ? "text" : "password"}
                className="premium-input"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="mt-3">
              <label className="form-label small text-secondary">
                Confirm Password
              </label>

              <input
                type={showPassword ? "text" : "password"}
                className="premium-input"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {/* SHOW PASSWORD TOGGLE */}
            <div className="form-check mt-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label className="form-check-label text-secondary">
                Show Password
              </label>
            </div>

            <button className="premium-btn-warning mt-3">
              Update Password
            </button>

            <hr className="my-4 border-secondary opacity-25" />

            {/* EXTRA INFO BLOCK */}
            <div className="mb-3">
              <h5 className="text-danger">Danger Zone</h5>
              <p className="text-secondary small">
                Deleting your account will permanently remove all data.
              </p>

              <button className="premium-btn-danger">
                Delete Account
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Account;