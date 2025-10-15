// 'use client';

// import { useEffect, useState } from 'react';
// import axiosInstance from '@/components/service/axiosInstance';
// import { toast } from 'react-toastify';
// import { Button } from '@/components/ui/button';
// import { Checkbox } from '@/components/ui/checkbox';
// import {
//     Select, SelectContent, SelectItem, SelectTrigger, SelectValue
// } from '@/components/ui/select';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { FiTool, FiCheck, FiPackage, FiSettings } from 'react-icons/fi';
// import './assignservices.css'; // External CSS file

// export default function AssignServicesPage() {
//     const [users, setUsers] = useState([]);
//     const [services, setServices] = useState([]);
//     const [selectedUserId, setSelectedUserId] = useState('');
//     const [selectedServices, setSelectedServices] = useState([]);
//     const [showChargeModal, setShowChargeModal] = useState(false);
//     const [selectedApiInfo, setSelectedApiInfo] = useState({ _id: '', name: '', charge: 0 });
//     const [customCharge, setCustomCharge] = useState('');
//     const [customService, setCustomService] = useState([]);


//     const handleOpenChargeModal = (api) => {
//         if (!selectedServices.includes(api._id)) {
//             setSelectedServices((prev) => [...prev, api._id]);
//         }
//         setSelectedApiInfo({ _id: api._id, name: api.name, charge: api.charge });
//         setShowChargeModal(true);
//     };

//     const saveCharge = () => {
//         setCustomService((pre) => {
//             const updateData = [...pre]
//             const axistData = updateData.findIndex(data => data.service == selectedApiInfo._id);
//             if (axistData !== -1) {
//                 updateData[axistData].customCharge = Number(customCharge)
//             } else {
//                 updateData.push({
//                     service: selectedApiInfo._id,
//                     customCharge: Number(customCharge),
//                 })
//             }
//             return updateData;
//         })
//         setShowChargeModal(false);
//         setCustomCharge('');
//     }

//     useEffect(() => {
//         fetchUsers();
//         fetchServices();
//     }, []);

//     const fetchUsers = async () => {
//         try {
//             const res = await axiosInstance.get('/admin/users');
//             setUsers(res.data.users || []);
//         } catch (err) {
//             toast.error('Failed to fetch users');
//         }
//     };

//     const fetchServices = async () => {
//         try {
//             const res = await axiosInstance.get('/admin/services');
//             setServices(res.data.services || []);
//         } catch (err) {
//             toast.error('Failed to fetch services');
//         }
//     };

//     const toggleService = (id) => {
//         setSelectedServices((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
//         );
//     };

//     const handleAssignSelectedServices = async () => {
//         if (!selectedUserId || selectedServices.length === 0) {
//             return toast.warn("Please select user and services");
//         }

//         try {
//             const res = await axiosInstance.post('/admin/assign-services', {
//                 userId: selectedUserId,
//                 services: selectedServices,
//                 customCharge: customService
//             });
//             console.log(res);

//             toast.success(res.data.message);
//             setSelectedServices([]);
//             setCustomService([])
//         } catch (err) {
//             toast.error('Failed to assign services');
//         }
//     };

//     const handleAssignAllServices = async () => {
//         if (!selectedUserId) return toast.warn("Please select a user");

//         try {
//             await axiosInstance.post('/admin/assign-services-bulk', { userId: selectedUserId });
//             toast.success('All services assigned to user');
//         } catch (err) {
//             toast.error('Failed to assign all services');
//         }
//     };

//     return (
//         <div className="card custom-card ">
//             <Card className="">
//                 <div className='card-header'>
//                     <div className=" text-left flex " style={{ "fontSize": "1.1rem", "fontWeight": "600" }}>
//                         <FiTool className=" me-1 mt-1" />
//                         Assign Services
//                     </div>
//                 </div>
//                 <CardContent className="card-content">
//                     {/* Select User */}
//                     <div className="form-group">
//                         <label className="form-label">Select User</label>
//                         <Select onValueChange={(val) => setSelectedUserId(val)}>
//                             <SelectTrigger className="select-input">
//                                 <SelectValue placeholder="Choose a user" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {users.map((user) => (
//                                     <SelectItem key={user._id} value={user._id}>
//                                         {user.name} ({user.email})
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     {/* Services */}
//                     <div className="form-group">
//                         <label className="form-label">Select Services</label>
//                         <div className="services-grid">
//                             {services.map((service) => (
//                                 < div key={service._id} className='flex items-center justify-between'>
//                                     <div>
//                                         <label className="service-item">
//                                             <Checkbox
//                                                 checked={selectedServices.includes(service._id)}
//                                                 onCheckedChange={() => toggleService(service._id)}
//                                                 className='border-[#c3653d] brandorange-bg-light brandorange-text'
//                                             />
//                                             <span className="service-name">{service.name}</span>
//                                         </label>
//                                     </div>
//                                     <button className='pl-3' title="Custom Charge" onClick={() => handleOpenChargeModal(service)}>
//                                         <FiSettings className="icon-spacing" />
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                     {showChargeModal && (
//                         <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center">
//                             <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
//                                 <button
//                                     className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-lg"
//                                     onClick={() => setShowChargeModal(false)}
//                                 >
//                                     ×
//                                 </button>
//                                 <h2 className="text-xl font-semibold mb-4">Add Custom Charge</h2>

//                                 <div className="mb-3">
//                                     <p className="text-sm text-gray-600"><strong>API Name:</strong> {selectedApiInfo.name}</p>
//                                     <p className="text-sm text-gray-600"><strong>Active Charge:</strong> ₹ {selectedApiInfo.charge}</p>
//                                 </div>

//                                 <div className="mb-4">
//                                     <label className="block mb-1 font-medium text-gray-700">Custom Charge (₹)</label>
//                                     <input
//                                         type="text"
//                                         className="w-full border px-3 py-2 rounded outline-none focus:ring-2 focus:ring-orange-300"
//                                         value={customCharge}
//                                         onChange={(e) => {
//                                             const value = e.target.value;
//                                             if (/^\d*$/.test(value)) {
//                                                 setCustomCharge(value);
//                                             }
//                                         }}
//                                         placeholder="Enter custom charge"
//                                     />
//                                 </div>

//                                 <div className="flex justify-end">
//                                     <button
//                                         className="brandorange-bg-light brandorange-text px-3 py-1 rounded-md"
//                                         onClick={() => {
//                                             saveCharge()
//                                         }}
//                                     >
//                                         Save
//                                     </button>

//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* Action Buttons */}
//                     <div className="action-buttons">
//                         <Button
//                             variant="outline"
//                             onClick={handleAssignAllServices}
//                             className="assign-all-btn"
//                         >
//                             <FiPackage className="icon-spacing" />
//                             Assign All Services
//                         </Button>
//                         <Button
//                             onClick={handleAssignSelectedServices}
//                             disabled={!selectedUserId || selectedServices.length === 0}
//                             className="brandorange-bg-light brandorange-text"
//                         >
//                             <FiCheck className="brandorange-bg-light brandorange-text" />
//                             Assign Selected Services
//                         </Button>
//                     </div>
//                 </CardContent>
//             </Card>
//         </div >
//     );
// }




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
import { FiTool, FiCheck, FiPackage, FiSettings, FiSearch } from 'react-icons/fi';
import './assignservices.css'; // External CSS file

export default function AssignServicesPage() {
    const [users, setUsers] = useState([]);
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedServices, setSelectedServices] = useState([]);
    const [showChargeModal, setShowChargeModal] = useState(false);
    const [selectedApiInfo, setSelectedApiInfo] = useState({ _id: '', name: '', charge: 0 });
    const [customCharge, setCustomCharge] = useState('');
    const [customService, setCustomService] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const handleOpenChargeModal = (api) => {
        if (!selectedServices.includes(api._id)) {
            setSelectedServices((prev) => [...prev, api._id]);
        }
        setSelectedApiInfo({ _id: api._id, name: api.name, charge: api.charge });
        setShowChargeModal(true);
    };

    const saveCharge = () => {
        setCustomService((pre) => {
            const updateData = [...pre]
            const axistData = updateData.findIndex(data => data.service == selectedApiInfo._id);
            if (axistData !== -1) {
                updateData[axistData].customCharge = Number(customCharge)
            } else {
                updateData.push({
                    service: selectedApiInfo._id,
                    customCharge: Number(customCharge),
                })
            }
            return updateData;
        })
        setShowChargeModal(false);
        setCustomCharge('');
    }

    useEffect(() => {
        fetchUsers();
        fetchServices();
    }, []);

    // Filter services based on search term
    useEffect(() => {
        if (searchTerm) {
            const filtered = services.filter(service =>
                service.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredServices(filtered);
        } else {
            setFilteredServices(services);
        }
    }, [searchTerm, services]);

    // When user selection changes, load their services
    useEffect(() => {
        if (selectedUserId) {
            loadUserServices(selectedUserId);
        } else {
            setSelectedServices([]);
            setSelectedUser(null);
        }
    }, [selectedUserId]);

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
            setFilteredServices(res.data.services || []);
        } catch (err) {
            toast.error('Failed to fetch services');
        }
    };

    // Load user's existing services
    const loadUserServices = async (userId) => {
        try {
            const res = await axiosInstance.get(`/admin/user/${userId}`);
            const user = res.data.user;
            setSelectedUser(user);
            
           
            if (user.services && user.services.length > 0) {
                setSelectedServices(user.services.map(service => 
                    typeof service === 'object' ? service._id : service
                ));
            } else {
                setSelectedServices([]);
            }
            
            
            if (user.customServiceCharges && user.customServiceCharges.length > 0) {
                setCustomService(user.customServiceCharges);
            } else {
                setCustomService([]);
            }
        } catch (err) {
            toast.error('Failed to load user services');
        }
    };

    const toggleService = (id) => {
        setSelectedServices((prev) => 
            prev.includes(id) 
                ? prev.filter((s) => s !== id) 
                : [...prev, id]
        );
    };

    const handleAssignSelectedServices = async () => {
        if (!selectedUserId || selectedServices.length === 0) {
            return toast.warn("Please select user and at least one service");
        }

        try {
            const res = await axiosInstance.post('/admin/assign-services', {
                userId: selectedUserId,
                services: selectedServices,
                customCharge: customService
            });

            toast.success(res.data.message);
            // Reload user services to reflect changes
            loadUserServices(selectedUserId);
        } catch (err) {
            toast.error('Failed to assign services');
        }
    };

    const handleAssignAllServices = async () => {
        if (!selectedUserId) return toast.warn("Please select a user");

        try {
            await axiosInstance.post('/admin/assign-services-bulk', { userId: selectedUserId });
            toast.success('All services assigned to user');
            // Reload user services
            loadUserServices(selectedUserId);
        } catch (err) {
            toast.error('Failed to assign all services');
        }
    };

    return (
        <div className="card custom-card ">
            <Card className="">
                <div className='card-header'>
                    <div className=" text-left flex " style={{ "fontSize": "1.1rem", "fontWeight": "600" }}>
                        <FiTool className=" me-1 mt-1" />
                        Assign Services
                    </div>
                </div>
                <CardContent className="card-content">
                    {/* Select User and Search Services in one row */}
                    <div className="form-row">
                        {/* Select User */}
                        <div className="form-group">
                            <label className="form-label">Select User</label>
                            <Select 
                                onValueChange={(val) => setSelectedUserId(val)}
                                value={selectedUserId}
                            >
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

                        {/* Services Search */}
                        <div className="form-group">
                            <label className="form-label">Search Services</label>
                            <div className="search-input-container">
                                <FiSearch className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search services by name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                            </div>
                        </div>
                    </div>

                    {/* User Info */}
                    {selectedUser && (
                        <div className="user-info mb-4 p-3 bg-gray-50 rounded-md">
                            <p className="text-sm">
                                <strong>Selected User:</strong> {selectedUser.name} ({selectedUser.email})
                            </p>
                            <p className="text-sm text-gray-600">
                                Currently has {selectedServices.length} services assigned
                            </p>
                        </div>
                    )}

                    {/* Services */}
                    <div className="form-group">
                        <label className="form-label">
                            Select Services 
                            {selectedUser && (
                                <span className="text-sm text-gray-500 ml-2">
                                    (✓ = currently assigned, you can add/remove)
                                </span>
                            )}
                        </label>
                        <div className="services-grid">
                            {filteredServices.map((service) => (
                                <div key={service._id} className='flex items-center justify-between'>
                                    <div>
                                        <label className="service-item">
                                            <Checkbox
                                                checked={selectedServices.includes(service._id)}
                                                onCheckedChange={() => toggleService(service._id)}
                                                className='border-[#c3653d] brandorange-bg-light brandorange-text'
                                            />
                                            <span className="service-name">{service.name}</span>
                                        </label>
                                    </div>
                                    <button className='pl-3' title="Custom Charge" onClick={() => handleOpenChargeModal(service)}>
                                        <FiSettings className="icon-spacing" />
                                    </button>
                                </div>
                            ))}
                            {filteredServices.length === 0 && (
                                <div className="text-center py-4 text-gray-500">
                                    No services found matching your search.
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {showChargeModal && (
                        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center">
                            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
                                <button
                                    className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-lg"
                                    onClick={() => setShowChargeModal(false)}
                                >
                                    ×
                                </button>
                                <h2 className="text-xl font-semibold mb-4">Add Custom Charge</h2>

                                <div className="mb-3">
                                    <p className="text-sm text-gray-600"><strong>API Name:</strong> {selectedApiInfo.name}</p>
                                    <p className="text-sm text-gray-600"><strong>Active Charge:</strong> ₹ {selectedApiInfo.charge}</p>
                                </div>

                                <div className="mb-4">
                                    <label className="block mb-1 font-medium text-gray-700">Custom Charge (₹)</label>
                                    <input
                                        type="text"
                                        className="w-full border px-3 py-2 rounded outline-none focus:ring-2 focus:ring-orange-300"
                                        value={customCharge}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d*$/.test(value)) {
                                                setCustomCharge(value);
                                            }
                                        }}
                                        placeholder="Enter custom charge"
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        className="brandorange-bg-light brandorange-text px-3 py-1 rounded-md"
                                        onClick={() => {
                                            saveCharge()
                                        }}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

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
                            Update Services ({selectedServices.length} selected)
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div >
    );
}