"use client"

import { useState, useEffect } from "react"
import constant from "../../../constant"

export default function Sections() {
  // Form state - backend field names: program, department, class, classYear, code, name, detail, isActive, campus, user
  const [formData, setFormData] = useState({
    program: "",
    department: "",
    class: "",
    classYear: "",
    code: "",
    name: "",
    detail: "",
  })

  // Section data state
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [searchColumn, setSearchColumn] = useState("all")
  const [filteredSections, setFilteredSections] = useState([])

  // Confirmation modal state
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    type: "", // "activate" or "deactivate"
    sectionId: null,
    sectionName: "",
  })

  // Static options (for simplicity)
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
  // In a real app, load class years from backend
  const classYearOptions = ["2024", "2025", "2026"]

  // Fetch sections on mount
  useEffect(() => {
    setLoading(true)
    fetch(`${constant.apiUrl}/session-planning/sections`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.sections)) {
          setSections(data.sections)
          setFilteredSections(data.sections)
        } else {
          setError("Failed to load sections")
        }
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load sections")
        setLoading(false)
      })
  }, [])

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => {
      const newData = { ...prev, [name]: value }
      if (name === "program") {
        newData.department = ""
        newData.class = ""
      } else if (name === "department") {
        newData.class = ""
      }
      return newData
    })
  }

  // Submit (POST) to API
  const handleSubmit = async (e) => {
    e.preventDefault()
    // Validation
    if (
      !formData.program ||
      !formData.department ||
      !formData.class ||
      !formData.classYear ||
      !formData.code.trim() ||
      !formData.name.trim() ||
      !formData.detail.trim()
    ) {
      alert("Please fill in all fields")
      return
    }
    // Duplicate check
    const exists = sections.find(
      s =>
        s.program === formData.program &&
        s.department === formData.department &&
        s.class === formData.class &&
        s.classYear === formData.classYear &&
        s.code.toLowerCase() === formData.code.trim().toLowerCase()
    )
    if (exists) {
      alert("Section with this combination already exists")
      return
    }

    // Prepare for API
    const payload = {
      program: formData.program,
      department: formData.department,
      class: formData.class,
      classYear: formData.classYear,
      code: formData.code.trim().toUpperCase(),
      name: formData.name.trim().toUpperCase(),
      detail: formData.detail.trim().toUpperCase(),
      isActive: true,
      campus: "The Future Grooming School",
      user: "Aitzaz Wattoo",
    }

    setLoading(true)
    setError("")
    try {
      const res = await fetch(`${constant.apiUrl}/session-planning/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setSections([...sections, data.section])
        setFilteredSections([...sections, data.section])
        handleReset()
        alert("Section added successfully!")
      } else {
        setError(data.message || "Failed to add section")
        alert(data.message || "Failed to add section")
      }
    } catch {
      setError("Failed to add section")
      alert("Failed to add section")
    }
    setLoading(false)
  }

  // Reset form
  const handleReset = () => {
    setFormData({
      program: "",
      department: "",
      class: "",
      classYear: "",
      code: "",
      name: "",
      detail: "",
    })
  }

  // Handle status change
  const handleStatusChange = (section, newStatus) => {
    setConfirmationModal({
      isOpen: true,
      type: newStatus ? "activate" : "deactivate",
      sectionId: section._id || section.id,
      sectionName: `${section.program} - ${section.class} - ${section.classYear} - ${section.name}`,
    })
  }

  // Confirm status change (client only, patch API can be added here)
  const confirmStatusChange = () => {
    const { sectionId, type } = confirmationModal
    const newStatus = type === "activate"
    setSections(sections.map(s =>
      (s._id || s.id) === sectionId ? { ...s, isActive: newStatus } : s
    ))
    setFilteredSections(filteredSections.map(s =>
      (s._id || s.id) === sectionId ? { ...s, isActive: newStatus } : s
    ))
    setConfirmationModal({
      isOpen: false,
      type: "",
      sectionId: null,
      sectionName: "",
    })
    alert(`Section has been ${newStatus ? "activated" : "deactivated"} successfully!`)
  }

  // Cancel status change
  const cancelStatusChange = () => {
    setConfirmationModal({
      isOpen: false,
      type: "",
      sectionId: null,
      sectionName: "",
    })
  }

  // Filter sections based on search
  useEffect(() => {
    let results = sections
    if (searchTerm) {
      const searchValue = searchTerm.toLowerCase()
      if (searchColumn === "all") {
        results = results.filter(
          (section) =>
            section.program?.toLowerCase().includes(searchValue) ||
            section.department?.toLowerCase().includes(searchValue) ||
            section.class?.toLowerCase().includes(searchValue) ||
            section.classYear?.toLowerCase().includes(searchValue) ||
            section.code?.toLowerCase().includes(searchValue) ||
            section.name?.toLowerCase().includes(searchValue) ||
            section.detail?.toLowerCase().includes(searchValue) ||
            section.campus?.toLowerCase().includes(searchValue) ||
            section.user?.toLowerCase().includes(searchValue)
        )
      } else {
        results = results.filter((section) => {
          const fieldValue = section[searchColumn]
          if (typeof fieldValue === "string") {
            return fieldValue.toLowerCase().includes(searchValue)
          } else if (typeof fieldValue === "boolean") {
            return fieldValue.toString().includes(searchValue)
          }
          return false
        })
      }
    }
    setFilteredSections(results)
  }, [searchTerm, sections, searchColumn])

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-[#2191BF]  text-white p-3 flex items-center gap-2 rounded-t-lg shadow-md">
        <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
          <span className="text-[#2191BF] text-sm font-bold">→</span>
        </div>
        <h1 className="text-lg font-medium">Admission Section</h1>
      </div>

      <div className="p-6 bg-gray-100">
        {/* Section Form */}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Year:</label>
                <select
                  name="classYear"
                  value={formData.classYear}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">--Select--</option>
                  {classYearOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Code:</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="--Code--"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="--Name--"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Detail:</label>
              <input
                type="text"
                name="detail"
                value={formData.detail}
                onChange={handleInputChange}
                placeholder="--Detail--"
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex gap-3 mb-4">
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
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors shadow-sm"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
            {error && <div className="text-red-500 mt-3">{error}</div>}
            {/* Important Note */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-sm text-gray-700">
                <span className="text-red-500 font-medium">*</span> For Promote Students,{" "}
                <span className="text-green-600 font-medium">Previous/Old Section Active Should No</span> AND{" "}
                <span className="text-blue-600 font-medium">Status Should #Make Active</span>
              </p>
            </div>
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
                <option value="classYear">Class Year</option>
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
          {filteredSections.length !== sections.length && sections.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              Showing {filteredSections.length} of {sections.length} results
            </div>
          )}
        </div>

        {/* Sections Table */}
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
                    Class Year
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
                    Active
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
                {filteredSections.length > 0 ? (
                  filteredSections.map((section) => (
                    <tr key={section._id || section.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900">{section.program}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{section.department}</td>
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">{section.class}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{section.classYear}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{section.code}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{section.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{section.detail}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`font-medium ${section.isActive ? "text-green-600" : "text-red-600"}`}>
                          {section.isActive ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => handleStatusChange(section, !section.isActive)}
                          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors shadow-sm ${
                            section.isActive
                              ? "bg-red-500 hover:bg-red-600 text-white"
                              : "bg-blue-500 hover:bg-blue-600 text-white"
                          }`}
                        >
                          {section.isActive ? "Make Deactive" : "Make Active"}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-32 truncate">{section.campus}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{section.user}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="px-4 py-4 text-center text-sm text-gray-500">
                      No matching records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500">
            {sections.length > 0 ? (
              `Showing 1 to ${filteredSections.length} of ${sections.length} rows`
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
                    {confirmationModal.type === "activate" ? "Activate Section" : "Deactivate Section"}
                  </h3>
                  <p className="text-sm text-gray-500">This action will change the status of the section</p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to{" "}
                <span
                  className={`font-semibold ${
                    confirmationModal.type === "activate" ? "text-blue-600" : "text-red-600"
                  }`}
                >
                  {confirmationModal.type}
                </span>{" "}
                the following section?
              </p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="font-medium text-gray-900">{confirmationModal.sectionName}</p>
              </div>
              {confirmationModal.type === "deactivate" && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <span className="font-medium">Note:</span> Deactivating this section may affect student promotions
                    and enrollment processes.
                  </p>
                </div>
              )}
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