"use client"

import { useState, useEffect } from "react"
import constant from '../../../constant';
export default function TimeTable() {
  // Form state
  const [formData, setFormData] = useState({
    program: "",
    department: "",
    class: "",
    classYear: "",
    sectionName: "",
    courseName: "",
    ch: "",
    coh: "",
    roomNo: "",
    dayNumber: "",
    startTime: "",
    endTime: "",
    studentAllowed: "",
    genderCriteria: "Co-Education",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  })

  // Data and loading
  const [timeTableData, setTimeTableData] = useState([])
  const [loading, setLoading] = useState(false)

  // Search
  const [searchTerm, setSearchTerm] = useState("")
  const [searchColumn, setSearchColumn] = useState("all")

  // Dropdown options
  const programOptions = ["PLAY GROUP", "PRIMARY", "MIDDLE", "SECONDARY"]
  const departmentOptions = ["PLAY GROUP", "PRIMARY", "MIDDLE", "SECONDARY"]
  const classOptions = ["PLAY", "NURSERY", "PREP", "ONE", "TWO", "THREE", "FOUR", "FIVE"]
  const classYearOptions = ["2024", "2025", "2026"]
  const sectionOptions = ["A", "B", "C", "D"]
  const courseOptions = [
    "ENGLISH (THEORY)",
    "MATHEMATICS (THEORY)",
    "SCIENCE (THEORY)",
    "URDU (THEORY)",
    "ISLAMIAT (THEORY)",
    "SOCIAL STUDIES (THEORY)",
    "COMPUTER (THEORY)",
  ]
  const roomOptions = ["2", "4", "6", "8", "10"]
  const dayOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const timeOptions = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
  ]
  const genderOptions = ["Co-Education", "Boys Only", "Girls Only"]

  // Fetch entries
  const fetchTimeTables = async () => {
    setLoading(true)
    try {
      let url = `${constant.apiUrl}/timetable`
      if (searchTerm) {
        url += `?search=${encodeURIComponent(searchTerm)}&column=${searchColumn}`
      }
      const res = await fetch(url)
      const data = await res.json()
      if (data.success) setTimeTableData(data.entries)
      else setTimeTableData([])
    } catch {
      setTimeTableData([])
    }
    setLoading(false)
  }

  useEffect(() => { fetchTimeTables() }, [])
  useEffect(() => { fetchTimeTables() }, [searchTerm, searchColumn])

  // Form input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Add timetable entry
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (
      !formData.program || !formData.department || !formData.class || !formData.classYear ||
      !formData.sectionName || !formData.courseName || !formData.roomNo || !formData.dayNumber ||
      !formData.startTime || !formData.endTime
    ) {
      alert("Please fill in all required fields")
      return
    }
    const payload = {
      ...formData,
      ch: Number(formData.ch),
      coh: Number(formData.coh),
      studentAllowed: Number(formData.studentAllowed),
    }
    try {
      const res = await fetch(`${constant.apiUrl}/timetable`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data.success) {
        fetchTimeTables()
        handleReset()
        alert("Time table entry added successfully!")
      } else {
        alert(data.message || "Failed to add time table entry")
      }
    } catch {
      alert("Failed to add time table entry!")
    }
  }

  // Reset form
  const handleReset = () => {
    setFormData({
      program: "",
      department: "",
      class: "",
      classYear: "",
      sectionName: "",
      courseName: "",
      ch: "",
      coh: "",
      roomNo: "",
      dayNumber: "",
      startTime: "",
      endTime: "",
      studentAllowed: "",
      genderCriteria: "Co-Education",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
    })
  }

  // Delete entry
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this time table entry?")) return
    try {
      const res = await fetch(`${constant.apiUrl}/timetable/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) fetchTimeTables()
      else alert(data.message || "Delete failed")
    } catch {
      alert("Delete failed!")
    }
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-[#2191BF]  text-white p-3 flex items-center gap-2 rounded-t-lg">
        <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
          <span className="text-[#2191BF] text-sm font-bold">→</span>
        </div>
        <h1 className="text-lg font-medium">Time Table</h1>
      </div>

      <div className="p-6 bg-gray-100">
        {/* Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Program:</label>
                <select name="program" value={formData.program} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">--Select--</option>
                  {programOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department:</label>
                <select name="department" value={formData.department} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">--Select--</option>
                  {departmentOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class:</label>
                <select name="class" value={formData.class} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">--Select--</option>
                  {classOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Year:</label>
                <select name="classYear" value={formData.classYear} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">--Select--</option>
                  {classYearOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Name:</label>
                <select name="sectionName" value={formData.sectionName} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">--Select--</option>
                  {sectionOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Name:</label>
                <select name="courseName" value={formData.courseName} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">--Select--</option>
                  {courseOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CH: <span className="text-green-600">* Un-Change-able</span>
                </label>
                <input type="number" name="ch" value={formData.ch} onChange={handleInputChange}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  COH: <span className="text-red-600">* Change-able</span>
                </label>
                <input type="number" name="coh" value={formData.coh} onChange={handleInputChange}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room No:</label>
                <select name="roomNo" value={formData.roomNo} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">--Select--</option>
                  {roomOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Day Number:</label>
                <select name="dayNumber" value={formData.dayNumber} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select Day</option>
                  {dayOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time:</label>
                <select name="startTime" value={formData.startTime} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select Time</option>
                  {timeOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time:</label>
                <select name="endTime" value={formData.endTime} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select Time</option>
                  {timeOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Allowed:</label>
                <input type="number" name="studentAllowed" value={formData.studentAllowed} onChange={handleInputChange}
                  placeholder="--Student Allowed--"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender Criteria:</label>
                <select name="genderCriteria" value={formData.genderCriteria} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  {genderOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date:</label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date:</label>
                <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={handleReset}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded transition-colors">
                Reset
              </button>
              <button type="submit"
                className="px-4 py-2 bg-[#2191BF]  hover:bg-[#88d6f5]  text-white text-sm font-medium rounded transition-colors">
                Submit
              </button>
            </div>
          </form>
        </div>

        {/* Search Section */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 flex gap-2">
              <select value={searchColumn} onChange={e => setSearchColumn(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="all">All Columns</option>
                <option value="class">Class</option>
                <option value="teacher">Teacher</option>
                <option value="courseName">Course</option>
                <option value="roomNo">Room</option>
                <option value="timing">Timing</option>
                <option value="genderCriteria">Gender</option>
                <option value="status">Status</option>
              </select>
              <div className="flex-1 relative">
                <input type="text"
                  placeholder={`Search ${searchColumn === "all" ? "all columns" : searchColumn}...`}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
              </div>
            </div>
            {searchTerm && (
              <button onClick={() => setSearchTerm("")}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                Clear
              </button>
            )}
          </div>
          {timeTableData.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              Showing {timeTableData.length} results
            </div>
          )}
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="min-w-[1200px]">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CH</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COH</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timing</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delete</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campus</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={15} className="px-4 py-8 text-center text-sm text-gray-700">Loading...</td>
                  </tr>
                ) : timeTableData.length > 0 ? (
                  timeTableData.map((entry) => (
                    <tr key={entry._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{`${entry.program} - ${entry.class} - ${entry.classYear} - ${entry.sectionName}`}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{entry.teacher}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{entry.courseName}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{entry.ch}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{entry.coh}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{entry.startTime} - {entry.endTime}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{entry.roomNo}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{formatDate(entry.startDate)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{formatDate(entry.endDate)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{entry.genderCriteria}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{entry.studentAllowed}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {entry.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <button onClick={() => handleDelete(entry._id)}
                          className="text-red-600 hover:text-red-900 transition-colors">
                          Delete
                        </button>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{entry.user}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">The Future Grooming School</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={15} className="px-4 py-8 text-center text-sm text-gray-700">
                      No matching records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500">
            {timeTableData.length > 0 ? (
              `Showing 1 to ${timeTableData.length} rows`
            ) : (
              <span>No records found</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}