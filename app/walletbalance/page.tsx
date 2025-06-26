"use client";

import { useEffect, useState } from "react";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";
import axiosInstance from "@/components/service/axiosInstance";
import Link from "next/link";
import { FaWallet } from "react-icons/fa";
import { FiDownload, FiChevronDown } from 'react-icons/fi';
import { useSelector } from "react-redux";

export default function WalletBalanceReportPage() {
    const { admin } = useSelector(state => state.admin)
    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [search, setSearch] = useState("");
    const [role, setRole] = useState("all");
    const [minWallet, setMinWallet] = useState("");
    const [maxWallet, setMaxWallet] = useState("");

    const fetchData = async (exportType = "") => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (role !== "all") params.append("role", role);
        if (minWallet) params.append("minWallet", minWallet);
        if (maxWallet) params.append("maxWallet", maxWallet);
        params.append("page", page.toString());
        params.append("limit", "10");
        params.append("mode", admin?.environment_mode);
        if (exportType) params.append("export", exportType);

        try {
            const url = `/admin/wallet-balance?${params.toString()}`;
            const res = await axiosInstance.get(url);

            if (exportType === "csv") {
                const blob = new Blob([res.data], { type: "text/csv" });
                saveAs(blob, "wallet-report.csv");
            } else if (exportType === "excel") {
                const blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                saveAs(blob, "wallet-report.xlsx");
            } else {
                setUsers(res.data.users);
                setTotal(res.data.totalWalletBalance);
                setTotalUsers(res.data.totalUsers);
                setTotalPages(res.data.totalPages);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, search, role, minWallet, maxWallet, admin?.environment_mode]);

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="p-6 font-sans bg-gray-50 min-h-screen">
            <div className=" mb-6 card custom-card rounded-md overflow-auto">
                {/* Header */}
                <div className="flex items-center text-black-600 mb-6 card-header">
                    <div className="flex items-center">
                        <FaWallet className="card-title " />
                        <h2 className="card-title ml-1">Wallet Balance Report</h2>
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            width: '100%',
                            gap: '16px',
                        }}>
                            <span style={{
                                padding: '8px 12px',
                                fontSize: '14px',
                                borderRadius: '6px',
                                border: '1px solid #d1d5db',
                                backgroundColor: 'white'
                            }}>
                                Total Users: {totalUsers}
                            </span>
                            <span style={{
                                padding: '8px 12px',
                                fontSize: '14px',
                                borderRadius: '6px',
                                border: '1px solid #d1d5db',
                                backgroundColor: 'white'
                            }}>
                                Total: ₹{total}
                            </span>
                        </div>


                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    borderRadius: '6px',
                                 
                                    padding: '8px 12px',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                   
                                    border: '1px solid rgba(29, 78, 216, 0.1)',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                               
                                onFocus={(e) => {
                                  
                                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(37, 99, 235, 0.5)';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.backgroundColor = '#eff6ff';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                                className="brandorange-bg-light brandorange-text"
                            >
                                <FiDownload />
                                Export
                                <FiChevronDown />
                            </button>

                            {isOpen && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        marginTop: '4px',
                                        borderRadius: '6px',
                                        backgroundColor: 'white',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                        border: '1px solid #e5e7eb',
                                        zIndex: 10,
                                        minWidth: '150px'
                                    }}
                                    onMouseLeave={() => setIsOpen(false)}
                                >
                                    <button
                                        onClick={() => {
                                            fetchData("csv");
                                            setIsOpen(false);
                                        }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            width: '100%',
                                            padding: '8px 12px',
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            color: '#1d4ed8',
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            outline: 'none',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s',
                                            borderBottom: '1px solid #e5e7eb',
                                            borderRadius: '6px 6px 0 0'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <FiDownload />
                                        CSV
                                    </button>

                                    <button
                                        onClick={() => {
                                            fetchData("excel");
                                            setIsOpen(false);
                                        }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            width: '100%',
                                            padding: '8px 12px',
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            color: '#1d4ed8',
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            outline: 'none',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s',
                                            borderRadius: '0 0 6px 6px'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <FiDownload />
                                        Excel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }} className="p-4">
                    <Input
                        placeholder="Search by name or email"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ flex: 1, width: '100%' }}
                    />

                    <div style={{ flex: 1, width: '100%' }}>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger style={{ width: '100%' }}>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Min ₹"
                                type="number"
                                value={minWallet}
                                onChange={(e) => setMinWallet(e.target.value)}
                                className="w-24"
                            />
                            <Input
                                placeholder="Max ₹"
                                type="number"
                                value={maxWallet}
                                onChange={(e) => setMaxWallet(e.target.value)}
                                className="w-24"
                            />
                        </div>
                        {/* <button
                            onClick={() => fetchData()}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                borderRadius: '6px',
                                backgroundColor: 'rgba(105, 108, 255, 0.16)',
                                padding: '8px 12px',
                                fontSize: '14px',
                                fontWeight: 500,
                                color: 'black',
                                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                                cursor: 'pointer',
                                border: 'none',
                                outline: 'none',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                            onFocus={(e) => {
                                e.currentTarget.style.backgroundColor = '#1d4ed8';
                                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(37, 99, 235, 0.5)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.backgroundColor = '#2563eb';
                                e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                            }}
                        >
                            Apply Filter
                        </button> */}
                    </div>
                </div>
            </div>

              <div className="card custom-card">
        <div className="card-header justify-content-between">
          <div className="card-title"> Wallet Table </div>
        </div>
        <div className="card-body">
          <div className="table-responsive ">
            <table className="table text-nowrap w-full">
              <thead className="brandorange-bg-light"><tr className="text-left">
                  <th className="col">S.NO.</th>
                            <th className="col">Name</th>
                            <th className="col">Email</th>
                            <th className="col">Role</th>
                            <th className="col">Wallet</th>
                            <th className="col">Action</th>
              </tr> </thead>

              <tbody className="">
                 {users.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-6 text-center text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            users.map((user, index) => (
                                <tr
                                    key={user._id}
                                    className=""
                                >
                                    <td className="">{index + 1}</td>
                                    <td className="">{user.name}</td>
                                    <td className="">{user.email}</td>
                                    <td className=" capitalize">{user.role}</td>
                                    <td className="">
                                        ₹ {admin?.environment_mode
                                            ? user?.wallet?.mode?.production || 0
                                            : user?.wallet?.mode?.credentials || 0}
                                    </td>
                                    <td className="p-3">
                                        <Link
                                            href={`userwalletreport/${user._id}`}
                                            style={{
                                                padding: '0.5rem 0.75rem',
                                                borderRadius: '0.25rem',
                                                fontSize: '0.75rem',
                                                fontWeight: '500',
                                                display: 'inline-block',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s'
                                            }}
                                            className="brandorange-bg-light brandorange-text"
                                        >
                                            View Ledger
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
              </tbody>

            </table>
          <div className="flex justify-between items-center py-4 px-2">
                <Button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="brandorange-bg-light brandorange-text"
                >
                    Previous
                </Button>
                <span className="text-sm text-gray-500">
                    Page {page} of {totalPages}
                </span>
                <Button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="brandorange-bg-light brandorange-text"
                >
                    Next
                </Button>
            </div>
          </div> </div>
          </div>

       
        </div>
    );
}