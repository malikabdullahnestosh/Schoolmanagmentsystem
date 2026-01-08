"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import constant from '../../../constant';
export default function ParentInformation() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState("All Fields");
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchStudents() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("No token found. Please log in.");
          setLoading(false);
          return;
        }
        // Replace with your actual API base URL
        const res = await axios.get(`${constant.apiUrl}/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });

       
        const students = res.data.students || res.data || [];
        
        const guardiansMap = {};
        students.forEach(student => {
          const parent = {
            id: student.familyNo || student.id || student._id,
            familyNo: student.familyNo,
            fatherName: student.fatherName || student.father || "",
            fatherCnic: student.guardian.cnic || student.cnic || "",
            cell: student.contactNo || student.fatherCell || "",
            fatherCell: student.fatherCell || student.contactNo || "",
            residency: student.currentAddress || student.residency || "",
            campus: student.campus || student.schoolCampus || "The Future Grooming School",
          };
          // Use familyNo or fatherCnic as unique key to avoid duplicate parents
          const key = parent.familyNo || parent.fatherCnic || parent.fatherName;
          if (key && !guardiansMap[key]) {
            guardiansMap[key] = parent;
          }
        });
        setParents(Object.values(guardiansMap));
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          toast.error("Unauthorized. Please log in again.");
        } else {
          toast.error("Failed to fetch students");
        }
        setParents([]);
      }
      setLoading(false);
    }
    fetchStudents();
  }, []);

  // Filter parents based on search term and selected filter
  const filteredParents = parents.filter((parent) => {
    const searchTermLower = searchTerm.toLowerCase();
    if (searchFilter === "All Fields") {
      return Object.values(parent).some((value) =>
        value?.toString().toLowerCase().includes(searchTermLower)
      );
    } else if (searchFilter === "Sr. No") {
      return (parent.id || "")
        .toString()
        .toLowerCase()
        .includes(searchTermLower);
    } else if (searchFilter === "Family No") {
      return (parent.familyNo || "")
        .toString()
        .toLowerCase()
        .includes(searchTermLower);
    } else if (searchFilter === "Father") {
      return (parent.fatherName || "")
        .toLowerCase()
        .includes(searchTermLower);
    } else if (searchFilter === "Father CNIC") {
      return (parent.fatherCnic || "")
        .toLowerCase()
        .includes(searchTermLower);
    } else if (searchFilter === "CELL") {
      return (parent.cell || "")
        .toLowerCase()
        .includes(searchTermLower);
    } else if (searchFilter === "Father CELL") {
      return (parent.fatherCell || "")
        .toLowerCase()
        .includes(searchTermLower);
    } else if (searchFilter === "Residency") {
      return (parent.residency || "")
        .toLowerCase()
        .includes(searchTermLower);
    } else if (searchFilter === "Campus") {
      return (parent.campus || "")
        .toLowerCase()
        .includes(searchTermLower);
    }
    return false;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-[#2191BF] text-white rounded-t-lg">
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#2191BF] font-bold text-lg">→</span>
              </div>
              <h1 className="text-xl font-semibold">Parents Information</h1>
            </div>
            <div className="flex items-center gap-4">
              {loading && (
                <span className="text-white font-semibold">Loading...</span>
              )}
              <div className="relative">
                <select
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-gray-700"
                >
                  <option>All Fields</option>
                  <option>Sr. No</option>
                  <option>Family No</option>
                  <option>Father</option>
                  <option>Father CNIC</option>
                  <option>CELL</option>
                  <option>Father CELL</option>
                  <option>Residency</option>
                  <option>Campus</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 rounded border-0 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-b-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-blue-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Sr #
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-blue-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Family No
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-blue-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Father
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-blue-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Father CNIC
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-blue-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    CELL
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-blue-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Father CELL
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-blue-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Residency
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-blue-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Campus
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredParents.length > 0 ? (
                  filteredParents.map((parent, index) => (
                    <tr
                      key={parent.id || `${parent.familyNo}_${index}`}
                      className={index % 2 === 0 ? "bg-gray-50" : ""}
                    >
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {index+1}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {parent.familyNo}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm font-medium text-blue-600">
                        {parent.fatherName}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {parent.fatherCnic}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {parent.cell}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {parent.fatherCell}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {parent.residency}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {parent.campus}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-5 py-5 border-b border-gray-200 text-sm text-center"
                    >
                      {loading
                        ? "Loading..."
                        : searchTerm
                        ? "No matching parents found"
                        : "No parents available."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="py-3 px-5 bg-blue-100 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {filteredParents.length > 0
                  ? `Showing 1 to ${filteredParents.length} of ${filteredParents.length} rows`
                  : "No entries to show"}
              </div>
              {searchTerm && (
                <div className="text-sm text-blue-600 font-medium">
                  {filteredParents.length > 0
                    ? `Found ${filteredParents.length} parent${
                        filteredParents.length !== 1 ? "s" : ""
                      } matching "${searchTerm}"`
                    : `No parents found matching "${searchTerm}"`}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}