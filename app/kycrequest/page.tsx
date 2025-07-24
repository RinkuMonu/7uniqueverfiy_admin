"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/components/service/axiosInstance";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GoPasskeyFill } from "react-icons/go";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { FiUserCheck, FiSearch, FiUser, FiCalendar, FiArrowUp, FiArrowDown, FiRefreshCw } from "react-icons/fi";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function KycRequestPage() {
  const [viewDoc, setViewDoc] = useState(null);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    role: "all",
    startDate: "",
    endDate: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchKycRequests();
  }, [filters, page]);

  const handleAction = async (isVerified, userId) => {
    try {
      setActionLoading(userId);
      const res = await axiosInstance.post("/admin/verify-kyc", {
        userId,
        isVerified,
      });
      toast.success(`KYC ${isVerified ? 'approved' : 'rejected'} successfully`);
      fetchKycRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to process KYC request");
    } finally {
      setActionLoading(null);
    }
  };

  const fetchKycRequests = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/kyc-request", {
        params: {
          ...filters,
          role: filters.role === "all" ? "" : filters.role,
          page,
          limit,
        },
      });
      setUsers(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error("Failed to load KYC requests.");
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      role: "all",
      startDate: "",
      endDate: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    setPage(1);
  };

  return (
    <div style={{ minHeight: "105vh", padding: "24px", backgroundColor: "#f9fafb" }}>
      {/* Filters Card */}
      <div style={{ marginBottom: "24px" }} className="  card custom-card">
        <div >
          <div style={{ alignItems: "center", justifyContent: "space-between" }} className="md:flex card-header">
            {/* Left Section: Icon + Heading */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <GoPasskeyFill size={20} style={{ color: "#000" }} />
              <h1 style={{ fontSize: "20px", color: "#000" }}>KYC Requests</h1>
            </div>

            {/* Right Section: Sort Order Dropdown */}
            <div style={{ display: "flex", gap: "40px" }} >
              <Select
                id="sortOrder"
                value={filters.sortOrder}
                onValueChange={(value) => setFilters({ ...filters, sortOrder: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest First</SelectItem>
                  <SelectItem value="asc">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>


        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }} className="p-4">
          {/* Search */}
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>Search</label>
            <Input
              placeholder="Name or email"
              value={filters.search}
              onChange={(e) => {
                setPage(1);
                setFilters({ ...filters, search: e.target.value });
              }}
            />
          </div>

          {/* Role */}
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>Role</label>
            <Select
              value={filters.role}
              onValueChange={(value) => {
                setPage(1);
                setFilters({ ...filters, role: value });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Start Date */}
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>Start Date</label>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => {
                setPage(1);
                setFilters({ ...filters, startDate: e.target.value });
              }}
            />
          </div>

          {/* End Date */}
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>End Date</label>
            <Input
              type="date"
              value={filters.endDate}
              min={filters.startDate}
              onChange={(e) => {
                setPage(1);
                setFilters({ ...filters, endDate: e.target.value });
              }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ borderRadius: "8px", overflow: "hidden" }} className="p-3 shadow bg-white">
        {loading ? (
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {[...Array(5)].map((_, i) => <Skeleton key={i} style={{ height: "64px", width: "100%" }} />)}
          </div>
        ) : users?.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div className="flex justify-center">
              <FiUserCheck size={40} style={{ color: "#9ca3af", marginBottom: "16px" }} />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: "600" }}>No KYC requests found</h3>
            <p style={{ color: "#6b7280", marginTop: "4px" }}>Try adjusting your filters or check back later</p>
          </div>
        ) : (

          <div className="card custom-card">
            <div className="card-header justify-content-between">
              <div className="card-title"> KYC Table </div>
            </div>
            <div className="card-body">
              <div className="table-responsive ">
                <table className="table text-nowrap w-full">
                  <thead className="brandorange-bg-light"><tr className="text-left">
                    {["User", "Details", "Status", "Date", "Actions", "Documents"].map(header => (
                      <th key={header}>{header}</th>
                    ))}
                  </tr> </thead>

                  <tbody className="">
                    {users.map(user => (
                      <tr key={user._id} style={{ transition: "background 0.2s", cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"} onMouseLeave={e => e.currentTarget.style.background = "white"}>
                        <td style={{ padding: "16px 24px" }}>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <div style={{ height: "40px", width: "40px", backgroundColor: "#dbeafe", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <FiUser style={{ color: "#2563eb" }} />
                            </div>
                            <div style={{ marginLeft: "16px" }}>
                              <div style={{ fontSize: "14px", fontWeight: "500" }}>{user.name}</div>
                              <div style={{ fontSize: "14px", color: "#6b7280" }}>{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ textTransform: "capitalize" }}>{user.role}</td>
                        <td >
                          <div className={`p-2 rounded text-xs font-semibold
    ${user.kycStatus === 'approved'
                              ? 'bg-green-100 text-green-700'
                              : user.kycStatus === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'}
  `} variant={user.kycStatus === 'approved' ? 'default' : user.kycStatus === 'pending' ? 'secondary' : 'destructive'}>
                            {user.kycStatus || 'pending'}
                          </div>
                        </td>
                        <td style={{ padding: "16px 24px", color: "#6b7280" }}>
                          {new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </td>
                        <td style={{ padding: "16px 24px" }}>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <Button
                              size="sm"
                              className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded"
                              onClick={() => handleAction(true, user._id)}
                              disabled={actionLoading === user._id}
                            >
                              {actionLoading === user._id ? 'Processing...' : 'Approve'}
                            </Button>

                            <Button
                              size="sm"
                              className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded"
                              onClick={() => handleAction(false, user._id)}
                              disabled={actionLoading === user._id}
                            >
                              {actionLoading === user._id ? 'Processing...' : 'Reject'}
                            </Button>

                          </div>
                        </td>
                        <td style={{ padding: "16px 24px" }}>
                          <Button
                            size="sm"
                            className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-3 py-1 rounded"
                            onClick={() => setViewDoc(user?.documents)} // or user.kycDocuments[0] if it's an array
                          >
                            View
                          </Button>
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>

                {viewDoc && (
                  <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center">
                    <div
                      className="bg-white rounded-xl shadow-lg flex flex-col relative"
                      style={{
                        width: '90vw',
                        height: '90vh',
                        maxWidth: '900px',
                        maxHeight: '90vh',
                        overflow: 'hidden',
                      }}
                    >
                      <button
                        onClick={() => setViewDoc(null)}
                        className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-3xl font-bold z-20"
                        style={{ zIndex: 20, background: 'white', borderRadius: '50%', padding: '2px 10px' }}
                      >
                        ×
                      </button>

                      <div className="pt-6 pb-3 px-6 border-b border-gray-200">
                        <h3 className="text-xl font-semibold text-center text-gray-800">KYC Documents</h3>
                      </div>

                      <div
                        className="overflow-y-auto px-6 pb-6 pt-2"
                        style={{ flex: 1, overflowY: 'auto' }}
                      >
                        {viewDoc?.aadhaarCard && (
                          <div className="mb-6 text-center">
                            <p className="font-medium mb-2 text-gray-700">Aadhaar Card</p>
                            <img
                              src={`https://api.7uniqueverfiy.com/uploads/kyc/${viewDoc.aadhaarCard}`}
                              alt="Aadhaar Card"
                              style={{
                                maxHeight: '60vh',
                                width: 'auto',
                                maxWidth: '100%',
                                objectFit: 'contain',
                                margin: '0 auto',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                              }}
                            />
                          </div>
                        )}
                        {viewDoc?.panCard && (
                          <div className="mb-6 text-center">
                            <p className="font-medium mb-2 text-gray-700">Pan Card</p>
                            <img
                              src={`https://api.7uniqueverfiy.com/uploads/kyc/${viewDoc.panCard}`}
                              alt="Aadhaar Card"
                              style={{
                                maxHeight: '60vh',
                                width: 'auto',
                                maxWidth: '100%',
                                objectFit: 'contain',
                                margin: '0 auto',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                              }}
                            />
                          </div>
                        )}
                        {viewDoc?.gstCert && (
                          <div className="mb-6 text-center">
                            <p className="font-medium mb-2 text-gray-700">GST Card</p>
                            <img
                              src={`https://api.7uniqueverfiy.com/uploads/kyc/${viewDoc.gstCert}`}
                              alt="Aadhaar Card"
                              style={{
                                maxHeight: '60vh',
                                width: 'auto',
                                maxWidth: '100%',
                                objectFit: 'contain',
                                margin: '0 auto',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                              }}
                            />
                          </div>
                        )}
                        {/* Add more sections for other documents if needed */}
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "24px", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: "14px", color: "#6b7280" }}>
                    Showing page {page} of {totalPages} • {users?.length} results
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Button variant="outline" onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1 || loading}>Previous</Button>
                    <Button variant="outline" onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages || loading}>Next</Button>
                  </div>
                </div>
              </div> </div>
          </div>




        )}
      </div>



    </div>
  );
} 