"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ChevronDown, Bell, Wallet, Menu, Search ,Settings } from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import axiosInstance from "./service/axiosInstance";
import { MainContext } from "@/app/context/context";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminDetails, logout } from "@/app/redux/reducer/AdminSlice";
import { PiBellRingingLight } from "react-icons/pi";
import { TestTube, Server } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import styles from './Header.module.css';


export default function Header({ isOpen, onToggle }) {

  const { tostymsg } = useContext(MainContext)


  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const isMobile = useIsMobile();

  const dispatch = useDispatch();
  const { admin } = useSelector(state => state.admin);
  const [environment, setEnvironment] = useState("uat");
  const [showUATModal, setShowUATModal] = useState(false);




  useEffect(
    () => {
      setEnvironment(admin?.environment_mode ? "live" : "uat");
    }, [admin?.environment_mode]
  )

  const handleEnvironmentSwitch = async (env) => {
    const userId = admin._id;
    let environment_mode = env === "live" ? true : false;
 
    if (admin?.documents?.isVerified) {
      try {
        const res = await axiosInstance.put(`/admin/status-change/${userId}`, { environment_mode });
        setEnvironment(env);
        dispatch(fetchAdminDetails());
        setEnvironment(env); // Update local state
        dispatch(fetchAdminDetails()); // Refresh admin data
        // tostymsg("Environment updated", "success");
      } catch (error) {
        console.error("Failed to update environment mode:", error);
      }
    } else {
      setShowUATModal(true);
    }
  };

  const closeUATModal = () => {
    setShowUATModal(false);
    setEnvironment("uat");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const response = await axiosInstance.post("/user/upload-kyc", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      tostymsg(response.data.message, response.data.status);
      setShowUATModal(false);
      setEnvironment("uat");
    } catch (error) {
      console.error("Upload Failed:", error);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        {/* Left Section */}
        <div className={styles.leftSection}>
          <button 
            onClick={() => onToggle(!isOpen)} 
            className={styles.menuButton}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
          
          {!isMobile && (
            <div className={styles.searchContainer}>
            
            </div>
          )}
            {isMobile && isOpen && (
      <div className={styles.mobileMenu}>
    
      </div>
    )}
        </div>

        {/* Right Section */}
        <div className={styles.rightSection}>
          {/* Environment Toggle */}
<div className={styles.environmentToggle}>
  {/* UAT Side */}
  <div className={styles.iconLabel}>
    <TestTube
      className={`${styles.icon} ${
        environment === "uat" ? styles.uatActive : styles.inactive
      }`}
    />
    <span
      className={
        environment === "uat" ? styles.labeluatActive : styles.labelInactive
      }
    >
      UAT
    </span>
  </div>

  {/* Toggle */}
  <Switch
    checked={environment === "live"}
    onCheckedChange={(checked) =>
      handleEnvironmentSwitch(checked ? "live" : "uat")
    }
    className={styles.envSwitch}
  />

  {/* LIVE Side */}
  <div className={styles.iconLabel}>
    <Server
      className={`${styles.icon} ${
        environment === "live" ? styles.liveActive : styles.inactive
      }`}
    />
    <span
      className={
        environment === "live" ? styles.labelActive : styles.labelInactive
      }
    >
      LIVE
    </span>
  </div>

  {/* Status Dot + Text */}
  <div className={styles.statusContainer}>
    <div
      className={`${styles.statusDot} ${
        environment === "live" ? styles.liveDot : styles.uatDot
      }`}
    />
    <span
      className={
        environment === "live" ? styles.liveStatusText : styles.uatStatusText
      }
    >
      {environment === "live" ? "Approved" : "Testing"}
    </span>
  </div>
</div>




{/* Wallet Info */}
<div className={styles.walletInfo}>
  <Wallet className={styles.walletIcon} />
  <div className={styles.walletDetails}>
       <span className={styles.walletAmount}>
      ₹{!admin?.environment_mode 
        ? admin?.wallet?.mode?.credentials || '0.00' 
        : admin?.wallet?.mode?.production || '0.00'}
    </span>
    <span className={styles.walletLabel}> Wallet Balance</span>
 
  </div>
</div>

          {/* Notifications */}
          <div className={styles.notificationWrapper}>
            <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className={styles.notificationButton}
          aria-label="Notifications"
        >
          <div className={styles.notificationDot}>
  <div className={styles.icon}>
    <PiBellRingingLight
      className={`${styles.notificationIcon} ${styles.bellAnimation}`}
    />
    <span className={styles.dot} />
  </div>
</div>
            </button>

            {showNotifications && (
              <div className={styles.notificationDropdown}>
                <div className={styles.notificationHeader}>
                  <h3>Notifications</h3>
                  <button className={styles.markAllRead}>Mark all as read</button>
                </div>
                <div className={styles.notificationList}>
                  {/* Notification items would go here */}
                  <div className={styles.notificationItem}>
                    <div className={styles.notificationDot}></div>
                    <div>
                      <p className={styles.notificationTitle}>New API request</p>
                      <p className={styles.notificationText}>Endpoint called successfully</p>
                      <p className={styles.notificationTime}>2 min ago</p>
                    </div>
                  </div>
                </div>
                <button className={styles.viewAllButton}>View all notifications</button>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className={styles.profileWrapper}>
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className={styles.profileButton}
              aria-label="User profile"
            >
              <div className={styles.avatar}>
                {admin?.profileImage ? (
                  <img 
                    src={admin.profileImage} 
                    alt="Profile" 
                    onError={(e) => e.target.style.display = 'none'}
                  />
                ) : (
                  <span className={styles.avatarFallback}>
                    {getInitials(admin?.name)}
                  </span>
                )}
              </div>
              {!isMobile && (
                <div className={styles.profileInfo}>
                  <span className={`${styles.profileName} capitalize`}>{admin?.name || 'User'}</span>
                  
                </div>
              )}
            </button>

            {showProfile && (
              <div className={styles.profileDropdown}>
                <div className={styles.profileHeader}>
                  <div className={styles.profileAvatar}>
                    {getInitials(admin?.name)}
                  </div>
                  <div>
                    <p className= {styles.profileTitle} >{admin?.name}</p>
                    <p className={styles.profileEmail}>{admin?.email}</p>
                  </div>
                </div>
                <div className={styles.profileMenu}>
                  <Link href="/profile" className={styles.menuItem}>
                    <span>My Profile</span>
                  </Link>
                  {/* <Link href="/settings" className={styles.menuItem}>
                    <span>Account Settings</span>
                  </Link> */}
                  <Link href="/all-user-report" className={styles.menuItem}>
                    <span>Billing</span>
                  </Link>
                  <div className={styles.divider}></div>
                  <button 
                    onClick={() => dispatch(logout())}
                    className={styles.logoutButton}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
              <Link href="" className={`${styles.menuItem} ${styles.settingsItem}`}>
              <Settings className={styles.settingsIcon} />
            
            </Link>
          </div>
        </div>
 
        {/* Mobile Search */}
        {isMobile && (
          <div className={styles.mobileSearch}>
            <div className={styles.searchContainer}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>
        )}
      </div>

      
    </header>
    {/* UAT Modal */}
    <Dialog open={showUATModal}  onOpenChange={setShowUATModal}>
    <DialogContent className="fixed top-1/2 h-[77%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg w-full max-w-md">
      <div className="card card-custom">
        <button onClick={closeUATModal} className={styles.closeButton}>
        </button>
        <div className="">
        <h2 className="card-title">Verify Your Account</h2>
        </div>
        
        <p className={styles.modalText}>
          To switch to LIVE mode, please upload the required documents:
        </p>
        <form onSubmit={handleSubmit} className={styles.uploadForm}>
          <div className={styles.formGroup}>
            <label className={styles.inputLabel}>PAN Card</label>
            <input
              type="file"
              name="panCard"
              required
              className={styles.fileInput}
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.inputLabel}>Aadhaar Card</label>
            <input
              type="file"
              name="aadhaarCard"
              required
              className={styles.fileInput}
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.inputLabel}>GST Certificate</label>
            <input
              type="file"
              name="gstCert"
              required
              className={styles.fileInput}
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>
          <button type="submit" className="btn brandorange-bg-light brandorange-bg-light text-[12px] p-2 font-bold mb-3">
            Upload Documents
          </button>
        </form>
      </div>
    </DialogContent>
  </Dialog>
  </>
  );
}