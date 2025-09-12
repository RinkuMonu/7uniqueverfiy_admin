"use client"

import type React from "react"
import { FileText, FileDown } from "lucide-react"
import html2pdf from "html2pdf.js"
import "./service.css"

interface ApiResponseViewerProps {
  response: any
}

const ApiResponseViewer: React.FC<ApiResponseViewerProps> = ({ response }) => {

  // For Base64 PDFs
  const downloadBase64PDF = (base64: string, filename = "document.pdf") => {
    const link = document.createElement("a")
    link.href = `data:application/pdf;base64,${base64}`
    link.download = filename
    link.click()
  }

  // For normal file URLs
  const downloadFile = (url: string, filename = "report.pdf") => {
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const generatePDFFromResponse = () => {
    const flattenedData = flattenObject(response);
    const imageSrc = window.location.origin + "/letter.png";

    const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333;">
      <div style="padding-bottom: 15px; margin-bottom: 30px; text-align:center;">
      </div>

      <table style="
        width: 100%; 
        margin-top: 80px; 
        margin-bottom: 80px; 
        border-radius: 8px; 
        overflow: hidden;
      ">
        <tbody>
          ${Object.entries(flattenedData)
        .map(
          ([key, value], index) => `
                <tr style="background: ${index % 2 === 0 ? "#fafafa" : "#ffffff"}; border:none">
                  <td style="
                    padding: 12px 16px; 
                    font-weight: 600; 
                    color: #444; 
                    width: 30%; 
                  ">
                  ${key
              .replace(/_/g, " ")              
              .replace(/\b\w/g, c => c.toUpperCase())}
                  </td>
                  <td style="
                    padding: 12px 16px; 
                    color: #212529; 
                    word-break: break-word; 
                  ">
                    ${String(value)}
                  </td>
                </tr>
              `
        )
        .join("")}
        </tbody>
      </table>
    </div>
  `;

    const element = document.createElement("div");
    element.innerHTML = htmlContent;

    // ✅ Background image fix
    element.style.background = `url(${imageSrc}) no-repeat center top`;
    element.style.backgroundSize = "contain"; // maintain full image without cutting
    element.style.backgroundRepeat = "no-repeat";
    element.style.padding = "40px";

    const opt = {
      margin: 0.5,
      filename: `api-response-${Date.now()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };


  const hasExistingDownload = (data: any): boolean => {
    const flattenedData = flattenObject(data)
    return Object.entries(flattenedData).some(
      ([key, value]) =>
        (key.toLowerCase().includes("download") && typeof value === "string") ||
        (typeof value === "string" && value.startsWith("JVBER"))
    )
  }

  const flattenObject = (obj: any): Record<string, any> => {
    const flattened: Record<string, any> = {}

    const processObject = (current: any) => {
      if (!current || typeof current !== "object") return

      for (const [key, value] of Object.entries(current)) {
        if (
          [
            "statuscode",
            "status",
            "metadata",
            "timestamp",
            "version",
            "environment",
            "region",
            "requestId",
            "requestTime",
            "responseTime",
            "download_at"
          ].includes(key.toLowerCase())
        ) {
          continue
        }

        if (Array.isArray(value)) {
          value.forEach((item) => {
            if (item && typeof item === "object") {
              processObject(item)
            }
          })
        } else if (value && typeof value === "object") {
          processObject(value)
        } else if (value !== null && value !== undefined && value !== "") {
          flattened[key] = value
        }
      }
    }

    processObject(obj)
    return flattened
  }

  const renderValue = (key: string, value: any) => {
    // Direct file link (credit_report_link etc.)
    if (
      (key.toLowerCase().includes("download") || key.toLowerCase().includes("link")) &&
      typeof value === "string" &&
      value.startsWith("http")
    ) {
      return (
        <button
          onClick={() => downloadFile(value, `${key}.pdf`)}
          className="btn btn-warning px-4 py-2 fw-semibold shadow-sm flex bg-orange-100 gap-3 items-center rounded-full"
        >
          <FileDown className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
          Download PDF
        </button>
      )
    }

    // Inline Base64 PDF
    if (typeof value === "string" && value.startsWith("JVBER")) {
      return (
        <button
          onClick={() => downloadBase64PDF(value)}
          className="btn btn-warning px-4 py-2 fw-semibold shadow-sm flex bg-orange-100 gap-3 items-center rounded-full"
        >
          <FileText className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
          Download PDF
        </button>
      )
    }

    return <span className="text-gray-800 break-words">{String(value)}</span>
  }

  const flattenedData = flattenObject(response)

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse"></div>
            <h3 className="text-xl font-bold text-gray-900">Summary</h3>
          </div>
          {(response?.data?.success === true || response?.data?.status === true) &&
            !hasExistingDownload(response) &&
            Object.keys(flattenedData).length > 0 && (
              <button
                onClick={generatePDFFromResponse}
                className="btn btn-warning px-4 py-2 fw-semibold shadow-sm flex bg-orange-100 gap-3 items-center rounded-full"
              >
                <FileDown className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200 relative z-10 animate-bounce" />
                <span className="relative z-10">Download as PDF</span>
              </button>
            )}
        </div>
      </div>

      <div className="p-6">
        <div className="max-h-[70vh] overflow-auto">
          {Object.keys(flattenedData).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(flattenedData).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center gap-4 p-4 bg-gray-50 mb-4 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                >
                  <div className="font-semibold text-gray-700 min-w-[120px] text-sm capitalize">
                    {key}:
                  </div>
                  <div className="flex-1 items-center text-sm">{renderValue(key, value)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg p-8 border border-gray-200 text-center text-gray-500">
              No displayable data found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ApiResponseViewer
