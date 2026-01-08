"use client";

import { useState, useEffect } from "react";
import constant from "../../../constant";
export default function StaffCourses() {
  // Form state
  const [formData, setFormData] = useState({
    program: "",
    departments: "",
    class: "",
    classYear: "",
    section: "",
    courseName: "",
    teacherName: "",
    creditHours: "",
    contactHours: "",
  });

  // Course assignments data (from backend)
  const [courseData, setCourseData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchColumn, setSearchColumn] = useState("all");

  // Dropdown options
  const programOptions = ["PLAY GROUP", "PRIMARY", "MIDDLE", "SECONDARY"];
  const departmentOptions = ["PLAY GROUP", "PRIMARY", "MIDDLE", "SECONDARY"];
  const classOptions = [
    "PLAY",
    "NURSERY",
    "PREP",
    "ONE",
    "TWO",
    "THREE",
    "FOUR",
    "FIVE",
  ];
  const classYearOptions = ["2024", "2025"];
  const sectionOptions = ["A", "B", "C", "D"];
  const courseOptions = [
    "ENGLISH (THEORY)",
    "MATHEMATICS (THEORY)",
    "SCIENCE (THEORY)",
    "URDU (THEORY)",
    "ISLAMIAT (THEORY)",
    "SOCIAL STUDIES (THEORY)",
    "COMPUTER (THEORY)",
  ];
  const teacherOptions = [
    "NOUR YOUSEF",
    "AHMED KHAN",
    "FATIMA ALI",
    "MUHAMMAD HASSAN",
    "AYESHA MALIK",
  ];

  // Fetch courses from API
  const fetchCourses = async () => {
    setLoading(true);
    try {
      let url = `${constant.apiUrl}/staff-courses/`;
      if (searchTerm) {
        url += `?search=${encodeURIComponent(
          searchTerm
        )}&column=${encodeURIComponent(searchColumn)}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setCourseData(data.courses);
      else setCourseData([]);
    } catch {
      setCourseData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line
  }, [searchTerm, searchColumn]);

  useEffect(() => {
    setFilteredCourses(courseData);
  }, [courseData]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission (add course assignment)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      program: formData.program,
      departments: formData.departments,
      class: formData.class,
      classYear: formData.classYear,
      section: formData.section,
      course: formData.courseName,
      ch: Number.parseInt(formData.creditHours) || 0,
      coh: Number.parseInt(formData.contactHours) || 0,
      teacher: formData.teacherName,
      user: "Aitzaz Wattoo", // or get user from auth/session
      campus: "Tech Minds School BWN",
    };

    try {
      const res = await fetch(`${constant.apiUrl}/staff-courses/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        alert("Course assignment added successfully!");
        fetchCourses();
        handleReset();
      } else {
        alert(data.message || "Failed to add course assignment!");
      }
    } catch {
      alert("Failed to add course assignment!");
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      program: "",
      departments: "",
      class: "",
      classYear: "",
      section: "",
      courseName: "",
      teacherName: "",
      creditHours: "",
      contactHours: "",
    });
  };

  // Filter courses based on search
  useEffect(() => {
    let results = courseData;

    if (searchTerm) {
      results = results.filter((course) => {
        const searchValue = searchTerm.toLowerCase();

        if (searchColumn === "all") {
          return (
            course.program.toLowerCase().includes(searchValue) ||
            course.departments.toLowerCase().includes(searchValue) ||
            course.class.toLowerCase().includes(searchValue) ||
            course.classYear.includes(searchValue) ||
            course.section.toLowerCase().includes(searchValue) ||
            course.course.toLowerCase().includes(searchValue) ||
            course.teacher.toLowerCase().includes(searchValue) ||
            course.campus.toLowerCase().includes(searchValue) ||
            course.id.toString().includes(searchValue)
          );
        } else {
          const fieldValue = course[searchColumn];
          if (typeof fieldValue === "string") {
            return fieldValue.toLowerCase().includes(searchValue);
          } else if (typeof fieldValue === "number") {
            return fieldValue.toString().includes(searchValue);
          }
          return false;
        }
      });
    }

    setFilteredCourses(results);
  }, [searchTerm, courseData, searchColumn]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-[#2191BF] text-white p-3 flex items-center gap-2 rounded-t-lg">
        <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
          <span className="text-blue-700 text-sm font-bold">→</span>
        </div>
        <h1 className="text-lg font-medium">Staff Courses</h1>
      </div>

      <div className="p-6 bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          {/* First Row - Program and Departments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Program:
              </label>
              <select
                name="program"
                value={formData.program}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">--Select--</option>
                {programOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departments:
              </label>
              <select
                name="departments"
                value={formData.departments}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">--Select--</option>
                {departmentOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Second Row - Class and Class Year */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class:
              </label>
              <select
                name="class"
                value={formData.class}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">--Select--</option>
                {classOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class Year:
              </label>
              <select
                name="classYear"
                value={formData.classYear}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">--Select--</option>
                {classYearOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Third Row - Section and Course Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section:
              </label>
              <select
                name="section"
                value={formData.section}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">--Select--</option>
                {sectionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Name:
              </label>
              <select
                name="courseName"
                value={formData.courseName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">--Select--</option>
                {courseOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fourth Row - Teacher Name (full width) */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teacher Name:
              </label>
              <select
                name="teacherName"
                value={formData.teacherName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">--Select--</option>
                {teacherOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Additional Fields - Credit Hours and Contact Hours */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Credit Hours (CH):
              </label>
              <input
                type="number"
                name="creditHours"
                value={formData.creditHours}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Hours (COH):
              </label>
              <input
                type="number"
                name="contactHours"
                value={formData.contactHours}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Form Actions */}
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
              className="px-4 py-2 bg-[#2191BF] hover:bg-[#2191BF] text-white text-sm font-medium rounded transition-colors"
            >
              Submit
            </button>
          </div>
        </form>

        {/* Course Assignments Table */}
        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Course Assignments
            </h2>
            <p className="text-gray-600">
              Manage staff course assignments and teaching schedules
            </p>
          </div>

          {/* Modern Search Section */}
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 flex gap-2">
                <select
                  value={searchColumn}
                  onChange={(e) => setSearchColumn(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Columns</option>
                  <option value="id">ID</option>
                  <option value="program">Program</option>
                  <option value="departments">Departments</option>
                  <option value="class">Class</option>
                  <option value="classYear">Class Year</option>
                  <option value="section">Section</option>
                  <option value="course">Course</option>
                  <option value="teacher">Teacher</option>
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
            {filteredCourses.length !== courseData.length && (
              <div className="mt-2 text-sm text-gray-600">
                Showing {filteredCourses.length} of {courseData.length} results
              </div>
            )}
          </div>

          <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="min-w-[1200px]">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Program
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Departments
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
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CH
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      COH
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teacher
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campus
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={11} className="text-center py-10">
                        Loading...
                      </td>
                    </tr>
                  ) : filteredCourses.length > 0 ? (
                    filteredCourses.map((course, idx) => (
                      <tr
                        key={course._id || idx}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {course.program}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {course.departments}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {course.class}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {course.classYear}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {course.section}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {course.course}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {course.ch}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {course.coh}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {course.teacher}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {course.user}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          The Future Grooming School
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={11} className="text-center py-10">
                        No course assignments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500">
              Showing 1 to {filteredCourses.length} of {courseData.length} rows
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
