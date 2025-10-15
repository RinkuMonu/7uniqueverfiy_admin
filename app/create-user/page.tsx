// "use client";

// import { useState } from "react";
// import axiosInstance from "@/components/service/axiosInstance";
// import { FaUser, FaEnvelope, FaLock, FaUserShield } from "react-icons/fa";
// import "./createuser.css";
// import { toast } from "react-toastify";
// import { useRouter } from "next/navigation";

// export default function CreateUserForm() {
//   const router = useRouter()
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "user",
//   });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e: any) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await axiosInstance.post("/admin/create-user", form);
//       setForm({ name: "", email: "", password: "", role: "user" });
//       toast.success(res.data.message);
//       router.push('/all-user-list')
//     } catch (err: any) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form className="card custom-card " onSubmit={handleSubmit}>
//       <div className="card-header">
//         <h1 className="card-title flex align-middle "><FaUserShield className="icon mt-1 me-1" /> Create New User</h1>
//       </div>

//       <div className="form-grid p-4">
//         <div className="input-wrapper">
//           <FaUser className="input-icon" />
//           <input
//             type="text"
//             name="name"
//             placeholder="Full Name"
//             value={form.name}
//             onChange={(e) => {
//               const value = e.target.value;
//               const regex = /^[a-zA-Z\s]*$/;
//               if (regex.test(value)) {
//                 handleChange(e);
//               }
//             }}
//             className="form-input"
//             required
//           />
//         </div>

//         <div className="input-wrapper">
//           <FaEnvelope className="input-icon" />
//           <input
//             type="email"
//             name="email"
//             placeholder="Email Address"
//             value={form.email}
//             onChange={handleChange}
//             className="form-input"
//             required
//           />
//         </div>

//         <div className="input-wrapper">
//           <FaLock className="input-icon" />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={form.password}
//             onChange={handleChange}
//             className="form-input"
//             required
//           />
//         </div>

//         <div className="input-wrapper">
//           <FaUserShield className="input-icon" />
//           <select
//             name="role"
//             value={form.role}
//             onChange={(e) => setForm({ ...form, role: e.target.value })}
//             className="form-input"
//             required
//           >
//             <option value="user">User</option>
//             <option value="admin">Admin</option>
//           </select>
//         </div>
//       </div>
//       <div className="flex px-4" style={{ "justifyContent": "end" }}>
//         <button className="brandorange-text brandorange-bg-light p-2 mb-2 rounded" type="submit" disabled={loading}>
//           {loading ? "Creating..." : "Create User"}
//         </button>
//       </div>
//     </form>
//   );
// }



"use client";

import { useState } from "react";
import axiosInstance from "@/components/service/axiosInstance";
import { FaUser, FaEnvelope, FaLock, FaUserShield, FaCheckCircle } from "react-icons/fa";
import "./createuser.css";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function CreateUserForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    isVerified: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post("/admin/create-user", form);
      setForm({ name: "", email: "", password: "", role: "user", isVerified: false });
      toast.success(res.data.message);
      router.push('/all-user-list')
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error creating user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card custom-card " onSubmit={handleSubmit}>
      <div className="card-header">
        <h1 className="card-title flex align-middle "><FaUserShield className="icon mt-1 me-1" /> Create New User</h1>
      </div>

      <div className="form-grid p-4">
        <div className="input-wrapper">
          <FaUser className="input-icon" />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => {
              const value = e.target.value;
              const regex = /^[a-zA-Z\s]*$/;
              if (regex.test(value)) {
                handleChange(e);
              }
            }}
            className="form-input"
            required
          />
        </div>

        <div className="input-wrapper">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="input-wrapper">
          <FaLock className="input-icon" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="input-wrapper">
          <FaUserShield className="input-icon" />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="form-input"
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Verification Checkbox - Same as Update Form */}
        {/* <div className="checkbox-wrapper">
          <input
            type="checkbox"
            name="isVerified"
            id="isVerified"
            checked={form.isVerified}
            onChange={handleChange}
          />
          <label htmlFor="isVerified" className="ms-2 flex items-center gap-2">
            <FaCheckCircle className="text-green-500" />
            Verify User (Enable Live Mode)
          </label>
        </div> */}

        {/* Verification Checkbox - Same as Update Form */}
        <div
          className="checkbox-wrapper"
          style={{ display: "flex", alignItems: "center" }}
        >
          <input
            type="checkbox"
            name="isVerified"
            id="isVerified"
            checked={form.isVerified}
            onChange={handleChange}
            style={{
              transform: "scale(1.5)",
              marginRight: "10px",
              marginLeft: "6px",
              cursor: "pointer"
            }}
          />
          <label
            htmlFor="isVerified"
            style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
          >
            {/* <FaCheckCircle style={{ color: "green" }} /> */}
            Verify User
          </label>
        </div>

      </div>
      <div className="flex px-4" style={{ "justifyContent": "end" }}>
        <button className="brandorange-text brandorange-bg-light p-2 mb-2 rounded" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create User"}
        </button>
      </div>
    </form>
  );
}