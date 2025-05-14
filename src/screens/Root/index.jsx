import { Routes, Route, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    FaHome,
    FaBook,
    FaSignInAlt,
    FaUserPlus,
    FaListAlt,
    FaClipboardList,
    FaChalkboardTeacher,
} from "react-icons/fa";

import { Login } from "../Login";
import { Home } from "../Home/index";
import Signup from "../Signup/index";
import { CourseDetail } from "../CourseDetail/index";
import { CourseList } from "../CourseList/index";
import QuizManagement from "../QuizManagement";
import QuizAttemptScreen from "../QuizAttempt/QuizAttemptScreen";
import { CoursesEnroll } from "../CoursesEnroll";
import ChapterDetail from "../ChapterDetail";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/Authentication";

export function RootPath() {
    return (
        <Routes>
            <Route
                path="/"
                element={<RootNavigationBar />}
            >
                <Route
                    index
                    element={<Home />}
                />
                <Route
                    path="login"
                    element={<Login />}
                />
                <Route
                    path="signup"
                    element={<Signup />}
                />
                <Route
                    path="chapter/:chapterId"
                    element={<ChapterDetail />}
                />
                <Route
                    path="quiz-attempt/:learningItemId"
                    element={<QuizAttemptScreen />}
                />
                <Route
                    path="quiz-management"
                    element={<QuizManagement />}
                />
                <Route
                    path="coursedetail"
                    element={<CourseDetail />}
                />
                <Route
                    path="courses"
                    element={<CourseList />}
                />
                <Route
                    path="coursesenroll"
                    element={<CoursesEnroll />}
                />
            </Route>
        </Routes>
    );
}

export function RootNavigationBar() {
    const { userRole } = useSelector((state) => state.authentication);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogout = () => {
        sessionStorage.removeItem("token");
        dispatch(logout());
        navigate("/");
    };
    return (
        <div style={{ width: "100vw", height: "100vh", display: "flex" }}>
            <div
                style={{
                    width: "240px",
                    backgroundColor: "#7462d1",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                    color: "white",
                }}
            >
                <h2 style={{ color: "white", marginBottom: "24px" }}>🎓 EduPlatform</h2>

                <NavLink
                    className={({ isActive }) => (isActive ? "navbut active" : "navbut")}
                    to="/"
                >
                    <FaHome style={{ marginRight: "8px" }} />
                    Home
                </NavLink>
                <NavLink
                    className={({ isActive }) => (isActive ? "navbut active" : "navbut")}
                    to="/courses"
                >
                    <FaBook style={{ marginRight: "8px" }} />
                    Discover
                </NavLink>
                <NavLink
                    className={({ isActive }) => (isActive ? "navbut active" : "navbut")}
                    to="/coursesenroll"
                >
                    <FaClipboardList style={{ marginRight: "8px" }} />
                    Course Enroll
                </NavLink>
                {userRole === "STUDENT" && (
                    <NavLink
                        className={({ isActive }) => (isActive ? "navbut active" : "navbut")}
                        to="/quiz"
                    >
                        <FaListAlt style={{ marginRight: "8px" }} />
                        Take Quiz
                    </NavLink>
                )}
                {userRole === "TEACHER" && (
                    <NavLink
                        className={({ isActive }) => (isActive ? "navbut active" : "navbut")}
                        to="/quiz-management"
                    >
                        <FaChalkboardTeacher style={{ marginRight: "8px" }} />
                        Quiz Management
                    </NavLink>
                )}
                <button
                    onClick={handleLogout}
                    className="logout-button"
                >
                    <FaSignInAlt style={{ marginRight: "8px" }} />
                    Logout
                </button>
            </div>

            <div style={{ flexGrow: 1, backgroundColor: "#f5f5f5", padding: "24px", overflowY: "auto" }}>
                <Outlet />
            </div>
        </div>
    );
}
