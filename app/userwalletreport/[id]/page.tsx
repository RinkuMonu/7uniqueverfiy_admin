"use client";

import axiosInstance from "@/components/service/axiosInstance";
import { use, useEffect, useState } from "react";

import { useSelector } from "react-redux";

import { FaWallet } from "react-icons/fa";

export default function WalletLedger({ params }) {
  const { id } = use(params)
  const { admin } = useSelector((state) => state.admin);
  const [walletData, setWalletData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ type: "", minAmount: "", maxAmount: "" });
  const mode = admin?.environment_mode
  const fetchWalletLedger = async () => {
    setLoading(true);
    try {
      // const params = {
      //     userId: id
      // };
      let url;
      if (admin?.role === 'admin') {
        url = `/admin/ledger/${id}`
      } else {
        url = `/user/wallet-ledger`
      }
      const res = await axiosInstance.get(url, { params: { mode, filters } });

      setWalletData(res.data.ledger);
      setTotalPages(res.data.totalPages);

    } catch (error) {
      console.error("Failed to fetch wallet ledger:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletLedger();
  }, [page, limit, filters, mode]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setPage(1); // Reset to first page on filter change
  };

  return (
    <div className="p-6 font-sans bg-gray-50 min-h-screen">
      <div className="p-6 mb-6   overflow-auto">
        {/* Header */}
       <div className="card card-custom">
         <div className="flex items-center text-black-600 mb-6 card-header">
          <div className="flex items-center">
            <FaWallet className="mr-2 text-lg text-black-600" />
            <h2 className="text-2xl">Wallet Ledger Summary</h2>
          </div>
        </div>


        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }} className="p-4 bg-white mb-3">
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #D1D5DB',
              fontSize: '14px',
              flex: 1
            }}
          >
            <option value="">All Types</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>


          <input
            type="number"
            name="minAmount"
            value={filters.minAmount}
            onChange={handleFilterChange}
            placeholder="Min Amount"

            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #D1D5DB',
              fontSize: '14px',
              flex: 1
            }}
          />

          <input
            type="number"
            name="maxAmount"
            value={filters.maxAmount}
            onChange={handleFilterChange}
            placeholder="Max Amount"
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #D1D5DB',
              fontSize: '14px',
              flex: 1
            }}
          />

          {/* <button
            onClick={() => fetchData()} // Replace with your filter function
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              borderRadius: '6px',
              backgroundColor: '#2563eb',
              padding: '8px 12px',
              fontSize: '14px',
              fontWeight: 500,
              color: 'white',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
              cursor: 'pointer',
              border: 'none',
              outline: 'none',
              transition: 'background-color 0.2s',
              flex: 0.5
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          >
            Apply Filters
          </button> */}
        </div>
       </div>

        {/* Table */}
        {loading ? (
          <div className="p-6 text-gray-600">Loading...</div>
        ) : (

          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white mb-6">

  <table className="table text-nowrap w-full">
              <thead className="brandorange-bg-light"> <tr className="text-left">
                  {["S.NO.", "Type", "Amount", "Description", "Reference ID", "Created At"].map((title) => (
                    <th key={title} className="col">
                      {title}
                    </th>
                  ))}
                </tr> </thead>
  <tbody>
                {walletData.length > 0 ? (
                  walletData.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3 text-sm text-gray-700">{index + 1}</td>
                      <td className="p-3 text-sm text-gray-700 capitalize">{item.type}</td>
                      <td className={`p-3 text-sm font-semibold ${item.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                        ₹{item.amount.toFixed(2)}
                      </td>
                      <td className="p-3 text-sm text-gray-700">{item.description}</td>
                      <td className="p-3 text-sm text-gray-500">{item.referenceId || "N/A"}</td>
                      <td className="p-3 text-sm text-gray-500">{new Date(item.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-sm text-gray-500">
                      No wallet transactions found.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>


          </div>
        )}

        {/* Pagination */}
     <div className="flex justify-between items-center mt-4 p-2">
            <button
              className="border border-gray-300 rounded px-4 py-2 text-sm font-medium brandorange-bg-light  text-slate-700 disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <span className="text-sm text-slate-600">
              Page {page} of {totalPages}
            </span>
            <button
              className="border border-gray-300 brandorange-bg-light rounded px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
      </div>
    </div>
  );
}
