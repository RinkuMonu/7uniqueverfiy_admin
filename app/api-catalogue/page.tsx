"use client";

import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MainContext } from "../context/context";
import axiosInstance from "@/components/service/axiosInstance";
import { FaEdit, FaPlus, FaMinus, FaServer } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

import "./style.css";
import { PiTrashLight } from "react-icons/pi";

export default function APICataloguePage() {
  const { tostymsg, allService, services, totalPages } =
    useContext(MainContext);
  const { admin } = useSelector((state) => state.admin);
  const [showModal, setShowModal] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [minCharge, setMinCharge] = useState("");
  const [maxCharge, setMaxCharge] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [formFields, setFormFields] = useState([
    {
      name: "",
      charge: "",
      active_charge: "",
      status: "",
      category: "",
      source: "",
      descreption: "",
      endpoint: "",
      method: "POST",
      fields: [{ label: "", name: "", type: "text", required: true }],
    },
  ]);

  const showService = admin?.role == 'admin' ? services : admin?.services;

  console.log(admin?.customServiceCharges);
  console.log(showService);


  useEffect(() => {
    allService(
      page,
      limit,
      search,
      methodFilter,
      minCharge,
      maxCharge,
      activeOnly,
      categoryFilter
    );
  }, [
    page,
    page,
    limit,
    search,
    methodFilter,
    minCharge,
    maxCharge,
    activeOnly,
    categoryFilter
  ]);

  const handleChange = (index, e) => {

    const updated = [...formFields];
    const fieldName = e.target.name.replace(/-\d+$/, ""); // handles "status-0" → "status"
    updated[index][fieldName] =
      e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setFormFields(updated);
  };




  const handleFieldChange = (
    formIndex: number,
    fieldIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updated = [...formFields];
    const field = updated[formIndex].fields[fieldIndex];
    const { name, type, checked, value } = e.target;
    if (field && typeof field === "object" && name in field) {
      (field as any)[name] = type === "checkbox" ? checked : value;
    }
    setFormFields(updated);
  };

  const addField = () => {
    setFormFields([
      ...formFields,
      {
        name: "",
        charge: "",
        active_charge: "",
        status: "",
        category: "",
        source: "",
        descreption: "",
        endpoint: "",
        method: "POST",
        fields: [{ label: "", name: "", type: "text", required: true }],
      },
    ]);
  };

  const removeField = (index) => {
    const updated = [...formFields];
    updated.splice(index, 1);
    setFormFields(updated);
  };

  const addInputField = (index) => {
    const updated = [...formFields];
    updated[index].fields.push({
      label: "",
      name: "",
      type: "text",
      required: true,
    });
    setFormFields(updated);
  };

  const removeInputField = (formIndex, fieldIndex) => {
    const updated = [...formFields];
    updated[formIndex].fields.splice(fieldIndex, 1);
    setFormFields(updated);
  };

  const openEditModal = (api) => {
    setShowEdit(true);
    setShowModal(true);
    setEditId(api._id);
    setFormFields([
      {
        name: api.name,
        charge: api.charge,
        active_charge: api.active_charge,
        status: api.status,
        category: api.category,
        source: api.source,
        descreption: api.descreption,
        endpoint: api.endpoint,
        method: api.method,
        fields: api.fields || [],
      },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (showEdit) {
        const data = formFields[0];
        const res = await axiosInstance.put(
          `/admin/update-service/${editId}`,
          data
        );
        tostymsg(res.data.message, 1);
      } else {
        const res = await axiosInstance.post("/admin/add-services", {
          services: formFields[0],
        });

        tostymsg(res.data.message, 1);
      }
      setShowModal(false);
      setShowEdit(false);
      resetForm();
      allService(
        page,
        limit,
        search,
        methodFilter,
        minCharge,
        maxCharge,
        activeOnly,
        categoryFilter
      );
    } catch (error) {
      tostymsg(error.response?.data?.message || "Something went wrong", 0);
    }
  };




  const resetForm = () => {
    setFormFields([
      {
        name: "",
        charge: "",
        active_charge: "",
        status: "",
        category: "",
        source: "",
        descreption: "",
        endpoint: "",
        method: "POST",
        fields: [{ label: "", name: "", type: "text", required: true }],
      },
    ]);
  };

  const getMethodClass = (method) => {
    if (method === "GET") return "bg-green-100 text-green-800";
    if (method === "POST") return "bg-blue-100 text-blue-800";
    if (method === "PUT") return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  const getStatusClass = (status) => {
    if (status === "Active") return "bg-green-100 text-green-800";
    if (status === "Beta") return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="p-6 font-sans bg-gray-50 min-h-screen">
      {admin?.role === "admin" && (
        <div className=" mb-6 card custom-card overflow-auto">
          {/* Header */}
          <div className="md:flex justify-between text-black-600 mb-6 card-header">
            <div style={{ alignItems: "center", gap: "8px" }} className="flex">
              <FaServer
                style={{
                  color: "black",

                  marginRight: "8px",
                }}
                className="card-title"
              />
              <h1 className="text-2xl card-title">API Catalogue</h1>
            </div>
            <div className="flex justify-center mt-2 md:mt-0 md:block  ">
              <button
                onClick={() => {
                  setShowEdit(false);
                  resetForm();
                  setShowModal(true);
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: "6px",
                  padding: "8px 12px",
                  fontSize: "14px",
                  fontWeight: 500,
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  cursor: "pointer",
                  border: "none",
                  outline: "none",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f9c4ad")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#fde8df")
                }
                className="brandorange-bg-light brandorange-text"
              >
                <FaPlus className="mr-2" />
                Add New API
              </button>
            </div>
          </div>

          {/* Filters */}
          <div
            style={{
              alignItems: "center",
              gap: "16px",
              marginBottom: "16px",
              width: "100%",
            }}
            className="md:flex p-4"
          >
            <div style={{ position: "relative", flex: 1 }} className="">
              <FaSearch
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9CA3AF",
                }}
              />
              <input
                type="text"
                placeholder="Search by API name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: "8px 12px 8px 36px",
                  borderRadius: "6px",
                  border: "1px solid #D1D5DB",
                  width: "100%",
                  fontSize: "14px",
                }}
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #D1D5DB",
                fontSize: "14px",
                flex: 1,
              }}
              className="py-1"
            >
              <option value="">All Categories</option>
              <option value="banking">Banking</option>
              <option value="employment">Employment</option>
              <option value="esign">eSign</option>
              <option value="identity">Identity</option>
              <option value="merchant">Merchant</option>
              <option value="osv">OSV</option>
              <option value="sms">SMS</option>
              <option value="vision">Vision</option>
              <option value="financial">Financial</option>
              <option value="utilities">Utilities</option>
            </select>

            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #D1D5DB",
                fontSize: "14px",
                flex: 1,
              }}
              className="py-1"
            >
              <option value="">All Methods</option>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>

            <div style={{ gap: "8px", flex: 1 }} className="py-1 md:flex">
              <input
                type="number"
                placeholder="Min Charge"
                value={minCharge}
                onChange={(e) => setMinCharge(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #D1D5DB",
                  fontSize: "14px",
                  width: "100%",
                }}
                className="my-1"
              />
              <input
                type="number"
                placeholder="Max Charge"
                value={maxCharge}
                onChange={(e) => setMaxCharge(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #D1D5DB",
                  fontSize: "14px",
                  width: "100%",
                }}
                className="py-1"
              />
            </div>
          </div>

        </div>
      )}

      <div className="card custom-card shadow-md rounded-2xl overflow-hidden bg-white">
        {/* Header */}
        <div className="card-header flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Catalogue Table</h2>
        </div>

        {/* Body */}
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">API Name</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Charge</th>
                  <th className="px-4 py-3">Custom Charge</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Status</th>
                  {admin?.role === "admin" && <th className="px-4 py-3">Actions</th>}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {showService?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                      No APIs found.
                    </td>
                  </tr>
                ) : (
                  showService?.map((api, index) => {
                    const matchedCharge = admin?.customServiceCharges.find(
                      (charge) => charge.service === api?._id
                    );
                    return (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {/* API Name */}
                        <td className="px-4 py-3 max-w-xs">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {api?.name}
                          </p>
                        </td>

                        {/* Method */}
                        <td className="px-4 py-3">
                          <span
                            className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full"
                            style={
                              getMethodClass(api.method).includes("green")
                                ? { backgroundColor: "#DCFCE7", color: "#166534" }
                                : getMethodClass(api.method).includes("blue")
                                  ? { backgroundColor: "#DBEAFE", color: "#1E40AF" }
                                  : getMethodClass(api.method).includes("yellow")
                                    ? { backgroundColor: "#FEF3C7", color: "#92400E" }
                                    : { backgroundColor: "#F3F4F6", color: "#4B5563" }
                            }
                          >
                            {api.method}
                          </span>
                        </td>

                        {/* Charges */}
                        <td className="px-4 py-3 font-mono text-gray-700">
                          ₹{api?.charge}
                        </td>
                        <td className="px-4 py-3 font-mono text-gray-700">
                          ₹{matchedCharge?.customCharge ?? 0}
                        </td>

                        {/* Description */}
                        <td className="px-4 py-3 max-w-sm">
                          <textarea
                            value={api?.descreption || ""}
                            readOnly
                            rows={2}
                            className="w-full resize-none bg-transparent border border-gray-200 rounded-md px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-400"
                          />
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3 text-gray-700">{api?.status}</td>

                        {/* Actions */}
                        {admin?.role === "admin" && (
                          <td className="px-4 py-3">
                            <button
                              onClick={() => openEditModal(api)}
                              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-orange-700 bg-orange-100 rounded-lg hover:bg-orange-200 transition-colors"
                            >
                              <FaEdit size={12} />
                              Edit
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {admin?.role === "admin" && (
            <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={`px-4 py-2 rounded-md text-sm font-medium ${page <= 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                  }`}
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${page >= totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                  }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>


      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl ">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2" style={{ color: "#ca6f4aff" }}>
              <FaServer className="h-5 w-5 " />
              {showEdit ? "Edit API" : "Create New API"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 max-h-[90vh] overflow-y-auto">
            {formFields.map((field, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg bg-card">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`name-${index}`}>API Name</Label>
                    <Input
                      id={`name-${index}`}
                      name="name"
                      placeholder="Enter API name"
                      value={field.name}
                      onChange={(e) => handleChange(index, e)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`charge-${index}`}>Charge</Label>
                    <Input
                      id={`charge-${index}`}
                      name="charge"
                      type="number"
                      placeholder="0.00"
                      value={field.charge}
                      onChange={(e) => {
                        const value = e.target.value
                        const regex = /^\d*\.?\d*$/
                        if (regex.test(value)) {
                          handleChange(index, e)
                        }
                      }}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`active_charge-${index}`}>Active Charge</Label>
                    <Input
                      id={`active_charge-${index}`}
                      name="active_charge"
                      type="number"
                      placeholder="0.00"
                      value={field.active_charge}
                      onChange={(e) => {
                        const value = e.target.value
                        const regex = /^\d*\.?\d*$/
                        if (regex.test(value)) {
                          handleChange(index, e)
                        }
                      }}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`endpoint-${index}`}>Endpoint</Label>
                    <Input
                      id={`endpoint-${index}`}
                      name="endpoint"
                      placeholder="/api/endpoint"
                      value={field.endpoint}
                      onChange={(e) => handleChange(index, e)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`method-${index}`}>Method</Label>
                    <Select
                      value={field.method}
                      onValueChange={(value) => handleChange(index, { target: { name: "method", value } })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`category-${index}`}>Category</Label>
                    <Select
                      value={field.category}
                      onValueChange={(value) => handleChange(index, { target: { name: "category", value } })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="banking">Banking</SelectItem>
                        <SelectItem value="employment">Employment</SelectItem>
                        <SelectItem value="esign">eSign</SelectItem>
                        <SelectItem value="identity">Identity</SelectItem>
                        <SelectItem value="merchant">Merchant</SelectItem>
                        <SelectItem value="osv">OSV</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="vision">Vision</SelectItem>
                        <SelectItem value="financial">Financial</SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`source-${index}`}>Source</Label>
                    <Select
                      value={field.source}
                      onValueChange={(value) => handleChange(index, { target: { name: "source", value } })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sprintverify">Sprint Verify</SelectItem>
                        <SelectItem value="surpass">Surpass</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`status-${index}`}>Status</Label>
                    <Select
                      value={field.status}
                      onValueChange={(value) => handleChange(index, { target: { name: "status", value } })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4 md:col-span-2 lg:col-span-1">
                    <Label htmlFor={`descreption-${index}`}>Description</Label>
                    <Textarea
                      id={`descreption-${index}`}
                      name="descreption"
                      placeholder="Enter API description"
                      value={field.descreption}
                      onChange={(e) => handleChange(index, e)}
                      rows={3}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">API Fields</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addInputField(index)}
                      className="flex items-center gap-2"
                    >
                      <FaPlus className="h-3 w-3" />
                      Add Field
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {field.fields.map((f: any, i: number) => (
                      <div key={i} className="flex gap-3 items-end p-3 bg-muted/30 rounded-lg">
                        <div className="flex-1 space-y-2">
                          <Label className="text-xs">Label</Label>
                          <Input
                            name="label"
                            placeholder="Field label"
                            value={f.label}
                            onChange={(e) => handleFieldChange(index, i, e)}
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <Label className="text-xs">Name</Label>
                          <Input
                            name="name"
                            placeholder="field_name"
                            value={f.name}
                            onChange={(e) => handleFieldChange(index, i, e)}
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <Label className="text-xs">Type</Label>
                          <Select
                            value={f.type}
                            onValueChange={(value) => handleFieldChange(index, i, { target: { name: "type", value } })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="file">File</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center space-x-2 pb-2">
                          <Checkbox
                            id={`required-${index}-${i}`}
                            checked={f.required}
                            onCheckedChange={(checked) =>
                              handleFieldChange(index, i, { target: { name: "required", type: "checkbox", checked } })
                            }
                          />
                          <Label htmlFor={`required-${index}-${i}`} className="text-xs">
                            Required
                          </Label>
                        </div>
                        {field.fields.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeInputField(index, i)}
                            className="text-destructive hover:text-destructive"
                          >
                            <PiTrashLight className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {!showEdit && formFields.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeField(index)}
                    className="text-destructive hover:text-destructive flex items-center gap-2"
                  >
                    <FaMinus className="h-3 w-3" />
                    Remove API
                  </Button>
                )}
              </div>
            ))}

            {!showEdit && (
              <Button
                type="button"
                variant="outline"
                onClick={addField}
                className="flex items-center gap-2 bg-transparent"
              >
                <FaPlus className="h-4 w-4" />
                Add Another API
              </Button>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-orange-500 hover:bg-orange-700 text-primary-foreground">
                {showEdit ? "Update API" : "Create API"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
