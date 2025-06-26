"use client";

import { useSelector } from "react-redux";
import { useState } from "react";

export default function CredentialsPage() {
  const { admin } = useSelector((state) => state.admin);
  const [isProd, setIsProd] = useState(false);

  const environment = isProd ? admin?.production : admin?.credentials;

  const credentials = [
    {
      id: 1,
      data: environment,
      type: "API Key",
      status: environment?.isActive ? "Active" : "Inactive",
      created: admin?.createdAt?.slice(0, 10),
      lastUsed: admin?.updatedAt?.slice(0, 10),
    },
  ];

  const [openSections, setOpenSections] = useState({
    ipWhitelist: false,
    callbackUrl: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div style={{ padding: "20px",  margin: "0 auto" }}>
      <div style={{ display: "grid", gap: "24px" }}>
        {/* API Credentials Section */}
        <div className="card custom-card">
          <div
          className="card-header lg:flex justify-between"
          >
            <h2 className="card-title">API Credentials</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                style={{ padding: "6px 12px", background: !isProd ? "#e5e7eb" : "#fff", borderRadius: "4px" }}
                onClick={() => setIsProd(false)}
              >
                UAT
              </button>
              <label style={{ position: "relative", display: "inline-block", width: "40px", height: "20px" }}>
                <input
                  type="checkbox"
                  checked={isProd}
                  onChange={() => setIsProd(!isProd)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span
                  style={{
                    position: "absolute",
                    cursor: "pointer",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: isProd ? "#4f46e5" : "#ccc",
                    transition: ".4s",
                    borderRadius: "20px",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      height: "16px",
                      width: "16px",
                      left: isProd ? "20px" : "2px",
                      bottom: "2px",
                      backgroundColor: "white",
                      borderRadius: "50%",
                      transition: ".4s",
                    }}
                  />
                </span>
              </label>
              <button
                style={{ padding: "6px 12px", background: isProd ? "#e5e7eb" : "#fff", borderRadius: "4px" }}
                onClick={() => setIsProd(true)}
              >
                Production
              </button>
            </div>
          </div>

          <div className="p-4">
            {credentials.map((credential) => (
              <div
                key={credential.id}
                style={{ marginBottom: "16px" }}
              >
                <h3 style={{ margin: 0, fontSize: "14px", color: "#111827" }}>
                  Auth Key :- {credential.data?.jwtSecret}
                </h3>
                <p style={{ fontSize: "14px", color: "#6b7280" }}>Client Key :- {credential.data?.authKey}</p>
                <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "8px" }}>
                  <span style={{ marginRight: "16px" }}>Created: {credential.created}</span>
                  <span>Last used: {credential.lastUsed}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Settings Section */}
        <div className="card custom-card">
          <div className="card-header">
            <h2 className="card-title">Security Settings</h2>
          </div>

          {/* IP Whitelist Section */}
          <div
            style={{   cursor: "pointer" }}
            onClick={() => toggleSection("ipWhitelist")}
            className="p-4"
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h1 style={{ fontSize: "14px", fontWeight: 500, color: "#374151" }}>IP Whitelist Update</h1>
              <span
                style={{
                  transform: openSections.ipWhitelist ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              >
                ▼
              </span>
            </div>

            {openSections.ipWhitelist && (
              <div style={{ marginTop: "16px" }}>
                <label style={{ fontSize: "14px", color: "#374151" }}>IP Addresses:</label>
                {[1].map((_, index) => (
                  <div
                    key={index}
                    style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}
                  >
                    <input
                      type="text"
                      placeholder="Enter IP address"
                      style={{
                        width: "50%",
                        padding: "8px",
                        borderRadius: "6px",
                        border: "1px solid #d1d5db",
                        outline: "none",
                        backgroundColor: "",
                      }}
                      onMouseOver={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
                      onMouseOut={(e) => (e.target.style.backgroundColor = "#fff")}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button
                      style={{
                        padding: "4px 8px 4px 6px", // Adjusted padding for icon
                        backgroundColor: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                      }}
                      onClick={(e) => e.stopPropagation()}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#d32f2f")} // Darker red on hover
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "red")}
                    >
                      {/* Trash can icon */}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ color: "white" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                      Delete
                    </button>
                  </div>
                ))}

              </div>
            )}
          </div>

          {/* Callback URL Section */}
          <div
            style={{  cursor: "pointer" }}
            onClick={() => toggleSection("callbackUrl")}
            className="p-4"
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h1 style={{ fontSize: "14px", fontWeight: 500, color: "#374151" }}>Callback URL</h1>
              <span
                style={{
                  transform: openSections.callbackUrl ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              >
                ▼
              </span>
            </div>

            {openSections.callbackUrl && (
              <div style={{ marginTop: "16px" }}>
                <div style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
                  <input
                    type="url"
                    placeholder="Enter callback URL"
                    style={{
                      flex: 1,
                      padding: "8px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px"
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <input
                    type="url"
                    placeholder="Add new callback URL"
                    style={{
                      flex: 1,
                      padding: "8px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px"
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                <div style={{ textAlign: "center", marginTop: "16px" }}>
                  <button
                    style={{ padding: "8px 16px", borderRadius: "4px" }}
                    onClick={(e) => e.stopPropagation()} 
                    className="brandorange-bg-light brandorange-text">
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}