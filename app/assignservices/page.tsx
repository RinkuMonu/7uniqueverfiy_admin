'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/components/service/axiosInstance';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FiTool, FiCheck, FiPackage } from 'react-icons/fi';
import './assignservices.css'; // External CSS file

export default function AssignServicesPage() {
    const [users, setUsers] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedServices, setSelectedServices] = useState([]);

    useEffect(() => {
        fetchUsers();
        fetchServices();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axiosInstance.get('/admin/users');
            setUsers(res.data.users || []);
        } catch (err) {
            toast.error('Failed to fetch users');
        }
    };

    const fetchServices = async () => {
        try {
            const res = await axiosInstance.get('/admin/services');
            setServices(res.data.services || []);
        } catch (err) {
            toast.error('Failed to fetch services');
        }
    };

    const toggleService = (id) => {
        setSelectedServices((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    const handleAssignSelectedServices = async () => {
        if (!selectedUserId || selectedServices.length === 0) {
            return toast.warn("Please select user and services");
        }

        try {
            const res = await axiosInstance.post('/admin/assign-services', {
                userId: selectedUserId,
                services: selectedServices
            });
            console.log(res);

            toast.success(res.data.message);
            setSelectedServices([]);
        } catch (err) {
            toast.error('Failed to assign services');
        }
    };

    const handleAssignAllServices = async () => {
        if (!selectedUserId) return toast.warn("Please select a user");

        try {
            await axiosInstance.post('/admin/assign-services-bulk', { userId: selectedUserId });
            toast.success('All services assigned to user');
        } catch (err) {
            toast.error('Failed to assign all services');
        }
    };

    return (
        <div className="card custom-card ">
            <Card className="">
                <div className='card-header'>
                    <div className=" text-left flex " style={{"fontSize" :"1.1rem" , "fontWeight": "600"}}>
                        <FiTool className=" me-1 mt-1" />
                        Assign Services
                    </div>
                </div>
                <CardContent className="card-content">
                    {/* Select User */}
                    <div className="form-group">
                        <label className="form-label">Select User</label>
                        <Select onValueChange={(val) => setSelectedUserId(val)}>
                            <SelectTrigger className="select-input">
                                <SelectValue placeholder="Choose a user" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((user) => (
                                    <SelectItem key={user._id} value={user._id}>
                                        {user.name} ({user.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Services */}
                    <div className="form-group">
                        <label className="form-label">Select Services</label>
                        <div className="services-grid">
                            {services.map((service) => (
                                <label key={service._id} className="service-item">
                                    <Checkbox
                                        checked={selectedServices.includes(service._id)}
                                        onCheckedChange={() => toggleService(service._id)}
                                        className='border-[#c3653d] brandorange-bg-light brandorange-text'
                                    />
                                    <span className="service-name">{service.name}</span>
                                </label>
                            ))}
                        </div>
                        
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons">
                        <Button
                            variant="outline"
                            onClick={handleAssignAllServices}
                            className="assign-all-btn"
                        >
                            <FiPackage className="icon-spacing" />
                            Assign All Services
                        </Button>
                        <Button
                            onClick={handleAssignSelectedServices}
                            disabled={!selectedUserId || selectedServices.length === 0}
                            className="brandorange-bg-light brandorange-text"
                        >
                            <FiCheck className="brandorange-bg-light brandorange-text" />
                            Assign Selected Services
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}