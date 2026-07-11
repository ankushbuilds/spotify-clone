import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [savedBio, setSavedBio] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (savedUser) {
      setUser(savedUser);
      setUsername(savedUser.username || "");
      setEmail(savedUser.email || "");
      setSavedBio(savedUser.bio || "");
      setImage(savedUser.image || "");
    }
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();

    const updatedUser = {
      ...user,
      username,
      email,
      bio,
      image
    };

    setUser(updatedUser);

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    setSavedBio(bio);
    setBio("");

    setMessage("✅ Profile updated successfully");

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  const becomeArtist = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axiosClient.put(
        "/user/become-artist",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      setUser(response.data.user);

      setMessage("🎤 You are now an Artist!");

      setTimeout(() => {
        setMessage("");
      }, 2000);

    } catch (error) {
      console.log(
        error.response?.data ||
        error.message
      );

      setMessage(
        error.response?.data?.message ||
        "Failed to become artist"
      );
    }
  };

  if (!user) {
    return (
      <div className="text-white p-4">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="container text-white py-5">

      <div className="mb-4">
        <h1 className="fw-bold display-6">
          Your Profile 👤
        </h1>

        <p className="text-secondary">
          Manage your identity and personal information.
        </p>

        {message && (
          <p className="text-success fw-semibold">
            {message}
          </p>
        )}
      </div>

      <div className="row g-4">

        <div className="col-md-5">
          <div className="premium-card text-center">

            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                overflow: "hidden",
                margin: "0 auto 15px",
                border: "2px solid #1db954"
              }}
            >
              {image ? (
                <img
                  src={image}
                  alt="profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
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
                    fontWeight: "bold"
                  }}
                >
                  {username?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
            </div>

            <h4>{username}</h4>

            <p className="text-secondary small">
              {email}
            </p>

            {savedBio && (
              <p className="text-secondary small mt-3 px-3">
                "{savedBio}"
              </p>
            )}

            <span className="badge bg-success">
              {
                user.role === "artist"
                  ? "🎤 Artist"
                  : "👤 User"
              }
            </span>

            <div className="mt-3 text-secondary small">
              Member since: 2026
            </div>

            {user.role !== "artist" && (
              <button
                className="premium-btn mt-3"
                onClick={becomeArtist}
              >
                Become an Artist 🎤
              </button>
            )}

          </div>
        </div>

        <div className="col-md-7">
          <div className="premium-card">

            <h4>
              ✏️ Edit Profile
            </h4>

            <form onSubmit={handleSave}>

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

              <button
                type="submit"
                className="premium-btn mt-4"
              >
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