import React, { useState } from "react";
import axios from "axios";

const Account = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(storedUser);
  const [username, setUsername] = useState(storedUser?.username || "");
  const [email, setEmail] = useState(storedUser?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `http://localhost:3000/api/user/update/${user.id}`,
        {
          username,
          email
        }
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      setUser(res.data.user);
      setMessage("Profile updated successfully");
    } catch (error) {
      console.log(error);
      setMessage("Failed to update profile");
    }
  };

  const handlePasswordUpdate = async () => {
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      console.log(user);
      await axios.put(
        `http://localhost:3000/api/user/update-password/${user._id}`,
        {
          password
        }
      );

      setPassword("");
      setConfirmPassword("");
      setMessage("Password updated successfully");
    } catch (error) {
      console.log(error);
      setMessage("Failed to update password");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:3000/api/user/delete/${user.id}`
      );

      localStorage.removeItem("user");
      window.location.href = "/login";

    } catch (error) {
      console.log(error);
    }
  };

 return (
  <div className="container py-5 text-white">
    <div className="account-header mb-5">
      <div className="profile-avatar">
        {username?.charAt(0).toUpperCase()}
      </div>
      <div>
        <h1 className="fw-bold mb-1">{username}</h1>
        <p className="text-secondary mb-0">
          Manage your account and security settings
        </p>
      </div>
    </div>

    {message && (
      <div className="alert premium-alert">
        {message}
      </div>
    )}

    <div className="row g-4">
      <div className="col-lg-7">
        <div className="premium-card account-card">
          <div className="section-title">
            <span>👤</span>
            <div>
              <h4>Profile</h4>
              <p>Update your personal information</p>
            </div>
          </div>

          <form onSubmit={handleSave}>
            <div className="input-group-premium">
              <label>Username</label>
              <input
                type="text"
                className="premium-input"
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
              />
            </div>

            <div className="input-group-premium">
              <label>Email Address</label>
              <input
                type="email"
                className="premium-input"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
            </div>

            <button className="premium-btn w-100 mt-4">
              Save Profile
            </button>
          </form>
        </div>
      </div>


      <div className="col-lg-5">
        <div className="premium-card account-card">
          <div className="section-title">
            <span>🔒</span>
            <div>
              <h4>Password</h4>
              <p>Keep your account secure</p>
            </div>
          </div>


          <div className="input-group-premium">
            <label>New Password</label>
            <input
              type={showPassword ? "text":"password"}
              className="premium-input"
              placeholder="Enter password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
          </div>


          <div className="input-group-premium">
            <label>Confirm Password</label>
            <input
              type={showPassword ? "text":"password"}
              className="premium-input"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
            />
          </div>


          <div className="form-check mt-3">
            <input
              className="form-check-input"
              type="checkbox"
              checked={showPassword}
              onChange={()=>setShowPassword(!showPassword)}
            />

            <label className="form-check-label text-secondary ms-2">
              Show password
            </label>
          </div>


          <button
            className="premium-btn-warning w-100 mt-4"
            onClick={handlePasswordUpdate}
          >
            Update Password
          </button>
        </div>


        <div className="premium-card danger-card mt-4">
          <div className="section-title">
            <span>⚠️</span>
            <div>
              <h4 className="text-danger">
                Danger Zone
              </h4>
              <p>
                Permanently delete your account
              </p>
            </div>
          </div>


          <button
            className="premium-btn-danger w-100"
            onClick={handleDelete}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  </div>
);
};


export default Account;