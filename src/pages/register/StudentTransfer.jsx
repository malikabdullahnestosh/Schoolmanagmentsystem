"use client";

import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import constant from '../../../constant';
export default function StudentTransfer() {
  const [selectedClass, setSelectedClass] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchRollNo, setSearchRollNo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState("all");
  const [students, setStudents] = useState([]);
  const [showStudents, setShowStudents] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [nextSection, setNextSection] = useState("");
  const [transferLoading, setTransferLoading] = useState(false);

  // API token from localStorage (consider using context in a real app)
  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token") || "";
    }
    return "";
  };

  const getAxiosConfig = () => ({
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const classes = [
    "PLAY",
    "NURSERY",
    "KG",
    "CLASS 1",
    "CLASS 2",
    "CLASS 3",
    "CLASS 4",
    "CLASS 5",
    "CLASS 6",
    "CLASS 7",
    "CLASS 8",
    "CLASS 9",
    "CLASS 10",
  ];

  const sectionOptions = ["A", "B", "C", "D"];

  // Helper to get next section from the current one
  const getNextSections = (currentSection) => {
    const idx = sectionOptions.indexOf(currentSection);
    if (idx >= 0 && idx < sectionOptions.length - 1) {
      return sectionOptions.slice(idx + 1);
    }
    return [];
  };

  // Fetch all students from API
  const handleGetAllStudents = async () => {
    setLoading(true);
    setShowStudents(false);
    try {
      const res = await axios.get(
        `${constant.apiUrl}/students`,
        getAxiosConfig()
      );
      setStudents(res.data.students || res.data);
      setShowStudents(true);
      toast.success("Fetched all students!");
    } catch (err) {
      setStudents([]);
      setShowStudents(true);
      toast.error("Failed to fetch students.");
    }
    setLoading(false);
  };

  // Fetch by class (not section)
  const handleFetchByClass = async () => {
    if (!selectedClass) {
      toast.error("Please select a class!");
      return;
    }
    setLoading(true);
    setShowStudents(false);
    try {
      const res = await axios.get(
        `${constant.apiUrl}/students/section/${encodeURIComponent(
          selectedClass
        )}`,
        getAxiosConfig()
      );
      setStudents(res.data.students || res.data);
      setShowStudents(true);
   
    } catch (err) {
      setStudents([]);
      setShowStudents(true);
      toast.error("Failed to fetch students.");
    }
    setLoading(false);
  };

  const handleFetchByName = () => {
    if (!searchName.trim()) {
      toast.error("Please enter a name!");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const filtered = students.filter((student) =>
        (student.name || "").toLowerCase().includes(searchName.toLowerCase())
      );
      setStudents(filtered);
      setShowStudents(true);
      setLoading(false);
      toast.success("Filtered by name!");
    }, 1000);
  };

  const handleFetchByRollNo = () => {
    if (!searchRollNo.trim()) {
      toast.error("Please enter a roll number!");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const filtered = students.filter(
        (student) =>
          (student.admission?.rollNo || "").toString() === searchRollNo
      );
      setStudents(filtered);
      setShowStudents(true);
      setLoading(false);
      toast.success("Filtered by roll number!");
    }, 1000);
  };

  const handleTransferClick = (student) => {
    setSelectedStudent(student);
    setNextSection("");
    setShowTransferModal(true);
  };

  // UI: Transfer a student to the next section, with API integration
  const handleTransferSubmit = async () => {
    if (!nextSection) {
      toast.error("Please select a section to transfer!");
      return;
    }
    setTransferLoading(true);
    try {
      await axios.patch(
        `${constant.apiUrl}/students/${
          selectedStudent.id || selectedStudent._id
        }/transfer-section`,
        { newSection: nextSection },
        getAxiosConfig()
      );
      setStudents((prev) =>
        prev.map((student) =>
          (student.id || student._id) ===
          (selectedStudent.id || selectedStudent._id)
            ? {
                ...student,
                admission: {
                  ...student.admission,
                  sectionName: nextSection,
                },
                status: "Section Transferred",
              }
            : student
        )
      );
      toast.success(
        `Student ${selectedStudent.name} transferred to section ${nextSection}!`
      );
      setShowTransferModal(false);
      setSelectedStudent(null);
      setNextSection("");
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to transfer section."
      );
    }
    setTransferLoading(false);
  };

  const filteredStudents = students.filter((student) => {
    if (!searchTerm) return true;
    const searchValue = searchTerm.toLowerCase();
    switch (searchFilter) {
      case "compReg":
        return (student.compReg || "").toLowerCase().includes(searchValue);
      case "familyNo":
        return (student.familyNo || "").toString().includes(searchValue);
      case "rollNo":
        return (student.admission?.rollNo || "")
          .toString()
          .includes(searchValue);
      case "name":
        return (student.name || "").toLowerCase().includes(searchValue);
      case "father":
        return (student.fatherName || "").toLowerCase().includes(searchValue);
      case "class":
        return (student.admission?.className || "")
          .toLowerCase()
          .includes(searchValue);
      case "all":
      default:
        return Object.values(student).some(
          (value) =>
            value && value.toString().toLowerCase().includes(searchValue)
        );
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-[#2191BF] text-white rounded-t-lg shadow-lg">
          <div className="flex items-center p-6">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-4 shadow-md">
              <span className="text-[#2191BF] font-bold text-xl">→</span>
            </div>
            <h1 className="text-2xl font-bold">Student Transfer (Section)</h1>
          </div>
        </div>

        {/* Search Controls and Table (same as before) */}
        {/* ... keep previous search UI unchanged ... */}

        {/* Search Controls */}
        <div className="bg-white shadow-lg">
          {/* Primary Actions Row */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Get All Students */}
              <div className="lg:w-auto w-full">
                <button
                  onClick={handleGetAllStudents}
                  disabled={loading}
                  className="w-full lg:w-auto px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                    <>
                      <span className="mr-2">👥</span>
                      Get All Students
                    </>
                  )}
                </button>
              </div>

              {/* Class Selection */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 relative min-w-0">
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none bg-white text-gray-700 font-medium"
                    >
                      <option value="">Select Class</option>
                      {classes.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
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
                    onClick={handleFetchByClass}
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r bg-[#6c8d9a] text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
                  >
                    <span className="mr-2">🔍</span>
                    Fetch Data
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Search Row */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Search by Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <span className="mr-2">👤</span>
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
                    onClick={handleFetchByName}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
                  >
                    <span className="mr-2">🔍</span>
                    Search
                  </button>
                </div>
              </div>

              {/* Search by Roll Number */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <span className="mr-2">🔢</span>
                  Search by Roll Number
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter roll number..."
                    value={searchRollNo}
                    onChange={(e) => setSearchRollNo(e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-medium"
                  />
                  <button
                    onClick={handleFetchByRollNo}
                    className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-orange-800 focus:outline-none focus:ring-4 focus:ring-orange-300 transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
                  >
                    <span className="mr-2">🔍</span>
                    Search
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
                  <span className="mr-2">🔍</span>
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

                {/* Search Results Info */}
                {searchTerm && (
                  <div className="mt-3 text-sm bg-blue-100 text-blue-800 px-3 py-2 rounded-lg border border-blue-200">
                    {filteredStudents.length > 0 ? (
                      <>
                        Found {filteredStudents.length} student
                        {filteredStudents.length !== 1 ? "s" : ""}
                        {searchFilter !== "all" && ` in ${searchFilter}`}
                        matching "{searchTerm}"
                      </>
                    ) : (
                      <>
                        No students found matching "{searchTerm}"{" "}
                        {searchFilter !== "all" && `in ${searchFilter}`}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Students Table */}
        {showStudents && (
          <div className="bg-white rounded-b-lg shadow-lg overflow-hidden">
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
                      Section
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-blue-200">
                      Address
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-blue-200">
                      Phone 1
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-blue-200">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-blue-200">
                      Transfer
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student, index) => (
                    <tr
                      key={student.id || student._id || index}
                      className={`hover:bg-gray-50 transition-colors duration-150 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.compReg}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {student.familyNo}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {student.admission?.rollNo}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {student.fatherName}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {student.admission?.className}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {student.admission?.sectionName}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {student.currentAddress}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {student.contactNo}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            student.status === "Section Transferred"
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : "bg-blue-100 text-blue-800 border border-blue-200"
                          }`}
                        >
                          {student.status === "Section Transferred"
                            ? `Transferred to ${student.admission?.sectionName}`
                            : "Active"}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {student.status === "Section Transferred" ? (
                          <span className="text-green-600 font-semibold flex items-center">
                            <span className="mr-1">✅</span>
                            Transferred
                          </span>
                        ) : (
                          <button
                            onClick={() => handleTransferClick(student)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            Transfer to Next Section
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>
                  Showing {filteredStudents.length > 0 ? "1" : "0"} to{" "}
                  {filteredStudents.length} of {filteredStudents.length} rows
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
          </div>
        )}

        {/* Transfer Modal */}
        {showTransferModal && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t-lg">
                <h3 className="text-lg font-semibold text-gray-800">
                  Transfer Student to Next Section
                </h3>
                <button
                  onClick={() => setShowTransferModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Student Info */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="font-semibold text-gray-800">
                    {selectedStudent.admission?.rollNo} : {selectedStudent.name}{" "}
                    S / O {selectedStudent.fatherName}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Class: {selectedStudent.admission?.className} | Current
                    Section: {selectedStudent.admission?.sectionName}
                  </div>
                </div>

                {/* Select Next Section */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Next Section: <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={nextSection}
                      onChange={(e) => setNextSection(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none bg-white text-gray-700"
                    >
                      <option value="">--Select--</option>
                      {getNextSections(
                        selectedStudent.admission?.sectionName
                      ).map((sec) => (
                        <option key={sec} value={sec}>
                          {sec}
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
                </div>

                {/* Form Buttons */}
                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setShowTransferModal(false)}
                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTransferSubmit}
                    disabled={!nextSection || transferLoading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {transferLoading ? "Transferring..." : "Confirm Transfer"}
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
