import React, { useState } from "react";

const Settings = () => {
  const [settings, setSettings] = useState({
    darkMode:true,
    autoplay:true,
    highQuality:true,
    crossfade:true,
    normalize:true,
    notifications:true,
    privateSession:false,
    explicit:true,
    wifiDownload:true,
    animation:true
  });

  const toggleSetting = (key) => {
    setSettings({
      ...settings,
      [key]:!settings[key]
    });
  };

  const Toggle = ({title,desc,name}) => (
    <div className="setting-row">
      <div>
        <h6>{title}</h6>
        <p>{desc}</p>
      </div>
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          checked={settings[name]}
          onChange={()=>toggleSetting(name)}
        />
      </div>
    </div>
  );

  return (
    <div className="container text-white py-5">
      <div className="mb-5">
        <h1 className="fw-bold">Settings ⚙️</h1>
        <p className="text-secondary">
          Control your music experience and application preferences.
        </p>
      </div>

      <div className="row g-4">

        <div className="col-lg-6">
          <div className="settings-card">
            <h4>🎧 Playback</h4>

            <Toggle
              title="Autoplay"
              desc="Play recommended songs automatically"
              name="autoplay"
            />

            <Toggle
              title="High Quality Audio"
              desc="Use better streaming quality"
              name="highQuality"
            />

            <Toggle
              title="Crossfade"
              desc="Smooth transition between tracks"
              name="crossfade"
            />

            <Toggle
              title="Normalize Volume"
              desc="Keep all songs at similar volume"
              name="normalize"
            />
          </div>
        </div>

        <div className="col-lg-6">
          <div className="settings-card">
            <h4>🎨 Experience</h4>

            <Toggle
              title="Dark Mode"
              desc="Premium dark interface"
              name="darkMode"
            />

            <Toggle
              title="Notifications"
              desc="Artist and playlist updates"
              name="notifications"
            />

            <Toggle
              title="Private Session"
              desc="Hide your listening activity"
              name="privateSession"
            />

            <Toggle
              title="Show Explicit Content"
              desc="Allow explicit songs"
              name="explicit"
            />
          </div>
        </div>

        <div className="col-lg-6">
          <div className="settings-card">
            <h4>📥 Downloads</h4>

            <Toggle
              title="Download Using WiFi"
              desc="Prevent mobile data usage"
              name="wifiDownload"
            />

            <div className="quality-box">
              <label>Download Quality</label>
              <select className="form-select custom-select">
                <option>Very High</option>
                <option>High</option>
                <option>Normal</option>
              </select>
            </div>

            <div className="storage mt-4">
              <div className="d-flex justify-content-between">
                <span>Storage</span>
                <span>3.2 GB / 5 GB</span>
              </div>

              <div className="progress mt-2">
                <div
                  className="progress-bar bg-success"
                  style={{width:"65%"}}
                />
              </div>

              <button className="btn btn-outline-danger w-100 mt-3">
                Clear Cache
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="settings-card">
            <h4>🌍 App Preferences</h4>

            <div className="quality-box">
              <label>Language</label>
              <select className="form-select custom-select">
                <option>English</option>
                <option>Hindi</option>
              </select>
            </div>

            <div className="quality-box mt-3">
              <label>Theme</label>
              <select className="form-select custom-select">
                <option>Spotify Dark</option>
                <option>AMOLED Black</option>
              </select>
            </div>

            <Toggle
              title="Animated Background"
              desc="Enable smooth visual effects"
              name="animation"
            />
          </div>
        </div>

      </div>

      <div className="text-center mt-5 border-top border-secondary pt-3">
        <small className="text-secondary">
          Spotify Clone Premium Settings 🎵
        </small>
      </div>
    </div>
  );
};

export default Settings;