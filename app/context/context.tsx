'use client';
import '@/app/globals.css';
import Header from "../../components/header";
import { Sidebar } from "../../components/sidebar";
import { createContext, useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { useIsMobile } from "@/hooks/use-mobile";

import { Flip, toast, ToastContainer } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";
import { lsTokenData } from "../redux/reducer/AdminSlice";
import axiosInstance from "../../components/service/axiosInstance";




export const MainContext = createContext();

export const Context = ({ children }) => {
    const isMobile = useIsMobile();
    const admin = useSelector(state => state.admin.token);
    const router = useRouter()
    const pathname = usePathname()
    const dispatch = useDispatch()
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [services, setServices] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    const handleToggleSidebar = () => setSidebarOpen((prev) => !prev);
    const handleNavigate = (route: any) => console.log("Navigating to:");
    const tostymsg = (msg, status) => {
        toast(msg, { type: status ? "success" : "error" });
    };


    // get all Services
    const allService = async (page, limit, search, methodFilter, minCharge, maxCharge, activeOnly) => {
        try {
            const res = await axiosInstance.get(`/admin/services?page=${page}&limit=${limit}&search=${search}&method=${methodFilter}&minCharge=${minCharge}&maxCharge=${maxCharge}&activeOnly=${activeOnly}`);
            setServices(res.data.services);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(
        () => {
            dispatch(lsTokenData())
        }, [admin]
    )
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!admin) {
                router.push('/login');
            }
        }, 200);

        return () => clearTimeout(timeout);
    }, [admin]);


    return (

        <MainContext.Provider value={{ tostymsg, allService, services, totalPages }}>
            <>
                {
                    admin && pathname != "/login" ?
                        <div className="min-h-screen md:flex">
                            {/* Sidebar */}
                            {!isMobile && (
                                <div
                                    className={`transition-all duration-300 h-screen z-30 bg-white shadow ${sidebarOpen ? "w-60" : "w-20"
                                        }`}
                                >
                                    <Sidebar
                                        isOpen={sidebarOpen}
                                        onToggle={handleToggleSidebar}
                                        onNavigate={handleNavigate}
                                    />
                                </div>
                            )}

                            {/* Main Content */}
                            <div className="flex-1 min-h-screen flex flex-col">
                                <Header isOpen={sidebarOpen} onToggle={handleToggleSidebar} />
                                <main className="p-4 flex-1 overflow-auto">
                                    {children}
                                </main>
                            </div>
                        </div>

                        :
                        (
                            pathname == "/login" &&
                            <main className="">
                                {children}
                            </main>
                        )

                }
                <ToastContainer
                    autoClose={1000}
                    transition={Flip}
                    toastClassName="text-sm bg-white shadow-md border w-52 border-gray-200 rounded p-3"
                /></>
        </MainContext.Provider>


    )
}