"use client";

import { useState } from "react";
import axiosInstance from "@/components/service/axiosInstance";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const walletModes = ["production", "credentials"];

export default function TopupRequestForm() {
    const router = useRouter();

    const [form, setForm] = useState({
        amount: "",
        mode: "UPI",
        walletMode: "credentials",
        description: "",
        vpa: "",
        accountName: "",
        accountNumber: "",
        ifscCode: "",
        bankName: "",
        branch: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        switch (name) {
            case "amount":
                if (!/^\d{0,7}$/.test(value)) return; // Up to 7 digits only
                break;
            case "accountNumber":
                if (!/^\d{0,20}$/.test(value)) return; // Only digits allowed (max 20)
                break;
            case "vpa":
                if (value.length > 50) return; // limit VPA length
                break;
            case "ifscCode":
                if (!/^[A-Za-z0-9]*$/.test(value)) return; // Only alphanumeric
                break;
            default:
                break;
        }

        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                amount: parseFloat(form.amount),
                mode: form.mode,
                walletMode: form.walletMode,
                description: form.description,
                ...(form.mode === "UPI" && { upiDetails: { vpa: form.vpa } }),
                ...(form.mode === "Bank Transfer" && {
                    bankDetails: {
                        accountName: form.accountName,
                        accountNumber: form.accountNumber,
                        ifscCode: form.ifscCode.toUpperCase(),
                        bankName: form.bankName,
                        branch: form.branch,
                    },
                }),
            };

            const res = await axiosInstance.post("/topupReq/request-topup", payload);
            if (res.data.success) {
                toast.success("request submited")
                setForm({
                    amount: "",
                    mode: "UPI",
                    walletMode: "credentials",
                    description: "",
                    vpa: "",
                    accountName: "",
                    accountNumber: "",
                    ifscCode: "",
                    bankName: "",
                    branch: "",
                });
            }

        } catch (err) {
            console.error("Top-up request failed:", err);
            alert("Failed to submit top-up request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-lg mx-auto bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100"
        >
            {/* Form Header */}
            <div className="brandorange-bg p-6">
                <h2 className="text-2xl font-bold text-white">Wallet Top-Up Request</h2>
                <p className="text-white mt-1">Fill in the details to request funds</p>
            </div>

            <div className="p-6 space-y-5">
                {/* Amount Field */}
                <div className="space-y-1 pb-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Amount <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-2 flex items-center pl-3 text-gray-500">₹</span>
                        <input
                            type="text"
                            name="amount"
                            value={form.amount}
                            onChange={handleChange}
                            required
                            placeholder="0.00"
                            className="w-full pl-8 pr-4 py-3 border border-gray-300 focus:outline-none rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                        />
                    </div>
                </div>

                {/* Wallet Mode */}
                <div className="space-y-1 pb-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Wallet Mode <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="walletMode"
                        value={form.walletMode}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border focus:outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                        {walletModes.map((mode) => (
                            <option key={mode} value={mode}>
                                {mode.charAt(0).toUpperCase() + mode.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Payment Mode */}
                <div className="space-y-1 pb-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Payment Method <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {["UPI", "Bank Transfer", "Cash", "Wallet", "Other"].map((method) => (
                            <div key={method} className="flex items-center">
                                <input
                                    type="radio"
                                    id={method}
                                    name="mode"
                                    value={method}
                                    checked={form.mode === method}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 "
                                />
                                <label htmlFor={method} className="ml-2 block text-sm text-gray-700">
                                    {method}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dynamic Fields based on Payment Method */}
                <div className="space-y-4 pb-2">
                    {/* UPI Fields */}
                    {form.mode === "UPI" && (
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                UPI ID <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="vpa"
                                value={form.vpa}
                                onChange={handleChange}
                                required
                                placeholder="username@bank"
                                className="w-full px-4 py-3 focus:outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                            <p className="text-xs text-gray-500 mt-1">Enter your UPI Virtual Payment Address</p>
                        </div>
                    )}

                    {/* Bank Transfer Fields */}
                    {form.mode === "Bank Transfer" && (
                        <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h3 className="font-medium text-gray-700">Bank Details</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Account Name</label>
                                    <input
                                        type="text"
                                        name="accountName"
                                        value={form.accountName}
                                        onChange={handleChange}
                                        placeholder="Full name"
                                        className="w-full px-4 py-2 focus:outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Account Number</label>
                                    <input
                                        type="text"
                                        name="accountNumber"
                                        value={form.accountNumber}
                                        onChange={handleChange}
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        placeholder="Digits only"
                                        className="w-full px-4 py-2 focus:outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">IFSC Code</label>
                                <input
                                    type="text"
                                    name="ifscCode"
                                    value={form.ifscCode}
                                    onChange={handleChange}
                                    placeholder="SBIN0001234"
                                    className="w-full px-4 py-2 focus:outline-none border border-gray-300 rounded-lg uppercase focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                                    <input
                                        type="text"
                                        name="bankName"
                                        value={form.bankName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border focus:outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Branch</label>
                                    <input
                                        type="text"
                                        name="branch"
                                        value={form.branch}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 focus:outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="space-y-1 pb-2">
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Any additional information..."
                        rows={3}
                        className="w-full px-4 py-2 border focus:outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full brandorange-bg py-3 px-4 rounded-lg font-medium text-white transition ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'}`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        "Submit Request"
                    )}
                </button>
            </div>
        </form>
    );
}
