"use client";

import { useState, useEffect } from "react";
import { ChevronRight, X, ChevronLeft, ChevronDown } from "lucide-react";
import constant from "../../../constant";
const Birthday = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterColumn, setFilterColumn] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showRowsDropdown, setShowRowsDropdown] = useState(false);
  const [ageData, setAgeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch the age-wise data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // Get token from localStorage
        const token = localStorage.getItem("token"); // adjust key if needed

        // Adjust the endpoint as needed
        const res = await fetch(`${constant.apiUrl}/birthday-report`, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        if (!res.ok) throw new Error("Failed to fetch age data");
        const data = await res.json();
        // If your API sends { data: [...] }, use data.data
        setAgeData(Array.isArray(data) ? data : data.data);
      } catch (err) {
        setError("Could not load age wise data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter data based on search and column filter
  const filteredData = ageData.filter((item) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();

    switch (filterColumn) {
      case "age":
        return item.age?.toString().includes(searchTerm);
      case "students":
        return item.students?.toString().includes(searchTerm);
      case "sum":
        return item.sum?.toString().includes(searchTerm);
      default:
        return (
          item.age?.toString().includes(searchTerm) ||
          item.students?.toString().includes(searchTerm) ||
          item.sum?.toString().includes(searchTerm)
        );
    }
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
    setShowRowsDropdown(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        {/* Header */}
        <div className="bg-[#2191BF] text-white p-4 flex items-center gap-2">
          <ChevronRight className="w-5 h-5" />
          <h1 className="text-lg font-semibold">Age Wise Student Count</h1>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-lg">
          {/* Secondary Header */}
          <div className="p-6 flex justify-between items-center">
            <h2 className="text-2xl font-medium text-gray-800">
              Age Wise List
            </h2>

            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <select
                value={filterColumn}
                onChange={(e) => setFilterColumn(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              >
                <option value="all">All Columns</option>
                <option value="age">Age</option>
                <option value="students">Students</option>
                <option value="sum">Sum</option>
              </select>
            </div>
          </div>

          {/* Error/Loading */}
          {loading && (
            <div className="py-8 text-center text-blue-600">Loading...</div>
          )}
          {error && (
            <div className="py-8 text-center text-red-600">{error}</div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sum
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {!loading && currentData.length > 0
                  ? currentData.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                          {item.age}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium text-center">
                          {item.students}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium text-center">
                          {item.sum}
                        </td>
                      </tr>
                    ))
                  : !loading && (
                      <tr>
                        <td
                          colSpan="3"
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No data found
                        </td>
                      </tr>
                    )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredData.length)} of {filteredData.length}{" "}
              rows
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowRowsDropdown(!showRowsDropdown)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm flex items-center gap-1"
                >
                  {rowsPerPage} <span className="text-xs">rows per page</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showRowsDropdown && (
                  <div className="absolute bottom-full mb-1 left-0 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                    {[5, 10, 20, 50, 100].map((rows) => (
                      <button
                        key={rows}
                        onClick={() => handleRowsPerPageChange(rows)}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        {rows}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`p-1 rounded-md ${
                    currentPage === 1
                      ? "text-gray-400"
                      : "text-[#2191BF] hover:bg-blue-100"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 flex items-center justify-center rounded-md ${
                        currentPage === pageNum
                          ? "bg-[#2191BF] text-white"
                          : "text-blue-600 hover:bg-blue-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && <span className="px-2">...</span>}
                <button
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`p-1 rounded-md ${
                    currentPage === totalPages
                      ? "text-gray-400"
                      : "text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Birthday;
