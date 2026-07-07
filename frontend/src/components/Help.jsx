import React from "react";

const Help = () => {
  return (
    <div className="container text-white py-5">

      {/* HEADER */}
      <div className="mb-4">
        <h1 className="fw-bold">Help & Support ❓</h1>
        <p className="text-secondary">
          Find answers to common questions about using the app.
        </p>
      </div>

      <div className="row g-3">

        {/* LOGIN ISSUES */}
        <div className="col-md-6">
          <div className="about-card">
            <h4>🔐 Login Issues</h4>
            <p>
              If you are unable to login, make sure:
            </p>
            <ul>
              <li>✔ Correct email/username is entered</li>
              <li>✔ Password is correct</li>
              <li>✔ Server is running properly</li>
              <li>✔ Token is not expired</li>
            </ul>
          </div>
        </div>

        {/* MUSIC NOT PLAYING */}
        <div className="col-md-6">
          <div className="about-card">
            <h4>🎵 Music Not Playing</h4>
            <ul>
              <li>✔ Check internet connection</li>
              <li>✔ Ensure audio file URL is valid</li>
              <li>✔ Click play button again</li>
              <li>✔ Check browser audio permissions</li>
            </ul>
          </div>
        </div>

        {/* SEARCH ISSUES */}
        <div className="col-md-6">
          <div className="about-card">
            <h4>🔎 Search Not Working</h4>
            <ul>
              <li>✔ Check API endpoint</li>
              <li>✔ Ensure backend is running</li>
              <li>✔ Verify database has songs</li>
              <li>✔ Try refreshing the page</li>
            </ul>
          </div>
        </div>

        {/* PLAYER ISSUES */}
        <div className="col-md-6">
          <div className="about-card">
            <h4>🎧 Player Issues</h4>
            <ul>
              <li>✔ Only one song plays at a time</li>
              <li>✔ Pause before switching songs</li>
              <li>✔ Check audioRef connection</li>
              <li>✔ Reload page if stuck</li>
            </ul>
          </div>
        </div>

        {/* GENERAL HELP */}
        <div className="col-md-12">
          <div className="about-card">
            <h4>💡 General Help</h4>
            <p>
              This Spotify clone is built for learning full-stack development.
              Some features may require backend server running properly.
            </p>
            <p>
              If something is not working, check console (F12) for errors.
            </p>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <div className="text-center mt-5 pt-3 border-top border-secondary">
        <h6 className="text-secondary">
          Need more help? Contact support at{" "}
          <span className="text-success fw-bold">
            ankushthakur5981@gmail.com
          </span>
        </h6>
      </div>

    </div>
  );
};

export default Help;