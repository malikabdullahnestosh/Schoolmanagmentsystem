"use client"

import { useState, useEffect } from "react"
import { ClipboardList, Search, Plus } from "lucide-react"
import constant from "../../../constant"

const EnrollmentChecklist = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  const [checklistItems, setChecklistItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [searchColumn, setSearchColumn] = useState("all")

  // Load checklist items from backend API
  useEffect(() => {
    setLoading(true)
    fetch(`${constant.apiUrl}/registration/enrollment-checklist`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.items)) {
          setChecklistItems(data.items)
        } else {
          setError("Failed to load checklist items")
        }
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load checklist items")
        setLoading(false)
      })
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.description.trim()) {
      alert("Please fill in all fields")
      return
    }

    // Check for duplicate names in loaded items
    const isDuplicate = checklistItems.some(
      (item) => item.name?.toLowerCase() === formData.name.trim().toLowerCase()
    )
    if (isDuplicate) {
      alert("A checklist item with this name already exists")
      return
    }

    setLoading(true)
    setError("")
    try {
      const res = await fetch(`${constant.apiUrl}/registration/enrollment-checklist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setChecklistItems([...checklistItems, data.item])
        setFormData({ name: "", description: "" })
        alert("Checklist item added successfully!")
      } else {
        setError(data.message || "Failed to add checklist item")
        alert(data.message || "Failed to add checklist item")
      }
    } catch {
      setError("Failed to add checklist item")
      alert("Failed to add checklist item")
    }
    setLoading(false)
  }

  const handleReset = () => {
    setFormData({ name: "", description: "" })
  }

  // Filter logic
  const filteredItems = checklistItems.filter((item) => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    switch (searchColumn) {
      case "name":
        return item.name?.toLowerCase().includes(searchLower)
      case "description":
        return item.description?.toLowerCase().includes(searchLower)
      default:
        return (
          item.name?.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower)
        )
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#2191BF]  text-white p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <ClipboardList className="h-6 w-6" />
          <h1 className="text-xl font-semibold">Student Enrollment Check List</h1>
        </div>
      </div>

      <div className="p-6">
        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="--Name--"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description:</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="--Description--"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-md transition-colors duration-200"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[#2191BF]  hover:bg-[#86cae5]  text-white font-medium rounded-md transition-colors duration-200 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
            {error && <div className="text-red-500 mt-3">{error}</div>}
          </form>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ClipboardList className="h-4 w-4" />
              <span>Enrollment Checklist Items</span>
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>

              <select
                value={searchColumn}
                onChange={(e) => setSearchColumn(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Columns</option>
                <option value="name">Name</option>
                <option value="description">Description</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => (
                    <tr
                      key={item._id || item.id}
                      className={`hover:bg-gray-50 transition-colors duration-150 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.description}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="px-6 py-8 text-center text-gray-500">
                      No checklist items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing {filteredItems.length > 0 ? "1" : "0"} to {filteredItems.length} of {filteredItems.length} rows
              {searchTerm && (
                <span className="ml-2 text-[#2191BF]">(filtered from {checklistItems.length} total entries)</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnrollmentChecklist