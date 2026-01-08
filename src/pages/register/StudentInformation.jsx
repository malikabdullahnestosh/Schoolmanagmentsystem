"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import constant from "/constant";
import { Download, ChevronDown } from "lucide-react";
import { usePrintModal } from "../../components/PrintModalContext";
import schoolLogo from '../../assets/schoolLogo.png';

const printStyles = `
 @media print {
  body * { visibility: hidden !important; }
  .print-modal-content, .print-modal-content * { visibility: visible !important; }
  .print-modal-content {
    position: absolute !important;
    left: 0 !important; top: 0 !important; width: 100vw !important; height: auto !important;
    max-height: none !important;
    overflow: visible !important;
    background: white !important;
    z-index: 99999 !important;
    box-shadow: none !important;
  }
  .print-modal-header, .no-print, .print-buttons, .bg-black, .bg-opacity-40 { display: none !important; }
}
`;

export default function StudentInformation() {
  const currentDate = new Date();
  const dateString = `${currentDate
    .getDate()
    .toString()
    .padStart(2, "0")} ${currentDate.toLocaleString("default", {
    month: "short",
  })}, ${currentDate.getFullYear()}`;
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState("All Fields");
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isExportOpen, setIsExportOpen] = useState(false);

  const { setPrintModalOpen } = usePrintModal();

  useEffect(() => {
    async function fetchStudents() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in.");
          setLoading(false);
          return;
        }
        const res = await axios.get(`${constant.apiUrl}/students/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setStudents(res.data.students);
        } else {
          setError(res.data.message || "Failed to fetch students");
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch students"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  const handleExport = (format) => {
    if (!students.length) return;
    let content = "";
    let fileName = `student-information.${format.toLowerCase()}`;
    let mimeType = "";

    switch (format) {
      case "JSON":
        content = JSON.stringify(students, null, 2);
        mimeType = "application/json";
        break;
      case "XML":
        content = `<?xml version="1.0" encoding="UTF-8"?>\n<students>\n${students
          .map(
            (student) =>
              `  <student>\n${Object.entries(student)
                .map(([key, value]) => `    <${key}>${value}</${key}>`)
                .join("\n")}\n  </student>`
          )
          .join("\n")}\n</students>`;
        mimeType = "application/xml";
        break;
      case "CSV":
        {
          const headers = Object.keys(students[0]).join(",");
          const rows = students.map((student) =>
            Object.values(student).join(",")
          );
          content = [headers, ...rows].join("\n");
          mimeType = "text/csv";
        }
        break;
      case "TXT":
        content = students
          .map((student) =>
            Object.entries(student)
              .map(([key, value]) => `${key}: ${value}`)
              .join("\n")
          )
          .join("\n\n");
        mimeType = "text/plain";
        break;
      case "SQL":
        {
          content = "-- Student Information SQL Export\n\n";
          content += "CREATE TABLE IF NOT EXISTS students (\n";
          content += `  id INT PRIMARY KEY,\n`;
          content += `  rollNo INT,\n`;
          content += `  name VARCHAR(255),\n`;
          content += `  father VARCHAR(255),\n`;
          content += `  class VARCHAR(255),\n`;
          content += `  section VARCHAR(50),\n`;
          content += `  fatherCell VARCHAR(50),\n`;
          content += `  campus VARCHAR(255),\n`;
          content += `  familyNo INT,\n`;
          content += `  bForm VARCHAR(255),\n`;
          content += `  gender VARCHAR(50),\n`;
          content += `  admissionDate VARCHAR(50),\n`;
          content += `  dob VARCHAR(50),\n`;
          content += `  fatherCnic VARCHAR(50),\n`;
          content += `  cell VARCHAR(50),\n`;
          content += `  residency TEXT,\n`;
          content += `  status VARCHAR(50),\n`;
          content += `  user VARCHAR(255),\n`;
          content += `  nameUrdu VARCHAR(255),\n`;
          content += `  fatherUrdu VARCHAR(255),\n`;
          content += `  fatherOccupation VARCHAR(255),\n`;
          content += `  dobWords TEXT,\n`;
          content += `  lastSchool TEXT,\n`;
          content += `  permanentAddress TEXT,\n`;
          content += `  religion VARCHAR(50),\n`;
          content += `  admittedClass VARCHAR(50),\n`;
          content += `  admittedSection VARCHAR(50),\n`;
          content += `  rollNoAdmitted VARCHAR(50)\n`;
          content += ");\n\n";

          content += students
            .map((student) => {
              const values = Object.values(student)
                .map((val) =>
                  typeof val === "string" ? `'${val.replace(/'/g, "''")}'` : val
                )
                .join(", ");
              return `INSERT INTO students VALUES (${values});`;
            })
            .join("\n");

          mimeType = "application/sql";
        }
        break;
      case "MS-EXCEL":
        {
          const excelHeaders = Object.keys(students[0]).join(",");
          const excelRows = students.map((student) =>
            Object.values(student).join(",")
          );
          content = [excelHeaders, ...excelRows].join("\n");
          fileName = "student-information.xls";
          mimeType = "application/vnd.ms-excel";
        }
        break;
      default:
        return;
    }

    // Create a blob and download it
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsExportOpen(false);
  };

  // Filter students based on search term and selected filter
  const filteredStudents = students.filter((student, idx) => {
    const searchTermLower = searchTerm.toLowerCase();
    if (searchFilter === "All Fields") {
      return Object.values(student).some((value) =>
        value?.toString().toLowerCase().includes(searchTermLower)
      );
    } else if (searchFilter === "Sr. No") {
      return (idx + 1).toString().toLowerCase().includes(searchTermLower);
    } else if (searchFilter === "Roll No") {
      return (student.admission?.rollNo ?? "")
        .toString()
        .toLowerCase()
        .includes(searchTermLower);
    } else if (searchFilter === "Name") {
      return (student.name ?? "").toLowerCase().includes(searchTermLower);
    } else if (searchFilter === "Father") {
      return (student.fatherName ?? student.father ?? "")
        .toLowerCase()
        .includes(searchTermLower);
    } else if (searchFilter === "Class") {
      return (student.admission?.className ?? "")
        .toLowerCase()
        .includes(searchTermLower);
    } else if (searchFilter === "Section") {
      return (student.admission?.sectionName ?? "")
        .toLowerCase()
        .includes(searchTermLower);
    } else if (searchFilter === "Father CELL") {
      return (student.guardian?.contact ?? "")
        .toLowerCase()
        .includes(searchTermLower);
    } else if (searchFilter === "Campus") {
      return (student.campus ?? "").toLowerCase().includes(searchTermLower);
    }
    return false;
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isExportOpen && !event.target.closest("button")) {
        setIsExportOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExportOpen]);

  const handlePrint = (student) => {
    setSelectedStudent(student);
    setShowPrintModal(true);
    setPrintModalOpen(true);
  };

  const handleClosePrintModal = () => {
    setShowPrintModal(false);
    setPrintModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r bg-[#2191BF] text-white rounded-t-lg">
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#2191BF] font-bold text-lg">→</span>
              </div>
              <h1 className="text-xl font-semibold">Student Information</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setIsExportOpen(!isExportOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded shadow text-gray-700 hover:bg-gray-50"
                  type="button"
                >
                  <Download className="h-4 w-4" />
                  Export
                  <ChevronDown className="h-4 w-4" />
                </button>
                {isExportOpen && (
                  <div className="absolute left-0 mt-1 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
                    {["JSON", "XML", "CSV", "TXT", "SQL", "MS-EXCEL"].map(
                      (format) => (
                        <button
                          key={format}
                          onClick={() => handleExport(format)}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800 text-sm"
                          type="button"
                        >
                          {format}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
              <div className="relative">
                <select
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-gray-700"
                >
                  <option>All Fields</option>
                  <option>Sr. No</option>
                  <option>Roll No</option>
                  <option>Name</option>
                  <option>Father</option>
                  <option>Class</option>
                  <option>Section</option>
                  <option>Father CELL</option>
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
                    Roll No
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-blue-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-blue-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Father
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-blue-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-blue-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Section
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-blue-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Father CELL
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-blue-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Campus
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-blue-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Admission Form
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <tr
                      key={student._id || student.id || index}
                      className={index % 2 === 0 ? "bg-gray-50" : ""}
                    >
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {index + 1}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {student.admission?.rollNo}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {student.name}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {student.fatherName ?? student.father}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {student.admission?.className}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {student.admission?.sectionName}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {student.guardian?.contact}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {student.campus || "The Future Grooming School"}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        <button
                          onClick={() => handlePrint(student)}
                          className="px-4 py-2 bg-[#2191BF] text-white text-sm rounded hover:bg-[#2191BF] transition-colors font-medium"
                        >
                          Print
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      className="px-5 py-5 border-b border-gray-200 text-sm text-center"
                    >
                      {searchTerm
                        ? "No matching students found"
                        : "No students available"}
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
                {filteredStudents.length > 0
                  ? `Showing ${filteredStudents.length} of ${students.length} entries`
                  : "No entries to show"}
              </div>
            </div>
          </div>
        </div>

        {/* Print Modal */}
        {showPrintModal && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 print-modal">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto print-modal-content">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 border-b bg-gray-50 print-modal-header no-print">
                <h3 className="text-lg font-semibold text-gray-800">
                  Admission Form Print
                </h3>
                <div className="flex gap-3 print-buttons">
                  <button
                onClick={() => window.print()}
                    className="px-4 py-1.5 bg-[#2191BF] text-white rounded hover: transition-colors flex items-center gap-1"
                  >
                    <span>🖨️</span> Print
                  </button>
                  <button
                    onClick={handleClosePrintModal}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Print Content */}
              <div className="p-6 bg-white">
                <div className="text-xs text-right mb-1 no-print">
                  {new Date().toLocaleString()}
                </div>
                <div className="print-modal-body print-form">
                  {/* Header Section */}
                  <div className="border border-gray-400 mb-2">
                    <table className="w-full border-collapse">
                      <tbody>
                        <tr>
                          <td className="border border-gray-400 p-1 text-center font-bold text-sm">
                            ADMISSION FORM
                          </td>
                          <td className="border border-gray-400 p-1 text-center font-bold text-sm">
                            SESSION
                          </td>
                          <td className="border border-gray-400 p-1 text-center font-bold text-sm">
                            {selectedStudent.admission?.classYearName || "2023-2024"}
                          </td>
                          <td className="border border-gray-400 p-1 text-center font-bold text-sm">
                            ADMISSION NO
                          </td>
                          <td className="border border-gray-400 p-1"></td>
                        </tr>
                        <tr>
                          <td className="border border-gray-400 p-1 w-1/4">
                            <div className="flex items-center justify-center">
                              <img src={schoolLogo.src} alt="School Logo" className="h-16" />
                            </div>
                          </td>
                          <td
                            className="border border-gray-400 p-1 text-center"
                            colSpan="3"
                          >
                            <div className="font-bold">
                              The FUTURE GROOMING SCHOOL
                            </div>
                            <div className="text-xs">PAKISTAN</div>
                          </td>
                          <td className="border border-gray-400 p-1">
                            <div className="flex items-center justify-center">
                              <div className="w-16 h-20 flex items-center justify-center">
                                <span className="text-3xl">🎓</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {/* Student Information Table */}
                  <div className="border border-gray-400 mb-2">
                    <table className="w-full border-collapse text-xs">
                      <tbody>
                        <tr>
                          <td className="border border-gray-400 p-1 bg-gray-100 font-semibold w-1/3">
                            Name of Candidate In English
                          </td>
                          <td className="border border-gray-400 p-1 font-semibold">
                            {selectedStudent.name}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-400 p-1 bg-gray-100 font-semibold">
                            Father Name In English
                          </td>
                          <td className="border border-gray-400 p-1 font-semibold">
                            {selectedStudent.fatherName || selectedStudent.father}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-400 p-1 bg-gray-100 font-semibold">
                            Father CNIC Card No
                          </td>
                          <td className="border border-gray-400 p-1 font-semibold">
                            {selectedStudent.guardian?.cnic || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-400 p-1 bg-gray-100 font-semibold">
                            Student Bey Form No
                          </td>
                          <td className="border border-gray-400 p-1 font-semibold">
                            {selectedStudent.bFormNo || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-400 p-1 bg-gray-100 font-semibold">
                            Father Occupation
                          </td>
                          <td className="border border-gray-400 p-1 font-semibold">
                            {selectedStudent.guardian?.occupation || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-400 p-1 bg-gray-100 font-semibold">
                            Date of Birth in Figure
                          </td>
                          <td className="border border-gray-400 p-1 font-semibold">
                            {selectedStudent.dateOfBirth || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-400 p-1 bg-gray-100 font-semibold">
                            Permanent Address
                          </td>
                          <td className="border border-gray-400 p-1 font-semibold">
                            {selectedStudent.currentAddress || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-400 p-1 bg-gray-100 font-semibold">
                            Religion
                          </td>
                          <td className="border border-gray-400 p-1 font-semibold">
                            {selectedStudent.religion || "N/A"}
                          </td>
                          <td className="border border-gray-400 p-1 bg-gray-100 font-semibold">
                            Telephone No.
                          </td>
                          <td className="border border-gray-400 p-1 font-semibold">
                            {selectedStudent.contactNo || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-400 p-1 bg-gray-100 font-semibold">
                            Class in which admission is sought
                          </td>
                          <td className="border border-gray-400 p-1 font-semibold">
                            {selectedStudent.admission?.className || "N/A"}
                          </td>
                          <td className="border border-gray-400 p-1 font-semibold text-center">
                            A
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {/* Under Taking Section */}
                  <div className="mb-2">
                    <div className="font-bold text-xs mb-1">
                      Under Taking By The Parents
                    </div>
                    <div className="text-xs text-justify leading-tight border border-gray-400 p-1">
                      I have read the prospectus of FUTURE GROOMING SCHOOL and
                      hereby undertake that my son/daughter will follow the
                      rules and regulations of the institute promulgated here by
                      authorities and also undertake that as students of RPS.
                      He/She will do nothing inside or outside of School
                      premises that will interfere with the administration and
                      discipline of School and I/he/she will abide by decision
                      of principal. In case, He/She is found guilty of
                      indiscipline defamation and disrespect to teaching staff
                      and involve in other anti institutional activities, He/She
                      will be expelled.
                    </div>
                  </div>
                  {/* Signature Section */}
                  <div className="border border-gray-400 mb-2">
                    <table className="w-full border-collapse text-xs">
                      <tbody>
                        <tr>
                          <td className="border border-gray-400 p-1 bg-gray-100 font-semibold w-1/4">
                            Signature
                          </td>
                          <td className="border border-gray-400 p-1 signature-row"></td>
                        </tr>
                        <tr>
                          <td className="border border-gray-400 p-1 bg-gray-100 font-semibold">
                            Name
                          </td>
                          <td className="border border-gray-400 p-1 font-semibold">
                            {selectedStudent.fatherName || selectedStudent.father}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-400 p-1 bg-gray-100 font-semibold">
                            Address
                          </td>
                          <td className="border border-gray-400 p-1 font-semibold">
                            {selectedStudent.currentAddress || "N/A"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {/* Office Use Only Section */}
                  <div className="mb-2">
                    <div className="font-bold text-xs text-center mb-1">
                      FOR OFFICE USE ONLY
                    </div>
                    <div className="border border-gray-400">
                      <table className="w-full border-collapse text-xs">
                        <tbody>
                          <tr>
                            <td className="border border-gray-400 p-1 bg-gray-100 font-semibold">
                              Admitted In Class
                            </td>
                            <td className="border border-gray-400 p-1 font-semibold text-center">
                              {selectedStudent.admission?.className || "N/A"}
                            </td>
                            <td className="border border-gray-400 p-1 font-semibold text-center">
                              {selectedStudent.admission?.sectionName || "N/A"}
                            </td>
                            <td className="border border-gray-400 p-1 font-semibold text-center">
                              {selectedStudent.rollNoAdmitted || "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-gray-400 p-1 bg-gray-100 font-semibold">
                              Fee Received Vide Receipt No
                            </td>
                            <td
                              className="border border-gray-400 p-1 signature-row"
                              colSpan="3"
                            ></td>
                          </tr>
                          <tr>
                            <td className="border border-gray-400 p-1 bg-gray-100 font-semibold">
                              Office Suprintendent
                            </td>
                            <td className="border border-gray-400 p-1 signature-row"></td>
                            <td className="border border-gray-400 p-1 bg-gray-100 font-semibold">
                              Class Teacher
                            </td>
                            <td className="border border-gray-400 p-1 signature-row"></td>
                          </tr>
                          <tr>
                            <td className="border border-gray-400 p-1 bg-gray-100 font-semibold">
                              Account Clerk
                            </td>
                            <td className="border border-gray-400 p-1 signature-row"></td>
                            <td className="border border-gray-400 p-1 bg-gray-100 font-semibold">
                              Principal
                            </td>
                            <td className="border border-gray-400 p-1 signature-row"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* Footer */}
                  <div className="text-right text-xs mb-1">{dateString}</div>
                  <div className="text-xs text-gray-500 mt-2 flex justify-between">
                    <div>1/1</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}