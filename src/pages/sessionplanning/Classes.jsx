"use client";

import { useState, useEffect } from "react";
import constant from '../../../constant';
export default function Classes() {
  // Form state - match backend fields: programme, department, code, name, detail
  const [formData, setFormData] = useState({
    programme: "",
    department: "",
    code: "",
    name: "",
    detail: "",
  });

  // Classes data state
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("all");
  const [filteredClasses, setFilteredClasses] = useState([]);

  // Programme and department options
  const programmeOptions = [
    "PLAY GROUP",
    "PRIMARY",
    "MIDDLE",
    "MATRIC",
    "16710",
  ];
  const departmentOptions = {
    "PLAY GROUP": ["PLAY GROUP"],
    PRIMARY: ["PRIMARY"],
    MIDDLE: ["MIDDLE"],
    MATRIC: ["SCIENCE", "ARTS", "COMPUTER SCIENCE"],
    16710: ["16710"],
  };

  // Fetch classes from API
  useEffect(() => {
    setLoading(true);
    fetch(`${constant.apiUrl}/session-planning/classes`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.classes)) {
          setClasses(data.classes);
          setFilteredClasses(data.classes);
        } else {
          setError("Failed to load classes");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load classes");
        setLoading(false);
      });
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "programme" ? { department: "" } : {}),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.programme ||
      !formData.department ||
      !formData.code.trim() ||
      !formData.name.trim() ||
      !formData.detail.trim()
    ) {
      alert("Please fill in all fields");
      return;
    }

    // Check if class already exists
    const existingClass = classes.find(
      (cls) =>
        cls.programme === formData.programme &&
        cls.department === formData.department &&
        cls.code.toLowerCase() === formData.code.trim().toLowerCase()
    );
    if (existingClass) {
      alert("Class with this code already exists in the selected department");
      return;
    }

    // Prepare request body for API
    const payload = {
      programme: formData.programme,
      department: formData.department,
      code: formData.code.trim().toUpperCase(),
      name: formData.name.trim().toUpperCase(),
      detail: formData.detail.trim().toUpperCase(),
      campus: "The Future Grooming School",
      user: "Aitzaz Wattoo",
    };

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${constant.apiUrl}/session-planning/classes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setClasses([...classes, data.class]);
        setFilteredClasses([...classes, data.class]);
        handleReset();
        alert("Class added successfully!");
      } else {
        setError(data.message || "Failed to add class");
        alert(data.message || "Failed to add class");
      }
    } catch (err) {
      setError("Failed to add class");
      alert("Failed to add class");
    }
    setLoading(false);
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      programme: "",
      department: "",
      code: "",
      name: "",
      detail: "",
    });
  };

  // Filter classes based on search
  useEffect(() => {
    let results = classes;
    if (searchTerm) {
      const searchValue = searchTerm.toLowerCase();
      if (searchColumn === "all") {
        results = results.filter(
          (cls) =>
            cls.programme?.toLowerCase().includes(searchValue) ||
            cls.department?.toLowerCase().includes(searchValue) ||
            cls.code?.toLowerCase().includes(searchValue) ||
            cls.name?.toLowerCase().includes(searchValue) ||
            cls.detail?.toLowerCase().includes(searchValue) ||
            cls.campus?.toLowerCase().includes(searchValue) ||
            cls.user?.toLowerCase().includes(searchValue)
        );
      } else {
        results = results.filter((cls) => {
          const fieldValue = cls[searchColumn];
          if (typeof fieldValue === "string") {
            return fieldValue.toLowerCase().includes(searchValue);
          }
          return false;
        });
      }
    }
    setFilteredClasses(results);
  }, [searchTerm, classes, searchColumn]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-[#2191BF]  text-white p-3 flex items-center gap-2 rounded-t-lg shadow-md">
        <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
          <span className="text-[#2191BF] text-sm font-bold">→</span>
        </div>
        <h1 className="text-lg font-medium">Admission Classes</h1>
      </div>

      <div className="p-6 bg-gray-100">
        {/* Class Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Programme:
                </label>
                <select
                  name="programme"
                  value={formData.programme}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">--Select--</option>
                  {programmeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department:
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  disabled={!formData.programme}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">--Select--</option>
                  {formData.programme &&
                    departmentOptions[formData.programme]?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class Code:
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="--Code--"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class Name:
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="--Name--"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class Detail:
              </label>
              <input
                type="text"
                name="detail"
                value={formData.detail}
                onChange={handleInputChange}
                placeholder="--Detail--"
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-md transition-colors shadow-sm"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#2191BF]  hover:bg-[#81c6e0]  text-white text-sm font-medium rounded-md transition-colors shadow-sm"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
            {error && <div className="text-red-500 mt-3">{error}</div>}
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
                <option value="programme">Programme</option>
                <option value="department">Department</option>
                <option value="code">Code</option>
                <option value="name">Name</option>
                <option value="detail">Detail</option>
                <option value="campus">Campus</option>
                <option value="user">User</option>
              </select>
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder={`Search ${
                    searchColumn === "all" ? "all columns" : searchColumn
                  }...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
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
          {filteredClasses.length !== classes.length && classes.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              Showing {filteredClasses.length} of {classes.length} results
            </div>
          )}
        </div>

        {/* Classes Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="min-w-[1000px]">
            {loading ? (
              <div className="p-6 text-center text-[#2191BF]">Loading...</div>
            ) : (
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Programme
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Detail
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
                  {filteredClasses.length > 0 ? (
                    filteredClasses.map((cls) => (
                      <tr
                        key={cls._id || cls.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {cls.programme}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {cls.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          {cls.code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {cls.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {cls.detail}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {cls.campus}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {cls.user}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No matching records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
          <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500">
            {classes.length > 0 ? (
              `Showing 1 to ${filteredClasses.length} of ${classes.length} rows`
            ) : (
              <span>No records found</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
