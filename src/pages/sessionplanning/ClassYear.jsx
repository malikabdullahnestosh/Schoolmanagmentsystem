"use client"

import { useState, useEffect } from "react"
import constant from '../../../constant';
export default function ClassYear() {
  // Form state -- use backend field names: program, department, class, code, name, detail, startDate, endDate
  const [formData, setFormData] = useState({
    program: "",
    department: "",
    class: "",
    code: "25",
    name: "2025",
    detail: "2025",
    startDate: "2025-06-01",
    endDate: "2025-06-01",
  })

  // Class years data state
  const [classYears, setClassYears] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Search state
  const [searchTerm, setSearchTerm] = useState("")
  const [searchColumn, setSearchColumn] = useState("all")
  const [filteredClassYears, setFilteredClassYears] = useState([])

  // Confirmation modal state
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    type: "", // "activate" or "deactivate"
    classYearId: null,
    classYearName: "",
  })

  // Program, department, and class options
  const programOptions = ["PLAY GROUP", "PRIMARY", "MIDDLE", "MATRIC", "16710"]
  const departmentOptions = {
    "PLAY GROUP": ["PLAY GROUP"],
    PRIMARY: ["PRIMARY"],
    MIDDLE: ["MIDDLE"],
    MATRIC: ["SCIENCE", "ARTS", "COMPUTER SCIENCE"],
    16710: ["16710"],
  }
  const classOptions = {
    "PLAY GROUP": ["PLAY", "NURSERY", "PREP"],
    PRIMARY: ["ONE", "TWO", "THREE", "4TH", "5TH"],
    MIDDLE: ["16710"],
    SCIENCE: ["6TH", "7TH", "8TH", "9TH", "10TH"],
    ARTS: ["6TH", "7TH", "8TH", "9TH", "10TH"],
    "COMPUTER SCIENCE": ["6TH", "7TH", "8TH", "9TH", "10TH"],
    16710: ["16710"],
  }

  // Fetch class years from API
  useEffect(() => {
    setLoading(true)
    fetch(`${constant.apiUrl}/session-planning/class-years`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.classYears)) {
          setClassYears(data.classYears)
          setFilteredClassYears(data.classYears)
        } else {
          setError("Failed to load class years")
        }
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load class years")
        setLoading(false)
      })
  }, [])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "program" ? { department: "", class: "" } : {}),
      ...(name === "department" ? { class: "" } : {}),
    }))
  }

  // Format date from YYYY-MM-DD to DD-MM-YYYY
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (
      !formData.program ||
      !formData.department ||
      !formData.class ||
      !formData.code.trim() ||
      !formData.name.trim() ||
      !formData.detail.trim() ||
      !formData.startDate ||
      !formData.endDate
    ) {
      alert("Please fill in all fields")
      return
    }

    // Validate dates
    const startDateVal = new Date(formData.startDate)
    const endDateVal = new Date(formData.endDate)
    if (endDateVal <= startDateVal) {
      alert("End date must be after start date")
      return
    }

    // Check if class year already exists
    const existingClassYear = classYears.find(
      (cy) =>
        cy.program === formData.program &&
        cy.department === formData.department &&
        cy.class === formData.class &&
        cy.code === formData.code.trim()
    )
    if (existingClassYear) {
      alert("Class year with this combination already exists")
      return
    }

    // Prepare request body for API (use backend field names)
    const payload = {
      program: formData.program,
      department: formData.department,
      class: formData.class,
      code: formData.code.trim(),
      name: formData.name.trim(),
      detail: formData.detail.trim(),
      startDate: formatDate(formData.startDate),
      endDate: formatDate(formData.endDate),
      isActive: true,
      campus: "The Future Grooming School",
      user: "Aitzaz Wattoo"
    }

    setLoading(true)
    setError("")
    try {
      const res = await fetch(`${constant.apiUrl}/session-planning/class-years`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setClassYears([...classYears, data.classYear])
        setFilteredClassYears([...classYears, data.classYear])
        handleReset()
        alert("Class year added successfully!")
      } else {
        setError(data.message || "Failed to add class year")
        alert(data.message || "Failed to add class year")
      }
    } catch (err) {
      setError("Failed to add class year")
      alert("Failed to add class year")
    }
    setLoading(false)
  }

  // Reset form
  const handleReset = () => {
    setFormData({
      program: "",
      department: "",
      class: "",
      code: "25",
      name: "2025",
      detail: "2025",
      startDate: "2025-06-01",
      endDate: "2025-06-01",
    })
  }

  // Handle status change click
  const handleStatusChange = (classYear, newStatus) => {
    setConfirmationModal({
      isOpen: true,
      type: newStatus ? "activate" : "deactivate",
      classYearId: classYear._id || classYear.id,
      classYearName: `${classYear.program} - ${classYear.class} - ${classYear.name}`,
    })
  }

  // Confirm status change (client state only, you can implement PATCH here if needed)
  const confirmStatusChange = () => {
    const { classYearId, type } = confirmationModal
    const newStatus = type === "activate"
    setClassYears(classYears.map((cy) =>
      (cy._id || cy.id) === classYearId ? { ...cy, isActive: newStatus } : cy
    ))
    setFilteredClassYears(filteredClassYears.map((cy) =>
      (cy._id || cy.id) === classYearId ? { ...cy, isActive: newStatus } : cy
    ))
    setConfirmationModal({
      isOpen: false,
      type: "",
      classYearId: null,
      classYearName: "",
    })
    // Show success message
    const action = newStatus ? "activated" : "deactivated"
    alert(`Class year has been ${action} successfully!`)
  }

  // Cancel status change
  const cancelStatusChange = () => {
    setConfirmationModal({
      isOpen: false,
      type: "",
      classYearId: null,
      classYearName: "",
    })
  }

  // Filter class years based on search
  useEffect(() => {
    let results = classYears
    if (searchTerm) {
      const searchValue = searchTerm.toLowerCase()
      if (searchColumn === "all") {
        results = results.filter(
          (cy) =>
            cy.program?.toLowerCase().includes(searchValue) ||
            cy.department?.toLowerCase().includes(searchValue) ||
            cy.class?.toLowerCase().includes(searchValue) ||
            cy.code?.toLowerCase().includes(searchValue) ||
            cy.name?.toLowerCase().includes(searchValue) ||
            cy.detail?.toLowerCase().includes(searchValue) ||
            cy.startDate?.includes(searchValue) ||
            cy.endDate?.includes(searchValue) ||
            cy.campus?.toLowerCase().includes(searchValue) ||
            cy.user?.toLowerCase().includes(searchValue)
        )
      } else {
        results = results.filter((cy) => {
          const fieldValue = cy[searchColumn]
          if (typeof fieldValue === "string") {
            return fieldValue.toLowerCase().includes(searchValue)
          } else if (typeof fieldValue === "boolean") {
            return fieldValue.toString().includes(searchValue)
          }
          return false
        })
      }
    }
    setFilteredClassYears(results)
  }, [searchTerm, classYears, searchColumn])

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-[#2191BF]  text-white p-3 flex items-center gap-2 rounded-t-lg shadow-md">
        <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
          <span className="text-[#2191BF] text-sm font-bold">→</span>
        </div>
        <h1 className="text-lg font-medium">Admission Class Year</h1>
      </div>

      <div className="p-6 bg-gray-100">
        {/* Class Year Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
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
                  disabled={!formData.program}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">--Select--</option>
                  {formData.program &&
                    departmentOptions[formData.program]?.map((option) => (
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
                  disabled={!formData.department}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">--Select--</option>
                  {formData.department &&
                    classOptions[formData.department]?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code:</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="25"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="2025"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Detail:</label>
                <input
                  type="text"
                  name="detail"
                  value={formData.detail}
                  onChange={handleInputChange}
                  placeholder="2025"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-md transition-colors shadow-sm"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#2191BF]  hover:bg-[#7cc1dc]  text-white text-sm font-medium rounded-md transition-colors shadow-sm"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
            {error && <div className="text-red-500 mt-3">{error}</div>}
          </form>
        </div>

        {/* Search Section */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 flex gap-2">
              <select
                value={searchColumn}
                onChange={(e) => setSearchColumn(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Columns</option>
                <option value="program">Program</option>
                <option value="department">Department</option>
                <option value="class">Class</option>
                <option value="code">Code</option>
                <option value="name">Name</option>
                <option value="detail">Detail</option>
                <option value="startDate">Start Date</option>
                <option value="endDate">End Date</option>
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
          {filteredClassYears.length !== classYears.length && classYears.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              Showing {filteredClassYears.length} of {classYears.length} results
            </div>
          )}
        </div>

        {/* Class Years Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="min-w-[1400px]">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Detail
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Is Active
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campus
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClassYears.length > 0 ? (
                  filteredClassYears.map((classYear) => (
                    <tr key={classYear._id || classYear.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900">{classYear.program}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{classYear.department}</td>
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">{classYear.class}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{classYear.code}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{classYear.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{classYear.detail}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{classYear.startDate}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{classYear.endDate}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{classYear.isActive ? "Yes" : "No"}</td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => handleStatusChange(classYear, !classYear.isActive)}
                          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors shadow-sm ${
                            classYear.isActive
                              ? "bg-red-500 hover:bg-red-600 text-white"
                              : "bg-blue-500 hover:bg-blue-600 text-white"
                          }`}
                        >
                          {classYear.isActive ? "Make Deactive" : "Make Active"}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-32 truncate">{classYear.campus}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{classYear.user}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="px-4 py-4 text-center text-sm text-gray-500">
                      No matching records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500">
            {classYears.length > 0 ? (
              `Showing 1 to ${filteredClassYears.length} of ${classYears.length} rows`
            ) : (
              <span>No records found</span>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmationModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    confirmationModal.type === "activate" ? "bg-blue-100" : "bg-red-100"
                  }`}
                >
                  {confirmationModal.type === "activate" ? (
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {confirmationModal.type === "activate" ? "Activate Class Year" : "Deactivate Class Year"}
                  </h3>
                  <p className="text-sm text-gray-500">This action will change the status of the class year</p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to{" "}
                <span
                  className={`font-semibold ${confirmationModal.type === "activate" ? "text-blue-600" : "text-red-600"}`}
                >
                  {confirmationModal.type}
                </span>{" "}
                the following class year?
              </p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="font-medium text-gray-900">{confirmationModal.classYearName}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={cancelStatusChange}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusChange}
                className={`flex-1 px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors shadow-sm ${
                  confirmationModal.type === "activate"
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {confirmationModal.type === "activate" ? "Activate" : "Deactivate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}