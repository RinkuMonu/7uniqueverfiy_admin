import React, { useState } from "react";
import Link from "next/link";

const ServiceCard = ({ service }) => {
    const [showForm, setShowForm] = useState(false);

    return (
        <div
            className={`border p-5 rounded-2xl shadow-sm transition duration-200 hover:shadow-md ${service?.source === "surpass" ? "bg-orange-50" : "bg-gray-100"
                }`}
        >
            {/* Title + Category */}
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-md font-semibold text-gray-800">
                    {service?.name}
                </h2>
                {service?.category && (
                    <span className="text-xs font-medium bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                        {service?.category}
                    </span>
                )}
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {service?.descreption}
            </p>

            {/* Button */}
            <Link href={`services/${service?._id}`}>
                <button className="bg-orange-800 hover:bg-orange-900 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
                    Use Service
                </button>
            </Link>
        </div>

    );
};

export default ServiceCard;
