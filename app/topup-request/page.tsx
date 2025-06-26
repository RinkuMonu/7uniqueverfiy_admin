"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/components/service/axiosInstance";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

export default function PaymentRequestListPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({
        search: "",
        status: "Pending",
        mode: "",
        page: 1,
        limit: 10,
    });

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/topupReq", {
                params: filters,
            });
            setRequests(res.data.data);
            setTotal(res.data.total);
        } catch (err) {
            console.error("Error fetching payment requests:", err);
        } finally {
            setLoading(false);
        }
    };

    const statusChange = async (id, status) => {

        try {
            const res = await axiosInstance.patch(`/topupReq/${id}/status`, { status });

            fetchRequests()
            toast.success(res.data.message)
        } catch (err) {
            toast.error(err.response.data.message)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
    };

    return (
        <div className=" max-w-7xl mx-auto">
            <div className="card custom-card overflow-auto ">
                <div className="card-header">
                     <h1 className="card-title">Top-Up Requests</h1>
                </div>

              <div className="grid grid-cols-2  gap-4 mb-6 p-4">
               <div> <input
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search..."
                    className="px-3 py-2 w-full rounded border"
                /></div>
               <div className="grid grid-cols-2 gap-4">
                    <select name="mode" value={filters.mode} onChange={handleFilterChange} className="px-2 border rounded">
                    <option value="">All Modes</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Wallet">Wallet</option>
                </select>
                <select name="status" value={filters.status} onChange={handleFilterChange} className="px-2 border rounded">
                    <option value="">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                    <option value="Failed">Failed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
               </div>
            
            </div>
            </div>
           


            <div className="card custom-card">
                <div className="card-header justify-content-between">
                    <div className="card-title"> Top-up Tables </div>
                </div>
                <div className="card-body">
                    <div className="table-responsive ">
                        <table className="table text-nowrap w-full">
                            <thead className="brandorange-bg-light"><tr className="text-left">
                                {/* <th className="p-3">Reference</th> */}
                                <th className="col" >User</th>
                                <th className="col" >Payment Mode</th>
                                <th className="col" >Mode</th>
                                <th className="col" >Status</th>
                                <th className="col" >Amount</th>
                                <th className="col" >Account Type</th>
                                <th className="col" >Action</th>
                                <th className="col" >Date</th>
                            </tr> </thead>

                            <tbody className="">
                                {requests?.map((req) => (
                                    <tr key={req._id} className="border-b" >
                                        {/* <td className="p-3 font-medium">{req.reference}</td> */}
                                        <td >{req.userId?.name || "-"}</td>
                                        <td className="p-3 text-center">{req.mode}</td>
                                        <td >{req.walletMode}</td>
                                        <td >{req.status}</td>
                                        <td >₹{req.amount}</td>
                                        <td >{req.account}</td>
                                        <td >
                                            <select
                                                value={req.status}
                                                disabled={!(req.status === 'Pending' || req.status === 'Processing')}
                                                onChange={(e) => statusChange(req._id, e.target.value)}
                                                className={`px-3 py-1 rounded-full text-xs font-semibold appearance-none cursor-pointer
                                          ${req.status === "Pending"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : req.status === "Processing"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : req.status === "Completed"
                                                                ? "bg-green-100 text-green-800"
                                                                : req.status === "Failed"
                                                                    ? "bg-red-100 text-red-800"
                                                                    : req.status === "Cancelled"
                                                                        ? "bg-gray-200 text-gray-600"
                                                                        : ""
                                                    }`}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Failed">Failed</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>

                                        <td >{new Date(req.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                                {!requests.length && !loading && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-6">
                                            No top-up requests found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                        <div className="flex justify-between items-center mt-6 px-2">
                            <p className="text-sm text-gray-600">
                                Showing page {filters.page} of {Math.ceil(total / filters.limit)}
                            </p>
                            <div className="space-x-2">
                                <Button
                                    onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
                                    disabled={filters.page <= 1} className="brandorange-bg-light brandorange-text "
                                >
                                    Previous
                                </Button>
                                <Button
                                    onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
                                    disabled={filters.page >= Math.ceil(total / filters.limit)} className="ml-2 brandorange-bg-light brandorange-text"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div> </div>
            </div>

        </div>
    );
}
