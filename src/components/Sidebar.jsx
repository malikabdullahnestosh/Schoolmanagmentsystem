"use client"

import {
  LayoutDashboard,
  UserPlus,
  Users,
  UsersRound,
  MessageSquare,
  UserCheck,
  Calendar,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  Circle,
} from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Logo from "../components/ui/logo"
import { useNavigate, useLocation } from "react-router-dom"

export default function Sidebar({ isOpen = true }) {
  const navigate = useNavigate()
  const location = useLocation()

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    {
      icon: UserPlus,
      label: "Registration",
      subItems: [
        { label: "Add Student", path: "/add-student" },
        { label: "Student Information", path: "/student-information" },
        { label: "Promotion", path: "/student-promotion" },
        { label: "Student Transfer", path: "/student-transfer" },
        { label: "Parent", path: "/parent-information" },
      ],
    },
    {
      icon: Users,
      label: "Accounts",
      subItems: [
        { label: "Student", path: "/student-account" },
        { label: "Generate Monthly Fees", path: "/fee-assign" },
        { label: "Fee Collections", path: "/fee-collection" },
      ],
    },
    {
      icon: UsersRound,
      label: "Staff Management",
      subItems: [
        { label: "Staff", path: "/add-staff" },
        { label: "Staff Courses", path: "/staff-course" },
      ],
    },
    { icon: MessageSquare, label: "Public Message", path: "/public-message" },
    // {
    //   icon: UserCheck,
    //   label: "Attendance",
    //   subItems: [{ label: "Take Attendence", path: "/take-attendence" }],
    // },
    {
      icon: Calendar,
      label: "Time Table",
      subItems: [
        { label: "Room", path: "/room" },
        { label: "Time Table", path: "/time-table" },
      ],
    },
    {
      icon: ClipboardList,
      label: "Examination",
      subItems: [
        { label: "Exam Type", path: "/exam-type" },
        { label: "Chapters", path: "/chapter" },
        { label: "Questions", path: "/question" },
        { label: "Add Exam/Test", path: "/add-exam" },
      ],
    },
    {
      icon: ClipboardList,
      label: "Session Planning",
      subItems: [
        { label: "Programs", path: "/programs" },
        { label: "Departments", path: "/departments" },
        { label: "Classes", path: "/classes" },
        { label: "Class Year", path: "/class-year" },
        { label: "Sections", path: "/sections" },
        { label: "Course", path: "/course" },
      ],
    },
    {
      icon: ClipboardList,
      label: "Registration Setup",
      subItems: [
        { label: "Student Category", path: "/student-category" },
        { label: "Enrollment Checklist", path: "/enrollment-checklist" },
      ],
    },
    {
      icon: ClipboardList,
      label: "Account Setup",
      subItems: [
        { label: "Fee Bank", path: "/fee-bank" },
        { label: "Fee duration/Month", path: "/fee-duration" },
        { label: "Fees Details", path: "/fee-details" },
        { label: "Fees Policy", path: "/fee-policy" },
      ],
    },
    {
      icon: ClipboardList,
      label: "Admission Reports",
      subItems: [
        { label: "Admission Year", path: "/admission-year" },
        { label: "Sections", path: "/sections-report" },
        { label: "Gender", path: "/gender" },
        { label: "Category", path: "/category" },
        { label: "Birthday", path: "/birthday" },
      ],
    },
    {
      icon: ClipboardList,
      label: "Account Reports",
      subItems: [
        { label: "Payable", path: "/payable" },
        { label: "Paid", path: "/paid" },
      ],
    },
    { icon: MessageSquare, label: "Logout", path: "/" },
  ]

  const [openDropdown, setOpenDropdown] = useState(null)

  // Helper: is a main item or any of its subitems active?
  const isMainActive = (item) => {
    if (item.path && location.pathname === item.path) return true
    if (item.subItems) return item.subItems.some((sub) => location.pathname === sub.path)
    return false
  }

  // Helper: is a subitem active?
  const isSubActive = (sub) => location.pathname === sub.path

  const handleMainClick = (item) => {
    if (!isOpen && item.subItems) {
      // If sidebar is collapsed and item has subitems, expand sidebar first
      return
    }

    if (item.subItems) {
      setOpenDropdown(openDropdown === item.label ? null : item.label)
    } else if (item.path) {
      navigate(item.path)
      setOpenDropdown(null)
    }
  }

  return (
    <aside className="w-full h-full bg-[#0D1B28] text-white flex flex-col p-4">
      {/* Logo Section */}
      <div className={`mb-6 transition-all duration-300 ${isOpen ? "" : "flex justify-center"}`}>
        {isOpen ? (
          <Logo className="w-full h-auto" />
        ) : (
          <div className="w-8 h-8 bg-[#2191BF] rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">TFGS</span>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;  /* Internet Explorer 10+ */
            scrollbar-width: none;  /* Firefox */
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;  /* Safari and Chrome */
          }
        `}</style>

        {sidebarItems.map((item, index) => (
          <div key={index} className="relative group">
            <div
              onClick={() => handleMainClick(item)}
              className={`flex items-center p-2 mb-1 rounded cursor-pointer transition-colors relative
                ${isMainActive(item) ? "bg-[#2191BF] text-white" : "hover:bg-[#16405B] text-white/80"}
                ${isOpen ? "space-x-3" : "justify-center"}
              `}
            >
              <item.icon className="w-6 h-6 flex-shrink-0" />

              {isOpen && (
                <>
                  <span className="flex-1 text-sm font-medium">{item.label}</span>
                  {item.subItems &&
                    (openDropdown === item.label ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    ))}
                </>
              )}
            </div>

            {/* Tooltip for collapsed state */}
            {!isOpen && (
              <div className="absolute left-full ml-2 top-0 bg-gray-900 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            )}

            {/* Dropdown menu - only show when sidebar is open */}
            {isOpen && (
              <AnimatePresence initial={false}>
                {openDropdown === item.label && item.subItems && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="pl-5 overflow-hidden"
                  >
                    {item.subItems.map((sub, subIndex) => (
                      <div
                        key={subIndex}
                        onClick={() => navigate(sub.path)}
                        className={`flex space-x-4 py-2 rounded cursor-pointer
                          ${
                            isSubActive(sub)
                              ? "bg-[#2191BF] text-white font-semibold"
                              : "text-white/80 hover:bg-[#16405B]"
                          }
                        `}
                      >
                        <Circle className="w-5 h-5 mt-1 text-white/70" />
                        <span className="text-md">{sub.label}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        ))}
      </div>
    </aside>
  )
}