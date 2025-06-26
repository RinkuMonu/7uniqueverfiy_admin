'use client';
import 'bootstrap-icons/font/bootstrap-icons.css'; 
import './globals.css';
// import '../styles/globals.css'; 

import { Context } from "./context/context"
import { Provider, useSelector } from "react-redux";

import { store } from "./redux/store";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  // const isMobile = useIsMobile();
  // const [sidebarOpen, setSidebarOpen] = useState(true);
  // const admin = useSelector(state => state.admin.token);
  // const handleToggleSidebar = () => setSidebarOpen((prev) => !prev);
  // const handleNavigate = (route: any) => console.log("Navigating to:", route);

  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Provider store={store}>
          <Context>
            <main className="">
              {children}
            </main>
          </Context>
        </Provider>
      </body>
    </html>
  );
}