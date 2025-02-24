import { Link, Outlet, Route, Routes } from "react-router";
import { Login } from "./Login";
import { Home } from "./Home";
import Signup from "../screens/Signup/index";
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
            </Route>
        </Routes>
    );
}

export function RootNavigationBar() {
    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                    border: "solid 1px black",
                    padding: "5px",
                }}
            >
                <Link to={"/"}>Home</Link>
                <Link to={"/login"}>Log in</Link>
                <Link to={"/signup"}>Sign Up</Link>
            </div>
            <Outlet />
        </div>
    );
}
