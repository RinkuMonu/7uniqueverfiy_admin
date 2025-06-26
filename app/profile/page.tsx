"use client";

import { useContext, useEffect, useState } from "react";
import axiosInstance from "@/components/service/axiosInstance";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { MainContext } from "../context/context";
import { fetchAdminDetails } from "../redux/reducer/AdminSlice";

export default function UserProfilePage() {
    const { tostymsg } = useContext(MainContext);
    const { admin } = useSelector((state) => state.admin);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (admin) setForm(admin);
    }, [admin]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const updatedFields = {};
            for (const key in form) {
                if (form[key] !== admin[key]) {
                    updatedFields[key] = form[key];
                }
            }

            const res = await axiosInstance.put(`/user/update/${admin._id}`, updatedFields);
            tostymsg(res.data.message, res.data.status);

            if (res.data.status === 1) {
                dispatch(fetchAdminDetails());
                setEditMode(false);
            }
        } catch (err) {
            console.error("Update failed", err);
            alert("Error updating user");
        }
    };

    if (!form) return <p className="text-center py-8 text-gray-600">Loading user data...</p>;

    return (
        <div className="card card-custom space-y-6">
            <div className="card-header">
                <h1 className="card-title text-black">User Profile</h1>
            </div>

            <div className="grid grid-cols-12 gap-6 p-4 bg-white">
                <div className="col-span-12 lg:col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                        Name
                    </label>
                    <Input
                        id="name"
                        name="name"
                        value={form.name || ""}
                        onChange={handleChange}
                        disabled={!editMode}
                    />
                </div>
                {!editMode && (
                   
                         <div className="col-span-12 lg:col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                        Auth Key
                    </label>
                    <Input
                        id="auth"
                        name="auth"
                        value={form.auth || ""}
                        onChange={handleChange}
                        disabled={!editMode}
                    />
                </div>
                
                   
                )}

                {!editMode && (
                     <div className="col-span-12 lg:col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                        JWT key
                    </label>
                    <Input
                        id="jwt"
                        name="jwt"
                        value={form.jwt || ""}
                        onChange={handleChange}
                        disabled={!editMode}
                    />
                </div>
                )}

                 <div className="col-span-12 lg:col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                        Email
                    </label>
                    <Input
                        id="email"
                        name="email"
                        value={form.email || ""}
                        onChange={handleChange}
                        disabled={!editMode}
                    />
                </div>

                 <div className="col-span-12 lg:col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="role">
                        Role
                    </label>
                    <Input
                        id="role"
                        name="role"
                        value={form.role || ""}
                        onChange={handleChange}
                        disabled={!editMode}
                    />
                </div>
            </div>

            {/* <div className="flex  gap-4 py-6 px-4" style={{"justifyContent" :"end"}}>
                <Button
                    onClick={() => setEditMode((prev) => !prev)}
                    variant={editMode ? "outline" : "secondary"}
                >
                    {editMode ? "Cancel" : "Edit"}
                </Button>
                {editMode && (
                    <Button onClick={handleSubmit} variant="default">
                        Save Changes
                    </Button>
                )}
            </div> */}
        </div>
    );
}
