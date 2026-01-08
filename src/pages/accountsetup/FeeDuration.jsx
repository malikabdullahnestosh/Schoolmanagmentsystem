"use client";

import { useState, useEffect } from "react";
import constant from "../../../constant"; // adjust the import path if needed
import { usePrintModal } from "../../components/PrintModalContext";
export default function FeeDuration() {
  const [formData, setFormData] = useState({
    name: "",
    year: "2025",
    isActive: "Active",
  });
  const { setPrintModalOpen } = usePrintModal();
  const [feeDurations, setFeeDurations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("all");
  const [filteredFeeDurations, setFilteredFeeDurations] = useState([]);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    type: "",
    itemId: null,
    itemName: "",
  });
  const [loading, setLoading] = useState(false);

  // Get token from localStorage
  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch fee durations from API
  const fetchFeeDurations = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${constant.apiUrl}/fee-durations`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (!res.ok) throw new Error("Failed to fetch durations");
      const data = await res.json();
      setFeeDurations(data);
    } catch (err) {
      alert("Failed to fetch fee durations!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeDurations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Search filter
  useEffect(() => {
    let results = feeDurations;
    if (searchTerm) {
      const searchValue = searchTerm.toLowerCase();
      if (searchColumn === "all") {
        results = results.filter(
          (fd) =>
            fd.name?.toLowerCase().includes(searchValue) ||
            fd.status?.toLowerCase().includes(searchValue) ||
            fd.campus?.toLowerCase().includes(searchValue) ||
            fd.user?.toLowerCase().includes(searchValue)
        );
      } else {
        results = results.filter((fd) => {
          const fieldValue = fd[searchColumn];
          if (typeof fieldValue === "string") {
            return fieldValue.toLowerCase().includes(searchValue);
          }
          return false;
        });
      }
    }
    setFilteredFeeDurations(results);
  }, [searchTerm, feeDurations, searchColumn]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.year.trim()) {
      alert("Please fill in all required fields");
      return;
    }
    if (
      feeDurations.find(
        (fd) => fd.name.toLowerCase() === formData.name.toLowerCase()
      )
    ) {
      alert("Fee duration with this name already exists");
      return;
    }
    try {
      setLoading(true);
      const token = getToken();
      const res = await fetch(`${constant.apiUrl}/fee-durations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          year: formData.year,
          status: formData.isActive === "Active" ? "Active" : "Deactive",
          campus: "The Future Grooming School",
          user: "Admin",
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to add fee duration");
      }
      await fetchFeeDurations();
      handleReset();
      alert("Fee duration added successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      year: "2025",
      isActive: "Active",
    });
  };

  const handleStatusChange = (feeDuration, newStatus) => {
    setConfirmationModal({
      isOpen: true,
      type: newStatus === "Active" ? "activate" : "deactivate",
      itemId: feeDuration._id || feeDuration.id,
      itemName: feeDuration.name,
    });
    setPrintModalOpen(true);
  };

  const confirmStatusChange = async () => {
    const { itemId, type } = confirmationModal;
    const newStatus = type === "activate" ? "Active" : "Deactive";
    try {
      setLoading(true);
      const token = getToken();
      const res = await fetch(`${constant.apiUrl}/fee-durations/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update status");
      }
      await fetchFeeDurations();
      setConfirmationModal({
        isOpen: false,
        type: "",
        itemId: null,
        itemName: "",
      });
      alert(
        `Fee duration has been ${
          type === "activate" ? "activated" : "deactivated"
        } successfully!`
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelStatusChange = () => {
    setConfirmationModal({
      isOpen: false,
      type: "",
      itemId: null,
      itemName: "",
    });
    setPrintModalOpen(false); // Show Sidebar
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-[#2191BF]  text-white p-3 flex items-center gap-2 rounded-t-lg shadow-md">
        <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
          <span className="text-[#2191BF] text-sm font-bold">→</span>
        </div>
        <h1 className="text-lg font-medium">Fee Duration / Month</h1>
      </div>

      <div className="p-6 bg-gray-100">
        {/* Fee Duration Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name:
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="--Duration / Month Name--"
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year:
              </label>
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Is Active:
              </label>
              <select
                name="isActive"
                value={formData.isActive}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                disabled={loading}
              >
                <option value="Active">Active</option>
                <option value="Deactive">Deactive</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-md transition-colors shadow-sm"
              disabled={loading}
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#2191BF]  hover:bg-[#80c6e1]  text-white text-sm font-medium rounded-md transition-colors shadow-sm"
              disabled={loading}
            >
              {loading ? "Saving..." : "Submit"}
            </button>
          </div>
        </form>

        {/* Search Section */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 flex gap-2 w-full">
              <select
                value={searchColumn}
                onChange={(e) => setSearchColumn(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Columns</option>
                <option value="name">Name</option>
                <option value="status">Status</option>
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
          {filteredFeeDurations.length !== feeDurations.length &&
            feeDurations.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                Showing {filteredFeeDurations.length} of {feeDurations.length}{" "}
                results
              </div>
            )}
        </div>

        {/* Fee Durations Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campus
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-4 text-center text-sm text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredFeeDurations.length > 0 ? (
                filteredFeeDurations.map((feeDuration, idx) => (
                  <tr
                    key={feeDuration._id || feeDuration.id || idx}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {feeDuration.id || idx + 1}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">
                      {feeDuration.name}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          feeDuration.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {feeDuration.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        type="button"
                        onClick={() =>
                          handleStatusChange(
                            feeDuration,
                            feeDuration.status === "Active"
                              ? "Deactive"
                              : "Active"
                          )
                        }
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors shadow-sm ${
                          feeDuration.status === "Active"
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                        disabled={loading}
                      >
                        {feeDuration.status === "Active"
                          ? "Make Deactive"
                          : "Make Active"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 max-w-32 truncate">
                      {feeDuration.campus}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {feeDuration.user}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-4 text-center text-sm text-gray-500"
                  >
                    No matching records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500">
            {feeDurations.length > 0 ? (
              `Showing 1 to ${filteredFeeDurations.length} of ${feeDurations.length} rows`
            ) : (
              <span>No records found</span>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmationModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all animate-fade-in-up">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    confirmationModal.type === "activate"
                      ? "bg-blue-100"
                      : "bg-red-100"
                  }`}
                >
                  {confirmationModal.type === "activate" ? (
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {confirmationModal.type === "activate"
                      ? "Activate Fee Duration"
                      : "Deactivate Fee Duration"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    This action will change the status of the fee duration
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to{" "}
                <span
                  className={`font-semibold ${
                    confirmationModal.type === "activate"
                      ? "text-blue-600"
                      : "text-red-600"
                  }`}
                >
                  {confirmationModal.type}
                </span>{" "}
                the following fee duration?
              </p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="font-medium text-gray-900">
                  {confirmationModal.itemName}
                </p>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                type="button"
                onClick={cancelStatusChange}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmStatusChange}
                className={`flex-1 px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors shadow-sm ${
                  confirmationModal.type === "activate"
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
                disabled={loading}
              >
                {confirmationModal.type === "activate"
                  ? "Activate"
                  : "Deactivate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
