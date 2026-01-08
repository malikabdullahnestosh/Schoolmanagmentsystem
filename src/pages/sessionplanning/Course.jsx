"use client"

import { useState, useEffect } from "react"
import { Search, BookOpen } from "lucide-react"
import constant from '../../../constant';

const Course = () => {
  // Use backend field names: program, department, class, name, type, book, ch, coh, campus, user
  const [formData, setFormData] = useState({
    program: "",
    department: "",
    class: "",
    name: "",
    ch: "",
    coh: "",
    book: "",
    type: "",
  })

  // Filter dropdowns
  const [filterProgram, setFilterProgram] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("")
  const [filterClass, setFilterClass] = useState("")
  const [filterType, setFilterType] = useState("")

  const [searchTerm, setSearchTerm] = useState("")
  const [searchColumn, setSearchColumn] = useState("all")

  // Static dropdown data
  const programs = ["PLAY GROUP", "PRIMARY", "MIDDLE", "MATRIC", "16710"]
  const departmentsByProgram = {
    "PLAY GROUP": ["PLAY GROUP"],
    PRIMARY: ["PRIMARY"],
    MIDDLE: ["MIDDLE"],
    MATRIC: ["MATRIC"],
    16710: ["16710"],
  }
  const classesByDepartment = {
    "PLAY GROUP": ["PLAY", "NURSERY", "PREP"],
    PRIMARY: ["ONE", "TWO", "THREE", "FOUR", "FIVE"],
    MIDDLE: ["SIX", "SEVEN", "EIGHT"],
    MATRIC: ["NINE", "TEN"],
    16710: ["16710"],
  }
  const courseTypes = ["THEORY", "PRACTICAL", "LAB", "PROJECT", "SEMINAR"]

  // Courses state
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Fetch courses from API on mount
  useEffect(() => {
    setLoading(true)
    fetch(`${constant.apiUrl}/session-planning/courses`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.courses)) {
          setCourses(data.courses)
        } else {
          setError("Failed to load courses")
        }
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load courses")
        setLoading(false)
      })
  }, [])

  // Dependent dropdowns for form
  const availableDepartments = formData.program ? departmentsByProgram[formData.program] || [] : []
  const availableClasses = formData.department ? classesByDepartment[formData.department] || [] : []

  // Dependent dropdowns for filter
  const filterDepartments = filterProgram ? departmentsByProgram[filterProgram] || [] : []
  const filterClasses = filterDepartment ? classesByDepartment[filterDepartment] || [] : []

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const newData = { ...prev, [name]: value }
      if (name === "program") {
        newData.department = ""
        newData.class = ""
      } else if (name === "department") {
        newData.class = ""
      }
      return newData
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Validation
    if (
      !formData.program ||
      !formData.department ||
      !formData.class ||
      !formData.name ||
      !formData.ch ||
      !formData.coh ||
      !formData.book ||
      !formData.type
    ) {
      alert("Please fill in all required fields")
      return
    }

    // Check for duplicate course (in loaded courses)
    const isDuplicate = courses.some(
      (course) =>
        course.program === formData.program &&
        course.department === formData.department &&
        course.class === formData.class &&
        course.name.toLowerCase() === formData.name.toLowerCase()
    )
    if (isDuplicate) {
      alert("This course already exists for the selected program, department, and class")
      return
    }

    // Prepare API payload (backend field names)
    const payload = {
      program: formData.program,
      department: formData.department,
      class: formData.class,
      name: formData.name.toUpperCase(),
      type: formData.type,
      book: formData.book.toUpperCase(),
      ch: Number.parseInt(formData.ch),
      coh: Number.parseInt(formData.coh),
      campus: "The Future Grooming School",
      user: "Aitzaz Wattoo",
    }

    setLoading(true)
    setError("")
    try {
      const res = await fetch(`${constant.apiUrl}/session-planning/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setCourses([...courses, data.course])
        handleReset()
        alert("Course added successfully!")
      } else {
        setError(data.message || "Failed to add course")
        alert(data.message || "Failed to add course")
      }
    } catch {
      setError("Failed to add course")
      alert("Failed to add course")
    }
    setLoading(false)
  }

  const handleReset = () => {
    setFormData({
      program: "",
      department: "",
      class: "",
      name: "",
      ch: "",
      coh: "",
      book: "",
      type: "",
    })
  }

  // Filter courses based on dropdowns and search
  const filteredCourses = courses.filter((course) => {
    // Dropdown filters
    if (filterProgram && course.program !== filterProgram) return false
    if (filterDepartment && course.department !== filterDepartment) return false
    if (filterClass && course.class !== filterClass) return false
    if (filterType && course.type !== filterType) return false

    // Search
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    if (searchColumn === "all") {
      return Object.values(course).some((value) => value?.toString().toLowerCase().includes(searchLower))
    } else {
      return course[searchColumn]?.toString().toLowerCase().includes(searchLower)
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#2191BF]  text-white p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6" />
          <h1 className="text-xl font-semibold">Courses</h1>
        </div>
      </div>

      <div className="p-6">
        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Program:</label>
                <select
                  name="program"
                  value={formData.program}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">--Select--</option>
                  {programs.map((program) => (
                    <option key={program} value={program}>
                      {program}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department:</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!formData.program}
                >
                  <option value="">--Select--</option>
                  {availableDepartments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Class:</label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!formData.department}
                >
                  <option value="">--Select--</option>
                  {availableClasses.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="--Name--"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Third Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Credit Hour: <span className="text-red-500 text-xs">How Many Lectures(Hour) in Week</span>
                </label>
                <input
                  type="number"
                  name="ch"
                  value={formData.ch}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  COH: <span className="text-red-500 text-xs">How Many Lecture(Hours) in a Day</span>
                </label>
                <input
                  type="number"
                  name="coh"
                  value={formData.coh}
                  onChange={handleInputChange}
                  min="1"
                  max="8"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Fourth Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Text Book:</label>
                <input
                  type="text"
                  name="book"
                  value={formData.book}
                  onChange={handleInputChange}
                  placeholder="--Book--"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Type:</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">--Course Type--</option>
                  {courseTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-200 font-medium"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#2191BF]  text-white rounded-md hover:bg-[#89d1ed]  transition-colors duration-200 font-medium"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
            {error && <div className="text-red-500 mt-3">{error}</div>}
          </form>
        </div>

        {/* Filter + Search Section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center mb-3">
            <select
              value={filterProgram}
              onChange={e => {
                setFilterProgram(e.target.value)
                setFilterDepartment("")
                setFilterClass("")
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">All Programs</option>
              {programs.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <select
              value={filterDepartment}
              onChange={e => {
                setFilterDepartment(e.target.value)
                setFilterClass("")
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              disabled={!filterProgram}
            >
              <option value="">All Departments</option>
              {filterDepartments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <select
              value={filterClass}
              onChange={e => setFilterClass(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              disabled={!filterDepartment}
            >
              <option value="">All Classes</option>
              {filterClasses.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">All Types</option>
              {courseTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={searchColumn}
              onChange={(e) => setSearchColumn(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Columns</option>
              <option value="program">Program</option>
              <option value="department">Department</option>
              <option value="class">Class</option>
              <option value="name">Course Name</option>
              <option value="type">Type</option>
              <option value="book">Book</option>
            </select>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
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
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CH</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    COH
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
                {filteredCourses.map((course) => (
                  <tr key={course._id || course.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.program}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.class}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          course.type === "THEORY"
                            ? "bg-blue-100 text-blue-800"
                            : course.type === "PRACTICAL"
                              ? "bg-green-100 text-green-800"
                              : course.type === "LAB"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {course.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.book}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center font-medium">
                      {course.ch}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center font-medium">
                      {course.coh}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.campus}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Table Footer */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing {filteredCourses.length} of {courses.length} courses
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Course