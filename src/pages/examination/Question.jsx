"use client"

import { useState, useEffect } from "react"
import constant from '../../../constant';
export default function Question() {
  // Form state
  const [formData, setFormData] = useState({
    program: "",
    department: "",
    class: "",
    course: "",
    chapter: "",
    questionType: "",
    question: "",
    questionMarks: "1",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correctAnswer: "",
    timeSeconds: "30",
  })

  // Questions data state
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)

  // Search state
  const [searchTerm, setSearchTerm] = useState("")
  const [searchColumn, setSearchColumn] = useState("all")
  const [filteredQuestions, setFilteredQuestions] = useState([])

  // Options for dropdowns
  const programOptions = ["PLAY GROUP", "PRIMARY", "MIDDLE", "SECONDARY"]
  const departmentOptions = ["PLAY GROUP", "PRIMARY", "MIDDLE", "SECONDARY"]
  const classOptions = ["PLAY", "NURSERY", "PREP", "ONE", "TWO", "THREE", "FOUR", "FIVE"]
  const courseOptions = [
    "ENGLISH (THEORY)",
    "MATHEMATICS (THEORY)",
    "SCIENCE (THEORY)",
    "URDU (THEORY)",
    "ISLAMIAT (THEORY)",
    "SOCIAL STUDIES (THEORY)",
    "COMPUTER (THEORY)",
  ]
  const chapterOptions = [
    "Introduction to Alphabets",
    "Numbers and Counting",
    "Living and Non-Living Things",
    "Basic Grammar",
    "Addition and Subtraction",
  ]
  const questionTypeOptions = ["Multiple Choice", "True/False", "Short Answer", "Essay", "Fill in the Blank"]

  // Fetch questions from API
  const fetchQuestions = async (search = "", column = "all") => {
    setLoading(true)
    try {
      let url = `${constant.apiUrl}/exams/question`
      if (search) {
        url += `?search=${encodeURIComponent(search)}&column=${column}`
      }
      const res = await fetch(url)
      const data = await res.json()
      if (data.success) setQuestions(data.questions)
      else setQuestions([])
    } catch {
      setQuestions([])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  useEffect(() => {
    if (searchTerm) fetchQuestions(searchTerm, searchColumn)
    else fetchQuestions()
    // eslint-disable-next-line
  }, [searchTerm, searchColumn])

  useEffect(() => {
    setFilteredQuestions(questions)
  }, [questions])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    // Validate form
    if (
      !formData.program ||
      !formData.department ||
      !formData.class ||
      !formData.course ||
      !formData.chapter ||
      !formData.questionType ||
      !formData.question.trim() ||
      !formData.questionMarks
    ) {
      alert("Please fill in all required fields")
      return
    }
    // Additional validation for multiple choice questions
    if (formData.questionType === "Multiple Choice") {
      if (!formData.option1.trim() || !formData.option2.trim() || !formData.correctAnswer.trim()) {
        alert("Please provide at least 2 options and select the correct answer for multiple choice questions")
        return
      }
    }

    // Prepare payload for backend
    const payload = {
      program: formData.program,
      department: formData.department,
      class: formData.class,
      course: formData.course,
      chapter: formData.chapter,
      questionType: formData.questionType,
      question: formData.question.trim(),
      marks: Number.parseInt(formData.questionMarks),
      option1: formData.option1.trim(),
      option2: formData.option2.trim(),
      option3: formData.option3.trim(),
      option4: formData.option4.trim(),
      answer: formData.correctAnswer.trim(),
      seconds: Number.parseInt(formData.timeSeconds),
    }

    try {
      const res = await fetch(`${constant.apiUrl}/exams/question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data.success) {
        fetchQuestions()
        handleReset()
        alert("Question added successfully!")
      } else {
        alert(data.message || "Failed to add question")
      }
    } catch {
      alert("Failed to add question!")
    }
  }

  // Reset form
  const handleReset = () => {
    setFormData({
      program: "",
      department: "",
      class: "",
      course: "",
      chapter: "",
      questionType: "",
      question: "",
      questionMarks: "1",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      correctAnswer: "",
      timeSeconds: "30",
    })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-[#2191BF]  text-white p-3 flex items-center gap-2 rounded-t-lg">
        <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
          <span className="text-[#2191BF] text-sm font-bold">→</span>
        </div>
        <h1 className="text-lg font-medium">Exam Questions</h1>
      </div>

      <div className="p-6 bg-gray-100">
        {/* Question Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* ... Dropdowns and inputs (same as your code, using formData and handleInputChange) ... */}
              {/* You can copy your dropdowns and input fields here */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Program:</label>
                <select
                  name="program"
                  value={formData.program}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                >
                  <option value="">--Select--</option>
                  {programOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department:</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                >
                  <option value="">--Select--</option>
                  {departmentOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class:</label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                >
                  <option value="">--Select--</option>
                  {classOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course:</label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                >
                  <option value="">--Select--</option>
                  {courseOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chapter:</label>
                <select
                  name="chapter"
                  value={formData.chapter}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                >
                  <option value="">--Select--</option>
                  {chapterOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question Type:</label>
                <select
                  name="questionType"
                  value={formData.questionType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                >
                  <option value="">--Question Type--</option>
                  {questionTypeOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question:</label>
                <textarea
                  name="question"
                  value={formData.question}
                  onChange={handleInputChange}
                  placeholder="--Question--"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question Marks:</label>
                <input
                  type="number"
                  name="questionMarks"
                  value={formData.questionMarks}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                />
              </div>
            </div>

            {/* Options for Multiple Choice Questions */}
            {formData.questionType === "Multiple Choice" && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Answer Options:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Option 1:</label>
                    <input
                      type="text"
                      name="option1"
                      value={formData.option1}
                      onChange={handleInputChange}
                      placeholder="Option 1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Option 2:</label>
                    <input
                      type="text"
                      name="option2"
                      value={formData.option2}
                      onChange={handleInputChange}
                      placeholder="Option 2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Option 3:</label>
                    <input
                      type="text"
                      name="option3"
                      value={formData.option3}
                      onChange={handleInputChange}
                      placeholder="Option 3 (Optional)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Option 4:</label>
                    <input
                      type="text"
                      name="option4"
                      value={formData.option4}
                      onChange={handleInputChange}
                      placeholder="Option 4 (Optional)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Correct Answer:</label>
                    <input
                      type="text"
                      name="correctAnswer"
                      value={formData.correctAnswer}
                      onChange={handleInputChange}
                      placeholder="Enter correct answer"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Time (Seconds):</label>
                    <input
                      type="number"
                      name="timeSeconds"
                      value={formData.timeSeconds}
                      onChange={handleInputChange}
                      min="10"
                      max="300"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

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
                className="px-4 py-2 bg-[#2191BF]  hover:bg-[#81c3de]  text-white text-sm font-medium rounded transition-colors"
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
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
              >
                <option value="all">All Columns</option>
                <option value="class">Class</option>
                <option value="course">Course</option>
                <option value="chapter">Chapter</option>
                <option value="questionType">Type</option>
                <option value="question">Question</option>
                <option value="marks">Marks</option>
                <option value="answer">Answer</option>
              </select>
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder={`Search ${searchColumn === "all" ? "all columns" : searchColumn}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          {filteredQuestions.length !== questions.length && questions.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              Showing {filteredQuestions.length} of {questions.length} results
            </div>
          )}
        </div>

        {/* Questions Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="min-w-[1400px]">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chapter
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Question
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marks
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">1</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">2</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">3</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">4</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Answer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seconds
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredQuestions.length > 0 ? (
                  filteredQuestions.map((question, idx) => (
                    <tr key={question._id || idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-32 truncate">{question.class || `${question.program} - ${question.class} - 2024 - A`}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-32 truncate">{question.course}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-32 truncate">{question.chapter}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{question.questionType || question.type}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 max-w-64 truncate" title={question.question}>
                        {question.question}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{question.marks}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{question.option1}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{question.option2}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{question.option3}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{question.option4}</td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">{question.answer}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{question.seconds}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="px-4 py-4 text-center text-sm text-gray-500">
                      No matching records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500">
            {questions.length > 0 ? (
              `Showing 1 to ${filteredQuestions.length} of ${questions.length} rows`
            ) : (
              <span>No records found</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}