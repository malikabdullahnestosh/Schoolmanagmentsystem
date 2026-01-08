"use client";

import {
  Menu,
  MessageCircle,
  Bell,
  Search,
  Mail,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import usePublicMessages from "../../hooks/usePublicMessages.js";
import NotificationBadge from "../components/ui/notification-badge";

export default function Header({
  selectedSchool,
  setSelectedSchool,
  selectedLanguage,
  setSelectedLanguage,
  toggleSidebar,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMessageDropdown, setShowMessageDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const navigate = useNavigate();
  const { latestMessage, latestAnnouncement, messageCount, announcementCount } =
    usePublicMessages();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate("/student-account", {
      state: {
        searchName: searchQuery.trim(),
        autoSearch: true,
      },
    });
    setSearchQuery("");
  };

  const handleSearchIconClick = () => {
    navigate("/student-account", {
      state: {
        searchName: searchQuery.trim(),
        autoSearch: true,
      },
    });
    setSearchQuery("");
  };

  return (
    <header className="bg-[#0D1B28] text-white">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <Menu
            className="w-6 h-6 cursor-pointer hover:text-slate-300 transition-colors"
            onClick={toggleSidebar}
          />
        </div>

        {/* Center section */}
        <div className="flex items-center space-x-4">
          {/* Enhanced Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-sm">
              <input
                type="text"
                placeholder="Search Student By Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 text-gray-800 focus:outline-none focus:ring-2  w-64"
              />
              <button
                type="button"
                onClick={handleSearchIconClick}
                className="px-4 py-2  text-black  transition-colors flex items-center"
                title="Search Student"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-white text-gray-800 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#2191BF]"
          >
            <option>English</option>
          </select>

          <select
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
            className="bg-white text-gray-800 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#2191BF]"
          >
            <option>Future Grooming School</option>
          </select>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Message icon and dropdown */}
          <div className="relative">
            <NotificationBadge
              Icon={MessageCircle}
              count={messageCount}
              color="bg-red-500"
              onClick={() => setShowMessageDropdown((v) => !v)}
            />
            {showMessageDropdown && latestMessage && (
              <div className="absolute right-0 mt-2 w-72 bg-white text-gray-800 rounded shadow-lg z-20">
                <div className="flex items-center px-4 pt-4">
                  <span className="font-normal">{latestMessage.section}</span>
                </div>
                <div className="px-4 ">
                  <span className="font-normal text-[16px]">
                    {latestMessage.title}
                  </span>
                </div>
                <div className="px-4 pb-3 text-sm  text-gray-400">
                  {new Date(latestMessage.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Notification icon and dropdown */}
          <div className="relative">
            <NotificationBadge
              Icon={Bell}
              count={announcementCount}
              color="bg-yellow-500"
              onClick={() => setShowNotificationDropdown((v) => !v)}
            />
            {showNotificationDropdown && latestAnnouncement && (
              <div className="absolute right-0 mt-2 w-72 bg-white text-gray-800 rounded shadow-lg z-20">
                <div className="flex items-center px-4 py-3">
                  <Mail className="mr-2" />
                  <span className="font-medium">
                    {latestAnnouncement.title}
                  </span>
                  <span className="font-medium">
                    {latestAnnouncement.section}
                  </span>
                </div>
                <div className="px-4 pb-3 text-sm text-right text-gray-400">
                  {new Date(latestAnnouncement.date).toLocaleDateString(
                    "en-GB",
                    { day: "2-digit", month: "short", year: "numeric" }
                  )}
                </div>
              </div>
            )}
          </div>
          <ArrowRight
            className="w-6 h-6 cursor-pointer hover:text-slate-300 transition-colors"
            onClick={() => navigate("/")}
          />
        </div>
      </div>
    </header>
  );
}
