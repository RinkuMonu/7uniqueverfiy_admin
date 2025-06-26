"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/components/service/axiosInstance";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { HiOutlineDotsVertical } from "react-icons/hi";
import Link from "next/link";

import {
  FaSms,
  FaUserLock,
  FaMoneyBillWave,
  FaEnvelope,
} from "react-icons/fa";
import { FiUsers, FiCheckCircle, FiKey, FiEdit2 } from "react-icons/fi";

const roles = ["All", "User", "Admin"];



const verification = ["All", "Verified", "Unverified"];
const services = ["Email API", "SMS Gateway", "User Auth", "Billing"];
const serviceIcons = {

  "Email API": <FaEnvelope className="mr-2 text-blue-500" />,
  "SMS Gateway": <FaSms className="mr-2 text-green-500" />,
  "User Auth": <FaUserLock className="mr-2 text-purple-500" />,
  "Billing": <FaMoneyBillWave className="mr-2 text-red-500" />
};

export default function AllUserListPage() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const [filters, setFilters] = useState({
    email: "",
    role: "All",
    isVerified: "All",
    fromDate: "",
    toDate: "",
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const query = {
        ...filters,
        role: filters.role === "All" ? "" : filters.role.toLowerCase(),
        isVerified: filters.isVerified === "All" ? "" :
          filters.isVerified === "Verified" ? "true" : "false",
        page,
        limit: 10,
      };

      const res = await axiosInstance.get("/admin/users", { params: query });


      setUsers(res.data.users);
      setTotalPages(Math.ceil(res.data.total / 10));
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters, page]);

  const handleAction = (type: string, userId: string) => {
    if (type === "verifyKYC") {
      toast.success(`KYC verified for user ${userId}`);
    } else if (type === "productionKey") {
      toast.success(`Production key generated`);
    }
  };

  const router = useRouter();

  return (

    <div style={{ margin: ' 0px 7px' }}>
      <div className=" mb-6 card custom-card  overflow-auto ">
        {/* Header */}
        <div className="md:flex card-header justify-between items-center mb-6">



          <h1 style={{  color: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} className="card-title">
            <FiUsers style={{ color: '#000000' }} />

            User Management
          </h1>
          <div className="flex justify-center mt-2 md:mt-0">
            <Link
              href="/create-user"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                padding: '8px 16px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.3s ease',
              }}
              className=" brandorange-bg-light brandorange-text "
            >
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',

              }}>
                + Create User
              </span>
            </Link>
          </div>


        </div>
        {/* Filters Section */}
        <div className="space-y-6 mb-6 p-4">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 min-w-0 space-y-1">
              {/* <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Email
              </label> */}

              {/* Filters */}
              <div className=" space-y-6">
                <div className="md:flex gap-4 flex-wrap">
                  <div className="flex-1 min-w-[200px] space-y-1">
                    <label className="text-sm font-medium text-gray-700">Email</label>

                    <Input
                      value={filters.email}
                      onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                    />
                  </div>
                  <div className="flex-1 min-w-[200px] space-y-1">
                    <label className="text-sm font-medium text-gray-700">Role</label>
                    <Select
                      value={filters.role}
                      onValueChange={(value) => setFilters({ ...filters, role: value })}
                    >
                      <SelectTrigger><SelectValue placeholder="Select Role" /></SelectTrigger>
                      <SelectContent>
                        {roles.map((r: string) => (
                          <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 min-w-[200px] space-y-1">
                    <label className="text-sm font-medium text-gray-700">Verification</label>
                    <Select
                      value={filters.isVerified}
                      onValueChange={(value) => setFilters({ ...filters, isVerified: value })}
                    >
                      <SelectTrigger><SelectValue placeholder="Select Verification" /></SelectTrigger>
                      <SelectContent>
                        {verification.map((v: string) => (
                          <SelectItem key={v} value={v}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 min-w-[200px] space-y-1">
                    <label className="text-sm font-medium text-gray-700">From Date</label>
                    <Input
                      type="date"
                      value={filters.fromDate}
                      onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                    />
                  </div>
                  <div className="flex-1 min-w-[200px] space-y-1">
                    <label className="text-sm font-medium text-gray-700">To Date</label>
                    <Input
                      type="date"
                      value={filters.toDate}
                      onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>

            </div>


          </div>


        </div>
      </div>
      <div className="card custom-card">
        <div className="card-header justify-content-between">
          <div className="card-title"> User Table </div>
        </div>
        <div className="card-body">
          <div className="table-responsive ">
            <table className="table text-nowrap w-full">
              <thead className="brandorange-bg-light"><tr className="text-left">
                <th className="col">User Name</th>
                <th className="col">Verified</th>
                <th className="col">Email</th>
                <th className="col">User ID</th>
                <th className="col">Actions</th>
              </tr> </thead>

              <tbody className="">
                {users.map((user: any, idx: number) => (
                  <tr key={user._id} className="">
                    <td className="">{user.name}</td>
                    <td className="">
                      <span className={`rounded-full ${user.documents.isVerified ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
                        {user.documents.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </td>
                    <td className="">{user.email}</td>
                    <td className="">{user._id.slice(-6)}</td>
                    <td className="">
                      {/* <button
                      onClick={() => handleAction("verifyKYC", user._id)}
                      className="p-2 hover:bg-gray-100 rounded text-green-600"
                      title="Verify KYC"
                    >
                      <FiCheckCircle />
                    </button> */}
                      {/* <button
                      onClick={() => handleAction("productionKey", user._id)}
                      className="p-2 hover:bg-gray-100 rounded text-blue-600"
                      title="Generate Key"
                    >
                      <FiKey />
                    </button> */}
                      <Link
                        href={`/updatealluser/${user._id}`}
                        className="brandorange-bg-light brandorange-text px-2 py-1 rounded text-xs font-medium inline-flex items-center gap-1"
                        title="Update"
                      >
                        <FiEdit2 />
                      </Link>
                      {/* <div className="relative">
                      <button
                        onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <HiOutlineDotsVertical />
                      </button>
                      {openIndex === idx && (
                        <div className="absolute right-0 mt-2 bg-white border shadow-lg rounded z-10 w-48">
                          <div className="text-xs px-4 py-2 text-gray-500">Assign Service</div>
                          {services.map((s: string) => (
                            <button
                              key={s}
                              onClick={() => toast.success(`${s} assigned`)}
                              className="px-4 py-2 w-full text-left hover:bg-gray-50 text-sm flex items-center gap-2"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div> */}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
            <div className="flex justify-between items-center mt-4 p-2">
            <button
              className="border border-gray-300 rounded px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <span className="text-sm text-slate-600">
              Page {page} of {totalPages}
            </span>
            <button
              className="border border-gray-300 rounded px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
          </div> </div>
          </div>


       
      </div>
      );
}