"use client";

import { use, useEffect, useRef, useState } from "react";
import { SignJWT } from "jose";
import { useSearchParams } from "next/navigation";
import axiosInstance from "@/components/service/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { fetchAdminDetails } from "@/app/redux/reducer/AdminSlice";
import axios from "axios";


// Function to sign JWT with jose
const generateToken = async (payload, secret) => {
    const secretKey = new TextEncoder().encode(secret);
    const jwt = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .sign(secretKey);
    return jwt;
};

export default function ServiceDynamicPage({ params }) {
    const searchParams = useSearchParams();
    // const id = searchParams.get("id");
    const { id } = use(params);
    // console.log(params.id);

    const { admin } = useSelector((state) => state.admin);
    const dispatch = useDispatch()
    const [service, setService] = useState(null);
    const [formData, setFormData] = useState({});
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const hiddenFields = ["client_id", "transaction_id", "request_id"];
    const shouldAutoCall = service?.fields.every(field => hiddenFields.includes(field.name));


    const apiFlowMap = {

        // aadhat part
        "/adhar/send/otp": {
            nextStep: "/adhar/verify/otp",
            needs: "client_id",
        },
        // telicom part
        "/send_telecom_otp": {
            nextStep: "/verify_telecom_otp",
            needs: "client_id",
        },
        "/aadhaar/eaadhaar/generate-otp": {
            nextStep: "/aadhaar/eaadhaar/submit-otp",
            needs: "client_id",
        },
       

        // bank-statement part
        "/bank-statement-analyzer/upload": {
            nextStep: "/bank-statement-analyzer/report-fetch",
            needs: "transaction_id",
        },

        // epfo part
        "/send_epfo_otp": {
            nextStepOptions: [
                { label: "Verify OTP", step: "/verify_epfo_otp" },
                { label: "Download Passbook", step: "/epfo_passbook_download" },
            ],
            needs: "client_id",
        },
        "/verify_epfo_otp": {
            needs: "client_id",
        },
        "/epfo_passbook_download": {
            needs: "client_id",
        },
        // crime_check part
        "/crime_check_individual": {
            needs: "request_id",
            nextStepOptions: [
                { label: "Download PDF", step: "/crime_report_download_pdf" },
                { label: "Download JSON", step: "/crime_report_download_json" },
            ],
        },
        "/crime_check_company": {
            needs: "request_id",
            nextStepOptions: [
                { label: "Download PDF", step: "/crime_report_download_pdf" },
                { label: "Download JSON", step: "/crime_report_download_json" },
            ],
        },
        "/crime_report_download_pdf": {
            needs: "request_id",
        },
        "/crime_report_download_json": {
            needs: "request_id",
        },
        // itr part
        "/itr_create_client": {
            nextStepOptions: [
                { step: "/itr-forget-password", label: "Forgot Password" },
                { step: "/itr-submit-otp", label: "Submit OTP" },
                { step: "/get-profile", label: "Get ITR Profile Details" },
                { step: "/itr-list", label: "Get ITR List" },
                { step: "/get-itr", label: "Get Single ITR Details" },
                { step: "/itr_check", label: "Get 26AS (TDS) List" },
                { step: "/get-26as-list", label: "Get Single 26AS (TDS) Details" },
                { step: "/get-26as", label: "Get 26AS (TDS) Details" }
            ],
            label: "Create ITR Client",
            needs: "client_id"
        },

        "/itr-forget-password": {
            nextStepOptions: [{ step: "itr-submit-otp", label: "Income Tax Return – Submit OTP" }],
            label: "Income Tax Return – Forgot Password",
            needs: "client_id"
        },

        "/itr-submit-otp": {
            nextStepOptions: [{ step: "itr-get-profile", label: "Get ITR Profile Details" }],
            label: "Income Tax Return – Submit OTP",
            needs: "client_id"
        },

        "/get-profile": {
            nextStepOptions: [
                { step: "itr-list", label: "Get ITR List" },
                { step: "tds-list", label: "Get 26AS (TDS) List" }
            ],
            label: "Get ITR Profile Details",
            needs: "client_id"
        },

        "/itr-list": {
            nextStepOptions: [{ step: "itr-single", label: "Get Single ITR Details" }],
            label: "Get Income Tax Return List",
            needs: "client_id"
        },

        "/get-itr": {
            nextStepOptions: [],
            label: "Get Single ITR Details",
            needs: "client_id"
        },

        "/itr_check": {
            nextStepOptions: [{ step: "tds-single", label: "Get Single 26AS (TDS) Details" }],
            label: "Get 26AS (TDS) List",
            needs: "client_id"
        },

        "/get-26as-list": {
            nextStepOptions: [],
            label: "Get Single 26AS (TDS) Details",
            needs: "client_id"
        },

        "/get-26as": {
            nextStepOptions: [],
            label: "Get 26AS (TDS) Details",
            needs: "client_id"
        }
    };




    const refIds = useRef({
        client_id: "",
        transaction_id: "",
    });

    useEffect(() => {
        if (!shouldAutoCall || !service) return;

        const payload = {};
        service.fields.forEach((field) => {
            payload[field.name] = formData[field.name] || "";
        });

        const autoCall = async () => {
            try {
                const environment = admin?.environment_mode ? "production" : "credentials";
                const envConfig = admin?.[environment];

                if (!envConfig?.jwtSecret || !envConfig?.authKey) {
                    throw new Error("❌ Missing JWT secret or auth key in environment config");
                }

                // Step 3: Generate JWT token
                // console.log("🔐 Generating JWT token...");
                const token = await generateToken({
                    userId: admin._id,
                    email: admin.email,
                    role: admin.role,
                }, envConfig?.jwtSecret);

                setLoading(true);
                const res = await axios.post(`http://localhost:5050/api/verify/${service.endpoint}`, payload, {
                    headers: {
                        "client-id": envConfig.authKey,
                        "authorization": `Bearer ${token}`,
                        "x-env": environment,
                    }
                });
                setResponse(res.data);
                console.log(res);

                Swal.fire({
                    icon: res.data?.status || res.data?.success ? "success" : "error",
                    // title: "Success",
                    text: res.data?.message || "API called successfully!",
                });

            } catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: err?.response?.data?.message || "Something went wrong!",
                });
            } finally {
                setLoading(false);
            }
        };

        autoCall();
    }, [service]); // triggers when `service` changes



    useEffect(() => {
        if (id) {
            axiosInstance
                .get(`/user/service/${id}`)
                .then((res) => setService(res.data.data))
                .catch((err) => console.error("Service fetch error:", err));
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, type, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === "file" ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // console.log("🔄 Form submission started");

        try {
            const hasFile = service.fields.some((field) => field.type === "file");
            // console.log(`📦 Payload includes file: ${hasFile}`);

            let requestData;
            let headers = {};

            // Step 1: Prepare request payload
            if (hasFile) {
                // console.log("🛠️ Preparing FormData payload...");
                const formPayload = new FormData();
                service.fields.forEach((field) => {
                    console.log(`📎 Appending field: ${field.name}`);
                    formPayload.append(field.name, formData[field.name]);
                });
                requestData = formPayload;
            } else {
                // console.log("🛠️ Preparing JSON payload...");
                const jsonPayload = {};
                service.fields.forEach((field) => {
                    console.log(`📎 Adding field: ${field.name} => ${formData[field.name]}`);
                    jsonPayload[field.name] = formData[field.name];
                });
                requestData = JSON.stringify(jsonPayload);
                headers["Content-Type"] = "application/json";
            }

            // Step 2: Determine environment
            const environment = admin?.environment_mode ? "production" : "credentials";
            const envConfig = admin?.[environment];

            if (!envConfig?.jwtSecret || !envConfig?.authKey) {
                throw new Error("❌ Missing JWT secret or auth key in environment config");
            }

            // Step 3: Generate JWT token
            // console.log("🔐 Generating JWT token...");
            const token = await generateToken({
                userId: admin._id,
                email: admin.email,
                role: admin.role,
            }, envConfig?.jwtSecret);
            // console.log("✅ JWT token generated");

            // Step 4: API call
            // const endpointUrl = `http://localhost:5050/api/verify/${service.endpoint}`;
            const endpointUrl = `https://api.7uniqueverfiy.com/api/verify/${service.endpoint}`;
            // console.log(`📡 Sending request to: ${endpointUrl}`);
            const res = await fetch(endpointUrl, {
                method: "POST",
                headers: {
                    ...headers,
                    "client-id": envConfig.authKey,
                    "authorization": `Bearer ${token}`,
                    "x-env": environment,
                },
                body: requestData,
            });

            const result = await res.json();

            if (result.success) {
                console.log("🎉 Success response received. Fetching latest admin details...");
                dispatch(fetchAdminDetails());
            }

            setResponse(result);


            const flow = apiFlowMap[`/${service.endpoint}`];

            if (result.success && flow?.needs) {
                const idKey = flow.needs;
                const idValue = result.data?.data?.[idKey] || result.data?.[idKey];

                if (idKey && idValue) {

                    // ✅ Save ID to formData
                    setFormData((prev) => ({
                        ...prev,
                        [idKey]: idValue,
                    }));

                    // 🔁 If single nextStep (automatic redirect)
                    if (flow.nextStep) {

                        const nextService = admin?.services.find(
                            (s) => s.endpoint === flow.nextStep.replace(/^\//, "")
                        );
                        if (nextService) {
                            setService(nextService);
                        }
                    }
                    else if (flow.nextStepOptions?.length > 0) {

                        const { isConfirmed, value } = await Swal.fire({
                            title: "What would you like to do next?",
                            input: "radio",
                            inputOptions: flow.nextStepOptions.reduce((acc, option) => {
                                acc[option.step] = option.label;
                                return acc;
                            }, {}),
                            inputValidator: (value) => !value && "Please select an option",
                            confirmButtonText: "Continue",
                            showCancelButton: true,

                        });

                        if (isConfirmed && value) {
                            const nextService = admin?.services.find(
                                (s) => s.endpoint === value.replace(/^\//, "")
                            );
                            if (nextService) {
                                setService(nextService);
                            }
                        }
                    }
                }
            }




            // const keys = ["client_id", "request_id", "transaction_id", "refid"];
            // const foundKey = keys.find(key => result?.data?.data?.[key]);

            // if (foundKey) {
            //     const id = result.data.data[foundKey];
            //     dynamicIdRef.current = id;

            //     setFormData(prev => ({
            //         ...prev,
            //         [foundKey]: id,
            //     }));
            // }


        } catch (err) {
            console.error("❌ Submission error:", err);
            setResponse({ error: "Something went wrong", details: err.message });
        } finally {
            setLoading(false);
            console.log("⏹️ Form submission completed");
        }
    };


    // const clearDynamicId = () => {
    //     dynamicIdRef.current = null;
    //     setFormData((prev) => {
    //         const newData = { ...prev };
    //         delete newData.client_id;
    //         delete newData.ref_id;
    //         delete newData.transaction_id;
    //         return newData;
    //     });
    // };



    if (!service) return <p className="text-center mt-10">Loading service details...</p>;

    return (
        <div style={{

            margin: '0 auto',
            marginTop: '2.5rem',

        }}
            className="card custom-card">
            <button onClick={() => window.history.back()} className="bg-orange-800 text-white px-3 py-2 rounded mb-4">
                ← Use Another API
            </button>


            <div className="card-header ">
                <h1 className="card-title">
                    {service.name}
                    {/* <span style={{
                    position: 'absolute',
                    bottom: '-0.5rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '5rem',
                    height: '0.25rem',
                    backgroundColor: '#dbeafe',
                    borderRadius: '9999px'
                }}></span> */}
                </h1>
            </div>
            <div className="p-4 ">
                {
                    !shouldAutoCall && (
                        <form onSubmit={handleSubmit} >
                            <div className="grid grid-cols-12 gap-4">
                                {service.fields.map((field) => (
                                    ["client_id", "transaction_id", "request_id"].includes(field.name) ? (
                                        // Yeh hidden input hai
                                        <input
                                            key={field.name}
                                            type="hidden"
                                            name={field.name}
                                            value={formData[field.name] || ""}
                                        // Agar aap chahte ho dynamically set ho, to yahan value me set karo
                                        />
                                    ) : (
                                        <div key={field.name} className="col-span-12 sm:col-span-6 lg:col-span-4">
                                            <label style={{
                                                display: 'block',
                                                color: '#374151',
                                                fontWeight: '500',
                                                marginBottom: '0.5rem',
                                                transition: 'all 0.2s ease'
                                            }}>
                                                {field.label}
                                                {field.required && <span style={{ color: '#ef4444', marginLeft: '0.25rem' }}>*</span>}
                                            </label>
                                            {field.type === "file" ? (
                                                <input
                                                    type={field.type || "text"}
                                                    name={field.name}
                                                    required={field.required}
                                                    onChange={handleChange}
                                                    style={{
                                                        width: '100%',
                                                        border: '1px solid #d1d5db',
                                                        borderRadius: '0.5rem',
                                                        padding: '0.75rem 1rem',
                                                        outline: 'none',
                                                        transition: 'all 0.2s ease',
                                                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor = '#3b82f6';
                                                        e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)';
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor = '#d1d5db';
                                                        e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                                                    }}
                                                    placeholder={`Enter ${field.label.toLowerCase()}`}
                                                />
                                            ) : (
                                                <input
                                                    type={field.type || "text"}
                                                    name={field.name}
                                                    required={field.required}
                                                    value={formData[field.name] || ""}
                                                    onChange={handleChange}
                                                    style={{
                                                        width: '100%',
                                                        border: '1px solid #d1d5db',
                                                        borderRadius: '0.5rem',
                                                        padding: '0.75rem 1rem',
                                                        outline: 'none',
                                                        transition: 'all 0.2s ease',
                                                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor = '#3b82f6';
                                                        e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)';
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor = '#d1d5db';
                                                        e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                                                    }}
                                                    placeholder={`Enter ${field.label.toLowerCase()}`}
                                                />
                                            )}
                                        </div>
                                    )
                                ))}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'end', margin: "10px 0px" }}>
                                <button
                                    type="submit"
                                    style={{
                                        padding: '0.75rem',
                                        borderRadius: '0.5rem',
                                        fontWeight: '600',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',

                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity: loading ? 0.9 : 1
                                    }}
                                    onMouseOver={(e) => {

                                        e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                                    }}
                                    onMouseOut={(e) => {

                                        e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                    }}
                                    disabled={loading}
                                    className="brandorange-bg-light brandorange-text"
                                >
                                    {loading ? (
                                        <>
                                            <div style={{
                                                animation: 'spin 1s linear infinite',
                                                marginRight: '0.75rem',
                                                width: '1.25rem',
                                                height: '1.25rem',
                                                border: '2px solid rgba(255, 255, 255, 0.3)',
                                                borderTopColor: 'white',
                                                borderRadius: '50%'
                                            }}></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Submit
                                            <svg style={{ marginLeft: '0.5rem', width: '1.25rem', height: '1.25rem' }} fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                            {response && (
                                <div style={{
                                    marginTop: '1.5rem',
                                    padding: '1.5rem',
                                    backgroundColor: '#f9fafb',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '0.5rem',
                                    transition: 'all 0.3s ease',
                                    transform: 'scale(1)',
                                    alignSelf: 'flex-start',  // Align to top of container
                                    maxWidth: '1000px'
                                }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.005)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: '0.75rem'
                                    }}>
                                        <h2 style={{
                                            fontSize: '1.125rem',
                                            fontWeight: '600',
                                            color: '#1f2937',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                            <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem', color: '#2563eb' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                            Response
                                        </h2>
                                        <button
                                            onClick={() => setResponse(null)}
                                            style={{
                                                color: '#9ca3af',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                transition: 'color 0.2s ease'
                                            }}
                                            onMouseOver={(e) => {
                                                e.target.style.color = '#4b5563';
                                            }}
                                            onMouseOut={(e) => {
                                                e.target.style.color = '#9ca3af';
                                            }}
                                        >
                                            <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                        </button>
                                    </div>
                                    <div style={{
                                        overflow: 'auto',
                                        maxHeight: '15rem',
                                        backgroundColor: 'white',
                                        padding: '1rem',
                                        borderRadius: '0.25rem',
                                        border: '1px solid #f3f4f6'
                                    }}>
                                        <pre style={{
                                            whiteSpace: 'pre-wrap',
                                            color: '#374151',
                                            fontSize: '0.875rem',
                                            margin: 0
                                        }}>
                                            {JSON.stringify(response.message, null, 2)}
                                            {JSON.stringify(response.data, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            )}

                        </form>
                    )

                }


            </div>
        </div>
    );
}
