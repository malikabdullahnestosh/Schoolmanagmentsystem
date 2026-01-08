"use client";

import { useState, useEffect } from "react";
import { ChevronRight, Search, X } from "lucide-react";
import constant from "../../../constant";

const Payable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterColumn, setFilterColumn] = useState("all");
  const [payableData, setPayableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch and group by student
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // Get token from localStorage
        const token = localStorage.getItem("token"); // adjust key as needed

        const res = await fetch(`${constant.apiUrl}/payable`, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        if (!res.ok) throw new Error("Failed to fetch payable data");
        const data = await res.json();
        console.log(data);
        // Group by student (one row per student)
        const groupedObj = {};
        data.forEach((fee) => {
          // Use _id or another unique field for grouping
          const key = fee.studentId || fee._id || fee.name + (fee.rollNo || "");
          if (!groupedObj[key]) {
            groupedObj[key] = {
              id: key,
              srNo: Object.keys(groupedObj).length + 1,
              rollNo: fee.rollNo || "",
              name: fee.name,
              class:
                fee.class ||
                (fee.admission
                  ? `${fee.admission.className} (${fee.admission.classYearName})`
                  : ""),
              total: 0,
              phone: fee.phone || fee.contactNo || "",
              feesTypeList: [],
              feesAmountsList: [],
              campus:
                fee.campus ||
                fee.admission?.campus ||
                "The Future Grooming School",
            };
          }
          groupedObj[key].feesTypeList.push(
            fee.feeName || fee.feesDetails || fee.feeType || ""
          );
          groupedObj[key].feesAmountsList.push(
            fee.feeAmount || fee.totalFees || fee.amount || 0
          );
          groupedObj[key].total += Number(
            fee.feeAmount || fee.totalFees || fee.amount || 0
          );
        });
        const grouped = Object.values(groupedObj).map((student, idx) => ({
          ...student,
          srNo: idx + 1,
          feesType: student.feesTypeList.join(" , "),
          feesAmounts: student.feesAmountsList.join(" , "),
        }));
        setPayableData(grouped);
      } catch (err) {
        setError("Could not load payable data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter data based on search and column filter
  const filteredData = payableData.filter((item) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    switch (filterColumn) {
      case "name":
        return item.name.toLowerCase().includes(searchLower);
      case "class":
        return item.class.toLowerCase().includes(searchLower);
      case "phone":
        return item.phone.includes(searchTerm);
      case "campus":
        return item.campus.toLowerCase().includes(searchLower);
      case "total":
        return item.total.toString().includes(searchTerm);
      default:
        return (
          item.name.toLowerCase().includes(searchLower) ||
          item.class.toLowerCase().includes(searchLower) ||
          item.phone.includes(searchTerm) ||
          item.campus.toLowerCase().includes(searchLower) ||
          item.total.toString().includes(searchTerm) ||
          item.feesType?.toLowerCase().includes(searchLower) ||
          item.feesAmounts?.includes(searchTerm)
        );
    }
  });

  const clearSearch = () => setSearchTerm("");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        {/* Header */}
        <div className="bg-[#2191BF] text-white p-4 flex items-center gap-2">
          <ChevronRight className="w-5 h-5" />
          <h1 className="text-lg font-semibold">Students Payable Fees</h1>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-lg">
          {/* Search and Filter Section */}
          <div className="p-6 flex justify-end items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <option value="name">Name</option>
                <option value="class">Class</option>
                <option value="total">Total</option>
                <option value="phone">Phone</option>
                <option value="campus">Campus</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Sr No
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Roll No
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Name
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Class
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Total
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Fees Type
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Fees Amounts
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campus
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="px-6 py-4 text-center text-red-500"
                    >
                      {error}
                    </td>
                  </tr>
                ) : filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center border-r border-gray-200">
                        {item.srNo}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center border-r border-gray-200">
                        {item.rollNo}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-[#2191BF] font-medium border-r border-gray-200">
                        {item.name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center border-r border-gray-200">
                        {item.class}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center border-r border-gray-200">
                        {item.total}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center border-r border-gray-200">
                        {item.phone}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 border-r border-gray-200 max-w-xs">
                        <div className="break-words">{item.feesType}</div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 border-r border-gray-200 max-w-xs">
                        <div className="break-words">{item.feesAmounts}</div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 max-w-xs">
                        <div className="break-words">{item.campus}</div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-700">
              {loading
                ? "Loading..."
                : `Showing 1 to ${filteredData.length} of ${payableData.length} rows`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payable;
