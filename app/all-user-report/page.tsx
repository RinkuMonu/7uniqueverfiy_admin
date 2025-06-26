"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/components/service/axiosInstance";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { FaUserGroup } from "react-icons/fa6";
import { HiOutlineDocumentArrowDown } from "react-icons/hi2";
import { AiFillFileExcel } from "react-icons/ai";



export default function AllUserReportPage() {
  const isMobile = useIsMobile();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axiosInstance.get("/admin/report", {
        params: {
          search,
          service: serviceFilter,
          page,
          limit:10,
        },
      });

      setUsers(res.data.users || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type) => {
    try {
      const res = await axiosInstance.get("/admin/report", {
        params: {
          search,
          service: serviceFilter,
          export: type,
        },
        responseType: "blob",
      });

      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `usage-report.${type === "csv" ? "csv" : "xlsx"}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error("Export failed");
    }
  };

  useEffect(() => {
    fetchReport();
  }, [search, serviceFilter, page]);

  return (
    <>


      <div className="card custom-card">
        <div
          className="card-header"
        >
          <h1 style={{ display: "flex", alignItems: "center", gap: "8px" }} className="card-title">
            <FaUserGroup size={20} />
            All User Report
          </h1>


        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
          }}
          className="p-4"
        >
          <div style={{ display: "flex", flex: 1, gap: "10px", flexWrap: "wrap" }}>
            <input
              placeholder="Search name/email"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="px-3 py-2 border rounded w-full"
              style={{ flex: 1, minWidth: "200px" }}
            />
          </div>

          {/* Right: Buttons */}
          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            <button
              onClick={() => handleExport("csv")}
              style={{
                padding: "8px 12px",
                fontSize: "12px",
                borderRadius: "4px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
              className="brandorange-bg-light brandorange-text"
            >
              <HiOutlineDocumentArrowDown size={16} />
              Export CSV
            </button>

            <button
              onClick={() => handleExport("xlsx")}
              style={{
                backgroundColor: "#bbf7d0",
                padding: "8px 12px",
                fontSize: "12px",
                color: "#166534",
                borderRadius: "4px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <AiFillFileExcel size={16} />
              Export Excel
            </button>
          </div>
        </div>

      </div>

      {error && (
        <div style={{ color: "red", marginBottom: "16px" }}>{error}</div>
      )}

      <div
        style={{

          marginBottom: "1.25rem", backgroundColor: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", borderRadius: "0.375rem", overflow: "auto"
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", color: "#666" }}>Loading...</div>
        ) : users.length === 0 ? (
          <div style={{ textAlign: "center", color: "#666" }}>
            No users found.
          </div>
        ) : (
          <div className="card custom-card">
            <div className="card-header justify-content-between">
              <div className="card-title"> Report Table </div>
            </div>
            <div className="card-body">
              <div className="table-responsive ">
                <table className="table text-nowrap w-full">
                  <thead className="brandorange-bg-light"><tr className="text-left">
                    <th >
                      Name
                    </th>
                    <th >
                      Email
                    </th>
                    <th>
                      Service
                    </th>
                    <th >
                      Hit Count
                    </th>
                    <th>
                      Total Charges
                    </th>
                  </tr> </thead>

                  <tbody className="">
                    {users.map((user) =>
                      user.serviceUsage.map((service, index) => (
                        <tr key={`${user._id}-${index}`}>
                          <td style={{ padding: "0.75rem 1.5rem" }}>{user.name}</td>
                          <td style={{ padding: "0.75rem 1.5rem", color: "#6b7280" }}>
                            {user.email}
                          </td>
                          <td style={{ padding: "0.75rem 1.5rem" }}>{service.service}</td>
                          <td style={{ padding: "0.75rem 1.5rem" }}>
                            {service.hitCount}
                          </td>
                          <td style={{ padding: "0.75rem 1.5rem" }}>
                            ₹ {service.totalCharge?.toFixed(2)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>

                </table>

      
              </div> </div>
          </div>



          //  <div className="p-3 shadow">
          //             <table style={{ width: "100%",  borderSpacing: "0 0.25rem", fontSize: "0.875rem", textAlign: "left", borderBottom: "1px solid #e5e7eb"}} className="p-3">
          //     <thead>
          //       <tr style={{ fontSize: "",   }} className="brandorange-bg-light brandorange-text">
          //         <th style={{ padding: "0.75rem 1.5rem" }}>
          //           Name
          //         </th>
          //         <th style={{  padding: "0.75rem 1.5rem" }}>
          //           Email
          //         </th>
          //         <th style={{  padding: "0.75rem 1.5rem"}}>
          //           Service
          //         </th>
          //         <th style={{ padding: "0.75rem 1.5rem" }}>
          //           Hit Count
          //         </th>
          //         <th style={{padding: "0.75rem 1.5rem" }}>
          //           Total Charges
          //         </th>
          //       </tr>
          //     </thead>
          //     <tbody>
          //       {users.map((user) =>
          //         user.serviceUsage.map((service, index) => (
          //           <tr key={`${user._id}-${index}`}>
          //             <td style={{padding: "0.75rem 1.5rem" }}>{user.name}</td>
          //             <td style={{ padding: "0.75rem 1.5rem", color: "#6b7280" }}>
          //               {user.email}
          //             </td>
          //             <td style={{ padding: "0.75rem 1.5rem" }}>{service.service}</td>
          //             <td style={{ padding: "0.75rem 1.5rem" }}>
          //               {service.hitCount}
          //             </td>
          //             <td style={{padding: "0.75rem 1.5rem" }}>
          //               ₹ {service.totalCharge?.toFixed(2)}
          //             </td>
          //           </tr>
          //         ))
          //       )}
          //     </tbody>
          //   </table>
          //  </div>
        )}

        {/* Pagination */}
        {!loading && totalPages >= 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "20px",
            }}
            className="px-2 pb-2"
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
      </div>

    </>
  );
}
