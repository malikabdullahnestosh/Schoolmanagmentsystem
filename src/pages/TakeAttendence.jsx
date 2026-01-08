"use client";

import { useState, useEffect } from "react";
import constant from "../../constant";
export default function TakeAttendance() {
  // State for classes data
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);

  // Students data
  const [studentList, setStudentList] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClasses, setFilteredClasses] = useState([]);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendance, setAttendance] = useState({});
  const token = localStorage.getItem("token");
  // Fetch classes from API
  useEffect(() => {
    const fetchClasses = async () => {
      setLoadingClasses(true);
      try {
        const res = await fetch(`${constant.apiUrl}/students/classes/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log("Classes API data:", data);
        if (data.success) {
          setClasses(data.classes);
          setFilteredClasses(data.classes);
        } else {
          setClasses([]);
          setFilteredClasses([]);
        }
      } catch {
        setClasses([]);
        setFilteredClasses([]);
      }
      setLoadingClasses(false);
    };
    fetchClasses();
  }, []);

  // Handle search (with null checks)
  useEffect(() => {
    let results = classes;
    if (searchTerm) {
      const searchValue = searchTerm.toLowerCase();
      results = results.filter(
        (classItem) =>
          (classItem.programName || "").toLowerCase().includes(searchValue) ||
          (classItem.departmentName || "")
            .toLowerCase()
            .includes(searchValue) ||
          (classItem.className || "").toLowerCase().includes(searchValue) ||
          (classItem.classYearName || "").toLowerCase().includes(searchValue) ||
          (classItem.sectionName || "").toLowerCase().includes(searchValue)
      );
    }
    setFilteredClasses(results);
  }, [searchTerm, classes]);

  // Fetch students for a class from API and open modal
  const handleGetStudents = async (classItem) => {
    setSelectedClass(classItem);
    setShowModal(true);
    setLoadingStudents(true);
    setStudentList([]);
    setAttendance({});

    // Use the section API for NURSERY, else fallback to your normal API
    let url = "";
    if (classItem.className) {
      url = `${constant.apiUrl}/students/section/${encodeURIComponent(
        classItem.className
      )}`;
    } else if (classItem.sectionName) {
      url = `${constant.apiUrl}/students/section/${encodeURIComponent(
        classItem.sectionName
      )}`;
    }

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setStudentList(data.students);
        // Initialize attendance for all students as Present
        const initialAttendance = {};
        data.students.forEach((student) => {
          initialAttendance[student._id] = "Present";
        });
        setAttendance(initialAttendance);
      } else {
        setStudentList([]);
      }
    } catch {
      setStudentList([]);
    }
    setLoadingStudents(false);
  };

  // Handle attendance change
  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // Handle submit attendance
  const handleSubmitAttendance = async () => {
    if (!selectedClass || !selectedDate) return;

    const classInfo = {
      programName: selectedClass.programName,
      departmentName: selectedClass.departmentName,
      className: selectedClass.className,
      classYearName: selectedClass.classYearName,
      sectionName: selectedClass.sectionName,
    };

    const payload = {
      classInfo,
      date: selectedDate,
      attendance: Object.entries(attendance).map(([studentId, status]) => ({
        studentId,
        status,
      })),
    };

    try {
      const res = await fetch(`${constant.apiUrl}/classes/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert("Attendance submitted successfully!");
        setShowModal(false);
        setSelectedClass(null);
        setAttendance({});
        setStudentList([]);
      } else {
        alert("Failed to submit attendance!");
      }
    } catch {
      alert("Failed to submit attendance!");
    }
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedClass(null);
    setAttendance({});
    setStudentList([]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-[#2191BF]  text-white p-3 flex items-center gap-2 rounded-t-lg">
        <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
          <span className="text-[#2191BF] text-sm font-bold">→</span>
        </div>
        <h1 className="text-lg font-medium">Take Attendance</h1>
      </div>

      <div className="p-6 bg-gray-100">
        {/* Search Section */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-end">
            <div className="relative">
              <input
                type="text"
                placeholder="Search classes..."
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
        </div>

        {/* Classes Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
          {/* Debug: Show fetched classes */}
          {/* <pre>{JSON.stringify(filteredClasses, null, 2)}</pre> */}
          <div className="min-w-[800px]">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Section
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loadingClasses ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10">
                      Loading classes...
                    </td>
                  </tr>
                ) : filteredClasses.length > 0 ? (
                  filteredClasses.map((classItem, idx) => (
                    <tr
                      key={classItem._id || classItem.id || idx}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {classItem.programName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {classItem.departmentName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {classItem.className}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {classItem.classYearName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {classItem.sectionName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleGetStudents(classItem)}
                          className="bg-[#2191BF]  hover:bg-[#476a78]  text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          Get Students
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-10">
                      No classes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500">
            Showing 1 to {filteredClasses.length} of {classes.length} rows
          </div>
        </div>
      </div>

      {/* Attendance Modal */}
      {showModal && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t-lg">
              <h3 className="text-lg font-semibold text-gray-800">
                Take Attendance
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Date Selection */}
              <div className="mb-6">
                <div className="flex gap-2 items-center">
                  <label className="text-sm font-medium text-gray-700">
                    Date:
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Class Information */}
              <div className="mb-6 p-3 bg-gray-100 rounded-md">
                <h4 className="text-sm font-medium text-gray-800">
                  {selectedClass.programName} - {selectedClass.departmentName} -{" "}
                  {selectedClass.className} - {selectedClass.classYearName} -{" "}
                  {selectedClass.sectionName}
                </h4>
              </div>

              {/* Students List */}
              <div className="space-y-4 mb-6">
                {loadingStudents ? (
                  <div>Loading students...</div>
                ) : studentList.length === 0 ? (
                  <div>No students found for this class.</div>
                ) : (
                  studentList.map((student, index) => (
                    <div key={student._id}>
                      <div className="p-3 bg-gray-100 rounded-md mb-2">
                        <span className="text-sm font-medium text-gray-800">
                          {index + 1}: {student.name} S/O {student.fatherName}
                        </span>
                      </div>
                      <select
                        value={attendance[student._id] || "Present"}
                        onChange={(e) =>
                          handleAttendanceChange(student._id, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Late">Late</option>
                        <option value="Excused">Excused</option>
                      </select>
                    </div>
                  ))
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitAttendance}
                className="w-full bg-[#2191BF]  hover:bg-[#527786] 00 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Submit
              </button>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-4 border-t bg-gray-50 rounded-b-lg">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
