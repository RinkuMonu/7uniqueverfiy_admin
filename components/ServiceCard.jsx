import React, { useState } from "react";
import Link from "next/link";

const ServiceCard = ({ service }) => {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="border p-4 rounded shadow-sm bg-white">
            <h2 className="text-lg font-semibold">{service?.name}</h2>
            <p className="text-gray-600 mb-4">{service?.descreption}</p>
            <Link href={`services/${service?._id}`}>
                <button
                    className="bg-orange-800 text-white px-3 py-2 rounded"
                >
                    Use Service
                </button>
            </Link>

            {/* {showForm && (
                <div className="mt-4">
                    <ServiceForm service={service} />
                </div>
            )} */}
        </div>
    );
};

export default ServiceCard;
