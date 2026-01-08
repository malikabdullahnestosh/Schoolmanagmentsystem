"use client"

import { useState, useEffect } from "react"
import constant from '../../../constant';
export default function Departments() {
  // Form state -- match backend fields: program, code, name, detail
  const [formData, setFormData] = useState({
    program: "",
    code: "",
    name: "",
    detail: "",
  })

  // Departments data state
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Search state
  const [searchTerm, setSearchTerm] = useState("")
  const [searchColumn, setSearchColumn] = useState("all")
  const [filteredDepartments, setFilteredDepartments] = useState([])

  // Program options (ideally fetched from backend, but static here for now)
  const programOptions = ["PLAY GROUP", "PRIMARY", "MIDDLE", "MATRIC", "16710"]

  // Fetch departments from API
  useEffect(() => {
    setLoading(true)
    fetch(`${constant.apiUrl}/session-planning/departments`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.departments)) {
          setDepartments(data.departments)
          setFilteredDepartments(data.departments)
        } else {
          setError("Failed to load departments")
        }
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load departments")
        setLoading(false)
      })
  }, [])

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
      !formData.code.trim() ||
      !formData.name.trim() ||
      !formData.detail.trim()
    ) {
      alert("Please fill in all fields")
      return
    }

    // Check if department already exists
    const existingDepartment = departments.find(
      (dept) =>
        dept.program === formData.program &&
        dept.name.toLowerCase() === formData.name.trim().toLowerCase()
    )
    if (existingDepartment) {
      alert("Department with this name already exists in the selected program")
      return
    }

    // Prepare request body for API
    const payload = {
      program: formData.program,
      code: formData.code.trim().toUpperCase(),
      name: formData.name.trim().toUpperCase(),
      detail: formData.detail.trim(),
      campus: "The Future Grooming School",
      user: "Admin"
    }

    setLoading(true)
    setError("")
    try {
      const res = await fetch(`${constant.apiUrl}/session-planning/departments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setDepartments([...departments, data.department])
        setFilteredDepartments([...departments, data.department])
        handleReset()
        alert("Department added successfully!")
      } else {
        setError(data.message || "Failed to add department")
        alert(data.message || "Failed to add department")
      }
    } catch (err) {
      setError("Failed to add department")
      alert("Failed to add department")
    }
    setLoading(false)
  }

  // Reset form
  const handleReset = () => {
    setFormData({
      program: "",
      code: "",
      name: "",
      detail: "",
    })
  }

  // Filter departments based on search
  useEffect(() => {
    let results = departments
    if (searchTerm) {
      const searchValue = searchTerm.toLowerCase()
      if (searchColumn === "all") {
        results = results.filter(
          (dept) =>
            dept.program?.toLowerCase().includes(searchValue) ||
            dept.code?.toLowerCase().includes(searchValue) ||
            dept.name?.toLowerCase().includes(searchValue) ||
            dept.detail?.toLowerCase().includes(searchValue) ||
            dept.campus?.toLowerCase().includes(searchValue) ||
            dept.user?.toLowerCase().includes(searchValue)
        )
      } else {
        results = results.filter((dept) => {
          const fieldValue = dept[searchColumn]
          if (typeof fieldValue === "string") {
            return fieldValue.toLowerCase().includes(searchValue)
          }
          return false
        })
      }
    }
    setFilteredDepartments(results)
  }, [searchTerm, departments, searchColumn])

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-[#2191BF]  text-white p-3 flex items-center gap-2 rounded-t-lg">
        <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
          <span className="text-[#2191BF] text-sm font-bold">→</span>
        </div>
        <h1 className="text-lg font-medium">Admission Departments</h1>
      </div>

      <div className="p-6 bg-gray-100">
        {/* Department Form */}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Department Code:</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="--Code--"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="--Name--"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department Detail:</label>
                <input
                  type="text"
                  name="detail"
                  value={formData.detail}
                  onChange={handleInputChange}
                  placeholder="--Detail--"
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
                disabled={loading}
                className="px-4 py-2 bg-[#2191BF]  hover:bg-[#7ebed7]  text-white text-sm font-medium rounded transition-colors"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
            {error && <div className="text-red-500 mt-3">{error}</div>}
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
                <option value="program">Program</option>
                <option value="code">Code</option>
                <option value="name">Name</option>
                <option value="detail">Detail</option>
                <option value="campus">Campus</option>
                <option value="user">User</option>
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
          {filteredDepartments.length !== departments.length && departments.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              Showing {filteredDepartments.length} of {departments.length} results
            </div>
          )}
        </div>

        {/* Departments Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="min-w-[800px]">
            {loading ? (
              <div className="p-6 text-center text-[#2191BF]">Loading...</div>
            ) : (
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Program
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Detail
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campus
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDepartments.length > 0 ? (
                    filteredDepartments.map((department) => (
                      <tr key={department._id || department.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{department.program}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{department.code}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{department.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{department.detail}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{department.campus}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{department.user}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        No matching records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
          <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500">
            {departments.length > 0 ? (
              `Showing 1 to ${filteredDepartments.length} of ${departments.length} rows`
            ) : (
              <span>No records found</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}