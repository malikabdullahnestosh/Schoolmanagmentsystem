"use client"

import { useState, useEffect } from "react"
import { ChevronRight, Search, ChevronDown, CheckCircle, XCircle } from "lucide-react"
import constant from "../../../constant" // adjust path as needed

const FeePolicy = () => {
  const [formData, setFormData] = useState({
    program: "",
    department: "",
    class: "",
    classYear: "",
    feeName: "",
    fee: "",
    feeAfterDueDate: "",
    tuitionFee: "",
    securityFee: "",
    sportsFee: "",
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [filterColumn, setFilterColumn] = useState("all")
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(false)

  const allPrograms = ["PLAY GROUP", "PRIMARY", "SECONDARY"]
  const allDepartments = {
    "PLAY GROUP": ["PLAY GROUP"],
    PRIMARY: ["SCIENCE", "ARTS", "COMMERCE"],
    SECONDARY: ["SCIENCE", "ARTS", "COMMERCE"],
  }
  const allClasses = {
    "PLAY GROUP": ["PLAY", "NURSERY", "KG"],
    SCIENCE: ["CLASS 1", "CLASS 2", "CLASS 3"],
    ARTS: ["CLASS 4", "CLASS 5", "CLASS 6"],
    COMMERCE: ["CLASS 7", "CLASS 8", "CLASS 9"],
  }
  const classYears = ["2024", "2025", "2026"]

  const [availableDepartments, setAvailableDepartments] = useState(allDepartments[formData.program] || [])
  const [availableClasses, setAvailableClasses] = useState(allClasses[formData.department] || [])

  const columns = [
    { key: "all", label: "All Columns" },
    { key: "program", label: "Program" },
    { key: "department", label: "Department" },
    { key: "class", label: "Class" },
    { key: "year", label: "Year" },
    { key: "feeName", label: "Fee Name" },
    { key: "fee", label: "Fee" },
    { key: "feeAfterDueDate", label: "Fee After Due Date" },
    { key: "status", label: "Status" },
    { key: "campus", label: "Campus" },
  ]

  // Helper to get token from localStorage
  const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("token") : null)

  // Fetch policies from API
  const fetchPolicies = async () => {
    setLoading(true)
    try {
      const token = getToken()
      const res = await fetch(`${constant.apiUrl}/fee-policies`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      })
      if (!res.ok) throw new Error("Failed to fetch policies")
      const data = await res.json()
      setPolicies(data)
    } catch (err) {
      alert("Failed to fetch fee policies!")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPolicies()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setAvailableDepartments(allDepartments[formData.program] || [])
    setAvailableClasses([])
    setFormData((prev) => ({ ...prev, department: "", class: "" }))
  }, [formData.program])

  useEffect(() => {
    setAvailableClasses(allClasses[formData.department] || [])
    setFormData((prev) => ({ ...prev, class: "" }))
  }, [formData.department])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleReset = () => {
    setFormData({
      program: "",
      department: "",
      class: "",
      classYear: "",
      feeName: "",
      fee: "",
      feeAfterDueDate: "",
      tuitionFee: "",
      securityFee: "",
      sportsFee: "",
    })
    setAvailableDepartments(allDepartments[formData.program] || [])
    setAvailableClasses(allClasses[formData.department] || [])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.program || !formData.department || !formData.class || !formData.feeName) {
      alert("Please fill in all required fields")
      return
    }
    try {
      setLoading(true)
      const token = getToken()
      const res = await fetch(`${constant.apiUrl}/fee-policies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          program: formData.program,
          department: formData.department,
          class: formData.class,
          year: formData.classYear,
          feeName: formData.feeName,
          fee: formData.fee,
          feeAfterDueDate: formData.feeAfterDueDate,
          feesDetails: {
            tuitionFee: Number.parseInt(formData.tuitionFee) || 0,
            securityFee: Number.parseInt(formData.securityFee) || 0,
            sportsFee: Number.parseInt(formData.sportsFee) || 0,
          },
          status: "Yes",
          campus: "The Future Grooming School",
        }),
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || "Failed to add fee policy")
      }
      await fetchPolicies()
      handleReset()
      alert("Fee policy created successfully!")
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (id, newStatus) => {
    setConfirmAction({ id, newStatus, type: newStatus === "Yes" ? "activate" : "deactivate" })
    setShowConfirmModal(true)
  }

  const confirmStatusChange = async () => {
    try {
      setLoading(true)
      const token = getToken()
      const res = await fetch(`${constant.apiUrl}/fee-policies/${confirmAction.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ status: confirmAction.newStatus }),
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || "Failed to update status")
      }
      await fetchPolicies()
      const action = confirmAction.type === "activate" ? "activated" : "deactivated"
      alert(`Fee policy has been ${action} successfully!`)
      setShowConfirmModal(false)
      setConfirmAction(null)
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredPolicies = policies.filter((policy) => {
    const searchLower = searchTerm.toLowerCase()
    if (filterColumn === "all") {
      return Object.values(policy).some((value) => value && value.toString().toLowerCase().includes(searchLower))
    }
    const fieldValue = policy[filterColumn]
    return fieldValue && fieldValue.toString().toLowerCase().includes(searchLower)
  })

  const formatFeesDetails = (feesDetails) => {
    if (!feesDetails) return null
    const details = []
    if (feesDetails.tuitionFee > 0) details.push(`Tuition Fee(${feesDetails.tuitionFee})`)
    if (feesDetails.securityFee > 0) details.push(`Security Fee(${feesDetails.securityFee})`)
    if (feesDetails.sportsFee > 0) details.push(`Sports Fee(${feesDetails.sportsFee})`)
    const total =
      (feesDetails.tuitionFee || 0) +
      (feesDetails.securityFee || 0) +
      (feesDetails.sportsFee || 0)
    return (
      <div className="text-sm">
        {details.map((detail, index) => (
          <div key={index}>{detail} ,</div>
        ))}
        <div className="mt-1 font-semibold">{total}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#2191BF] text-white p-4 flex items-center">
        <ChevronRight className="mr-2" size={20} />
        <h1 className="text-xl font-semibold">Fee Policy</h1>
      </div>

      {/* Form Section */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-6">
          {/* ... form fields unchanged ... */}
          {/* (use your own form fields code from above, unchanged) */}
          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Program:</label>
              <select
                value={formData.program}
                onChange={(e) => handleInputChange("program", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">--Select--</option>
                {allPrograms.map((program) => (
                  <option key={program} value={program}>
                    {program}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department:</label>
              <select
                value={formData.department}
                onChange={(e) => handleInputChange("department", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!formData.program}
              >
                <option value="">--Select--</option>
                {availableDepartments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class:</label>
              <select
                value={formData.class}
                onChange={(e) => handleInputChange("class", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!formData.department}
              >
                <option value="">--Select--</option>
                {availableClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class Year:</label>
              <select
                value={formData.classYear}
                onChange={(e) => handleInputChange("classYear", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">--Select--</option>
                {classYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fee Name:</label>
              <input
                type="text"
                value={formData.feeName}
                onChange={(e) => handleInputChange("feeName", e.target.value)}
                placeholder="--Name--"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fee:</label>
              <input
                type="number"
                value={formData.fee}
                onChange={(e) => handleInputChange("fee", e.target.value)}
                placeholder="--Fee--"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fee After Due Date:</label>
              <input
                type="number"
                value={formData.feeAfterDueDate}
                onChange={(e) => handleInputChange("feeAfterDueDate", e.target.value)}
                placeholder="--Fee After Due Date--"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          {/* Fees Details Record Section */}
          <div className="mb-6">
            <div className="bg-[#2191BF] text-white px-4 py-3 rounded-t-lg">
              <h3 className="text-lg font-semibold">Fees Details Record</h3>
            </div>
            <div className="border border-t-0 rounded-b-lg p-6 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-4">Fees Details:</h4>
                  <div className="space-y-3">
                    <div className="bg-gray-200 px-4 py-3 rounded-md text-gray-700">Tuition Fee</div>
                    <div className="bg-gray-200 px-4 py-3 rounded-md text-gray-700">Security Fee</div>
                    <div className="bg-gray-200 px-4 py-3 rounded-md text-gray-700">Sports Fee</div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-4">Amount:</h4>
                  <div className="space-y-3">
                    <input
                      type="number"
                      value={formData.tuitionFee}
                      onChange={(e) => handleInputChange("tuitionFee", e.target.value)}
                      placeholder="--Tuition Fee Amount--"
                      className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      value={formData.securityFee}
                      onChange={(e) => handleInputChange("securityFee", e.target.value)}
                      placeholder="--Security Fee Amount--"
                      className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      value={formData.sportsFee}
                      onChange={(e) => handleInputChange("sportsFee", e.target.value)}
                      placeholder="--Sports Fee Amount--"
                      className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
              disabled={loading}
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#2191BF] text-white rounded-md hover:bg-[#85cbe6] transition-colors"
              disabled={loading}
            >
              {loading ? "Saving..." : "Submit"}
            </button>
          </div>
        </form>

        {/* Search and Filter Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative">
              <select
                value={filterColumn}
                onChange={(e) => setFilterColumn(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {columns.map((column) => (
                  <option key={column.key} value={column.key}>
                    {column.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear
              </button>
            )}
            <div className="flex gap-2">
              <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
                <ChevronDown size={16} />
              </button>
              <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
          {searchTerm && (
            <div className="mt-2 text-sm text-gray-600">
              Showing {filteredPolicies.length} of {policies.length} results
            </div>
          )}
        </div>

        {/* Table Section */}
        <div className="mt-4 bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Program</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Department</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Class</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Year</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Fee Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Fee</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Fee After Due Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Fees Details</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Edit Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Campus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPolicies.map((policy) => (
                  <tr key={policy._id || policy.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{policy.program}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{policy.department}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{policy.class}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{policy.year}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{policy.feeName}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{policy.fee}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{policy.feeAfterDueDate}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{formatFeesDetails(policy.feesDetails)}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          policy.status === "Yes" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {policy.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {policy.status === "Yes" ? (
                        <button
                          onClick={() => handleStatusChange(policy._id || policy.id, "No")}
                          className="px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition-colors"
                          disabled={loading}
                        >
                          Make Deactive (Hide)
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(policy._id || policy.id, "Yes")}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
                          disabled={loading}
                        >
                          Make Active (Show)
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{policy.campus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t text-sm text-gray-600">
            Showing {filteredPolicies.length} to {filteredPolicies.length} of {policies.length} rows
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 transform transition-all">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100">
              {confirmAction?.type === "activate" ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              {confirmAction?.type === "activate" ? "Activate Fee Policy" : "Deactivate Fee Policy"}
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to {confirmAction?.type} this fee policy?
            </p>
            <div className="bg-gray-50 rounded-lg p-3 mb-6">
              <div className="text-sm text-gray-600">
                <strong>Policy:</strong> {policies.find((p) => (p._id || p.id) === confirmAction?.id)?.feeName}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusChange}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                  confirmAction?.type === "activate"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
                disabled={loading}
              >
                {confirmAction?.type === "activate" ? "Activate" : "Deactivate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FeePolicy