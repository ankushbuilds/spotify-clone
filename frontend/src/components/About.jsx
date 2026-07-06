import React from "react";

const About = () => {
  return (
    <div className="container text-white py-5">

      {/* HEADER */}
      <div className="mb-4">
        <h1 className="fw-bold">About This App 🎵</h1>
        <p className="text-secondary">
          A Spotify-inspired music streaming platform built with React.
        </p>
      </div>

      {/* CARDS */}
      <div className="row g-3">

        {/* APP OVERVIEW */}
        <div className="col-md-6">
          <div className="about-card">
            <h4>🎧 App Overview</h4>
            <p>
              This app lets you stream music, like songs, and control playback
              with a global music player. It replicates core Spotify features
              with a modern UI experience.
            </p>
          </div>
        </div>

        {/* FEATURES */}
        <div className="col-md-6">
          <div className="about-card">
            <h4>⚡ Key Features</h4>
            <ul>
              <li>🎵 Play / Pause music instantly</li>
              <li>❤️ Like & save songs</li>
              <li>🔐 Login / Register authentication</li>
              <li>🔎 Search songs & albums</li>
              <li>📚 Library & liked songs</li>
              <li>🎧 Global music player</li>
            </ul>
          </div>
        </div>

        {/* TECH STACK */}
        <div className="col-md-6">
          <div className="about-card">
            <h4>🛠️ Tech Stack</h4>
            <ul>
              <li>React.js (Frontend)</li>
              <li>React Router</li>
              <li>Axios</li>
              <li>Bootstrap / CSS</li>
              <li>Node.js + Express</li>
              <li>MongoDB</li>
            </ul>
          </div>
        </div>

        {/* PURPOSE */}
        <div className="col-md-6">
          <div className="about-card">
            <h4>🎯 Purpose</h4>
            <p>
              Built for learning full-stack development, authentication flow,
              and real-world UI design similar to production apps like Spotify.
            </p>
          </div>
        </div>

        {/* CONTACT US */}
        <div className="col-md-12">
          <div className="about-card">
            <h4>📩 Contact Us</h4>
            <p>
              Have suggestions or feedback? Feel free to reach out!
            </p>

            <ul>
              <li>📧 Email: ankushthakur5981@gmail.com</li>
              <li>📱 Phone: +91 63984 62796</li>
              <li>🌐 GitHub: https://github.com/ankushbuilds</li>
            </ul>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <div className="text-center mt-5 pt-3 border-top border-secondary">
        <h6 className="text-secondary">
          Made with ❤️ by <span className="text-success fw-bold">Ankush Thakur</span>
        </h6>
      </div>

    </div>
  );
};

export default About;