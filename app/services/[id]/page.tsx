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
  const { id } = use(params);

  const { admin } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  const [service, setService] = useState(null);
  const [formData, setFormData] = useState({});
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aaClientId, setAaClientId] = useState("");
  const [isAaCallback, setIsAaCallback] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const hiddenFields = ["client_id", "transaction_id", "request_id"];

  const refIds = useRef({
    client_id: "",
    transaction_id: "",
  });

  const shouldAutoCall =
    service?.fields?.every((field) => hiddenFields.includes(field.name));

  const apiFlowMap = {
    "/adhar/send/otp": { nextStep: "/adhar/verify/otp", needs: "client_id" },
    "/send_telecom_otp": { nextStep: "/verify_telecom_otp", needs: "client_id" },
    "/aadhaar/eaadhaar/generate-otp": { nextStep: "/aadhaar/eaadhaar/submit-otp", needs: "client_id" },
    "/bank-statement-analyzer/upload": { nextStep: "/bank-statement-analyzer/report-fetch", needs: "transaction_id" },
    "/send_epfo_otp": {
      nextStepOptions: [
        { label: "Verify OTP", step: "/verify_epfo_otp" },
        { label: "Download Passbook", step: "/epfo_passbook_download" },
      ],
      needs: "client_id",
    },
    "/verify_epfo_otp": { needs: "client_id" },
    "/epfo_passbook_download": { needs: "client_id" },
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
    "/crime_report_download_pdf": { needs: "request_id" },
    "/crime_report_download_json": { needs: "request_id" },
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
        { step: "/itr/get-26as-details/itr_LkksSlHruoCsxgigbaol", label: "Get 26AS (TDS) Details" },
        { step: "/itr/download-ais-v2", label: "Download ITR" },
        { step: "/itr/get-ais", label: "Get AIS" },
      ],
      label: "Create ITR Client",
      needs: "client_id",
    },
    "/bank/statement/upload": { nextStep: "bank/statement/download", needs: "client_id" },
    "/account-aggregator-v2/init": { nextStep: "/account-aggregator-v2/fetch-json-report", needs: "client_id" },
    "/account-aggregator-v2/fetch-json-report": { nextStep: "", needs: "client_id" },
  };

  // AUTO CALL
  useEffect(() => {
    if (!shouldAutoCall || !service) return;

    const autoCall = async () => {
      try {
        const payload = {};
        console.log("service = ",service);
        console.log("formData = ",formData);

        service.fields.forEach((field) => {
          payload[field.name] = formData[field.name] || "abc";
        });

        const environment = admin?.environment_mode ? "production" : "credentials";
        const envConfig = admin?.[environment];

        if (!envConfig?.jwtSecret || !envConfig?.authKey) {
          throw new Error("❌ Missing JWT secret or auth key");
        }

        const token = await generateToken(
          { userId: admin._id, email: admin.email, role: admin.role },
          envConfig?.jwtSecret
        );

        setLoading(true);
        const endpointUrl = `https://api.7uniqueverfiy.com/api/verify/${service.endpoint}`;

        const res = await axios.post(endpointUrl, payload, {
          headers: {
            "client-id": envConfig.authKey,
            authorization: `Bearer ${token}`,
            "x-env": environment,
          },
        });

        setResponse(res.data);
        const Swal = (await import("sweetalert2")).default;
        Swal.fire({
          icon: res.data?.status || res.data?.success ? "success" : "error",
          text: res.data?.message || "API called successfully!",
        });
      } catch (err) {
        const Swal = (await import("sweetalert2")).default;
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
  }, [service, shouldAutoCall, admin, formData]);

  // LOAD SERVICE META
  useEffect(() => {
    if (id) {
      axiosInstance
        .get(`/user/service/${id}`)
        .then((res) => {
          const serviceData = res.data.data;
          setService(serviceData);
          if (serviceData.endpoint === "account-aggregator-v2/fetch-json-report") {
            const savedClientId = localStorage.getItem("aa_client_id");
            if (savedClientId) setAaClientId(savedClientId);
          }
        })
        .catch((err) => console.error("Service fetch error:", err));
    }
  }, [id]);

  const fetchAAReport = async (clientIdFromParam) => {
    const finalClientId = clientIdFromParam || aaClientId || localStorage.getItem("aa_client_id");

    if (!finalClientId) {
      const Swal = (await import("sweetalert2")).default;
      Swal.fire("Error", "Client ID nahi mila. Dubara koshish karein.", "error");
      return;
    }

    try {
      setLoading(true);
      const environment = admin?.environment_mode ? "production" : "credentials";
      const envConfig = admin?.[environment];
      const token = await generateToken(
        { userId: admin._id, email: admin.email, role: admin.role },
        envConfig?.jwtSecret
      );

      const res = await axios.post(
        "https://api.7uniqueverfiy.com/api/verify/account-aggregator-v2/fetch-json-report",
        { client_id: finalClientId },
        {
          headers: {
            "Content-Type": "application/json",
            "client-id": envConfig.authKey,
            authorization: `Bearer ${token}`,
            "x-env": environment,
          },
        }
      );
      setResponse(res.data);
    } catch (err) {
      console.error("Payload error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    console.log("e.target 234 = ",e.target);
    console.log("formData 234 = ",formData);

    const { name, type, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const hasFile = service.fields.some((field) => field.type === "file");
      let requestData;
      let headers = {};

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

      const environment = admin?.environment_mode ? "production" : "credentials";
      const envConfig = admin?.[environment];

      const token = await generateToken(
        { userId: admin._id, email: admin.email, role: admin.role },
        envConfig?.jwtSecret
      );

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
      console.log("result line 289 = ",result);
      if (result.success) dispatch(fetchAdminDetails());

      if (service.endpoint === "account-aggregator-v2/init" && result.success) {
        const client_id = result.data?.client_id;
        const redirect_url = result.data?.redirect_url;

        localStorage.setItem("aa_client_id", client_id);
        setAaClientId(client_id);
        
        const Swal = (await import("sweetalert2")).default;
        const { isConfirmed } = await Swal.fire({
          icon: "info",
          title: "Redirecting to Bank Consent",
          html: `<p>Client ID: ${client_id}</p>`,
          showCancelButton: true,
          confirmButtonText: "Continue",
        });

        if (isConfirmed) {
          setIsRedirecting(true);
          window.location.href = redirect_url;
        }
        return;
      }
      console.log("result line 313 = ",result);
      setResponse(result);
      const flow = apiFlowMap[`/${service.endpoint}`];

      if (result.success && flow?.needs) {
        const idKey = flow.needs;
        console.log("line 319 result = ",result.data);
        const idValue = result.data?.data?.[idKey] || result.data?.[idKey];

        if (idKey && idValue) {
          console.log("line 322");
          console.log("idKey = ",idKey);

          console.log("idValue = ",idValue);

          setFormData((prev) => ({ ...prev, [idKey]: idValue }));
          if (flow.nextStep) {
            const nextService = admin?.services.find(s => s.endpoint === flow.nextStep.replace(/^\//, ""));
            if (nextService) setService(nextService);
          } else if (flow.nextStepOptions?.length > 0) {
            const Swal = (await import("sweetalert2")).default;
            const { isConfirmed, value } = await Swal.fire({
              title: "What would you like to do next?",
              input: "radio",
              inputOptions: flow.nextStepOptions.reduce((acc, opt) => ({ ...acc, [opt.step]: opt.label }), {}),
            });
            if (isConfirmed && value) {
              const nextService = admin?.services.find(s => s.endpoint === value.replace(/^\//, ""));
              if (nextService) setService(nextService);
            }
          }
        }
      }
    } catch (err) {
      const Swal = (await import("sweetalert2")).default;
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isRedirecting ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Redirecting...</h2>
        </div>
      ) : !service ? (
        <p className="text-center mt-10">Loading service details...</p>
      ) : (
        <div style={{ margin: "0 auto", marginTop: "2.5rem" }} className="card custom-card">
          <Button variant="outline" onClick={() => window.history.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Use Another API
          </Button>
          <div className="card-header"><h1 className="card-title">{service.name}</h1></div>
          <div className="p-4">
            {service.endpoint === "account-aggregator-v2/fetch-json-report" && aaClientId && (
              <button onClick={() => fetchAAReport(aaClientId)} disabled={loading} className="bg-green-600 text-white p-2 rounded">
                Fetch Report Now
              </button>
            )}
            {!shouldAutoCall && (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-12 gap-4">
                  {service?.fields?.map((field) => (
                    <div key={field.name} className="col-span-12 sm:col-span-6">
                      <label>{field.label}</label>
                      <input
                        type={field.type || "text"}
                        name={field.name}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required={field.required}
                      />
                    </div>
                  ))}
                </div>
                <button type="submit" disabled={loading} className="mt-4 bg-blue-600 text-white p-2 rounded">
                  {loading ? "Processing..." : "Submit"}
                </button>
              </form>
            )}
            {response && <ApiResponseViewer response={response} />}
          </div>
        </div>
      )}
    </>
  );
}