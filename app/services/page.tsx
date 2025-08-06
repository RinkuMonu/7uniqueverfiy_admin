'use client'
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ServiceCard from "@/components/ServiceCard"
import "./service.css"


const ServicePage = () => {
    const { admin } = useSelector(state => state.admin)
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [search, setSearch] = useState("");
    useEffect(
        () => {
            setServices(admin?.services)
        }, [admin]
    )


    // Filter logic
    useEffect(() => {
        const results = services?.filter(service =>
            service.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredServices(results);
    }, [search, services]);

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Your Purchased Services</h1>

            {/* Search Filter */}
            <input
                type="text"
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-2 rounded w-full mb-6"
            />

            {/* Services List */}
            <div className="service-card">
                {filteredServices?.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                ))}
            </div>
        </div>
    );
};

export default ServicePage;
