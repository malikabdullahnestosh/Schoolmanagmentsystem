import { useState } from "react";
// import Header from "../components/Header";
// import Sidebar from "../components/Sidebar";
// import { Navbar } from "../components/navbar";
import DashboardGrid from "../components/DashboardGrid";
import UpdatesHistory from "../components/UpdateHistory";
import FeeChart from "../components/FeeChart";
import CombinedReport from "../components/MonthlyFeeReport";
import { LayoutDashboard } from "lucide-react";
// import SummaryCards from "../components/summary-cards";
export default function DashboardLayout({ children }) {
  const [selectedSchool, setSelectedSchool] = useState("Tech Minds School BWN");
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  return (
    <div className="flex">
      {/* <Sidebar /> */}
      <div className="flex-1">
        {/* <Header />
        <Navbar /> */}
        <div className="inline-flex items-center gap-3 text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold p-3 sm:p-4 rounded-lg text-white bg-[#0D1B28] max-w-full">
          <LayoutDashboard className="mt-0.5 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
          <h1 className="truncate">Admin Dashboard</h1>
        </div>

        <DashboardGrid />
        {/* Updates History and Fee Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 mx-2 mt-4">
          <div className="lg:col-span-2">
            <UpdatesHistory />
          </div>
          <div>
            <FeeChart />
          </div>
        </div>

        {/* Monthly Report and Goal Completion */}
        {/* Combined Report Component */}
        <div className="mb-8 mx-2">
          <CombinedReport />
        </div>
      </div>
    </div>
  );
}
