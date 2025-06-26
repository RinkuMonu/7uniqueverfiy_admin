
"use client";

import { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiCheck,
  FiX,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiChevronDown,
  FiChevronUp,
  FiSearch,
} from "react-icons/fi";
import { GrContact } from "react-icons/gr";
import styles from "./contact.module.css";
import "./contant.css";
import styles from "./contact.module.css";

export default function ContactAdminPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    message: "",
    status: "unread",
  });

  const [submissions, setSubmissions] = useState([]);

  const [expandedMessage, setExpandedMessage] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "descending",
  });

  // Load submissions from localStorage on component mount
  useEffect(() => {
    const savedSubmissions = localStorage.getItem("contactSubmissions");
    if (savedSubmissions) {
      setSubmissions(JSON.parse(savedSubmissions));
    }
  }, []);

  // Save submissions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("contactSubmissions", JSON.stringify(submissions));
  }, [submissions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSubmission = {
      ...formData,
      id: Date.now(),
      date: new Date().toISOString(),
    };
    setSubmissions((prev) => [newSubmission, ...prev]);
    setFormData({
      name: "",
      email: "",
      contact: "",
      message: "",
      status: "unread",
    });
    setIsFormVisible(false);
  };

  const toggleStatus = (id) => {
    setSubmissions((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "read" ? "unread" : "read" }
          : item
      )
    );
  };

  const deleteSubmission = (id) => {
    setSubmissions((prev) => prev.filter((item) => item.id !== id));
    if (expandedMessage === id) {
      setExpandedMessage(null);
    }
  };

  const toggleMessageExpansion = (id) => {
    setExpandedMessage(expandedMessage === id ? null : id);
    // Mark as read when expanded
    if (expandedMessage !== id) {
      setSubmissions((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "read" } : item
        )
      );
    }
  };

  const filteredSubmissions = submissions
    .filter((submission) => {
      const matchesSearch = Object.values(submission).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesFilter =
        activeFilter === "all" || submission.status === activeFilter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <FiChevronUp className="sort-icon" />
    ) : (
      <FiChevronDown className="sort-icon" />
    );
  };

  return (
    <div className="contact-admin-container">
      <div className="controls flex">
        {/* <h2 className="page-title flex gap-2 ">

          <GrContact />Contact</h2> */}


        {/* <div className="filter-buttons" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className={activeFilter === "all" ? "active" : ""}
            onClick={() => setActiveFilter("all")}
          >
            Seen Message
          </button>
        </div> */}

      </div>

      {isFormVisible && (
        <div className="  card custom-card mb-8">
          <div className="card-header">
          <h3 className="card-title font-semibold text-gray-800  flex" > <GrContact style={{ marginRight: '10px' }} /> Send New Message</h3>

          </div>
          <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center hover:bg-[#f9c4ad] brandorange-bg-light brandorange-text px-3 py-2 text-xs font-medium cursor-pointer rounded"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="submissions-container  my-2">
        <div className="submissions-header">
          <h3>
            Messages ({filteredSubmissions.length})
            <span className="total-count"> / {submissions.length} total</span>
          </h3>
        </div>

        {filteredSubmissions.length === 0 ? (
          <div className="empty-state">
            <p>No messages found</p>
          </div>
        ) : (
          <div className="submissions-table">
            <div className="table-header">
              <span onClick={() => requestSort("name")}>
                Name {getSortIcon("name")}
              </span>
              <span onClick={() => requestSort("email")}>
                Email {getSortIcon("email")}
              </span>
              <span onClick={() => requestSort("date")}>
                Date {getSortIcon("date")}
              </span>
              <span>Preview</span>
              <span onClick={() => requestSort("status")}>
                Status {getSortIcon("status")}
              </span>
              <span>Actions</span>
            </div>

            {filteredSubmissions.map((submission) => (
              <div
                key={submission.id}
                className={`table-row ${submission.status} ${expandedMessage === submission.id ? "expanded" : ""
                  }`}
              >
                <div className="row-main">
                  <span className="name-cell">{submission.name}</span>
                  <span className="email-cell">
                    <a href={`mailto:${submission.email}`}>
                      {submission.email}
                    </a>
                  </span>
                  <span className="date-cell">
                    {new Date(submission.date).toLocaleString()}
                  </span>
                  <span
                    className="message-preview"
                    onClick={() => toggleMessageExpansion(submission.id)}
                  >
                    {submission.message.length > 30
                      ? `${submission.message.substring(0, 30)}...`
                      : submission.message}
                    {expandedMessage === submission.id ? (
                      <FiChevronUp className="expand-icon" />
                    ) : (
                      <FiChevronDown className="expand-icon" />
                    )}
                  </span>
                  <span className={`status-cell ${submission.status}`}>
                    {submission.status === "read" ? (
                      <FiEye className="status-icon" />
                    ) : (
                      <FiEyeOff className="status-icon" />
                    )}
                    {submission.status}
                  </span>
                  <span className="actions-cell">
                    <button
                      onClick={() => toggleStatus(submission.id)}
                      className="status-btn"
                      title={
                        submission.status === "read"
                          ? "Mark as unread"
                          : "Mark as read"
                      }
                    >
                      {submission.status === "read" ? (
                        <FiEyeOff />
                      ) : (
                        <FiEye />
                      )}
                    </button>
                    <button
                      onClick={() => deleteSubmission(submission.id)}
                      className="delete-btn"
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </span>
                </div>

                {expandedMessage === submission.id && (
                  <div className="row-details">
                    <div className="details-content">
                      <div className="detail-item">
                        <strong>Contact:</strong>{" "}
                        {submission.contact || "Not provided"}
                      </div>
                      <div className="detail-item">
                        <strong>Full Message:</strong>
                        <div className="full-message">{submission.message}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

