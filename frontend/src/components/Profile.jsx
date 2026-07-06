import React, { useState } from "react";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState(user?.bio || "");

  const [image, setImage] = useState(user?.image || "");
  const [message, setMessage] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();

    const updatedUser = {
      ...user,
      username,
      email,
      bio,
      image,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    setMessage("✅ Profile updated successfully 🎉");

    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="container text-white py-5">

      {/* HEADER */}
      <div className="mb-4">
        <h1 className="fw-bold display-6">Your Profile 👤</h1>
        <p className="text-secondary">
          Manage your identity and personal information.
        </p>

        {message && (
          <p className="text-success fw-semibold">{message}</p>
        )}
      </div>

      <div className="row g-4">

        {/* LEFT PROFILE CARD */}
        <div className="col-md-5">
          <div className="premium-card text-center">

            {/* PROFILE IMAGE */}
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                overflow: "hidden",
                margin: "0 auto 15px",
                border: "2px solid #1db954",
              }}
            >
              {image ? (
                <img
                  src={image}
                  alt="profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "#1db954",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "32px",
                    fontWeight: "bold",
                  }}
                >
                  {username?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
            </div>

            <h4>{username}</h4>
            <p className="text-secondary small">{email}</p>

            <span className="badge bg-success">Active User</span>

            <div className="mt-3 text-secondary small">
              Member since: 2026
            </div>

          </div>
        </div>

        {/* RIGHT EDIT CARD */}
        <div className="col-md-7">
          <div className="premium-card">

            <h4 className="card-title">✏️ Edit Profile</h4>

            <form onSubmit={handleSave}>

              {/* IMAGE UPLOAD */}
              <div className="mt-3">
                <label className="form-label text-secondary small">
                  Profile Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  className="premium-input"
                  onChange={handleImageUpload}
                />
              </div>

              <div className="mt-3">
                <label className="form-label text-secondary small">
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
                <label className="form-label text-secondary small">
                  Email
                </label>
                <input
                  type="email"
                  className="premium-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mt-3">
                <label className="form-label text-secondary small">
                  Bio
                </label>

                <textarea
                  className="premium-input"
                  rows="3"
                  placeholder="Write something about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <button type="submit" className="premium-btn mt-4">
                Save Profile
              </button>

            </form>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;