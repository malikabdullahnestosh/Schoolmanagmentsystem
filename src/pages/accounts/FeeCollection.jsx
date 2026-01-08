"use client"

import { useState, useRef } from "react"
import constant from '../../../constant';

export default function FeeCollection() {
  const [rollNo, setRollNo] = useState("")
  const [name, setName] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [showVoucher, setShowVoucher] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const printRef = useRef(null)

  // Search by Roll No using GET /api/students/by-rollno/:rollNo
  const handleSearchByRollNo = async () => {
    if (!rollNo.trim()) return;
    try {
      setShowResults(false)
      setSelectedStudent(null)
      const res = await fetch(`${constant.apiUrl}/students/by-rollno/${encodeURIComponent(rollNo.trim())}`)
      const data = await res.json()
      if (data.success && data.student) {
        setSearchResults([data.student])
      } else {
        setSearchResults([])
      }
      setShowResults(true)
    } catch (err) {
      setSearchResults([])
      setShowResults(true)
      setSelectedStudent(null)
    }
  }

  // Search by Name using GET /api/students/by-name/:name
  const handleSearchByName = async () => {
    if (!name.trim()) return;
    try {
      setShowResults(false)
      setSelectedStudent(null)
      const res = await fetch(`${constant.apiUrl}/students/by-name/${encodeURIComponent(name.trim())}`)
      const data = await res.json()
      if (data.success && data.students) {
        setSearchResults(data.students)
      } else {
        setSearchResults([])
      }
      setShowResults(true)
    } catch (err) {
      setSearchResults([])
      setShowResults(true)
      setSelectedStudent(null)
    }
  }

  const handleSelectStudent = (student) => {
    setSelectedStudent(student)
  }

  // Calculate totals for the selected student (for new fee structure)
  const calculateTotals = () => {
    if (!selectedStudent || !selectedStudent.fees) return { totalFees: 0, totalPaid: 0, totalBalance: 0 }
    return selectedStudent.fees.reduce(
      (acc, fee) => ({
        totalFees: acc.totalFees + (fee.feeAmount || 0),
        // If you implement payment tracking, update totalPaid here
        totalPaid: acc.totalPaid + (fee.received || 0),
        totalBalance: acc.totalBalance + ((fee.feeAmount || 0) - (fee.received || 0)),
      }),
      { totalFees: 0, totalPaid: 0, totalBalance: 0 },
    )
  }

  const { totalFees, totalPaid, totalBalance } = calculateTotals()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#2191BF] text-white p-4 rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
            <span className="text-slate-800 text-sm font-bold">$</span>
          </div>
          <h1 className="text-xl font-semibold">Fee Collection</h1>
        </div>
      </div>

      <div className="p-4">
        {/* Roll No Search */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Enter Roll No</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              placeholder="Roll No"
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearchByRollNo}
              className="bg-[#2191BF] hover:bg-[#2191BF] text-white px-4 py-2 rounded-md transition-colors"
            >
              Get By Roll No
            </button>
          </div>
        </div>

        {/* Name Search */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Enter Name</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearchByName}
              className="bg-[#2191BF] hover:bg-[#2191BF] text-white px-4 py-2 rounded-md transition-colors"
            >
              Get By Name
            </button>
          </div>
        </div>

        {/* Student Details Header */}
        {selectedStudent && (
          <div className="mb-2 border border-gray-300 bg-white rounded-md p-4">
            <div className="flex flex-wrap mb-1">
              <div className="font-bold text-lg flex-1">
                {selectedStudent.admission?.rollNo} : {selectedStudent.name} S/O {selectedStudent.fatherName}
              </div>
              <div className="font-bold text-base flex-1">
                Class: {selectedStudent.admission?.className}
              </div>
            </div>
            <div className="flex flex-wrap mb-1">
              <div className="flex-1"><b>CNIC:</b> {selectedStudent.bFormNo || selectedStudent.cnic || "N/A"}</div>
              <div className="flex-1"><b>Phone#</b> {selectedStudent.contactNo}</div>
            </div>
            <div><b>Address:</b> {selectedStudent.currentAddress}</div>
          </div>
        )}

        {/* Results Table */}
        {showResults && searchResults.length > 0 && !selectedStudent && (
          <div className="overflow-x-auto bg-white rounded-md shadow-sm border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Father</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone 1</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone 2</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bey Form</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOB</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {searchResults.map((student) => (
                  <tr key={student._id || student.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{student.admission?.rollNo}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-red-600">{student.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-red-600">{student.fatherName}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{student.admission?.className}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-red-600">{student.currentAddress}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{student.contactNo}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{student.contactNo}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{student.bFormNo}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{student.dateOfBirth ? student.dateOfBirth.slice(0,10) : ""}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleSelectStudent(student)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-xs transition-colors"
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-3 bg-gray-50 text-xs text-gray-500">
              Showing 1 to {searchResults.length} of {searchResults.length} rows
            </div>
          </div>
        )}

        {/* Fee Details Table */}
        {selectedStudent && selectedStudent.fees && (
          <div className="overflow-x-auto bg-white rounded-md shadow-sm border border-gray-200 mb-6">
            <div className="flex justify-end p-2">
              <input
                type="text"
                placeholder="Search"
                className="p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedStudent.fees.map((fee, idx) => (
                  <tr key={fee._id || idx} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{idx + 1}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{fee.feeType}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{fee.feeName}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{fee.feeAmount}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{fee.dueDate ? fee.dueDate.slice(0,10) : ""}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{fee.expiryDate ? fee.expiryDate.slice(0,10) : ""}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      {fee.status === "unpaid"
                        ? <span className="text-red-600 font-bold">Un - Paid</span>
                        : <span className="text-green-600 font-bold">Paid</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-3 bg-gray-50 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Showing 1 to {selectedStudent.fees.length} of {selectedStudent.fees.length} rows
                </span>
                <span className="font-medium">
                  Total Fees: <span className="text-gray-900">{totalFees}</span> &rarr; Total Paid: <span className="text-green-600">{totalPaid}</span> &rarr; Total Balance: <span className={totalBalance < 0 ? "text-red-600" : "text-green-600"}>{totalBalance}</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* No Results Message */}
        {showResults && searchResults.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md">
            No students found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  )
}