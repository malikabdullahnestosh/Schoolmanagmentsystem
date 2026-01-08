"use client";

import { useState, useEffect } from "react";
import constant from "../../constant";
import toast, { Toaster } from "react-hot-toast";

export default function PublicMessage() {
  // State for Public Message For All form
  const [publicMessageAll, setPublicMessageAll] = useState({
    title: "",
    endDate: "",
    image: null,
    description: "",
  });

  // State for Public Message For Classes form
  const [publicMessageClasses, setPublicMessageClasses] = useState({
    title: "",
    endDate: "",
    image: null,
    section: "",
    description: "",
  });

  // State for messages data
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMessages, setFilteredMessages] = useState(messages);

  // Class options from Play Group to Ten
  const classOptions = [
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

  // Fetch all messages from API
  const fetchMessages = async (search = "") => {
    setLoading(true);
    setError("");
    try {
      const url = search
        ? `${constant.apiUrl}/public-messages?search=${encodeURIComponent(
            search
          )}`
        : `${constant.apiUrl}/public-messages`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(
        data.map((msg) => ({
          ...msg,
          expiryDate: formatDate(msg.expiryDate),
          date: formatDate(msg.date),
        }))
      );
    } catch (err) {
      setError(err.message || "Error loading messages");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and whenever searchTerm changes
  useEffect(() => {
    fetchMessages(searchTerm);
    // eslint-disable-next-line
  }, [searchTerm]);

  useEffect(() => {
    setFilteredMessages(messages);
  }, [messages]);

  // Handle Public Message For All form input changes
  const handleAllInputChange = (e) => {
    const { name, value } = e.target;
    setPublicMessageAll({
      ...publicMessageAll,
      [name]: value,
    });
  };

  // Handle Public Message For Classes form input changes
  const handleClassesInputChange = (e) => {
    const { name, value } = e.target;
    setPublicMessageClasses({
      ...publicMessageClasses,
      [name]: value,
    });
  };

  // Handle image upload for Public Message For All
  const handleAllImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPublicMessageAll({
        ...publicMessageAll,
        image: file,
      });
    }
  };

  // Handle image upload for Public Message For Classes
  const handleClassesImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPublicMessageClasses({
        ...publicMessageClasses,
        image: file,
      });
    }
  };

  // Format date from YYYY-MM-DD or ISO to DD-MMM-YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return "";
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Handle Public Message For All form submission
  const handleAllSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const formData = new FormData();
      formData.append("type", "Announcement");
      formData.append("section", "All");
      formData.append("title", publicMessageAll.title);
      formData.append("expiryDate", publicMessageAll.endDate);
      formData.append("description", publicMessageAll.description);
      if (publicMessageAll.image) {
        formData.append("image", publicMessageAll.image); // field name must be "image"
      }
      formData.append("date", new Date().toISOString());
      const res = await fetch(`${constant.apiUrl}/public-messages`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || "Failed to add notification");
      }
      await fetchMessages();
      setPublicMessageAll({
        title: "",
        endDate: "",
        image: null,
        description: "",
      });
      toast.success("Notification saved successfully!");
    } catch (err) {
      setError(err.message || "Failed to submit");
      toast.error(err.message || "Failed to submit");
    }
  };

  // Handle Public Message For Classes form submission
  const handleClassesSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const formData = new FormData();
      formData.append("type", "Message");
      // Use class name as section for backend compatibility
      formData.append("section", publicMessageClasses.section);
      formData.append("title", publicMessageClasses.title);
      formData.append("expiryDate", publicMessageClasses.endDate);
      formData.append("description", publicMessageClasses.description);
      if (publicMessageClasses.image) {
        formData.append("image", publicMessageClasses.image); // field name must be "image"
      }
      formData.append("date", new Date().toISOString());
      const res = await fetch(`${constant.apiUrl}/public-messages`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || "Failed to add message");
      }
      await fetchMessages();
      setPublicMessageClasses({
        title: "",
        endDate: "",
        image: null,
        section: "",
        description: "",
      });
      toast.success("Message saved successfully!");
    } catch (err) {
      setError(err.message || "Failed to submit");
      toast.error(err.message || "Failed to submit");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      {/* Header */}
      <div className="bg-[#2191BF]  text-white p-3 flex items-center gap-2 rounded-t-lg">
        <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
          <span className="text-[#2191BF] text-sm font-bold">→</span>
        </div>
        <h1 className="text-lg font-medium">Public Message</h1>
      </div>

      <div className="p-6 bg-gray-100 space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
            {error}
          </div>
        )}

        {/* Public Message For All Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-[#2191BF]  text-white p-3">
            <h2 className="text-lg font-medium">Public Message For All</h2>
          </div>
          <form onSubmit={handleAllSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title:
                </label>
                <input
                  type="text"
                  name="title"
                  value={publicMessageAll.title}
                  onChange={handleAllInputChange}
                  placeholder="--Title--"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date:
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={publicMessageAll.endDate}
                  onChange={handleAllInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAllImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description:
              </label>
              <textarea
                name="description"
                value={publicMessageAll.description}
                onChange={handleAllInputChange}
                rows={4}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              ></textarea>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="px-6 py-2 bg-[#2191BF]  hover:bg-[#79b5cd]  text-white text-sm font-medium rounded transition-colors w-full"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>

        {/* Public Message For Classes Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-[#2191BF]  text-white p-3">
            <h2 className="text-lg font-medium">Public Message For Classes</h2>
          </div>
          <form onSubmit={handleClassesSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title:
                </label>
                <input
                  type="text"
                  name="title"
                  value={publicMessageClasses.title}
                  onChange={handleClassesInputChange}
                  placeholder="--Title--"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date:
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={publicMessageClasses.endDate}
                  onChange={handleClassesInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleClassesImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Class:
                </label>
                <select
                  name="section"
                  value={publicMessageClasses.section}
                  onChange={handleClassesInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select Class</option>
                  {classOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description:
                </label>
                <textarea
                  name="description"
                  value={publicMessageClasses.description}
                  onChange={handleClassesInputChange}
                  rows={4}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="px-6 py-2 bg-[#2191BF]  hover:bg-[#517c8d]  text-white text-sm font-medium rounded transition-colors w-full"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>

        {/* Messages Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 flex justify-between items-center border-b">
            <h2 className="text-xl font-bold text-gray-800">Public Messages</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[1000px]">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Section
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expiry Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMessages.map((message) => (
                      <tr
                        key={message._id || message.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {message.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {message.section}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {message.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {message.image ? (
                            <img
                              src={
                                message.image.startsWith("http")
                                  ? message.image
                                  : `${constant.apiUrl.replace(
                                      "/api",
                                      ""
                                    )}/uploads/${message.image}`
                              }
                              alt={message.title}
                              className="h-10 w-10 object-cover rounded"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/placeholder.svg";
                              }}
                            />
                          ) : (
                            <span className="text-gray-400">No image</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {message.expiryDate}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                          {message.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {message.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500">
            Showing 1 to {filteredMessages.length} of {messages.length} rows
          </div>
        </div>
      </div>
    </div>
  );
}
