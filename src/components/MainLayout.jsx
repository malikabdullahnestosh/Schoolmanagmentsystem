import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import image from "../assets/dashschool.jpg";
import { usePrintModal } from "./PrintModalContext";

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { printModalOpen } = usePrintModal();

  useEffect(() => {
    const savedSidebarState = localStorage.getItem("sidebarOpen");
    if (savedSidebarState !== null) {
      setSidebarOpen(JSON.parse(savedSidebarState));
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem("sidebarOpen", JSON.stringify(newState));
  };

  return (
    <div className="print-root flex h-screen overflow-hidden">
      {/* Hide sidebar if print modal is open */}
      {!printModalOpen && (
        <div
          className={`sidebar fixed top-0 left-0 h-screen bg-gray-800 text-white z-20 transition-all duration-300 ${
            sidebarOpen ? "w-64" : "w-16"
          }`}
        >
          <Sidebar isOpen={sidebarOpen} />
        </div>
      )}

      <div
        className={`relative flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ${
          !printModalOpen
            ? sidebarOpen
              ? "ml-64"
              : "ml-16"
            : ""
        }`}
      >
        <div
          className="main-bg-image absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60"
          style={{
            backgroundImage: `url(${image})`,
          }}
        ></div>

        {/* Content */}
        <div className="relative z-10 flex-1 overflow-y-auto">
          <Header
            toggleSidebar={toggleSidebar}
            selectedSchool="Future Grooming School"
            setSelectedSchool={() => {}}
            selectedLanguage="English"
            setSelectedLanguage={() => {}}
          />
          <Navbar />
          <div className="p-4">
            <Outlet />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};
export default MainLayout;