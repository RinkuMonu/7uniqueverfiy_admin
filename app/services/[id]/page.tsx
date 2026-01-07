"use client";

import { use, useEffect, useRef, useState } from "react";
import { SignJWT } from "jose";
import { useSearchParams } from "next/navigation";
import axiosInstance from "@/components/service/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminDetails } from "@/app/redux/reducer/AdminSlice";
import axios from "axios";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// ApiResponseViewer ko sirf client pe load karo (SSR disabled)
const ApiResponseViewer = dynamic(
  () => import("../ApiResponseViewer"),
  { ssr: false }
);

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

  const { admin } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  const [service, setService] = useState(null);
  const [formData, setFormData] = useState({});
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
// ✅ ADD HERE - after existing state variables
const [aaClientId, setAaClientId] = useState("");
console.log("aaClientId line 43 = ",aaClientId);
const [isAaCallback, setIsAaCallback] = useState(false);
const [isRedirecting, setIsRedirecting] = useState(false);
  const hiddenFields = ["client_id", "transaction_id", "request_id"];

  const shouldAutoCall =
    service?.fields?.every((field) => hiddenFields.includes(field.name));

  const apiFlowMap = {
    // aadhaar part
    "/adhar/send/otp": {
      nextStep: "/adhar/verify/otp",
      needs: "client_id",
    },
    // telecom part
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

    // itr part (flow-1)
    "/itr_create_client": {
      nextStepOptions: [
        { step: "/itr-forget-password", label: "Forgot Password" },
        { step: "/itr-submit-otp", label: "Submit OTP" },
        { step: "/get-profile", label: "Get ITR Profile Details" },
        { step: "/itr-list", label: "Get ITR List" },
        { step: "/get-itr", label: "Get Single ITR Details" },
        { step: "/itr_check", label: "Get 26AS (TDS) List" },
        { step: "/get-26as-list", label: "Get Single 26AS (TDS) Details" },
        { step: "/get-26as", label: "Get 26AS (TDS) Details" },
      ],
      label: "Create ITR Client",
      needs: "client_id",
    },

    "/itr-forget-password": {
      nextStepOptions: [
        { step: "itr-submit-otp", label: "Income Tax Return – Submit OTP" },
      ],
      label: "Income Tax Return – Forgot Password",
      needs: "client_id",
    },

    "/itr-submit-otp": {
      nextStepOptions: [
        { step: "itr-get-profile", label: "Get ITR Profile Details" },
      ],
      label: "Income Tax Return – Submit OTP",
      needs: "client_id",
    },

    "/get-profile": {
      nextStepOptions: [
        { step: "itr-list", label: "Get ITR List" },
        { step: "tds-list", label: "Get 26AS (TDS) List" },
      ],
      label: "Get ITR Profile Details",
      needs: "client_id",
    },

    "/itr-list": {
      nextStepOptions: [
        { step: "itr-single", label: "Get Single ITR Details" },
      ],
      label: "Get Income Tax Return List",
      needs: "client_id",
    },

    "/get-itr": {
      nextStepOptions: [],
      label: "Get Single ITR Details",
      needs: "client_id",
    },

    "/itr_check": {
      nextStepOptions: [
        { step: "tds-single", label: "Get Single 26AS (TDS) Details" },
      ],
      label: "Get 26AS (TDS) List",
      needs: "client_id",
    },

    "/get-26as-list": {
      nextStepOptions: [],
      label: "Get Single 26AS (TDS) Details",
      needs: "client_id",
    },

    "/get-26as": {
      nextStepOptions: [],
      label: "Get 26AS (TDS) Details",
      needs: "client_id",
    },

    // itr / surepass (flow-2)
    "/itr/create-client": {
      nextStepOptions: [
        { step: "/itr/check-credentials", label: "Get 26AS (TDS) List" },
        { step: "/itr/download-profile", label: "download profile" },
        { step: "/itr/download-itr", label: "download itr" },
        { step: "/itr/download-26as", label: "download 26as" },
        { step: "/itr/download-itr-v", label: "download itr v" },
        { step: "/itr/forget-password", label: "Forgot Password" },
        { step: "/itr/submit-otp", label: "Submit OTP" },
        { step: "/itr/get-profile", label: "Get ITR Profile Details" },
        { step: "/itr/get-itr-details", label: "Get Single ITR Details" },
        {
          step: "/itr/get-26as-details/itr_LkksSlHruoCsxgigbaol",
          label: "Get 26AS (TDS) Details",
        },
        { step: "/itr/download-ais-v2", label: "Download ITR" },
        { step: "/itr/get-ais", label: "Get AIS" },
      ],
      label: "Create ITR Client",
      needs: "client_id",
    },

    "/itr/check-credentials": {
      nextStepOptions: [
        { step: "itr-download-profile", label: "Download Profile" },
      ],
      label: "Get 26AS (TDS) List",
      needs: "client_id",
    },

    "/itr/download-profile": {
      nextStepOptions: [
        { step: "itr-download-itr", label: "Download ITR" },
      ],
      label: "Download Profile",
      needs: "client_id",
    },

    "/itr/download-itr": {
      nextStepOptions: [
        { step: "itr-download-26as", label: "Download 26AS" },
      ],
      label: "Download ITR",
      needs: "client_id",
    },

    "/itr/download-26as": {
      nextStepOptions: [
        { step: "itr-download-itr-v", label: "Download ITR V" },
      ],
      label: "Download 26AS",
      needs: "client_id",
    },

    "/itr/download-itr-v": {
      nextStepOptions: [
        {
          step: "itr-forget-password",
          label: "Income Tax Return – Forgot Password",
        },
      ],
      label: "Download ITR V",
      needs: "client_id",
    },

    "/itr/forget-password": {
      nextStepOptions: [
        {
          step: "itr-submit-otp",
          label: "Income Tax Return – Submit OTP",
        },
      ],
      label: "Income Tax Return – Forgot Password",
      needs: "client_id",
    },

    "/itr/submit-otp": {
      nextStepOptions: [
        {
          step: "itr-get-profile",
          label: "Get ITR Profile Details",
        },
      ],
      label: "Income Tax Return – Submit OTP",
      needs: "client_id",
    },

    "/itr/get-profile": {
      nextStepOptions: [
        {
          step: "itr-get-itr-details",
          label: "Get Single ITR Details",
        },
      ],
      label: "Get ITR Profile Details",
      needs: "client_id",
    },

    "/itr/get-itr-details": {
      nextStepOptions: [
        { step: "get-26as", label: "Get 26AS (TDS) Details" },
      ],
      label: "Get Income Tax Return List",
      needs: "client_id",
    },

    "/itr/get-26as-details/itr_LkksSlHruoCsxgigbaol": {
      nextStepOptions: [
        { step: "itr-download-ais-v2", label: "Download ITR" },
      ],
      label: "Get 26AS (TDS) Details",
      needs: "client_id",
    },

    "/itr/download-ais-v2": {
      nextStepOptions: [{ step: "v1-itr-get-ais", label: "Get AIS" }],
      label: "Download AIS V2",
      needs: "client_id",
    },

    "/itr/get-ais": {
      nextStepOptions: [],
      label: "Get AIS",
      needs: "client_id",
    },

    // bank statement alt
    "/bank/statement/upload": {
      nextStep: "bank/statement/download",
      needs: "client_id",
    },

    //aggregator apis
    "/account-aggregator-v2/init": {
      nextStep: "/account-aggregator-v2/fetch-json-report",
      needs: "client_id",
    },
    "/account-aggregator-v2/fetch-json-report": {
      nextStep: "",
      needs: "client_id",
    },

  };
  // ✅ ✅ ✅ ADD THIS FUNCTION HERE
  const checkForAaCallback = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const clientIdFromUrl = urlParams.get("client_id");
    const aaCallback = urlParams.get("aa_callback");
    
    if (clientIdFromUrl || aaCallback === "true") {
      setIsAaCallback(true);
      if (clientIdFromUrl) {
        setAaClientId(clientIdFromUrl);
        // Clean URL
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, "", cleanUrl);
      }
    }
  };

  // ✅ ✅ ✅ ADD THIS USEEFFECT HERE
  useEffect(() => {
    checkForAaCallback();
  }, []);

  const refIds = useRef({
    client_id: "",
    transaction_id: "",
  });

  // AUTO CALL (if service has only hidden fields)
  useEffect(() => {
    if (!shouldAutoCall || !service) return;

    const payload = {};
    service.fields.forEach((field) => {
      payload[field.name] = formData[field.name] || "";
    });

    const autoCall = async () => {
      try {
        const environment = admin?.environment_mode
          ? "production"
          : "credentials";
        const envConfig = admin?.[environment];

        if (!envConfig?.jwtSecret || !envConfig?.authKey) {
          throw new Error(
            "❌ Missing JWT secret or auth key in environment config"
          );
        }

        // Make JWT
        const token = await generateToken(
          {
            userId: admin._id,
            email: admin.email,
            role: admin.role,
          },
          envConfig?.jwtSecret
        );

        setLoading(true);

        // const endpointUrl = `http://localhost:5050/api/verify/${service.endpoint}`;
        const endpointUrl = `https://api.7uniqueverfiy.com/api/verify/${service.endpoint}`;

        const res = await axios.post(endpointUrl, payload, {
          headers: {
            "client-id": envConfig.authKey,
            authorization: `Bearer ${token}`,
            "x-env": environment,
          },
        });

        setResponse(res.data);

        // SweetAlert (dynamic import so SSR doesn't break)
        {
          const Swal = (await import("sweetalert2")).default;
          Swal.fire({
            icon: res.data?.status || res.data?.success ? "success" : "error",
            text: res.data?.message || "API called successfully!",
          });
        }
      } catch (err) {
        const Swal = (await import("sweetalert2")).default;
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            err?.response?.data?.message || "Something went wrong!",
        });
      } finally {
        setLoading(false);
      }
    };

    autoCall();
  }, [service, shouldAutoCall, admin, formData]);

  // LOAD SERVICE META
    // LOAD SERVICE META
  useEffect(() => {
    if (id) {
      axiosInstance
        .get(`/user/service/${id}`)
        .then((res) => {
          const serviceData = res.data.data;
          setService(serviceData);
          
          // ✅ ✅ ✅ ADD THIS BLOCK HERE
          if (serviceData.endpoint === "account-aggregator-v2/fetch-json-report") {
            // Check localStorage for client_id
            const savedClientId = localStorage.getItem("aa_client_id");
            console.log("savedClientId = ",savedClientId);
            if (savedClientId) {
              setAaClientId(savedClientId);
              // Auto-fetch if it's a callback
              if (isAaCallback) {
                fetchAAReport(savedClientId);
              }
            }
          }
        })
        .catch((err) => console.error("Service fetch error:", err));
    }
  }, [id, isAaCallback]); // ✅ Add dependency here too

    // ✅ ✅ ✅ REPLACE THE ABOVE useEffect WITH THIS NEW FUNCTION
  const fetchAAReport = async (clientId) => {
    console.log("client id received =", clientId);

    if (!clientId) {
      throw new Error("Client ID is missing");
    }

    const payload = {
      client_id: "rahulsecret234373636637",
      name: "rahul",
    };

    console.log("Payload being sent =", payload);

    const res = await axios.post(
      "https://api.7uniqueverfiy.com/api/verify/account-aggregator-v2/fetch-json-report",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "client-id": envConfig.authKey,
          authorization: `Bearer ${token}`,
          "x-env": environment,
        },
      }
    );
  };


  // Keep only this useEffect for auto-fetch
  useEffect(() => {
    if (service?.endpoint === "account-aggregator-v2/fetch-json-report" && aaClientId && isAaCallback) {
      console.log("line 522 = ",aaClientId);
      fetchAAReport(aaClientId);
    }
  }, [service, aaClientId, isAaCallback]);

  // FORM FIELD CHANGE
  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  // SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const hasFile = service.fields.some(
        (field) => field.type === "file"
      );

      let requestData;
      let headers = {};

      // Build request payload for API
      if (hasFile) {
        const formPayload = new FormData();
        service.fields.forEach((field) => {
          formPayload.append(field.name, formData[field.name]);
        });
        requestData = formPayload;
      } else {
        const jsonPayload = {};
        service.fields.forEach((field) => {
          jsonPayload[field.name] = formData[field.name];
        });
        requestData = JSON.stringify(jsonPayload);
        headers["Content-Type"] = "application/json";
      }

      // Pick correct env (live / test)
      const environment = admin?.environment_mode
        ? "production"
        : "credentials";
      const envConfig = admin?.[environment];

      if (!envConfig?.jwtSecret || !envConfig?.authKey) {
        throw new Error(
          "❌ Missing JWT secret or auth key in environment config"
        );
      }

      // Sign JWT for request
      const token = await generateToken(
        {
          userId: admin._id,
          email: admin.email,
          role: admin.role,
        },
        envConfig?.jwtSecret
      );

      // Call backend proxy
      // const endpointUrl = `http://localhost:5050/api/verify/${service.endpoint}`;
      const endpointUrl = `https://api.7uniqueverfiy.com/api/verify/${service.endpoint}`;



      const res = await fetch(endpointUrl, {
        method: "POST",
        headers: {
          ...headers,
          "client-id": envConfig.authKey,
          authorization: `Bearer ${token}`,
          "x-env": environment,
        },
        body: requestData,
      });

      const result = await res.json();

      // if success, refresh admin wallet/limits etc
      if (result.success) {
        dispatch(fetchAdminDetails());
      }

            if (service.endpoint === "account-aggregator-v2/init" && result.success) {
        const client_id = result.data?.client_id;
        const redirect_url = result.data?.redirect_url;
        
        if (!client_id || !redirect_url) {
          throw new Error("No client_id or redirect_url received");
        }
        
        // 1. Save client_id in localStorage
        localStorage.setItem("aa_client_id", client_id);
        setAaClientId(client_id);
        refIds.current.client_id = client_id;
        
        // 2. Show confirmation to user
        const Swal = (await import("sweetalert2")).default;
        const { isConfirmed } = await Swal.fire({
          icon: "info",
          title: "Redirecting to Bank Consent",
          html: `
            <div class="text-left">
              <p class="mb-3">You will be redirected to the bank consent page.</p>
              <div class="bg-blue-50 p-3 rounded mb-3">
                <p class="text-sm"><strong>Client ID:</strong> ${client_id}</p>
                <p class="text-xs text-gray-600">Save this ID for reference</p>
              </div>
              <p class="text-sm">After allowing access, you will return here automatically.</p>
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: "Continue",
          cancelButtonText: "Cancel",
          allowOutsideClick: false
        });
        
        if (isConfirmed) {
          setIsRedirecting(true);
          
          // Show loading
          Swal.fire({
            title: "Redirecting...",
            text: "Please wait",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
          
          // Wait a bit then redirect
          setTimeout(() => {
            // REDIRECT TO THIRD-PARTY URL
            window.location.href = redirect_url;
          }, 1000);
        }
        
        return;
      }

      setResponse(result);

      const flow = apiFlowMap[`/${service.endpoint}`];

      // handle chaining / next steps
      if (result.success && flow?.needs) {
        const idKey = flow.needs;
        const idValue =
          result.data?.data?.[idKey] || result.data?.[idKey];

        if (idKey && idValue) {
          // store ref id into formData
          setFormData((prev) => ({
            ...prev,
            [idKey]: idValue,
          }));

          // Case 1: single direct next step
          if (flow.nextStep) {
            const nextService = admin?.services.find(
              (s) => s.endpoint === flow.nextStep.replace(/^\//, "")
            );
            if (nextService) {
              setService(nextService);
            }
          }
          // Case 2: multiple next actions (SweetAlert radio)
          else if (flow.nextStepOptions?.length > 0) {
            const Swal = (await import("sweetalert2")).default;

            const { isConfirmed, value } = await Swal.fire({
              title: "What would you like to do next?",
              input: "radio",
              inputOptions: flow.nextStepOptions.reduce(
                (acc, option) => {
                  acc[option.step] = option.label;
                  return acc;
                },
                {}
              ),
              inputValidator: (value) =>
                !value && "Please select an option",
              confirmButtonText: "Continue",
              showCancelButton: true,
              width: "800px",
              didOpen: () => {
                const radioContainer =
                  Swal.getPopup().querySelector(".swal2-radio");
                if (radioContainer) {
                  radioContainer.style.display = "grid";
                  radioContainer.style.gridTemplateColumns =
                    "repeat(2, 1fr)";
                  radioContainer.style.gap = "10px";
                  radioContainer.style.textAlign = "left";
                }
              },
            });

            if (isConfirmed && value) {
              const nextService = admin?.services.find(
                (s) =>
                  s.endpoint === value.replace(/^\//, "")
              );
              if (nextService) {
                setService(nextService);
              }
            }
          }
        }
      }
    } catch (err) {
      console.error("❌ Submission error:", err);

      const Swal = (await import("sweetalert2")).default;
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err?.response?.data?.message ||
          err?.message ||
          "Something went wrong!",
      });

      setResponse({
        error: "Something went wrong",
        details: err.message,
      });
    } finally {
      setLoading(false);
    }
  };
if (isRedirecting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Redirecting to Consent Page...</h2>
        <p className="text-gray-600 text-center max-w-md">
          Please wait while we redirect you to the bank consent page.
          <br />
          After allowing access, you will be automatically redirected back here with the report.
        </p>
      </div>
    );
  }
  if (!service)
    return <p className="text-center mt-10">Loading service details...</p>;

  return (
    <div
      style={{
        margin: "0 auto",
        marginTop: "2.5rem",
      }}
      className="card custom-card"
    >
      <Button
        variant="outline"
        onClick={() => window.history.back()}
        className="gap-2 hover:bg-orange-100 border-orange-200 text-orange-700 hover:text-orange-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Use Another API
      </Button>

      <div className="card-header ">
        <h1 className="card-title ">{service.name}</h1>
      </div>

      <div className="p-4 ">
        {/* ✅ ✅ ✅ ACCOUNT AGGREGATOR SPECIAL SECTION START */}
        {service.endpoint === "account-aggregator-v2/init" && aaClientId && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">📋 Client ID Saved</h3>
            <p className="text-blue-700 mb-2">
              Your Client ID: <code className="bg-white px-2 py-1 rounded">{aaClientId}</code>
            </p>
            <p className="text-sm text-blue-600">
              If you were redirected back from the consent page, the report will be fetched automatically.
            </p>
          </div>
        )}
        
        {service.endpoint === "account-aggregator-v2/fetch-json-report" && aaClientId && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">✅ Client ID Available</h3>
            <p className="text-green-700 mb-3">
              Click the button below to fetch the report using Client ID: 
              <code className="bg-white px-2 py-1 rounded ml-2">{aaClientId}</code>
            </p>
            <button
              onClick={() => fetchAAReport(aaClientId)}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Fetching Report..." : "Fetch Report Now"}
            </button>
          </div>
        )}
        {/* ✅ ✅ ✅ ACCOUNT AGGREGATOR SPECIAL SECTION END */}
        {!shouldAutoCall && (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-12 gap-4">
              {service?.fields?.map((field) =>
                ["client_id", "transaction_id", "request_id"].includes(
                  field.name
                ) ? (
                  // hidden field
                  <input
                    key={field.name}
                    type="hidden"
                    name={field.name}
                    value={formData[field.name] || ""}
                  />
                ) : (
                  <div
                    key={field.name}
                    className="col-span-12 sm:col-span-6 lg:col-span-4"
                  >
                    <label
                      style={{
                        display: "block",
                        color: "#374151",
                        fontWeight: "500",
                        marginBottom: "0.5rem",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {field.label}
                      {field.required && (
                        <span
                          style={{
                            color: "#ef4444",
                            marginLeft: "0.25rem",
                          }}
                        >
                          *
                        </span>
                      )}
                    </label>

                    {field.type === "file" ? (
                      <input
                        type={field.type || "text"}
                        name={field.name}
                        required={field.required}
                        onChange={handleChange}
                        style={{
                          width: "100%",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.5rem",
                          padding: "0.75rem 1rem",
                          outline: "none",
                          transition: "all 0.2s ease",
                          boxShadow:
                            "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#3b82f6";
                          e.target.style.boxShadow =
                            "0 0 0 2px rgba(59, 130, 246, 0.5)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#d1d5db";
                          e.target.style.boxShadow =
                            "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
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
                          width: "100%",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.5rem",
                          padding: "0.75rem 1rem",
                          outline: "none",
                          transition: "all 0.2s ease",
                          boxShadow:
                            "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#3b82f6";
                          e.target.style.boxShadow =
                            "0 0 0 2px rgba(59, 130, 246, 0.5)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#d1d5db";
                          e.target.style.boxShadow =
                            "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
                        }}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    )}
                  </div>
                )
              )}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "end",
                margin: "10px 0px",
              }}
            >
              {service.endpoint === "account-aggregator-v2/fetch-json-report" && aaClientId && (
                <button
                  type="button"
                  onClick={() => fetchAAReport(aaClientId)}
                  disabled={loading}
                  style={{
                    marginRight: "10px",
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#10b981",
                    color: "white",
                    borderRadius: "0.5rem",
                    fontWeight: "600",
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  Fetch Report
                </button>
              )}
              <button
                type="submit"
                style={{
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  fontWeight: "600",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: loading ? 0.9 : 1,
                }}
                onMouseOver={(e) => {
                  e.target.style.boxShadow =
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
                }}
                onMouseOut={(e) => {
                  e.target.style.boxShadow =
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                }}
                disabled={loading}
                className="brandorange-bg-light brandorange-text"
              >
                {loading ? (
                  <>
                    <div
                      style={{
                        animation: "spin 1s linear infinite",
                        marginRight: "0.75rem",
                        width: "1.25rem",
                        height: "1.25rem",
                        border:
                          "2px solid rgba(255, 255, 255, 0.3)",
                        borderTopColor: "white",
                        borderRadius: "50%",
                      }}
                    ></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Submit
                    <svg
                      style={{
                        marginLeft: "0.5rem",
                        width: "1.25rem",
                        height: "1.25rem",
                      }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </>
                )}
              </button>
            </div>

            {response && (
              <div
                className="mt-6"
                style={{
                  marginTop: "1.5rem",
                  padding: "1.5rem",
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  transition: "all 0.3s ease",
                  transform: "scale(1)",
                  alignSelf: "flex-start",
                  maxWidth: "1000px",
                }}
              >
                <ApiResponseViewer response={response} />
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
