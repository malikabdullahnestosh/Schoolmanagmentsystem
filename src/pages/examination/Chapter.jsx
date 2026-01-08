"use client"

import { useState, useEffect } from "react"
import constant from '../../../constant';
export default function Chapter() {
  // Form state
  const [formData, setFormData] = useState({
    program: "",
    department: "",
    class: "",
    course: "",
    chapterNo: "",
    name: "",
  })

  // Chapters data state
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(false)

  // Search state
  const [searchTerm, setSearchTerm] = useState("")
  const [searchColumn, setSearchColumn] = useState("all")
  const [filteredChapters, setFilteredChapters] = useState([])

  // Options for dropdowns
  const programOptions = ["PLAY GROUP", "PRIMARY", "MIDDLE", "SECONDARY"]
  const departmentOptions = ["PLAY GROUP", "PRIMARY", "MIDDLE", "SECONDARY"]
  const classOptions = ["PLAY", "NURSERY", "PREP", "ONE", "TWO", "THREE", "FOUR", "FIVE"]
  const courseOptions = [
    "ENGLISH (THEORY)",
    "MATHEMATICS (THEORY)",
    "SCIENCE (THEORY)",
    "URDU (THEORY)",
    "ISLAMIAT (THEORY)",
    "SOCIAL STUDIES (THEORY)",
    "COMPUTER (THEORY)",
  ]

  // Fetch chapters from API
  const fetchChapters = async (search = "", column = "all") => {
    setLoading(true)
    try {
      let url = `${constant.apiUrl}/exams/chapter`
      if (search) {
        url += `?search=${encodeURIComponent(search)}&column=${column}`
      }
      const res = await fetch(url)
      const data = await res.json()
      if (data.success) setChapters(data.chapters)
      else setChapters([])
    } catch {
      setChapters([])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchChapters()
  }, [])

  useEffect(() => {
    if (searchTerm) fetchChapters(searchTerm, searchColumn)
    else fetchChapters()
    // eslint-disable-next-line
  }, [searchTerm, searchColumn])

  useEffect(() => {
    setFilteredChapters(chapters)
  }, [chapters])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    // Validate form
    if (
      !formData.program ||
      !formData.department ||
      !formData.class ||
      !formData.course ||
      !formData.chapterNo.trim() ||
      !formData.name.trim()
    ) {
      alert("Please fill in all fields")
      return
    }
    try {
      const res = await fetch(`${constant.apiUrl}/exams/chapter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          program: formData.program,
          department: formData.department,
          class: formData.class,
          course: formData.course,
          chapterNo: formData.chapterNo.trim(),
          name: formData.name.trim(),
          user: "Aitzaz Wattoo",
          campus: "Tech Minds School BWN",
        }),
      })
      const data = await res.json()
      if (data.success) {
        fetchChapters()
        handleReset()
        alert("Chapter added successfully!")
      } else {
        alert(data.message || "Failed to add chapter")
      }
    } catch {
      alert("Failed to add chapter!")
    }
  }

  // Reset form
  const handleReset = () => {
    setFormData({
      program: "",
      department: "",
      class: "",
      course: "",
      chapterNo: "",
      name: "",
    })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-[#2191BF]  text-white p-3 flex items-center gap-2 rounded-t-lg">
        <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
          <span className="text-[#2191BF] text-sm font-bold">→</span>
        </div>
        <h1 className="text-lg font-medium">Course Chapters</h1>
      </div>

      <div className="p-6 bg-gray-100">
        {/* Chapter Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Program:</label>
                <select
                  name="program"
                  value={formData.program}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">--Select--</option>
                  {programOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department:</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">--Select--</option>
                  {departmentOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class:</label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">--Select--</option>
                  {classOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chapter No:</label>
                <input
                  type="text"
                  name="chapterNo"
                  value={formData.chapterNo}
                  onChange={handleInputChange}
                  placeholder="--Chapter No--"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chapter Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="---Name---"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
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
                className="px-4 py-2 bg-[#2191BF]  hover:bg-[#82c7e2] 00 text-white text-sm font-medium rounded transition-colors"
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
                <option value="chapterNo">Chapter No</option>
                <option value="name">Name</option>
                <option value="program">Program</option>
                <option value="department">Department</option>
                <option value="class">Class</option>
                <option value="course">Course</option>
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
          {filteredChapters.length !== chapters.length && chapters.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              Showing {filteredChapters.length} of {chapters.length} results
            </div>
          )}
        </div>

        {/* Chapters Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="min-w-[1000px]">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chapter No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campus
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredChapters.length > 0 ? (
                  filteredChapters.map((chapter, idx) => (
                    <tr key={chapter._id || idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{idx + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{chapter.program}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{chapter.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{chapter.class}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{chapter.course}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{chapter.chapterNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{chapter.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Admin</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">The Future Grooming School</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                      No matching records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500">
            {chapters.length > 0 ? (
              `Showing 1 to ${filteredChapters.length} of ${chapters.length} rows`
            ) : (
              <span>No records found</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}