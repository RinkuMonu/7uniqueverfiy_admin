"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/components/service/axiosInstance";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

export default function ApiRequestPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({
        status: "",
        search: "",
        page: 1,
        limit: 10,
    });

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("admin/read-service-purchase", {
                params: filters,
            });

            setRequests(res.data || []);
            setTotal(res.data?.total || 0);
        } catch (err) {
            console.error("Error fetching API requests:", err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, userID, serviceId, status) => {
        try {
            const res = await axiosInstance.patch(`admin/update-service-purchase`, { id, userID, serviceId, status });
            console.log(res.data.message);

            toast.success(res.data.message);
            fetchRequests();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update status");
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
            page: 1,
        }));
    };

    useEffect(() => {
        fetchRequests();
    }, [filters]);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="bg-white p-4 rounded-md shadow-sm">
                <h2 className="text-lg font-semibold mb-4">API Requests</h2>

                <div className="flex flex-wrap gap-2">
                    {/* Search input */}
                    <input
                        name="search"
                        type="text"
                        value={filters.search}
                        onChange={handleFilterChange}
                        placeholder="Search by user or service..."
                        className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Status select */}
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="px-3 py-2 text-sm border border-gray-300 bg-gray-50 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="card custom-card mt-4">
                <div className="card-header justify-between">
                    <div className="card-title">API Purchase Table</div>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table text-nowrap w-full">
                            <thead className="brandorange-bg-light">
                                <tr className="text-left">
                                    <th>User</th>
                                    <th>Service</th>
                                    <th>Status</th>
                                    <th>Custom Charge</th>
                                    <th>Action</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((req) => (
                                    <tr key={req._id} className="border-b">
                                        <td>{req.user?.name || "-"}</td>
                                        <td>{req.service?.name || "-"}</td>
                                        <td>{req.status}</td>
                                        <td>₹{req.customCharge || "—"}</td>
                                        <td>
                                            <select
                                                value={req.status}
                                                disabled={req.status !== "pending"}
                                                onChange={(e) => updateStatus(req._id, req.user?._id, req.service?._id, e.target.value)}
                                                className="px-2 py-1 rounded text-sm"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="approved">Approve</option>
                                                <option value="rejected">Reject</option>
                                            </select>
                                        </td>
                                        <td>{new Date(req.requestedAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                                {!requests.length && !loading && (
                                    <tr>
                                        <td colSpan={6} className="text-center py-6">No API requests found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="flex justify-between items-center mt-6 px-2">
                            <p className="text-sm text-gray-600">
                                Showing page {filters.page} of {Math.ceil(total / filters.limit)}
                            </p>
                            <div className="space-x-2">
                                <Button
                                    onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
                                    disabled={filters.page <= 1}
                                    className="brandorange-bg-light brandorange-text"
                                >
                                    Previous
                                </Button>
                                <Button
                                    onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
                                    disabled={filters.page >= Math.ceil(total / filters.limit)}
                                    className="ml-2 brandorange-bg-light brandorange-text"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
