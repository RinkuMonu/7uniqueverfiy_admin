"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/components/service/axiosInstance";
import {
  FaUser,
  FaEnvelope,
  FaUserShield,
  FaCheckCircle,
} from "react-icons/fa";
import "./updateuser.css";
import { toast } from "react-toastify";

export default function EditUserForm() {
  const params = useParams();
  const router = useRouter();

  const id = typeof params.id === "string" ? params.id : params.id?.[0] || "";

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    isVerified: Boolean,
  });

  const [loading, setLoading] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(`/admin/users`, { params: { userId: id } });
        const user = res.data.users[0];

        setForm({
          name: user.name || "",
          email: user.email || "",
          role: user.role || "user",
          isVerified: user?.documents?.isVerified || false,
        });
      } catch (error) {
        console.error("Failed to fetch user:", error);
        toast.error("Failed to load user details.")
      }
    };

    if (id) fetchUser();
  }, [id]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axiosInstance.post("/admin/update-user", {
        userId: id,
        name: form.name,
        email: form.email,
        role: form.role,
        isVerified: form.isVerified,
      });
      toast.success(res.data.message)
      router.push("/all-user-list");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card custom-card" onSubmit={handleSubmit}>
  <div className="card-header">
        <h1 className="card-title flex ">
        <FaUserShield className="icon mt-1 me-1" /> Edit User
      </h1>
  </div>

      <div className="form-grid p-4">
        <div className="input-wrapper">
          <FaUser className="input-icon" />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="form-input"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-wrapper">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="form-input"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-wrapper">
          <FaUserShield className="input-icon" />
          <select
            name="role"
            className="form-input"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="checkbox-wrapper">
          <input
            type="checkbox"
            name="isVerified"
            id="isVerified"
            checked={form.isVerified}
            onChange={handleChange}
          />
          <label htmlFor="isVerified " className="ms-2">
             Is Verified
          </label>
        </div>
      </div>

        <div className="flex justify-center">
        <button className="brandorange-text brandorange-bg-light p-2 mb-2 rounded" type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update User"}
      </button>
      </div>
    </form>
  );
}
