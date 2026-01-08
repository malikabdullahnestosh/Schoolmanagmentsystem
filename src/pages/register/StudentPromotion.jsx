"use client";

import { useState } from "react";
import axios from "axios";
import constant from "../../../constant";
export default function StudentPromotion() {
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showStudents, setShowStudents] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [popupStudent, setPopupStudent] = useState(null);
  const [promoteTo, setPromoteTo] = useState("");
  const [promoteLoading, setPromoteLoading] = useState(false);

  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchPromoteTo, setBatchPromoteTo] = useState("");
  const [batchPromoteLoading, setBatchPromoteLoading] = useState(false);
const token = localStorage.getItem('token')
  // Class list
 const classList = [
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

  // All possible classes after the current
  const getPromotionOptions = (currentClass) => {
    const idx = classList.indexOf(currentClass);
    return idx >= 0 && idx < classList.length - 1
      ? classList.slice(idx + 1)
      : [];
  };

  // Fetch students from API by class only
  const handleFetchStudents = async () => {
    setError("");
    setSuccessMsg("");
    setShowStudents(false);
    setStudents([]);
    if (!selectedClass) {
      alert("Please select a class first!");
      return;
    }
    setLoading(true);

    try {
      const response = await axios.get(
        `${constant.apiUrl}/students/section/${encodeURIComponent(
          selectedClass
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Replace 'token' with your actual token variable
          },
        }
      );
      const apiStudents = response.data.students || response.data;
      setStudents(apiStudents || []);
      setShowStudents(true);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch students"
      );
    } finally {
      setLoading(false);
    }
  };

  // Open modal for single student promotion
  const handlePromoteStudent = (student) => {
    setPopupStudent(student);
    setPromoteTo("");
    setSuccessMsg("");
    setError("");
  };

  const handleConfirmPromote = async () => {
    if (!promoteTo) return;
    setPromoteLoading(true);
    try {
      // If you store the token in localStorage or context, get it here
      const token = localStorage.getItem("token"); // update if your token is stored elsewhere

      await axios.patch(
        `${constant.apiUrl}/students/${
          popupStudent.id || popupStudent._id
        }/promote`,
        { newClass: promoteTo },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStudents((prev) =>
        prev.map((student) =>
          (student.id || student._id) === (popupStudent.id || popupStudent._id)
            ? {
                ...student,
                status: "Promoted",
                promotedTo: promoteTo,
                class: promoteTo,
                className: promoteTo,
              }
            : student
        )
      );
      setSuccessMsg(
        `Student ${
          popupStudent.name || popupStudent.studentName
        } promoted to ${promoteTo}!`
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Promotion failed. Please try again."
      );
    }
    setPromoteLoading(false);
    setPopupStudent(null);
    setPromoteTo("");
  };

  // Open modal for batch promotion
  const handlePromoteAll = () => {
    setBatchPromoteTo("");
    setShowBatchModal(true);
    setError("");
    setSuccessMsg("");
  };

  // Confirm batch promotion (API call)
  const handleConfirmBatchPromote = async () => {
    if (!batchPromoteTo) return;
    setBatchPromoteLoading(true);
    const toPromote = students.filter((s) => s.status !== "Promoted");
    const studentIds = toPromote.map((s) => s.id || s._id);
    try {
      await axios.post(
        `${constant.apiUrl}/students/promote-batch`,
        {
          studentIds,
          newClass: batchPromoteTo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStudents((prev) =>
        prev.map((s) =>
          studentIds.includes(s.id || s._id)
            ? {
                ...s,
                status: "Promoted",
                promotedTo: batchPromoteTo,
                class: batchPromoteTo,
                className: batchPromoteTo,
              }
            : s
        )
      );
      setSuccessMsg(`All students promoted to ${batchPromoteTo}!`);
      setShowBatchModal(false);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Batch promotion failed. Please try again."
      );
    }
    setBatchPromoteLoading(false);
    setBatchPromoteTo("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-[#2191BF] text-white rounded-t-lg shadow-lg">
          <div className="flex items-center p-6">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-4 shadow-md">
              <span className="text-[#2191BF] font-bold text-xl">→</span>
            </div>
            <h1 className="text-2xl font-bold">Student Promotion</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-b-lg shadow-lg p-8">
          {/* Form Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Select Class */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center">
                <span className="text-[#2191BF] mr-2">📚</span>
                Select Class
              </h2>
              <div className="relative">
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2191BF] focus:ring-2 focus:ring-[#2191BF] transition-all duration-200 appearance-none bg-white text-gray-700 font-medium"
                >
                  <option value="">--Select--</option>
                  {classList.map((className) => (
                    <option key={className} value={className}>
                      {className}
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

            {/* Fetch Students */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center">
                <span className="text-green-600 mr-2">👥</span>
                Fetch Students
              </h2>
              <button
                onClick={handleFetchStudents}
                disabled={loading}
                className="w-full px-6 py-3 bg-[#2191BF] text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                    <span className="mr-2">🔍</span>
                    Submit
                  </>
                )}
              </button>
              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
              )}
              {successMsg && (
                <div className="text-green-600 text-sm mt-2">{successMsg}</div>
              )}
            </div>
          </div>

          {/* Students Table */}
          {showStudents && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <span className="text-[#2191BF] mr-2">📋</span>
                  Students in {selectedClass}
                </h3>
                {students.length > 0 && (
                  <button
                    onClick={handlePromoteAll}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
                  >
                    <span className="mr-2">⬆️</span>
                    Promote All
                  </button>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-blue-200">
                          Roll No
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-blue-200">
                          Student Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-blue-200">
                          Father Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-blue-200">
                          Current Class
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-blue-200">
                          Section
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-blue-200">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-blue-200">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student, index) => (
                        <tr
                          key={student.id || student._id || index}
                          className={`hover:bg-gray-50 transition-colors duration-150 ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.rollNo ||
                              student.roll_no ||
                              student.admissionNo ||
                              index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.name || student.studentName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {student.father || student.fatherName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {student.class ||
                              student.currentClass ||
                              student.className ||
                              (student.admission &&
                                student.admission.className)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {student.sectionName ||
                              student.currentSection ||
                              (student.admission &&
                                student.admission.sectionName)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                student.status === "Promoted"
                                  ? "bg-green-100 text-green-800 border border-green-200"
                                  : "bg-blue-100 text-[#2191BF] border border-blue-200"
                              }`}
                            >
                              {student.status === "Promoted"
                                ? `Promoted to ${
                                    student.promotedTo ||
                                    student.class ||
                                    student.className
                                  }`
                                : "Active"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {student.status === "Promoted" ? (
                              <span className="text-green-600 font-semibold flex items-center">
                                <span className="mr-1">✅</span>
                                Promoted
                              </span>
                            ) : (
                              <button
                                onClick={() => handlePromoteStudent(student)}
                                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-semibold rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all duration-200 shadow-sm hover:shadow-md flex items-center"
                              >
                                <span className="mr-1">⬆️</span>
                                Promote
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer */}
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Total Students: {students.length}</span>
                    <span>
                      Promoted:{" "}
                      {students.filter((s) => s.status === "Promoted").length} |
                      Pending:{" "}
                      {
                        students.filter(
                          (s) => s.status === "Active" || !s.status
                        ).length
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Promotion Modal */}
      {popupStudent && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-7 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              onClick={() => setPopupStudent(null)}
              title="Close"
            >
              ×
            </button>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="mr-2 text-green-600">⬆️</span>
              Promote Student
            </h3>
            <div className="mb-3">
              <div>
                <span className="font-semibold">Name:</span>{" "}
                {popupStudent.name || popupStudent.studentName}
              </div>
              <div>
                <span className="font-semibold">Current Class:</span>{" "}
                {popupStudent.class ||
                  popupStudent.className ||
                  popupStudent.currentClass ||
                  (popupStudent.admission && popupStudent.admission.className)}
              </div>
            </div>
            <label className="block mb-2 font-semibold">Promote To</label>
            <select
              value={promoteTo}
              onChange={(e) => setPromoteTo(e.target.value)}
              className="border px-4 py-2 rounded w-full mb-5"
            >
              <option value="">--Select Class--</option>
              {getPromotionOptions(
                popupStudent.class ||
                  popupStudent.className ||
                  popupStudent.currentClass ||
                  (popupStudent.admission &&
                    popupStudent.admission.className) ||
                  selectedClass
              ).map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
            <button
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-70 font-semibold"
              onClick={handleConfirmPromote}
              disabled={!promoteTo || promoteLoading}
            >
              {promoteLoading ? "Promoting..." : "Confirm Promotion"}
            </button>
          </div>
        </div>
      )}

      {/* Batch Promotion Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-7 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              onClick={() => setShowBatchModal(false)}
              title="Close"
            >
              ×
            </button>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="mr-2 text-green-600">⬆️</span>
              Promote All Students
            </h3>
            <div className="mb-3">
              <div>
                <span className="font-semibold">Current Class:</span>{" "}
                {selectedClass}
              </div>
              <div>
                <span className="font-semibold">Total Students:</span>{" "}
                {students.length}
              </div>
              <div>
                <span className="font-semibold">Promoted:</span>{" "}
                {students.filter((s) => s.status === "Promoted").length}
              </div>
              <div>
                <span className="font-semibold">Pending:</span>{" "}
                {students.filter((s) => s.status !== "Promoted").length}
              </div>
            </div>
            <label className="block mb-2 font-semibold">Promote To</label>
            <select
              value={batchPromoteTo}
              onChange={(e) => setBatchPromoteTo(e.target.value)}
              className="border px-4 py-2 rounded w-full mb-5"
            >
              <option value="">--Select Class--</option>
              {getPromotionOptions(selectedClass).map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
            <button
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-70 font-semibold"
              onClick={handleConfirmBatchPromote}
              disabled={!batchPromoteTo || batchPromoteLoading}
            >
              {batchPromoteLoading
                ? "Promoting..."
                : "Confirm Promotion for All"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
