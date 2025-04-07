import { Link, Outlet, Route, Routes } from "react-router";
import { Login } from "./Login";
import { Home } from "./Home";
import Signup from "../screens/Signup/index";
import { CourseDetail } from "./CourseDetail";
import "./style.css";
import { CoursesList } from "./CoursesList";
import { CoursesEnroll } from "./CoursesEnroll";
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
                <Route path="coursedetail" element={<CourseDetail />} />
                <Route path="courses" element={<CoursesList />} />
                <Route path="coursesenroll" element={<CoursesEnroll />} />
            </Route>
        </Routes>
    );
}

export function RootNavigationBar() {
    return (
        <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "row" }}>
            <div
                style={{
                    width: "200px",
                    height: "100vh",
                    backgroundColor: "#7462d1",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                    paddingTop: "20px",
                    gap: "5px",
                }}
            >
                <Link
                    className="navbut"
                    to={"/"}
                >
                    Home
                </Link>
                <Link className="navbut" to={"/login"}>Log in</Link>
                <Link className="navbut" to={"/signup"}>Sign Up</Link>
                <Link className="navbut" to={"/courses"}>Discover</Link>
                <Link className="navbut" to={"/coursesenroll"}>Course Enroll</Link>
                <Link className="navbut" to={"/coursedetail"}>Course Detail</Link>
            </div>
            <div style={{ flexGrow: 1 }}>
                {/* <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "10px",
                        padding: "10px",
                    }}
                >
                    <Link to={"/"}>Home</Link>
                    <Link to={"/login"}>Log in</Link>
                    <Link to={"/signup"}>Sign Up</Link>
                    <Link to={"/coursedetail"}>Course Detail</Link>
                </div> */}
                <Outlet />
            </div>
        </div>
    );
}
