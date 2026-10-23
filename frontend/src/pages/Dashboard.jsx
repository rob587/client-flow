import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const [stats, setStats] = useState({
        aperti: 0,
        inLavorazione: 0,
        clienti: 0,
    });

    useEffect(() => {
        Promise.all([api.get("/tickets"), api.get("/clients")])
            .then(([ticketsRes, clientsRes]) => {
                const tickets = ticketsRes.data;
                setStats({
                    aperti: tickets.filter((t) => t.status === "aperto").length,
                    inLavorazione: tickets.filter(
                        (t) => t.status === "in_lavorazione",
                    ).length,
                    clienti: clientsRes.data.length,
                });
            })
            .catch(() => navigate("/login"));
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <>
            <div className="min-h-screen bg-zinc-950 flex">
                {/* Sidebar */}
                <Sidebar />

                {/* Main content */}
                <main className="flex-1 p-8">
                    <h2 className="text-xl font-semibold text-zinc-100 mb-6">
                        Dashboard
                    </h2>

                    {/* Stats cards */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                            <p className="text-zinc-500 text-sm">
                                Ticket aperti
                            </p>
                            <p className="text-3xl font-bold text-zinc-100 mt-1">
                                {stats.aperti}
                            </p>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                            <p className="text-zinc-500 text-sm">
                                In lavorazione
                            </p>
                            <p className="text-3xl font-bold text-zinc-100 mt-1">
                                {stats.inLavorazione}
                            </p>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                            <p className="text-zinc-500 text-sm">
                                Clienti totali
                            </p>
                            <p className="text-3xl font-bold text-zinc-100 mt-1">
                                {stats.clienti}
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Dashboard;
