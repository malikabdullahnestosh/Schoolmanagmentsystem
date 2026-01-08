"use client"

import { useState, useEffect } from "react"
import constant from '../../../constant';
export default function ExamType() {
  // Form state: use 'name' and 'detail' to match backend
  const [formData, setFormData] = useState({
    name: "",
    detail: "",
  })

  // Exam types data state
  const [examTypes, setExamTypes] = useState([])
  const [loading, setLoading] = useState(false)

  // Search state
  const [searchTerm, setSearchTerm] = useState("")
  const [searchColumn, setSearchColumn] = useState("all")
  const [filteredExamTypes, setFilteredExamTypes] = useState([])

  // Fetch exam types from API
  const fetchExamTypes = async (search = "", column = "all") => {
    setLoading(true)
    try {
      let url = `${constant.apiUrl}/exams/exam-type`
      if (search) {
        url += `?search=${encodeURIComponent(search)}&column=${column}`
      }
      const res = await fetch(url)
      const data = await res.json()
      if (data.success) setExamTypes(data.examTypes)
      else setExamTypes([])
    } catch {
      setExamTypes([])
    }
    setLoading(false)
  }

  // Initial fetch and on search
  useEffect(() => {
    fetchExamTypes()
  }, [])

  useEffect(() => {
    if (searchTerm) fetchExamTypes(searchTerm, searchColumn)
    else fetchExamTypes()
    // eslint-disable-next-line
  }, [searchTerm, searchColumn])

  useEffect(() => {
    setFilteredExamTypes(examTypes)
  }, [examTypes])

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
    if (!formData.name.trim() || !formData.detail.trim()) {
      alert("Please fill in all fields")
      return
    }
    try {
      const res = await fetch(`${constant.apiUrl}/exams/exam-type`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          detail: formData.detail.trim(),
        }),
      })
      const data = await res.json()
      if (data.success) {
        fetchExamTypes()
        handleReset()
        alert("Exam type added successfully!")
      } else {
        alert(data.message || "Failed to add exam type")
      }
    } catch {
      alert("Failed to add exam type!")
    }
  }

  // Reset form
  const handleReset = () => {
    setFormData({
      name: "",
      detail: "",
    })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-[#2191BF]  text-white p-3 flex items-center gap-2 rounded-t-lg">
        <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
          <span className="text-[#2191BF] text-sm font-bold">→</span>
        </div>
        <h1 className="text-lg font-medium">Exam Type</h1>
      </div>

      <div className="p-6 bg-gray-100">
        {/* Exam Type Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="----Exam Type----"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                <input
                  type="text"
                  name="detail"
                  value={formData.detail}
                  onChange={handleInputChange}
                  placeholder="-------Details-------"
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
                className="px-4 py-2 bg-[#2191BF]  hover:bg-[#7fc6e1]  text-white text-sm font-medium rounded transition-colors"
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
                <option value="name">Exam Type</option>
                <option value="detail">Detail</option>
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
          {filteredExamTypes.length !== examTypes.length && examTypes.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              Showing {filteredExamTypes.length} of {examTypes.length} results
            </div>
          )}
        </div>

        {/* Exam Types Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="min-w-[600px]">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exam Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Detail
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExamTypes.length > 0 ? (
                  filteredExamTypes.map((exam) => (
                    <tr key={exam._id || exam.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{exam.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{exam.detail}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500">
                      No matching records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500">
            {examTypes.length > 0 ? (
              `Showing 1 to ${filteredExamTypes.length} of ${examTypes.length} rows`
            ) : (
              <span>No records found</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}