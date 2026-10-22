import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useEffect, useState } from "react";

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
                <aside className="w-60 bg-zinc-900 border-r border-zinc-800 flex flex-col">
                    <div className="px-6 py-5 border-b border-zinc-800">
                        <h1 className="text-lg font-semibold text-zinc-100">
                            Client<span className="text-amber-400">Flow</span>
                        </h1>
                    </div>

                    <nav className="flex-1 px-3 py-4 space-y-1">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="w-full text-left px-3 py-2 rounded-lg text-sm text-amber-400 bg-amber-400/10 font-medium"
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => navigate("/tickets")}
                            className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                        >
                            Ticket
                        </button>
                        <button
                            onClick={() => navigate("/clients")}
                            className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                        >
                            Clienti
                        </button>
                    </nav>

                    {/* User info */}
                    <div className="px-4 py-4 border-t border-zinc-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-zinc-100">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-zinc-500">
                                    {user?.role}
                                </p>
                            </div>
                            <button
                                onClick={logout}
                                className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
                            >
                                Esci
                            </button>
                        </div>
                    </div>
                </aside>

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
