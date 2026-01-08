"use client";

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import constant from "../../../constant";
const printStyles = `
  @media print {
    body * { visibility: hidden; }
    .print-family-fee-content, .print-family-fee-content * { visibility: visible; }
    .print-family-fee-content { position: absolute; left: 0; top: 0; width: 100%; height: 100%; padding: 0; margin: 0; }
    .print-modal-header, .print-modal-footer, .print-buttons { display: none !important; }
    .print-family-fee-body { padding: 0; margin: 0; }
    table { page-break-inside: avoid; }
    @page { size: A4; margin: 5mm; }
    .print-fee-form { font-size: 8pt; line-height: 1; }
    .print-fee-form td, .print-fee-form th { padding: 1px 2px; }
    .print-fee-form .fee-header { font-size: 10pt; font-weight: bold; }
    .print-fee-form .small-text { font-size: 7pt; }
    .print-fee-form .signature-space { height: 10px; }
    .fee-challan-copy { margin-bottom: 5mm; }
    .fee-challan-copy:last-child { margin-bottom: 0; }
  }
`;

export default function StudentAccount() {
  const location = useLocation();
  const [selectedSection, setSelectedSection] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchRollNo, setSearchRollNo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState("all");
  const [students, setStudents] = useState([]);
  const [showStudents, setShowStudents] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [showFamilyFeeModal, setShowFamilyFeeModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [showFeeCollectionModal, setShowFeeCollectionModal] = useState(false);

  // Handle search from header navigation
  useEffect(() => {
    if (location.state?.autoSearch) {
      const searchQuery = location.state?.searchName || "";
      setSearchName(searchQuery);

      if (searchQuery.trim()) {
        handleFetchByName(searchQuery);
      } else {
        handleGetAllStudents();
      }
    }
    // eslint-disable-next-line
  }, [location.state]); // suppress exhaustive-deps warning for handler fns

  // Section array fix: needs id & name for select
  const sections = [
    { id: 1, name: "PLAY" },
    { id: 2, name: "NURSERY" },
    { id: 3, name: "KG" },
    { id: 4, name: "CLASS 1" },
    { id: 5, name: "CLASS 2" },
    { id: 6, name: "CLASS 3" },
    { id: 7, name: "CLASS 4" },
    { id: 8, name: "CLASS 5" },
    { id: 9, name: "CLASS 6" },
    { id: 10, name: "CLASS 7" },
    { id: 11, name: "CLASS 8" },
    { id: 12, name: "CLASS 9" },
    { id: 13, name: "CLASS 10" },
  ];

  // Fetch all students from API
  const handleGetAllStudents = async () => {
    setLoading(true);
    setShowStudents(false);

    try {
      const token = localStorage.getItem("token");
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const res = await axios.get(`${constant.apiUrl}/students/`, config);
      const studentsData = res.data.students || res.data;

      // Add an id for each student for key if not present
      const studentsWithId = studentsData.map((student, idx) => ({
        ...student,
        id: student.id || student._id || idx + 1,
      }));

      setStudents(studentsWithId);
      setShowStudents(true);
    } catch (err) {
      console.error("Error fetching students:", err);
      setStudents([]);
      setShowStudents(true);
    }
    setLoading(false);
  };

  // Fetch by section
  const handleFetchBySection = async () => {
    if (!selectedSection) {
      return;
    }
    setLoading(true);
    setShowStudents(false);

    try {
      const token = localStorage.getItem("token");
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const res = await axios.get(
        `${constant.apiUrl}/students/section/${encodeURIComponent(
          selectedSection
        )}`,
        config
      );
      const studentsData = res.data.students || res.data;

      const studentsWithId = studentsData.map((student, idx) => ({
        ...student,
        id: student.id || student._id || idx + 1,
      }));

      setStudents(studentsWithId);
      setShowStudents(true);
    } catch (err) {
      console.error("Error fetching students by section:", err);
      setStudents([]);
      setShowStudents(true);
    }
    setLoading(false);
  };

  // Fetch by name
  const handleFetchByName = async (nameToSearch = null) => {
    const searchQuery = nameToSearch || searchName;
    if (!searchQuery.trim()) {
      return;
    }

    setLoading(true);
    setShowStudents(false);

    try {
      const token = localStorage.getItem("token");
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      const res = await axios.get(`${constant.apiUrl}/students/`, config);
      const allStudents = res.data.students || res.data;

      const filtered = allStudents.filter((student) =>
        (student.name || "").toLowerCase().includes(searchQuery.toLowerCase())
      );

      const studentsWithId = filtered.map((student, idx) => ({
        ...student,
        id: student.id || student._id || idx + 1,
      }));

      setStudents(studentsWithId);
      setShowStudents(true);
    } catch (err) {
      console.error("Search error:", err);
      setStudents([]);
      setShowStudents(true);
    }
    setLoading(false);
  };

  // Fetch by roll no
  const handleFetchByRollNo = async () => {
    if (!searchRollNo.trim()) {
      return;
    }

    setLoading(true);
    setShowStudents(false);

    try {
      const token = localStorage.getItem("token");
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const res = await axios.get(`${constant.apiUrl}/students/`, config);
      const allStudents = res.data.students || res.data;

      const filtered = allStudents.filter(
        (student) =>
          (student.admission?.rollNo || student.rollNo || "").toString() ===
          searchRollNo
      );

      const studentsWithId = filtered.map((student, idx) => ({
        ...student,
        id: student.id || student._id || idx + 1,
      }));

      setStudents(studentsWithId);
      setShowStudents(true);
    } catch (err) {
      console.error("Error searching by roll number:", err);
      setStudents([]);
      setShowStudents(true);
    }
    setLoading(false);
  };

  // Show modals
  const handleShowFeeDetails = (student) => {
    setSelectedStudent(student);
    setShowFeeModal(true);
  };

  const handleShowFamilyFees = (student) => {
    if (!student.familyNo) return;

    const familyStudents = students.filter(
      (s) => s.familyNo === student.familyNo
    );

    setSelectedFamily({
      familyNo: student.familyNo,
      father: student.fatherName || student.father,
      students: familyStudents,
      dueDate: "2024-03-15",
      month: "March 2024",
      accountNo: "0123456789",
      grandTotal: "24500",
    });
    setShowFamilyFeeModal(true);
  };

  const handlePrintFamilyFees = () => {
    window.print();
  };

  const handleFeeCollection = () => {
    setShowFeeCollectionModal(true);
  };

  // Filter students based on search
  const filteredStudents = students.filter((student) => {
    if (!searchTerm) return true;
    const searchValue = searchTerm.toLowerCase();
    switch (searchFilter) {
      case "compReg":
        return (student.compReg || "").toLowerCase().includes(searchValue);
      case "familyNo":
        return (student.familyNo || "").toString().includes(searchValue);
      case "rollNo":
        return (student.admission?.rollNo || student.rollNo || "")
          .toString()
          .includes(searchValue);
      case "name":
        return (student.name || "").toLowerCase().includes(searchValue);
      case "father":
        return (student.fatherName || student.father || "")
          .toLowerCase()
          .includes(searchValue);
      case "class":
        return (student.admission?.className || student.class || "")
          .toLowerCase()
          .includes(searchValue);
      case "all":
      default:
        return Object.values(student)
          .filter((v) => typeof v === "string" || typeof v === "number")
          .some((value) =>
            value.toString().toLowerCase().includes(searchValue)
          );
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-[#2191BF] text-white rounded-t-lg shadow-lg">
          <div className="flex items-center p-6">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-4 shadow-md">
              <span className="text-[#2191BF] font-bold text-xl">→</span>
            </div>
            <h1 className="text-2xl font-bold">Students Accounts Management</h1>
          </div>
        </div>

        {/* Search Controls */}
        <div className="bg-white shadow-lg">
          {/* Primary Actions Row */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="lg:w-auto w-full">
                <button
                  onClick={handleGetAllStudents}
                  disabled={loading}
                  className="w-full lg:w-auto px-8 py-3 bg-[#2191BF] text-white font-semibold rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Loading...
                    </>
                  ) : (
                    "Get All Students"
                  )}
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 relative min-w-0">
                    <select
                      value={selectedSection}
                      onChange={(e) => setSelectedSection(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2191BF] focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none bg-white text-gray-700 font-medium"
                    >
                      <option value="">Select Section</option>
                      {sections.map((section) => (
                        <option key={section.id} value={section.name}>
                          {section.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                      <svg
                        className="fill-current h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                  <button
                    onClick={handleFetchBySection}
                    disabled={loading}
                    className="px-6 py-3 bg-[#2191BF] text-white font-semibold rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap disabled:opacity-50"
                  >
                    Fetch Data
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Search Row */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Search by Student Name
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter student name..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-medium"
                  />
                  <button
                    onClick={() => handleFetchByName()}
                    disabled={loading}
                    className="px-6 py-3 bg-[#2191BF] text-white font-semibold rounded-lg  focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap disabled:opacity-50"
                  >
                    Fetch Data
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Search by Roll Number
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter roll number..."
                    value={searchRollNo}
                    onChange={(e) => setSearchRollNo(e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2191BF] focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-medium"
                  />
                  <button
                    onClick={handleFetchByRollNo}
                    disabled={loading}
                    className="px-6 py-3 bg-[#2191BF] text-white font-semibold rounded-lg hover:from-[#2191BF] focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap disabled:opacity-50"
                  >
                    Fetch Data
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Search Bar */}
          {showStudents && (
            <div className="px-6 pb-6 border-t border-gray-200 pt-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  Advanced Search & Filter
                </h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="search-filter"
                      className="text-sm font-medium whitespace-nowrap text-gray-600"
                    >
                      Filter by:
                    </label>
                    <select
                      id="search-filter"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm font-medium"
                    >
                      <option value="all">All Fields</option>
                      <option value="compReg">Comp. Reg#</option>
                      <option value="familyNo">Family No</option>
                      <option value="rollNo">Roll No</option>
                      <option value="name">Name</option>
                      <option value="father">Father</option>
                      <option value="class">Class</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      placeholder={`Search ${
                        searchFilter === "all" ? "all fields" : searchFilter
                      }...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full sm:w-80 font-medium"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="px-3 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white text-sm transition-colors font-medium"
                        title="Clear search"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Students Table */}
        {showStudents && (
          <div className="bg-white rounded-b-lg shadow-lg overflow-hidden">
            {filteredStudents.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-blue-200">
                          Comp. Reg#
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-blue-200">
                          Family No
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-blue-200">
                          Roll No
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-blue-200">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-blue-200">
                          Father
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-blue-200">
                          Class
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-blue-200">
                          Address
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-blue-200">
                          Phone 1
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-blue-200">
                          Phone 2
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-blue-200">
                          Fees
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map((student, index) => (
                        <tr
                          key={student.id}
                          className={`hover:bg-gray-50 transition-colors duration-150 ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                            {student.compReg}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {student.familyNo}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {student.admission?.rollNo || student.rollNo}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                            {student.name}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                            {student.fatherName}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {student.admission?.className || student.class}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {student.currentAddress}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {student.contactNo}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {student.contactNo}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleShowFeeDetails(student)}
                              className="px-4 py-2 bg-[#2191BF] text-white text-sm font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                              Fees
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>
                      Showing {filteredStudents.length > 0 ? "1" : "0"} to{" "}
                      {filteredStudents.length} of {filteredStudents.length}{" "}
                      rows
                      {searchTerm &&
                        ` (filtered from ${students.length} total students)`}
                    </span>
                    {filteredStudents.length > 0 && (
                      <span className="text-blue-600 font-medium">
                        Total Students: {students.length}
                      </span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-12 text-center">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Data Found
                </h3>
              </div>
            )}
          </div>
        )}

        {/* Fee Details Modal */}
        {showFeeModal && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t-lg">
                <h3 className="text-lg font-semibold text-gray-800">
                  Fees Details
                </h3>
                <button
                  onClick={() => setShowFeeModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="font-semibold text-gray-800">
                    {selectedStudent.admission?.rollNo ||
                      selectedStudent.rollNo}{" "}
                    : {selectedStudent.name} S / O {selectedStudent.fatherName}{" "}
                    Fees Details
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                          Sr No
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                          Challan (Policy)
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                          Fees Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                          Fees Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                          Fees
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Array.isArray(selectedStudent.fees) &&
                      selectedStudent.fees.length > 0 ? (
                        selectedStudent.fees.map((fee, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{fee.feeType}</td>
                            <td>{fee.feeName}</td>
                            <td>{fee.feeAmount}</td>
                            <td>{fee.paidAmount}</td>
                            <td>{fee.feeAmount - fee.paidAmount}</td>
                            <td>{fee.status}</td>
                            <td>
                              {new Date(fee.dueDate).toLocaleDateString()}
                            </td>
                            <td>
                              {new Date(fee.expiryDate).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="5"
                            className="text-center text-gray-400 py-4"
                          >
                            No fee records found for this student.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <h4 className="text-lg font-semibold text-red-600 mb-4">
                  Un Paid Challan
                </h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                          Sr No
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                          Challan ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Array.isArray(selectedStudent.unpaidFees) &&
                      selectedStudent.unpaidFees.length > 0 ? (
                        selectedStudent.unpaidFees.map((fee, index) => (
                          <tr key={fee.id || index}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {fee.id || index + 1}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                              {fee.challanId}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                              {fee.name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {fee.amount}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                              {fee.date}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="5"
                            className="text-center text-gray-400 py-4"
                          >
                            No unpaid challans found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end p-4 border-t bg-gray-50 rounded-b-lg">
                  <button
                    onClick={() => setShowFeeModal(false)}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
