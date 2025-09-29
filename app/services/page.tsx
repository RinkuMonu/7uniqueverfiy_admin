'use client'
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ServiceCard from "@/components/ServiceCard";
import { Badge, Search } from "lucide-react";
import "./service.css";

const ServicePage = () => {
    const { admin } = useSelector((state) => state.admin);
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");

    // load services from admin
    useEffect(
        () => {
            const service = admin?.services.filter(data => data.status == 'active');
            setServices(service)
        }, [admin]
    )

    // filter logic
    useEffect(() => {
        let results = services;
        // filter by category
        if (category !== "all") {
            results = results.filter((s) => s.category === category);
        }

        // search filter
        if (search) {
            results = results.filter((s) =>
                s.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        setFilteredServices(results);
    }, [search, status, category, services]);
    console.log(services);

    // extract unique categories for dropdown
    const categories = ["all", ...new Set(services?.map((s) => s.category))];


    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Your Purchased Services</h1>

            {/* Filter Section */}
            <div className="bg-white shadow rounded-lg p-4 mb-6 grid gap-4 md:grid-cols-3">
                {/* Search */}
                <div className="relative">
                    {/* <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" /> */}
                    <input
                        type="text"
                        placeholder="Search services..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border p-2 pl-10 rounded w-full"
                    />
                </div>

                {/* Category Filter */}
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border p-2 rounded w-full"
                >
                    {categories.map((c, i) => (
                        <option key={i} value={c}>
                            {c === "all" ? "All Categories" : c?.charAt(0).toUpperCase() + c?.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-sm bg-red-100 text-red-700 p-2 rounded-full font-semibold">
                    <Search className="w-4 h-4" />
                    {filteredServices?.length || 0} services found
                </div>
            </div>

            {/* Services List */}
            <div className="service-card grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredServices?.length > 0 ? (
                    filteredServices.map((service) => (
                        <ServiceCard key={service._id} service={service} />
                    ))
                ) : (
                    <p className="text-gray-500">No services found.</p>
                )}
            </div>
        </div >
    );
};

export default ServicePage;
