"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "@/components/service/axiosInstance";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import * as XLSX from "xlsx";
import { FiDownload, FiCalendar, FiSearch, FiBarChart2 } from "react-icons/fi";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";

import "./usages.css";

export default function UsagesPage() {
  const { admin, token } = useSelector((state) => state.admin);
  const [usageData, setUsageData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ service: "", startDate: "", endDate: "" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const mode = admin?.environment_mode
  useEffect(() => {
    fetchUsage();
  }, [filters, page, mode]);

  const fetchUsage = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/user/usage-report", {
        params: { ...filters, page, limit: 10, mode },
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsageData(res.data.usage || []);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      toast.error("Failed to fetch usage report");
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(usageData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "UsageReport");
    XLSX.writeFile(wb, "UsageReport.xlsx");
  };

  return (
    <div style={{ minHeight: '105vh', padding: '1rem', backgroundColor: '#f9fafb' }}>
      {/* Header Card */}
      <div
        style={{
          marginBottom: '1.5rem',
        }}
        className="card custom-card"
      >
        {/* Header: title + export button */}
        <div
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',

            gap: '1rem',
          }}
          className="md:flex card-header"
        >
          {/* Title with icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FiBarChart2 size={24} style={{ color: '#000' }} />
            <h1 style={{ fontSize: '1.125rem', color: '#000' }}>Service Usage Report</h1>
          </div>

          {/* Export button */}
          <div className="flex justify-center mt-2 md:mt-0">
            <button
              onClick={exportToExcel}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                display: 'flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
              }}
              className="brandorange-bg-light brandorange-text hover:!scale-105 "
            >
              <FiDownload size={16} style={{ marginRight: '0.5rem' }} className="brandorange-text" /> Export
            </button>
          </div>

        </div>

        {/* Filters grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            alignItems: 'end',
          }}
          className="p-4"
        >
          {/* Service Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>
              Service Name
            </label>
            <input
              type="text"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                outline: 'none',
              }}
              onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px #3b82f6')}
              onBlur={(e) => (e.target.style.boxShadow = 'none')}
              value={filters.service}
              onChange={(e) => setFilters({ ...filters, service: e.target.value })}
              placeholder="Filter by service name"
            />
          </div>

          {/* Start Date */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>
              Start Date
            </label>
            <input
              type="date"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                outline: 'none',
              }}
              onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px #3b82f6')}
              onBlur={(e) => (e.target.style.boxShadow = 'none')}
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
          </div>

          {/* End Date */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>
              End Date
            </label>
            <input
              type="date"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                outline: 'none',
              }}
              onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px #3b82f6')}
              onBlur={(e) => (e.target.style.boxShadow = 'none')}
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
          </div>
        </div>
      </div>





      {/* Table */}
      <div className="bg-white rounded-lg overflow-hidden ">
        {loading ? (
          <div className="p-6 flex flex-col gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 w-full bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="card custom-card">
            <div className="card-header justify-content-between">
              <div className="card-title"> Usages Table </div>
            </div>
            <div className="card-body">
              <div className="table-responsive ">
                <table className="table text-nowrap w-full">
                  <thead className="brandorange-bg-light"><tr className="text-left">

                    {["Service", "Hit Count", "Total Charges", "Last Used"].map(header => (
                      <th
                        key={header}
                        className="p-3 md:p-4 text-left text-xs font-semibold  uppercase"
                      >
                        {header}
                      </th>
                    ))}

                  </tr> </thead>

                  <tbody className="">
                    {usageData.length ? (
                      usageData.map((entry, idx) => (
                        <tr
                          key={idx}
                          className="transition-colors hover:bg-gray-50 border-t border-gray-100"
                        >
                          <td className="p-3 md:p-4 text-sm font-medium">{entry.service}</td>
                          <td className="p-3 md:p-4 text-sm">{entry.hitCount}</td>
                          <td className="p-3 md:p-4 text-sm">₹{entry.totalCharge?.toFixed(2)}</td>
                          <td className="p-3 md:p-4 text-sm text-gray-500">
                            {new Date(entry.lastUsed || Date.now()).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-8 text-center">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <FiBarChart2 size={40} className="text-gray-400" />
                            <h3 className="text-lg font-semibold">No usage data found</h3>
                            <p className="text-gray-500">Try adjusting your filters</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>

                </table>
             {!loading && totalPages >= 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <Button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              variant="outline"
            >
              Previous
            </Button>
            <span>
              Page {page} of {totalPages}
            </span>
            <Button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              variant="outline"
            >
              Next
            </Button>
          </div>
        )}
              </div> </div>
          </div>






        )}
      </div>
    </div>

  );
}
