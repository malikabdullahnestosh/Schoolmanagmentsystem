"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import constant from "/constant";
import axiosInstance from "../../../axiosInstance";
import schoolLogo from "../../assets/schoolLogo.png";
import { usePrintModal } from "../../components/PrintModalContext";
const printStyles = `
  @media print {
    body * { visibility: hidden; }
    .print-modal-content, .print-modal-content * { visibility: visible; }
    .print-modal-content {
      position: absolute;
      left: 0; top: 0; width: 100%; height: 100%; padding: 0; margin: 0;
      max-height: none !important;
      height: auto !important;
      overflow: visible !important;
      box-shadow: none !important;
      background: white !important;
    }
    .max-h-\\[85vh\\] {
      max-height: none !important;
    }
    .overflow-y-auto {
      overflow-y: visible !important;
    }
    .print-modal-header, .print-modal-footer, .print-buttons { display: none !important; }
    .print-modal-body { padding: 0; margin: 0; }
    table { page-break-inside: avoid; }
    @page { size: A4; margin: 10mm; }
    .print-form { font-size: 10pt; line-height: 1.2; }
    .print-form td { padding: 2px 4px; }
    .print-form .signature-row { height: 30px; }
    .print-form .small-text { font-size: 9pt; }
  }
`;

export default function AddStudent() {
  // At the top of AddStudent component
  const currentDate = new Date();
  const dateString = `${currentDate
    .getDate()
    .toString()
    .padStart(2, "0")} ${currentDate.toLocaleString("default", {
    month: "short",
  })}, ${currentDate.getFullYear()}`;

  const [dateOfBirth, setDateOfBirth] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState("all");
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setPrintModalOpen } = usePrintModal();
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    fatherCnic: "",
    fatherCell: "",
    siblingsList: "",
    name: "",
    father: "",
    bForm: "",
    contactNo: "",
    gender: "",
    email: "",
    address: "",
    hobby: "",
    religion: "",
    studentCategory: "",
    noOfSiblings: "",
    familyNo: "",
    relationWithStudent: "",
    guardianCnic: "",
    guardianContact: "",
    occupation: "",
    monthlyIncome: "",
    permanentAddress: "",
    programName: "",
    className: "",
    classYearName: "",
    sectionName: "",
    rollNo: "",
    bFormRemarks: "",
    fatherCnicRemarks: "",
    birthCertificateRemarks: "",
    feesAttachment: "",
    feeMonth: "",
    feePolicy: "",
    otherFeeNeeded: "",
    otherFee: "",
    admissionFeeAmount: "",
    annualFundAmount: "",
    tuitionFeeAmount: "",
    discount: "",
    amountPaid: "",
    dueDate: "",
    expiryDate: "",
  });

  const currentYear = new Date().getFullYear();
  const maxYear = 2076;
  const sessionOptions = [];
  for (let year = currentYear; year < maxYear; year++) {
    sessionOptions.push(`${year}-${year + 1}`);
  }

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await axiosInstance.get("/students/");
        if (res.data.success) {
          setStudents(res.data.students);
        } else {
          toast.error("Failed to fetch students");
        }
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          toast.error("Unauthorized. Please log in again.");
        } else {
          toast.error("Failed to fetch students");
        }
      }
    }
    fetchStudents();
  }, []);

  // Auto-fill student data when both CNIC and Cell entered
  useEffect(() => {
    if (formData.fatherCnic && formData.fatherCell) {
      const matched = students.find(
        (student) =>
          student.guardian?.cnic === formData.fatherCnic &&
          student.guardian?.contact === formData.fatherCell
      );
      if (matched) {
        setFormData((prev) => ({
          ...prev,
          name: matched.name || "",
          father: matched.fatherName || "",
          bForm: matched.bFormNo || "",
          gender: matched.gender || "",
          address: matched.currentAddress || "",
          contactNo: matched.contactNo || "",
          email: matched.email || "",
          religion: matched.religion || "",
          studentCategory: matched.studentCategory || "",
          familyNo: matched.familyNo || "",
          siblingsList: matched.siblingsList || "",
          noOfSiblings: matched.noOfSiblings?.toString() || "",
          relationWithStudent: matched.guardian?.relation || "",
          guardianCnic: matched.guardian?.cnic || "",
          guardianContact: matched.guardian?.contact || "",
          occupation: matched.guardian?.occupation || "",
          monthlyIncome: matched.guardian?.monthlyIncome || "",
          permanentAddress: matched.guardian?.permanentAddress || "",
          programName: matched.admission?.programName || "",
          className: matched.admission?.className || "",
          classYearName: matched.admission?.classYearName || "",
          sectionName: matched.admission?.sectionName || "",
          rollNo: matched.admission?.rollNo || "",
          bFormRemarks: matched.checklist?.bFormRemarks || "",
          fatherCnicRemarks: matched.checklist?.fatherCnicRemarks || "",
          birthCertificateRemarks: matched.checklist?.birthCertificateRemarks || "",
        }));
        toast.success("Student data auto-filled from existing record.");
      }
    }
  }, [formData.fatherCnic, formData.fatherCell, students]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePrint = (student) => {
    setSelectedStudent(student);
    setShowPrintModal(true);
    setPrintModalOpen(true);
  };

  // --- handleSubmit for API integration ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");

    // Calculate fee values
    const admissionFee = parseFloat(formData.admissionFeeAmount) || 0;
    const annualFund = parseFloat(formData.annualFundAmount) || 0;
    const tuitionFee = parseFloat(formData.tuitionFeeAmount) || 0;
    const discount = parseFloat(formData.discount) || 0;
    const amountPaid = parseFloat(formData.amountPaid) || 0;

    // Fees array as per backend
    const fees = [
      ...(admissionFee
        ? [
            {
              feeType: "Admission",
              feeName: "Admission Fee",
              feeAmount: admissionFee,
              paidAmount: Math.min(amountPaid, admissionFee),
              dueDate: formData.dueDate,
              expiryDate: formData.expiryDate,
            },
          ]
        : []),
      ...(annualFund
        ? [
            {
              feeType: "Annual Fund",
              feeName: "Annual Fund",
              feeAmount: annualFund,
              paidAmount: Math.max(
                0,
                Math.min(amountPaid - admissionFee, annualFund)
              ),
              dueDate: formData.dueDate,
              expiryDate: formData.expiryDate,
            },
          ]
        : []),
      ...(tuitionFee
        ? [
            {
              feeType: "Tuition",
              feeName: "Tuition Fee",
              feeAmount: tuitionFee,
              paidAmount: Math.max(0, amountPaid - admissionFee - annualFund),
              dueDate: formData.dueDate,
              expiryDate: formData.expiryDate,
            },
          ]
        : []),
    ];

    // Build the student payload as per your backend schema
    const payload = {
      name: formData.name,
      fatherName: formData.father,
      dateOfBirth: dateOfBirth,
      contactNo: formData.contactNo,
      bFormNo: formData.bForm,
      email: formData.email,
      gender: formData.gender,
      currentAddress: formData.address,
      hobby: formData.hobby,
      religion: formData.religion,
      studentCategory: formData.studentCategory,
      familyNo: formData.familyNo,
      noOfSiblings: Number(formData.noOfSiblings) || 0,
      siblingsList: formData.siblingsList,
      guardian: {
        relation: formData.relationWithStudent,
        contact: formData.guardianContact || formData.fatherCell,
        monthlyIncome: formData.monthlyIncome,
        cnic: formData.guardianCnic || formData.fatherCnic,
        occupation: formData.occupation,
        permanentAddress: formData.permanentAddress,
      },
      admission: {
        programName: formData.programName,
        className: formData.className,
        classYearName: formData.classYearName,
        sectionName: formData.sectionName,
        rollNo: formData.rollNo,
        joiningDate: joiningDate,
      },
      checklist: {
        bForm: !!formData.bForm,
        bFormRemarks: formData.bFormRemarks,
        fatherCnic: !!formData.fatherCnic,
        fatherCnicRemarks: formData.fatherCnicRemarks,
        birthCertificate: false,
        birthCertificateRemarks: formData.birthCertificateRemarks,
      },
      fee: {
        isFeeAttachmentNeeded: formData.feesAttachment === "Yes",
        feeMonth: formData.feeMonth,
        dueDate: formData.dueDate,
        feePolicy: formData.feePolicy,
        expiryDate: formData.expiryDate,
        discount,
        amountPaid,
        totalPayable: admissionFee + annualFund + tuitionFee - discount,
        dueAmount:
          admissionFee + annualFund + tuitionFee - discount - amountPaid,
      },
      fees, // The detailed array
      extraFee: {
        isOtherFeeNeeded: formData.otherFeeNeeded === "Yes",
        items: [
          {
            title: "Other Fee",
            amount: Number(formData.otherFee) || 0,
          },
        ],
      },
    };

    try {
      console.log("Payload sent:", JSON.stringify(payload, null, 2));
      const res = await axios.post(`${constant.apiUrl}/students/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        toast.success("Student added successfully!");
        setFormData({
          fatherCnic: "",
          fatherCell: "",
          siblingsList: "",
          name: "",
          father: "",
          bForm: "",
          contactNo: "",
          gender: "",
          email: "",
          address: "",
          hobby: "",
          religion: "",
          studentCategory: "",
          noOfSiblings: "",
          familyNo: "",
          relationWithStudent: "",
          guardianCnic: "",
          guardianContact: "",
          occupation: "",
          monthlyIncome: "",
          permanentAddress: "",
          programName: "",
          className: "",
          classYearName: "",
          sectionName: "",
          rollNo: "",
          bFormRemarks: "",
          fatherCnicRemarks: "",
          birthCertificateRemarks: "",
          feesAttachment: "",
          feeMonth: "",
          feePolicy: "",
          otherFeeNeeded: "",
          otherFee: "",
          admissionFeeAmount: "",
          annualFundAmount: "",
          tuitionFeeAmount: "",
          discount: "",
          amountPaid: "",
          dueDate: "",
          expiryDate: "",
        });
        setDateOfBirth("");
        setJoiningDate("");
        // Refetch students
        const refetch = await axios.get(`${constant.apiUrl}/students/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (refetch.data.success) setStudents(refetch.data.students);
      } else {
        setError(res.data.message || "Failed to add student");
        toast.error(res.data.message || "Failed to add student");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to add student"
      );
      toast.error(
        err.response?.data?.message || err.message || "Failed to add student"
      );
    } finally {
      setLoading(false);
    }
  };

  // Enhanced filter function based on selected filter type
  const filteredStudents = students.filter((student, index) => {
    if (!searchTerm) return true;
    const searchValue = searchTerm.toLowerCase();

    switch (searchFilter) {
      case "srNo":
        return (index + 1).toString().includes(searchValue);
      case "familyNo":
        return (student.familyNo ?? "")
          .toString()
          .toLowerCase()
          .includes(searchValue);
      case "rollNo":
        return (student.admission?.rollNo ?? "")
          .toString()
          .toLowerCase()
          .includes(searchValue);
      case "name":
        return (student.name ?? "").toLowerCase().includes(searchValue);
      case "father":
        return (student.fatherName ?? "").toLowerCase().includes(searchValue);
      case "class":
        return (student.admission?.className ?? "")
          .toLowerCase()
          .includes(searchValue);
      case "section":
        return (student.admission?.sectionName ?? "")
          .toLowerCase()
          .includes(searchValue);
      case "bForm":
        return (student.bFormNo ?? "").toLowerCase().includes(searchValue);
      case "gender":
        return (student.gender ?? "").toLowerCase().includes(searchValue);
      case "fatherCnic":
        return (student.guardian?.cnic ?? "")
          .toLowerCase()
          .includes(searchValue);
      case "cell":
        return (student.contactNo ?? "").toLowerCase().includes(searchValue);
      case "status":
        return (student.status ?? "Active").toLowerCase().includes(searchValue);
      case "all":
      default:
        return (
          (student.name ?? "").toLowerCase().includes(searchValue) ||
          (student.fatherName ?? "").toLowerCase().includes(searchValue) ||
          (student.bFormNo ?? "").toLowerCase().includes(searchValue) ||
          (student.admission?.className ?? "")
            .toLowerCase()
            .includes(searchValue) ||
          (student.admission?.sectionName ?? "")
            .toLowerCase()
            .includes(searchValue) ||
          (student.admission?.rollNo ?? "")
            .toLowerCase()
            .includes(searchValue) ||
          (student.familyNo ?? "")
            .toString()
            .toLowerCase()
            .includes(searchValue) ||
          (student.guardian?.cnic ?? "").toLowerCase().includes(searchValue) ||
          (student.contactNo ?? "").toLowerCase().includes(searchValue) ||
          (student.gender ?? "").toLowerCase().includes(searchValue)
        );
    }
  });

  const handleClosePrintModal = () => {
    setShowPrintModal(false);
    setPrintModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />
      <Toaster />
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header ... */}
        <div className="bg-[#0D1B28] text-white p-3 rounded-lg shadow-lg ">
          <h1 className="text-2xl font-bold  gap-4">
            <span className="text-2xl">🎓</span>
            Student Admission
          </h1>
        </div>

        {/* SHOW ERROR/LOADING */}
        {loading && <div className="text-blue-500 mb-2">Saving...</div>}

        <form onSubmit={handleSubmit}>
          {/* Search Section */}
          <div className="mb-1 bg-[#0D1B28] text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-xl">🔍</span>
              Search By (Auto-Fill Relevant Data)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="father-cnic"
                  className="block text-sm font-medium mb-2"
                >
                  Father CNIC
                </label>
                <input
                  id="father-cnic"
                  type="text"
                  placeholder="--CNIC--"
                  value={formData.fatherCnic}
                  onChange={(e) =>
                    handleInputChange("fatherCnic", e.target.value)
                  }
                  className="w-full p-3 rounded border-0 bg-white/90 focus:bg-white text-gray-900 transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="father-cell"
                  className="block text-sm font-medium mb-2"
                >
                  Father CELL NO
                </label>
                <input
                  id="father-cell"
                  type="text"
                  placeholder="--Cell NO--"
                  value={formData.fatherCell}
                  onChange={(e) =>
                    handleInputChange("fatherCell", e.target.value)
                  }
                  className="w-full p-3 rounded border-0 bg-white/90 focus:bg-white text-gray-900 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Student Information Section */}
          <div className="mb-1 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-[#2191BF] flex items-center gap-2 pb-3 border-b border-gray-200">
              <span className="text-xl">👤</span>
              Student Information
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Name: <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="--Name--"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="father"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Father: <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="father"
                    type="text"
                    placeholder="--Father Name--"
                    value={formData.father}
                    onChange={(e) =>
                      handleInputChange("father", e.target.value)
                    }
                    className="w-full p-3 border border-gray-200 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="dob"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Date Of Birth: <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="dob"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="b-form"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    B-Form / CNIC: <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="b-form"
                    type="text"
                    placeholder="--B Form--"
                    value={formData.bForm}
                    onChange={(e) => handleInputChange("bForm", e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Gender: <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value)
                    }
                    className="w-full p-3 border border-gray-200 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    required
                  >
                    <option value="">--Select--</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Current Address: <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="address"
                    placeholder="--Address--"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className="w-full p-3 border border-gray-200 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors min-h-[80px]"
                    required
                  ></textarea>
                </div>

                <div>
                  <label
                    htmlFor="religion"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Religion / Caste:
                  </label>
                  <input
                    id="religion"
                    type="text"
                    placeholder="--Religion / Caste--"
                    value={formData.religion}
                    onChange={(e) =>
                      handleInputChange("religion", e.target.value)
                    }
                    className="w-full p-3 border border-gray-200 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="contact"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Contact No: <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact"
                    type="text"
                    placeholder="--Cell NO--"
                    value={formData.contactNo}
                    onChange={(e) =>
                      handleInputChange("contactNo", e.target.value)
                    }
                    className="w-full p-3 border border-gray-200 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email:
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="e.g. example@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="hobby"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Hobby:
                  </label>
                  <input
                    id="hobby"
                    type="text"
                    placeholder="--Hobby--"
                    value={formData.hobby}
                    onChange={(e) => handleInputChange("hobby", e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="student-category"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Student Category: <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="student-category"
                    value={formData.studentCategory}
                    onChange={(e) =>
                      handleInputChange("studentCategory", e.target.value)
                    }
                    className="w-full p-3 border border-gray-200 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    required
                  >
                    <option value="">--Select--</option>
                    <option value="Regular">Regular</option>
                    <option value="Scholarship">Scholarship</option>
                    <option value="Special Needs">Special Needs</option>
                    <option value="Transfer">Transfer</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="family-no"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Family No: <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="family-no"
                    type="text"
                    placeholder="1"
                    value={formData.familyNo}
                    onChange={(e) =>
                      handleInputChange("familyNo", e.target.value)
                    }
                    className="w-full p-3 border border-gray-200 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="no-siblings"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    No In Siblings: <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="no-siblings"
                    value={formData.noOfSiblings}
                    onChange={(e) =>
                      handleInputChange("noOfSiblings", e.target.value)
                    }
                    className="w-full p-3 border border-gray-200 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    required
                  >
                    <option value="">--Select--</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Parents / Guardian Record */}
          <div className="mb-1 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-[#2191BF] flex items-center gap-2 pb-3 border-b border-gray-200">
              <span className="text-xl">👪</span>
              Parents / Guardian Record
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="relation"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Relation With Student:{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="relation"
                    value={formData.relationWithStudent}
                    onChange={(e) =>
                      handleInputChange("relationWithStudent", e.target.value)
                    }
                    className="w-full p-3 border border-gray-200 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    required
                  >
                    <option value="">--Select--</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="guardian-contact"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Contact:
                  </label>
                  <input
                    id="guardian-contact"
                    type="text"
                    placeholder="--Phone NO--"
                    value={formData.guardianContact}
                    onChange={(e) =>
                      handleInputChange("guardianContact", e.target.value)
                    }
                    className="w-full p-3 border border-gray-200 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="monthly-income"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Monthly Income:
                  </label>
                  <input
                    id="monthly-income"
                    type="text"
                    placeholder="--Monthly Income--"
                    value={formData.monthlyIncome}
                    onChange={(e) =>
                      handleInputChange("monthlyIncome", e.target.value)
                    }
                    className="w-full p-3 border border-gray-200 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="guardian-cnic"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    CNIC:
                  </label>
                  <input
                    id="guardian-cnic"
                    type="text"
                    placeholder="--CNIC--"
                    value={formData.guardianCnic}
                    onChange={(e) =>
                      handleInputChange("guardianCnic", e.target.value)
                    }
                    className="w-full p-3 border border-gray-200 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="occupation"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Occupation:
                  </label>
                  <input
                    id="occupation"
                    type="text"
                    placeholder="--Occupation--"
                    value={formData.occupation}
                    onChange={(e) =>
                      handleInputChange("occupation", e.target.value)
                    }
                    className="w-full p-3 border border-gray-200 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="permanent-address"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Permanent Address:
                  </label>
                  <textarea
                    id="permanent-address"
                    placeholder="--Address--"
                    value={formData.permanentAddress}
                    onChange={(e) =>
                      handleInputChange("permanentAddress", e.target.value)
                    }
                    className="w-full p-3 border border-gray-200 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors min-h-[80px]"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Admission Information */}
          <div className="mb-1 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-[#2191BF] flex items-center gap-2 pb-3 border-b border-gray-200">
              <span className="text-xl">🎓</span>
              Admission
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="program-name"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Program Level: <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="program-name"
                    value={formData.programName}
                    onChange={(e) =>
                      handleInputChange("programName", e.target.value)
                    }
                    className="w-full p-3 border border-gray-200 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    required
                  >
                    <option value="">--Select--</option>
                    <option value="Primary">Primary</option>
                    <option value="Middle">Middle</option>
                    <option value="Secondary">Secondary</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="class-name"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Class Name: <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="class-name"
                    value={formData.className}
                    onChange={(e) =>
                      handleInputChange("className", e.target.value)
                    }
                    className="w-full p-3 border border-gray-200 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    required
                  >
                    <option value="">--Select--</option>
                    <option value="PLAY">PLAY</option>
                    <option value="NURSERY">NURSERY</option>
                    <option value="KG">KG</option>
                    <option value="CLASS 1">CLASS 1</option>
                    <option value="CLASS 2">CLASS 2</option>
                    <option value="CLASS 3">CLASS 3</option>
                    <option value="CLASS 4">CLASS 4</option>
                    <option value="CLASS 5">CLASS 5</option>
                    <option value="CLASS 6">CLASS 6</option>
                    <option value="CLASS 7">CLASS 7</option>
                    <option value="CLASS 8">CLASS 8</option>
                    <option value="CLASS 9">CLASS 9</option>
                    <option value="CLASS 10">CLASS 10</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="section-name"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Section Name:
                  </label>
                  <select
                    id="section-name"
                    value={formData.sectionName}
                    onChange={(e) =>
                      handleInputChange("sectionName", e.target.value)
                    }
                    className="w-full p-3 border border-gray-200 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  >
                    <option value="">--Select--</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Department section commented as before */}
                {/* 
      <div> ... </div>
      */}
                <div>
                  <label
                    htmlFor="class-year"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Class Year Name: <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="class-year"
                    value={formData.classYearName}
                    onChange={(e) =>
                      handleInputChange("classYearName", e.target.value)
                    }
                    className="w-full p-3 border border-gray-200 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    required
                  >
                    <option value="">Select Session</option>
                    {sessionOptions.map((session) => (
                      <option key={session} value={session}>
                        {session}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="roll-no"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Roll No:
                  </label>
                  <input
                    id="roll-no"
                    type="text"
                    placeholder="--Roll No--"
                    value={formData.rollNo}
                    onChange={(e) =>
                      handleInputChange("rollNo", e.target.value)
                    }
                    className="w-full p-3 border border-gray-200 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="joining-date"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Joining Date:
                  </label>
                  <input
                    id="joining-date"
                    type="date"
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Checklist Record */}
          <div className="mb-1 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-[#2191BF] flex items-center gap-2 pb-3 border-b border-gray-200">
              <span className="text-xl">✅</span>
              Checklist Record
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Check List:
                  </label>
                  <input
                    type="text"
                    value="B-Form"
                    readOnly
                    className="w-full p-3 bg-gray-100 border border-gray-200 rounded cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Remarks:
                  </label>
                  <input
                    type="text"
                    placeholder="--Remarks--"
                    value={formData.bFormRemarks}
                    onChange={(e) =>
                      handleInputChange("bFormRemarks", e.target.value)
                    }
                    className="w-full p-3 border border-gray-200 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Check List:
                  </label>
                  <input
                    type="text"
                    value="Father CNIC"
                    readOnly
                    className="w-full p-3 bg-gray-100 border border-gray-200 rounded cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Remarks:
                  </label>
                  <input
                    type="text"
                    placeholder="--Remarks--"
                    value={formData.fatherCnicRemarks}
                    onChange={(e) =>
                      handleInputChange("fatherCnicRemarks", e.target.value)
                    }
                    className="w-full p-3 border border-gray-200 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Check List:
                  </label>
                  <input
                    type="text"
                    value="Birth Certificate"
                    readOnly
                    className="w-full p-3 bg-gray-100 border border-gray-200 rounded cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Remarks:
                  </label>
                  <input
                    type="text"
                    placeholder="--Remarks--"
                    value={formData.birthCertificateRemarks}
                    onChange={(e) =>
                      handleInputChange(
                        "birthCertificateRemarks",
                        e.target.value
                      )
                    }
                    className="w-full p-3 border border-gray-200 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fee Information */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-[#2191BF] flex items-center gap-2 pb-3 border-b border-gray-200">
              <span className="text-xl">💰</span> Fee Structure
            </h2>

            <div className="space-y-6">
              {/* Fees Attachment */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fees Attachment Needed?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  name="feesAttachment"
                  value={formData.feesAttachment}
                  onChange={(e) =>
                    handleInputChange("feesAttachment", e.target.value)
                  }
                  required
                  className="w-full p-3 border border-gray-200 rounded"
                >
                  <option value="">--Select--</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Fee Month & Dates */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Fee Month:
                    </label>
                    <select
                      name="feeMonth"
                      value={formData.feeMonth}
                      onChange={(e) =>
                        handleInputChange("feeMonth", e.target.value)
                      }
                      className="w-full p-3 border border-gray-200 rounded"
                    >
                      <option value="">--Select Month--</option>
                      {[
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                      ].map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Due Date:
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={(e) =>
                        handleInputChange("dueDate", e.target.value)
                      }
                      className="w-full p-3 border border-gray-200 rounded"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Fee Policy:
                    </label>
                    <select
                      name="feePolicy"
                      value={formData.feePolicy}
                      onChange={(e) =>
                        handleInputChange("feePolicy", e.target.value)
                      }
                      className="w-full p-3 border border-gray-200 rounded"
                    >
                      <option value="">--Select Policy--</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Bi-Annual">Bi-Annual</option>
                      <option value="Annual">Annual</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Expiry Date:
                    </label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={(e) =>
                        handleInputChange("expiryDate", e.target.value)
                      }
                      className="w-full p-3 border border-gray-200 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Basic Fees */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-4">
                <h3 className="text-lg font-semibold text-[#2191BF] mb-4 flex items-center gap-2">
                  <span className="text-lg">➕</span> Basic Fees
                </h3>

                {[
                  { label: "Admission Fee", name: "admissionFeeAmount" },
                  { label: "Annual Fund", name: "annualFundAmount" },
                  { label: "Tuition Fee", name: "tuitionFeeAmount" },
                ].map((fee, idx) => (
                  <div key={idx} className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {fee.label}
                      </label>
                      <input
                        type="text"
                        value={fee.label}
                        readOnly
                        className="w-full p-3 bg-gray-100 border border-gray-200 rounded cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Amount
                      </label>
                      <input
                        type="number"
                        name={fee.name}
                        value={formData[fee.name]}
                        onChange={(e) =>
                          handleInputChange(fee.name, e.target.value)
                        }
                        className="w-full p-3 border border-gray-200 rounded"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Discount & Total */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Discount (if any):
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={(e) =>
                      handleInputChange("discount", e.target.value)
                    }
                    className="w-full p-3 border border-gray-200 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Total Payable Fee:
                  </label>
                  <input
                    type="number"
                    readOnly
                    value={
                      parseFloat(formData.admissionFeeAmount || 0) +
                      parseFloat(formData.annualFundAmount || 0) +
                      parseFloat(formData.tuitionFeeAmount || 0) -
                      parseFloat(formData.discount || 0)
                    }
                    className="w-full p-3 bg-gray-100 border border-gray-200 rounded cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Paid & Due */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Amount Paid:
                  </label>
                  <input
                    type="number"
                    name="amountPaid"
                    value={formData.amountPaid}
                    onChange={(e) =>
                      handleInputChange("amountPaid", e.target.value)
                    }
                    className="w-full p-3 border border-gray-200 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Due Amount:
                  </label>
                  <input
                    type="number"
                    readOnly
                    value={
                      parseFloat(formData.admissionFeeAmount || 0) +
                      parseFloat(formData.annualFundAmount || 0) +
                      parseFloat(formData.tuitionFeeAmount || 0) -
                      parseFloat(formData.discount || 0) -
                      parseFloat(formData.amountPaid || 0)
                    }
                    className="w-full p-3 bg-gray-100 border border-gray-200 rounded cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              type="reset"
              className="px-8 py-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-12 py-3 bg-gradient-to-r bg-[#2191BF] text-white rounded-lg font-semibold  hover:bg-[#2191BF] shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <span className="text-lg">👥</span>
              Add Student
            </button>
          </div>
        </form>

        {/* Student Records Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r bg-[#2191BF] text-white p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="text-xl">📋</span>
                Student Records
              </h2>

              {/* Enhanced Search Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="search-filter"
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    Filter by:
                  </label>
                  <select
                    id="search-filter"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="px-3 py-2 rounded border-0 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
                  >
                    <option value="all">All Fields</option>
                    <option value="srNo">Sr. No</option>
                    <option value="familyNo">Family No</option>
                    <option value="rollNo">Roll No</option>
                    <option value="name">Name</option>
                    <option value="father">Father</option>
                    <option value="class">Class</option>
                    <option value="section">Section</option>
                    <option value="bForm">B-Form</option>
                    <option value="gender">Gender</option>
                    <option value="fatherCnic">Father CNIC</option>
                    <option value="cell">Cell</option>
                    <option value="status">Status</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Search ${
                      searchFilter === "all" ? "all fields" : searchFilter
                    }...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-2 rounded border-0 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full sm:w-64"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="px-2 py-2 bg-blue-700 hover:bg-blue-800 rounded text-white text-sm transition-colors"
                      title="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Search Results Info */}
            {searchTerm && (
              <div className="mt-3 text-sm bg-blue-600 bg-opacity-50 px-3 py-2 rounded">
                {filteredStudents.length > 0 ? (
                  <>
                    Found {filteredStudents.length} student
                    {filteredStudents.length !== 1 ? "s" : ""}
                    {searchFilter !== "all" && ` in ${searchFilter}`}
                    matching "{searchTerm}"
                  </>
                ) : (
                  <>
                    No students found matching "{searchTerm}"{" "}
                    {searchFilter !== "all" && `in ${searchFilter}`}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                    Sr #
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                    Print
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                    Family No
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                    Roll No
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                    Father
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                    Class
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                    Section
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                    Student B-Form
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                    Gender
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                    Admission Date
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                    DOB
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                    Father CNIC
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                    CELL
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                    Father CELL
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                    Residency
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                    User
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                    Campus
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <tr key={index} className="hover:bg-gray-50 border-b">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handlePrint(student)}
                          className="px-3 py-1 bg-[#2191BF] text-white text-xs rounded hover:bg-[#2191BF] transition-colors"
                        >
                          Print
                        </button>
                      </td>
                      <td className="px-4 py-3">{student.familyNo}</td>
                      <td className="px-4 py-3">{student.admission.rollNo}</td>
                      <td className="px-4 py-3 font-medium">{student.name}</td>
                      <td className="px-4 py-3">{student.fatherName}</td>
                      <td className="px-4 py-3">
                        {student.admission.className}
                      </td>
                      <td className="px-4 py-3">
                        {student.admission.sectionName}
                      </td>
                      <td className="px-4 py-3">{student.bFormNo}</td>
                      <td className="px-4 py-3">{student.gender}</td>
                      <td className="px-4 py-3">
                        {student.admission.joiningDate}
                      </td>
                      <td className="px-4 py-3">{student.dateOfBirth}</td>
                      <td className="px-4 py-3">{student.guardian.cnic}</td>
                      <td className="px-4 py-3">{student.contactNo}</td>
                      <td className="px-4 py-3">{student.guardian.contact}</td>
                      <td className="px-4 py-3">{student.currentAddress}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full border border-green-200">
                          {student.status ? student.status : "Active"}
                        </span>
                      </td>
                      <td className="px-4 py-3">{student.user}</td>
                      <td className="px-4 py-3">The Future Grooming School</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="19"
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      {searchTerm
                        ? "No students found matching your search criteria."
                        : "No students registered yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-sm text-gray-600 flex justify-between items-center">
            <span>
              Showing {filteredStudents.length > 0 ? "1" : "0"} to{" "}
              {filteredStudents.length} of {filteredStudents.length} rows
              {searchTerm &&
                ` (filtered from ${students.length} total students)`}
            </span>
            {filteredStudents.length > 0 && (
              <span className="text-[#2191BF] font-medium">
                Total Students: {students.length}
              </span>
            )}
          </div>
        </div>

        {/* Print Modal */}
        {showPrintModal && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 border-b bg-gray-50 print-modal-header">
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
              <div className="p-6 bg-white print-modal-content">
                    <div className="text-xs text-right mb-1">
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
                            {selectedStudent.admission.classYearName}
                          </td>
                          <td className="border border-gray-400 p-1 text-center font-bold text-sm">
                            ADMISSION NO
                          </td>
                          <td className="border border-gray-400 p-1"></td>
                        </tr>
                        <tr>
                          <td className="border border-gray-400 p-1 w-1/4">
                            <div className="flex items-center justify-center">
                              <img src={schoolLogo} />
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
                            {selectedStudent.fatherName}
                          </td>
                        </tr>

                        <tr>
                          <td className="border border-gray-400 p-1 bg-gray-100 font-semibold">
                            Father CNIC Card No
                          </td>
                          <td className="border border-gray-400 p-1 font-semibold">
                            {selectedStudent.guardian.cnic}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-400 p-1 bg-gray-100 font-semibold">
                            Student Bey Form No
                          </td>
                          <td className="border border-gray-400 p-1 font-semibold">
                            {selectedStudent.bFormNo}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-400 p-1 bg-gray-100 font-semibold">
                            Father Occupation
                          </td>
                          <td className="border border-gray-400 p-1 font-semibold">
                            {selectedStudent.guardian.occupation}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-400 p-1 bg-gray-100 font-semibold">
                            Date of Birth in Figure
                          </td>
                          <td className="border border-gray-400 p-1 font-semibold">
                            {selectedStudent.dateOfBirth}
                          </td>
                        </tr>

                        <tr>
                          <td className="border border-gray-400 p-1 bg-gray-100 font-semibold">
                            Permanent Address
                          </td>
                          <td className="border border-gray-400 p-1 font-semibold">
                            {selectedStudent.currentAddress}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-400 p-1 bg-gray-100 font-semibold">
                            Religion
                          </td>
                          <td className="border border-gray-400 p-1 font-semibold">
                            {selectedStudent.religion}
                          </td>
                          <td className="border border-gray-400 p-1 bg-gray-100 font-semibold">
                            Telephone No.
                          </td>
                          <td className="border border-gray-400 p-1 font-semibold">
                            {selectedStudent.contactNo}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-400 p-1 bg-gray-100 font-semibold">
                            Class in which admission is sought
                          </td>
                          <td className="border border-gray-400 p-1 font-semibold">
                            {selectedStudent.admission.className}
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
                            {selectedStudent.fatherName}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-400 p-1 bg-gray-100 font-semibold">
                            Address
                          </td>
                          <td className="border border-gray-400 p-1 font-semibold">
                            {selectedStudent.currentAddress}
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
                              {selectedStudent.admission.className}
                            </td>
                            <td className="border border-gray-400 p-1 font-semibold text-center">
                              {selectedStudent.admission.sectionName}
                            </td>
                            <td className="border border-gray-400 p-1 font-semibold text-center">
                              {selectedStudent.rollNoAdmitted}
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
