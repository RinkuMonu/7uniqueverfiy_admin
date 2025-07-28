'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/components/service/axiosInstance';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import {
    ArrowLeft,
    Wallet,
    CheckCircle,
    ShieldX,
    UserRound,
    ShieldCheck,
    IndianRupee
} from "lucide-react";
import { Button } from "@/components/ui/button";

const UserDetailsPage = () => {
    const params = useParams();
    const router = useRouter();
    const userId = typeof params.id === "string" ? params.id : params.id?.[0] || "";

    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        if (userId) {
            axiosInstance.get(`/admin/user/${userId}`)
                .then(res => setUser(res.data?.user))
                .catch(err => console.error("Error fetching user details", err));
        }
    }, [userId]);

    if (!user) return <div className="p-4">Loading user details...</div>;

    // Merge custom charges into services
    const mergedServices = user.services?.map((service: any) => {
        const custom = user.customServiceCharges?.find(
            (c: any) => c.service === service._id
        );
        return {
            ...service,
            customCharge: custom?.customCharge
        };
    }) || [];

    return (
        <div className="p-6 space-y-6">
            <div className='flex justify-between'>
                <Button onClick={() => router.back()} variant="outline" className="mb-4 flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>

                {/* Title */}
                <h2 className="text-2xl font-semibold">
                    {user.name?.toUpperCase()} <span className="text-gray-500 text-lg">({user.role})</span>
                </h2>

            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="space-y-4 col-span-1">
                    {/* Basic Info */}
                    <Card>
                        <CardContent className="p-4 space-y-1">
                            <div className="font-medium flex items-center gap-2 text-lg">
                                <UserRound className="w-5 h-5 text-gray-500" /> Basic Info
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div><strong>Email:</strong> {user.email}</div>
                                <div><strong>Role:</strong> {user.role}</div>
                                <div className="col-span-2 flex items-center gap-2">
                                    <strong>KYC Verified:</strong>
                                    {user.documents?.isVerified ? (
                                        <CheckCircle className="text-green-600 w-4 h-4" />
                                    ) : (
                                        <ShieldX className="text-red-500 w-4 h-4" />
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Wallet Info */}
                    <Card>
                        <CardContent className="p-4 space-y-2">
                            <div className="font-medium flex items-center gap-2 text-lg">
                                <Wallet className="w-5 h-5 text-yellow-500" /> Wallet
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>🛠 Credentials Mode: ₹{user.wallet?.mode?.credentials}</div>
                                <div>🚀 Production Mode: ₹{user.wallet?.mode?.production}</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 space-y-2">
                            <div className="font-medium text-lg flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-purple-500" />
                                {user?.documents?.isVerified ? 'Production' : 'Credentials'}
                            </div>
                            <div className="text-sm space-y-1">
                                <div>
                                    <strong>JWT Secret:</strong>{' '}
                                    {user?.documents?.isVerified
                                        ? user.production?.jwtSecret
                                        : user.credentials?.jwtSecret}
                                </div>
                                <div>
                                    <strong>Auth Key:</strong>{' '}
                                    {user?.documents?.isVerified
                                        ? user.production?.authKey
                                        : user.credentials?.authKey}
                                </div>
                                <div>
                                    <strong>Active:</strong>{' '}
                                    {(user?.documents?.isVerified
                                        ? user.production?.isActive
                                        : user.credentials?.isActive)
                                        ? '✅'
                                        : '❌'}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* Right Column: Services */}
                <div className="col-span-3 space-y-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="font-medium mb-4 flex items-center gap-2 text-lg">
                                <ShieldCheck className="w-5 h-5 text-green-600" />
                                Services Enabled
                            </div>

                            {mergedServices?.length === 0 ? (
                                <p className="text-sm">No services assigned.</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pr-2">
                                    {mergedServices.map((service: any) => (
                                        <div key={service._id} className="border rounded-lg p-3 shadow-sm hover:shadow-md transition flex justify-between">
                                            <div>
                                                <div className="text-sm font-medium text-gray-800">{service.name}</div>
                                                <div className="text-xs text-gray-500">{service.endpoint}</div>
                                            </div>
                                            <div className="mt-1 flex items-center gap-1 text-xs text-green-600">
                                                <IndianRupee className="w-3 h-3" />
                                                {service.customCharge !== undefined
                                                    ? `${service.customCharge} (custom)`
                                                    : `${service.charge || 0}`}{" "}
                                               
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default UserDetailsPage;
