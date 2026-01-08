import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { MainLayout } from "./components/MainLayout";
import AddStudent from "./pages/register/AddStudent";
import StudentInformation from "./pages/register/StudentInformation";
import StudentPromotion from "./pages/register/StudentPromotion";
import StudentTransfer from "./pages/register/StudentTransfer";
import ParentInformation from "./pages/register/ParentInformation";
import StudentAccount from "./pages/accounts/StudentAccount";
import StudentFeeAssign from "./pages/accounts/StudentFeeAssign";
import FeeCollection from "./pages/accounts/FeeCollection";
import AddStaff from "./pages/staffmanagement/AddStaff";
import StaffCourse from "./pages/staffmanagement/StaffCourse";
import PublicMessage from "./pages/PublicMessage";
import TakeAttendance from "./pages/TakeAttendence";
import Room from "./pages/timetable/Room";
import TimeTable from "./pages/timetable/TimeTable";
import ExamType from "./pages/examination/ExamType";
import Chapter from "./pages/examination/Chapter";
import Question from "./pages/examination/Question";
import AddExam from "./pages/examination/AddExam";
import Programs from "./pages/sessionplanning/Programs";
import Departments from "./pages/sessionplanning/Departments";
import Classes from "./pages/sessionplanning/Classes";
import ClassYear from "./pages/sessionplanning/ClassYear";
import Sections from "./pages/sessionplanning/Sections";
import Course from "./pages/sessionplanning/Course";
import StudentCategory from "./pages/registrationsetup/StudentCategory";
import EnrollmentChecklist from "./pages/registrationsetup/EnrollmentChecklist";
import FeeBank from "./pages/accountsetup/FeeBank";
import FeeDuration from "./pages/accountsetup/FeeDuration";
import FeeDetails from "./pages/accountsetup/FeeDetails";
import FeePolicy from "./pages/accountsetup/FeePolicy";
import AdmissionYear from "./pages/AdmissionReports/AdmissionYear";
import SectionsReport from "./pages/AdmissionReports/SectionsReport";
import Gender from "./pages/AdmissionReports/Gender";
import Category from "./pages/AdmissionReports/Category";
import Birthday from "./pages/AdmissionReports/Birthday";
import Payable from "./pages/AccountReports/Payable";
import Paid from "./pages/AccountReports/Paid";
import PrivateRoute from "./components/PrivateRoute";
import { Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { PrintModalProvider } from "./components/PrintModalContext"; // <-- import context

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("userId"));
  const [isToken, setIsToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
    } else {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          setIsLoggedIn(false);
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
        } else {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Invalid token", error);
        setIsLoggedIn(false);
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
      }
    }

    const sessionTimeout = setTimeout(() => {
      localStorage.clear();
      setIsLoggedIn(false);
      window.location.href = "/";
    }, 3600000);

    return () => clearTimeout(sessionTimeout);
  }, [isToken]);

  return (
    <>
      <Toaster position="top-center" />
      <PrintModalProvider>
        <BrowserRouter>
          <Routes>
            {/* Public route without layout */}
            <Route path="/" element={<Login />} />

            {/* Protected routes with layout */}
            <Route
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/add-student" element={<AddStudent />} />
              <Route path="/student-information" element={<StudentInformation />} />
              <Route path="/student-promotion" element={<StudentPromotion />} />
              <Route path="/student-transfer" element={<StudentTransfer />} />
              <Route path="/parent-information" element={<ParentInformation />} />

              <Route path="/student-account" element={<StudentAccount />} />
              <Route path="/fee-assign" element={<StudentFeeAssign />} />
              <Route path="/fee-collection" element={<FeeCollection />} />

              <Route path="/add-staff" element={<AddStaff />} />
              <Route path="/staff-course" element={<StaffCourse />} />

              <Route path="/public-message" element={<PublicMessage />} />

              <Route path="/take-attendence" element={<TakeAttendance />} />

              <Route path="/room" element={<Room />} />
              <Route path="/time-table" element={<TimeTable />} />

              <Route path="/exam-type" element={<ExamType />} />
              <Route path="/chapter" element={<Chapter />} />
              <Route path="/question" element={<Question />} />
              <Route path="/add-exam" element={<AddExam />} />

              <Route path="/programs" element={<Programs />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/classes" element={<Classes />} />
              <Route path="/class-year" element={<ClassYear />} />
              <Route path="/sections" element={<Sections />} />
              <Route path="/course" element={<Course />} />

              <Route path="/student-category" element={<StudentCategory />} />
              <Route path="/enrollment-checklist" element={<EnrollmentChecklist />} />

              <Route path="/fee-bank" element={<FeeBank />} />
              <Route path="/fee-duration" element={<FeeDuration />} />
              <Route path="/fee-details" element={<FeeDetails />} />
              <Route path="/fee-policy" element={<FeePolicy />} />

              <Route path="/admission-year" element={<AdmissionYear />} />
              <Route path="/sections-report" element={<SectionsReport />} />
              <Route path="/gender" element={<Gender />} />
              <Route path="/category" element={<Category />} />
              <Route path="/birthday" element={<Birthday />} />

              <Route path="/payable" element={<Payable />} />
              <Route path="/paid" element={<Paid />} />

              {/* Add more routes here, they will all use the same layout */}
            </Route>
          </Routes>
        </BrowserRouter>
      </PrintModalProvider>
    </>
  );
};

export default App;