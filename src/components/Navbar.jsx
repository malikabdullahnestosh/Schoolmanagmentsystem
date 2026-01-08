"use client"
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  UserCheck,
  DollarSign,
  Receipt,
  ClipboardList,
  Calendar,
  BookOpen,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: GraduationCap, label: "Student", path: "/add-student" },
  { icon: Users, label: "Parents", path: "/parent-information" },
  { icon: UserCheck, label: "Staff", path: "/add-staff" },
  { icon: DollarSign, label: "Fees", path: "/fee-bank" },
  { icon: Receipt, label: "Printing", path: "/student-information" },
  { icon: ClipboardList, label: "Exams", path: "/add-exam" },
  { icon: Calendar, label: "Timetable", path: "/time-table" },
  { icon: UserCheck, label: "Attendance", path: "/take-attendence" },
  { icon: BookOpen, label: "Student Category", path: "/student-category" },
]

const Navbar = () => {
  const navigate = useNavigate()

  const handleNavigation = (path) => {
    navigate(path)
  }

  return (
    <nav className="overflow-x-auto bg-[#0D1B28] text-white px-4 py-3 mx-4 my-4 rounded-md scrollbar-thin scrollbar-thumb-gray-400">
      <div className="flex gap-5 min-w-max">
        {navItems.map(({ icon: Icon, label, path }) => (
          <div
            key={label}
            className="flex flex-col items-center text-md whitespace-nowrap p-2 rounded-md transition-all duration-200 cursor-pointer hover:bg-slate-600"
            onClick={() => handleNavigation(path)}
          >
            <Icon className="w-5 h-5 mb-1" />
            {label}
          </div>
        ))}
      </div>
    </nav>
  )
}

export default Navbar