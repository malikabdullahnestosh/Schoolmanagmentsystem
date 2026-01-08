"use client";

import { useState, useEffect } from "react";
import constant from "../../../constant";
export default function Room() {
  // Form state
  const [formData, setFormData] = useState({
    roomName: "",
    roomType: "",
    roomCapacity: "",
  });

  // Rooms data state
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  // Room type options
  const roomTypeOptions = [
    "Class Room",
    "Hall",
    "Lab",
    "Office",
    "Store Room",
    "Hostel Room",
    "Apartments",
  ];

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("all");
  const [filteredRooms, setFilteredRooms] = useState([]);

  // Fetch rooms from API (with optional search)
  const fetchRooms = async (search = "", column = "all") => {
    setLoading(true);
    try {
      let url = `${constant.apiUrl}/rooms/`;
      if (search) {
        url += `?search=${encodeURIComponent(search)}&column=${column}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setRooms(data.rooms);
      else setRooms([]);
    } catch {
      setRooms([]);
    }
    setLoading(false);
  };

  // Initial fetch and on search
  useEffect(() => {
    fetchRooms();
  }, []);

  // Filter rooms on searchTerm or searchColumn change
  useEffect(() => {
    if (searchTerm) {
      fetchRooms(searchTerm, searchColumn);
    } else {
      fetchRooms();
    }
  }, [searchTerm, searchColumn]);

  // Keep filteredRooms in sync
  useEffect(() => {
    setFilteredRooms(rooms);
  }, [rooms]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.roomName || !formData.roomType || !formData.roomCapacity) {
      alert("Please fill in all fields");
      return;
    }

    const newRoom = {
      roomNo: formData.roomName.substring(0, 5),
      roomType: formData.roomType,
      capacity: Number(formData.roomCapacity),
      campus: "Tech Minds School BWN",
    };

    try {
      const res = await fetch(`${constant.apiUrl}/rooms/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRoom),
      });
      const data = await res.json();
      if (data.success) {
        fetchRooms();
        handleReset();
        alert("Room added successfully!");
      } else {
        alert(data.message || "Failed to add room");
      }
    } catch {
      alert("Failed to add room!");
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      roomName: "",
      roomType: "",
      roomCapacity: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-[#2191BF]  text-white p-3 flex items-center gap-2 rounded-t-lg">
        <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
          <span className="text-[#2191BF] text-sm font-bold">→</span>
        </div>
        <h1 className="text-lg font-medium">Time Table Rooms</h1>
      </div>

      <div className="p-6 bg-gray-100">
        {/* Room Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Name:
                </label>
                <input
                  type="text"
                  name="roomName"
                  value={formData.roomName}
                  onChange={handleInputChange}
                  placeholder="--Room Name--"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Type:
                </label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                >
                  <option value="">--Select--</option>
                  {roomTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Capacity:
                </label>
                <input
                  type="number"
                  name="roomCapacity"
                  value={formData.roomCapacity}
                  onChange={handleInputChange}
                  placeholder="--Room Capacity--"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#2191BF]  hover:bg-[#3b5763]  text-white text-sm font-medium rounded transition-colors"
              >
                Submit
              </button>
            </div>
          </form>
        </div>

        {/* Search Section */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 flex gap-2">
              <select
                value={searchColumn}
                onChange={(e) => setSearchColumn(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Columns</option>
                <option value="roomNo">Room No</option>
                <option value="roomType">Room Type</option>
                <option value="capacity">Capacity</option>
                <option value="campus">Campus</option>
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
          {filteredRooms.length !== rooms.length && (
            <div className="mt-2 text-sm text-gray-600">
              Showing {filteredRooms.length} of {rooms.length} results
            </div>
          )}
        </div>

        {/* Rooms Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="min-w-[800px]">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campus
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10">
                      Loading rooms...
                    </td>
                  </tr>
                ) : filteredRooms.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10">
                      No rooms found.
                    </td>
                  </tr>
                ) : (
                  filteredRooms.map((room) => (
                    <tr
                      key={room._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {room.roomNo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {room.roomType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {room.capacity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        The Future Grooming School
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500">
            Showing 1 to {filteredRooms.length} of {rooms.length} rows
          </div>
        </div>
      </div>
    </div>
  );
}
