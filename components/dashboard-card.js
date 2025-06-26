"use client";

import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "./service/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { MainContext } from "@/app/context/context";
import { fetchAdminDetails } from "@/app/redux/reducer/AdminSlice";
import { Loader2 } from "lucide-react";

const ProductTabs = () => {
  const { tostymsg } = useContext(MainContext);
  const dispatch = useDispatch();
  const { admin } = useSelector((state) => state.admin);

  const [activeTab, setActiveTab] = useState("allService");
  const [allServices, setAllServices] = useState([]);
  const [services, setServices] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const paginate = (items) => {
    const start = (page - 1) * limit;
    const paginated = items.slice(start, start + limit);
    setServices(paginated);
    setTotalPages(Math.ceil(items.length / limit));
  };

  const fetchServices = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const { data } = await axiosInstance.get("/admin/services");
      setAllServices(data.services || []);
    } catch (error) {
      const errMsg =
        error?.response?.data?.message || "Failed to fetch services.";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setLoading(false);
    }
  };

  const filterAndPaginate = () => {
    let filtered = [];

    if (activeTab === "allService") {
      filtered = allServices;
    } else if (activeTab === "userServices") {
      filtered = allServices.filter((s) =>
        admin.services?.some((as) => as._id === s._id)
      );
    } else if (activeTab === "NotSubscribed") {
      filtered = allServices.filter(
        (s) => !admin.services?.some((as) => as._id === s._id)
      );
    }

    paginate(filtered);
  };

  const handlePurchase = async (serviceId) => {
    setLoading(true);
    setMessage(null);
    try {
      const { data } = await axiosInstance.post("/user/service-request", {
        userId: admin._id,
        serviceId,
      });

      setMessage({ type: "success", text: data.message });
      dispatch(fetchAdminDetails());
    } catch (error) {
      const errMsg =
        error?.response?.data?.message || "Purchase request failed.";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchAdminDetails());
  }, []);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    filterAndPaginate();
  }, [activeTab, allServices, admin?.services?.length, page]);

  const tabList = [
    { id: "allService", label: "All Products", icons: "fas fa-code text-sm" },
    {
      id: "userServices",
      label: "Subscribed",
      icons: "fas fa-check-circle text-sm",
    },
    {
      id: "NotSubscribed",
      label: "Not Subscribed",
      icons: "fas fa-times-circle text-sm",
    },
  ];

  return (
    <div className="mx-4 md:mx-10">
      {/* Tabs */}
      <div className="mb-6">
        <ul className="flex flex-wrap gap-2">
          {tabList.map((tab) => (
            <li key={tab.id}>
              <button
                className={`flex items-center gap-2 text-sm px-4 py-2 rounded-md font-medium transition-all border ${activeTab === tab.id
                  ? "bg-[#B7603D22] brandorange-text border-[#B7603D]"
                  : "bg-white brandcolor-text border-[#09333C22] hover:bg-[#09333C0A]"
                  }`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setPage(1); // Reset page
                }}
              >
                <i className={tab.icons}></i>
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Notification Banner */}
      {message && (
        <div
          className={`rounded-md p-3 mb-4 text-sm font-medium ${message.type === "error"
            ? "bg-red-100 text-red-600"
            : "bg-green-100 text-green-600"
            }`}
        >
          {message.text}
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-blue-600 w-6 h-6" />
          </div>
        ) : services.length > 0 ? (
          services.map((product) => (
            <article
              key={product._id}
              className="rounded border  bg-white p-5 shadow-sm transition hover:shadow-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="bg-[#b7603d22] p-3 rounded-full brandorange-text shadow-inner">
                  <i className="fas fa-video fa-sm"></i>
                </div>
                <span className="bg-[#09333C10] brandcolor-text text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                  New
                </span>
              </div>

              <h3 className="text-lg font-bold brandcolor-text mb-1 truncate">
                {product.name.toUpperCase()}
              </h3>

              <p className="text-sm text-[#09333Ccc] mb-2 line-clamp-3">
                {product.descreption || "No description available"}
              </p>

              <div className="flex items-center justify-between mt-4">
                <span className="text-base font-semibold brandorange-text">
                  ₹ {product.charge}
                </span>
                <button
                  className="text-sm font-medium brandorange-bg text-white px-4 py-2 rounded-lg hover:bg-[#9e4d2e] transition"
                  onClick={() => handlePurchase(product._id)}
                >
                  Subscribe
                </button>
              </div>
            </article>
//                       <article
//   key={product._id}
//   className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-[#b7603d]/20 group"
// >
//   {/* Decorative accent */}
//   <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#b7603d] to-[#e3a88a]"></div>

//   <div className="flex justify-between items-start mb-6">
//     <div className="bg-[#f8ece6] p-3 rounded-xl group-hover:bg-[#b7603d] group-hover:text-white transition-colors duration-300">
//       <i className="fas fa-video text-[#b7603d] group-hover:text-white transition-colors duration-300"></i>
//     </div>
//     <span className="bg-[#f8ece6] text-[#b7603d] text-xs font-semibold px-3 py-1 rounded-full">
//       New
//     </span>
//   </div>

//   <div className="mb-6">
//     <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#b7603d] transition-colors duration-300">
//       {product.name.toUpperCase()}
//     </h3>
//     <p className="text-sm text-gray-600 line-clamp-3">
//       {product.descreption || "No description available"}
//     </p>
//   </div>

//   <div className="flex items-center justify-between mt-auto">
//     <div>
//       <span className="text-gray-500 text-xs">STARTING AT</span>
//       <span className="text-2xl font-bold text-[#b7603d] block">₹{product.charge}</span>
//     </div>
//     <button
//       className="relative overflow-hidden bg-[#b7603d] text-white font-medium px-6 py-2.5 rounded-xl hover:bg-[#9e4d2e] transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group-hover:shadow-lg"
//       onClick={() => handlePurchase(product._id)}
//     >
//       <span className="relative z-10">Subscribe</span>
//       <span className="absolute inset-0 bg-gradient-to-r from-[#b7603d] to-[#e3a88a] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
//     </button>
//   </div>
// </article>

          ))
        ) : (
          <div className="col-span-full text-center py-16 text-blue-500">
            <i className="fas fa-box-open fa-2x mb-2"></i>
            <p className="text-md font-semibold">No services found.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <Button
            className="brandorange-bg hover:bg-[#9e4d2e]"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <Button
            className="brandorange-bg hover:bg-[#9e4d2e]"
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductTabs;
