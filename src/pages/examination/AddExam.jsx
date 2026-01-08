"use client"

import { useState, useEffect } from "react"
import constant from '../../../constant';
export default function AddExam() {
  // Form state
  const [formData, setFormData] = useState({
    examType: "",
    section: "",
    course: "",
    totalMarks: "",
    startTime: "11:17",
    startDate: "2025-06-01",
    endTime: "11:17",
    endDate: "2025-06-01",
    examLocation: "Physical",
    totalTime: "90",
  })

  // Exams data state
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(false)

  // Search state
  const [searchTerm, setSearchTerm] = useState("")
  const [searchColumn, setSearchColumn] = useState("all")
  const [filteredExams, setFilteredExams] = useState([])

  // Options for dropdowns
  const examTypeOptions = ["Mid Term", "Final Term", "Quiz", "Assignment", "Project", "Practical"]
  const sectionOptions = [
    "PLAY GROUP - PLAY - 2024 - A",
    "PLAY GROUP - NURSERY - 2024 - A",
    "PLAY GROUP - PREP - 2024 - A",
    "PRIMARY - ONE - 2024 - A",
    "PRIMARY - TWO - 2024 - A",
    "MIDDLE - 16710 - 2024 - 16710",
  ]
  const courseOptions = [
    "ENGLISH (THEORY)",
    "MATHEMATICS (THEORY)",
    "SCIENCE (THEORY)",
    "URDU (THEORY)",
    "ISLAMIAT (THEORY)",
    "SOCIAL STUDIES (THEORY)",
    "COMPUTER (THEORY)",
  ]
  const examLocationOptions = ["Physical", "Online", "Hybrid"]

  // Fetch exams from API
  const fetchExams = async (search = "", column = "all") => {
    setLoading(true)
    try {
      let url = `${constant.apiUrl}/exams/`
      if (search) {
        url += `?search=${encodeURIComponent(search)}&column=${column}`
      }
      const res = await fetch(url)
      const data = await res.json()
      if (data.success) setExams(data.exams)
      else setExams([])
    } catch {
      setExams([])
    }
    setLoading(false)
  }

  useEffect(() => { fetchExams() }, [])
  useEffect(() => {
    if (searchTerm) fetchExams(searchTerm, searchColumn)
    else fetchExams()
    // eslint-disable-next-line
  }, [searchTerm, searchColumn])
  useEffect(() => { setFilteredExams(exams) }, [exams])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Format date from YYYY-MM-DD to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (
      !formData.examType ||
      !formData.section ||
      !formData.course ||
      !formData.totalMarks ||
      !formData.startTime ||
      !formData.startDate ||
      !formData.endTime ||
      !formData.endDate ||
      !formData.totalTime
    ) {
      alert("Please fill in all required fields")
      return
    }

    // Validate dates
    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`)
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`)
    if (endDateTime <= startDateTime) {
      alert("End date and time must be after start date and time")
      return
    }

    // Prepare payload
    const payload = {
      examType: formData.examType,
      section: formData.section,
      course: formData.course,
      totalMarks: Number.parseInt(formData.totalMarks),
      startTime: formData.startTime,
      startDate: formData.startDate,
      endTime: formData.endTime,
      endDate: formData.endDate,
      examLocation: formData.examLocation,
      totalTime: formData.totalTime,
      teacher: "NOUR YOUSEF",
      user: "Aitzaz Wattoo",
      campus: "Tech Minds School BWN",
      // Add additional fields as needed
    }

    try {
      const res = await fetch(`${constant.apiUrl}/exams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data.success) {
        fetchExams()
        handleReset()
        alert("Exam added successfully!")
      } else {
        alert(data.message || "Failed to add exam")
      }
    } catch {
      alert("Failed to add exam!")
    }
  }

  // Reset form
  const handleReset = () => {
    setFormData({
      examType: "",
      section: "",
      course: "",
      totalMarks: "",
      startTime: "11:17",
      startDate: "2025-06-01",
      endTime: "11:17",
      endDate: "2025-06-01",
      examLocation: "Physical",
      totalTime: "90",
    })
  }

  // Filter exams based on search
useEffect(() => {
  fetchExams()
}, []) // only fetch once

useEffect(() => {
  let results = exams
  if (searchTerm) {
    const searchValue = searchTerm.toLowerCase()
    if (searchColumn === "all") {
      results = results.filter(
        (exam) =>
          (exam.section || exam.class || "").toLowerCase().includes(searchValue) ||
          (exam.course || "").toLowerCase().includes(searchValue) ||
          (exam.teacher || "").toLowerCase().includes(searchValue) ||
          (exam.examType || "").toLowerCase().includes(searchValue) ||
          (exam.examLocation || "").toLowerCase().includes(searchValue) ||
          (exam.totalMarks || "").toString().includes(searchValue) ||
          (exam.totalTime || "").toString().toLowerCase().includes(searchValue) ||
          (exam.questions || "").toString().includes(searchValue) ||
          (exam.user || "").toLowerCase().includes(searchValue) ||
          (exam.campus || "").toLowerCase().includes(searchValue) ||
          (exam.startDate || "").includes(searchValue) ||
          (exam.endDate || "").includes(searchValue)
      )
    } else {
      results = results.filter((exam) => {
        const fieldValue = exam[searchColumn]
        if (typeof fieldValue === "string") {
          return fieldValue.toLowerCase().includes(searchValue)
        } else if (typeof fieldValue === "number") {
          return fieldValue.toString().includes(searchValue)
        }
        return false
      })
    }
  }
  setFilteredExams(results)
}, [searchTerm, exams, searchColumn])

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-[#2191BF]  text-white p-3 flex items-center gap-2 rounded-t-lg">
        <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
          <span className="text-[#2191BF] text-sm font-bold">→</span>
        </div>
        <h1 className="text-lg font-medium">Add Exam / Test</h1>
      </div>

      <div className="p-6 bg-gray-100">
        {/* Exam Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type:</label>
                <select
                  name="examType"
                  value={formData.examType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">--Select--</option>
                  {examTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section:</label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">--Select--</option>
                  {sectionOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course:</label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">--Select--</option>
                  {courseOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks:</label>
                <input
                  type="number"
                  name="totalMarks"
                  value={formData.totalMarks}
                  onChange={handleInputChange}
                  placeholder="Total Marks"
                  min="1"
                  max="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time:</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date:</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time:</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date:</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Location:</label>
                <select
                  name="examLocation"
                  value={formData.examLocation}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  {examLocationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Time:</label>
                <div className="relative">
                  <input
                    type="number"
                    name="totalTime"
                    value={formData.totalTime}
                    onChange={handleInputChange}
                    placeholder="90"
                    min="1"
                    max="600"
                    className="w-full px-3 py-2 pr-16 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">Mins</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#2191BF]  hover:bg-[#87d0ed]  text-white text-sm font-medium rounded transition-colors"
              >
                Submit
              </button>
            </div>
          </form>
        </div>

        {/* Search Section */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 flex gap-2">
              <select
                value={searchColumn}
                onChange={(e) => setSearchColumn(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Columns</option>
                <option value="section">Section</option>
                <option value="course">Course</option>
                <option value="teacher">Teacher</option>
                <option value="examType">Exam Type</option>
                <option value="examLocation">Exam Location</option>
                <option value="totalMarks">Total Marks</option>
                <option value="totalTime">Total Time</option>
                <option value="user">User</option>
                <option value="campus">Campus</option>
              </select>
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder={`Search ${searchColumn === "all" ? "all columns" : searchColumn}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          {filteredExams.length !== exams.length && exams.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              Showing {filteredExams.length} of {exams.length} results
            </div>
          )}
        </div>

        {/* Exams Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="min-w-[1600px]">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Section
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teacher
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exam Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exam Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Marks
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Questions
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Print
                  </th>
                 
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campus
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExams.length > 0 ? (
                  filteredExams.map((exam, idx) => (
                    <tr key={exam._id || idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-32 truncate">{exam.section || exam.class}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-32 truncate">{exam.course}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{exam.teacher}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{exam.examType}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatDate(exam.startDate)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatDate(exam.endDate)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            exam.examLocation === "Online"
                              ? "bg-blue-100 text-blue-800"
                              : exam.examLocation === "Physical"
                                ? "bg-green-100 text-green-800"
                                : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {exam.examLocation}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{exam.totalMarks}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{exam.totalTime}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{exam.questions}</td>
                      <td className="px-4 py-3 text-sm">
                        <button className="text-[#2191BF] hover:text-[#7ebfd8] transition-colors">{exam.print}</button>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{exam.marks}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{exam.user}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-32 truncate">{exam.campus}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="14" className="px-4 py-4 text-center text-sm text-gray-500">
                      No matching records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500">
            {exams.length > 0 ? (
              `Showing 1 to ${filteredExams.length} of ${exams.length} rows`
            ) : (
              <span>No records found</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}