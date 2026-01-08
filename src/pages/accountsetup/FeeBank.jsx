"use client"

import { useState, useEffect } from "react"
import { Building2, Search, Plus } from "lucide-react"
import constant from '../../../constant';

const FeeBank = () => {
  const [formData, setFormData] = useState({
    bankCode: "",
    bankName: "",
    accountNo: "",
    phone: "",
    address: "",
  })

  const [banks, setBanks] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchColumn, setSearchColumn] = useState("all")

  // Helper to get token from localStorage
  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token")
    }
    return null
  }

  // Fetch banks from API
  useEffect(() => {
    fetchBanks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchBanks = async () => {
    setLoading(true)
    try {
      const token = getToken()
      const res = await fetch(`${constant.apiUrl}/fee-banks/`, {
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
        },
      })
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setBanks(data)
    } catch (err) {
      alert("Failed to fetch banks!")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.bankCode || !formData.bankName || !formData.accountNo || !formData.phone || !formData.address) {
      alert("Please fill in all fields")
      return
    }

    // Check for duplicate bank code/accountNo locally before API call
    if (banks.some((bank) => bank.code.toLowerCase() === formData.bankCode.toLowerCase())) {
      alert("Bank code already exists")
      return
    }
    if (banks.some((bank) => bank.accountNo === formData.accountNo)) {
      alert("Account number already exists")
      return
    }

    // Call API to save
    try {
      setLoading(true)
      const token = getToken()
      const res = await fetch(`${constant.apiUrl}/fee-banks/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          code: formData.bankCode.toUpperCase(),
          name: formData.bankName,
          phone: formData.phone,
          address: formData.address,
          accountNo: formData.accountNo,
          campus: "The Future Grooming School",
          user: "Admin",
        }),
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || "Failed to add bank")
      }
      // Option 1: re-fetch banks
      await fetchBanks()
      handleReset()
      alert("Bank added successfully!")
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      bankCode: "",
      bankName: "",
      accountNo: "",
      phone: "",
      address: "",
    })
  }

  const filteredBanks = banks.filter((bank) => {
    if (!searchTerm) return true

    const searchLower = searchTerm.toLowerCase()
    switch (searchColumn) {
      case "code":
        return bank.code.toLowerCase().includes(searchLower)
      case "name":
        return bank.name.toLowerCase().includes(searchLower)
      case "phone":
        return bank.phone.toLowerCase().includes(searchLower)
      case "address":
        return bank.address.toLowerCase().includes(searchLower)
      case "accountNo":
        return bank.accountNo.toLowerCase().includes(searchLower)
      case "campus":
        return bank.campus.toLowerCase().includes(searchLower)
      case "user":
        return bank.user.toLowerCase().includes(searchLower)
      default:
        return (
          bank.code.toLowerCase().includes(searchLower) ||
          bank.name.toLowerCase().includes(searchLower) ||
          bank.phone.toLowerCase().includes(searchLower) ||
          bank.address.toLowerCase().includes(searchLower) ||
          bank.accountNo.toLowerCase().includes(searchLower) ||
          bank.campus.toLowerCase().includes(searchLower) ||
          bank.user.toLowerCase().includes(searchLower)
        )
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#2191BF]  text-white p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <Building2 className="h-6 w-6" />
          <h1 className="text-xl font-semibold">Fee Collection Bank</h1>
        </div>
      </div>

      <div className="p-6">
        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Code:</label>
                <input
                  type="text"
                  name="bankCode"
                  value={formData.bankCode}
                  onChange={handleInputChange}
                  placeholder="--Code--"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name:</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  placeholder="--Name--"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account No:</label>
                <input
                  type="text"
                  name="accountNo"
                  value={formData.accountNo}
                  onChange={handleInputChange}
                  placeholder="--Account No--"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone:</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="--Phone--"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="--Address--"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-md transition-colors duration-200"
                disabled={loading}
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#2191BF]  hover:bg-[#2191BF]  text-white font-medium rounded-md transition-colors duration-200 flex items-center gap-2"
                disabled={loading}
              >
                <Plus className="h-4 w-4" />
                {loading ? "Saving..." : "Submit"}
              </button>
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
                <option value="code">Code</option>
                <option value="name">Name</option>
                <option value="phone">Phone</option>
                <option value="address">Address</option>
                <option value="accountNo">Account No</option>
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
                  <Search className="h-5 w-5 text-gray-400" />
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
          {filteredBanks.length !== banks.length && banks.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              Showing {filteredBanks.length} of {banks.length} results
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account No
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
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredBanks.length > 0 ? (
                  filteredBanks.map((bank, index) => (
                    <tr key={bank.id || bank._id || index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bank.code}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bank.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bank.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bank.address}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bank.accountNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bank.campus}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bank.user}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      No banks found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-700">
              Showing {filteredBanks.length > 0 ? "1" : "0"} to {filteredBanks.length} of {filteredBanks.length} rows
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeeBank