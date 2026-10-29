import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import Clients from "./pages/Clients";
import TicketDetail from "./pages/TicketDetail";
// import ClienteDashboard from "./pages/ClienteDashboard";

function App() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user?.role === "admin" || user?.role === "operatore";
    const isCliente = user?.role === "cliente";

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
                path="/dashboard"
                element={
                    token && isAdmin ? <Dashboard /> : <Navigate to="/login" />
                }
            />
            <Route
                path="/tickets"
                element={
                    token && isAdmin ? <Tickets /> : <Navigate to="/login" />
                }
            />
            <Route
                path="/tickets/:id"
                element={
                    token && isAdmin ? (
                        <TicketDetail />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
            <Route
                path="/clients"
                element={
                    token && isAdmin ? <Clients /> : <Navigate to="/login" />
                }
            />

            <Route
                path="/miei-ticket"
                element={
                    token && isCliente ? (
                        <ClienteDashboard />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />

            <Route
                path="*"
                element={
                    !token ? (
                        <Navigate to="/login" />
                    ) : isAdmin ? (
                        <Navigate to="/dashboard" />
                    ) : (
                        <Navigate to="/miei-ticket" />
                    )
                }
            />
        </Routes>
    );
}

export default App;
