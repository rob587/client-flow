import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import Clients from "./pages/Clients";

function App() {
    const token = localStorage.getItem("token");

    return (
        <>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/dashboard"
                    element={token ? <Dashboard /> : <Navigate to="/login" />}
                />
                <Route
                    path="/tickets"
                    element={token ? <Tickets /> : <Navigate to="/login" />}
                />
                <Route
                    path="*"
                    element={<Navigate to={token ? "/dashboard" : "/login"} />}
                />
                <Route
                    path="/clients"
                    element={token ? <Clients /> : <Navigate to="/login" />}
                />
            </Routes>
        </>
    );
}

export default App;
