import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const statusColor = {
    aperto: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
    in_lavorazione: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    chiuso: "bg-zinc-700/50 text-zinc-400 border-zinc-700",
};

const prioritaColor = {
    alta: "text-red-400",
    media: "text-amber-400",
    bassa: "text-zinc-400",
};

const Tickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/tickets")
            .then((res) => setTickets(res.data))
            .catch(() => navigate("/login"))
            .finally(() => setLoading(false));
    }, []);

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
                            className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => navigate("/tickets")}
                            className="w-full text-left px-3 py-2 rounded-lg text-sm text-amber-400 bg-amber-400/10 font-medium"
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
                    <div className="px-4 py-4 border-t border-zinc-800">
                        <button
                            onClick={() => {
                                localStorage.clear();
                                navigate("/login");
                            }}
                            className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
                        >
                            Esci
                        </button>
                    </div>
                </aside>

                {/* Main */}
                <main className="flex-1 p-8">
                    <h2 className="text-xl font-semibold text-zinc-100 mb-6">
                        Ticket
                    </h2>

                    {loading ? (
                        <p className="text-zinc-500 text-sm">Caricamento...</p>
                    ) : tickets.length === 0 ? (
                        <p className="text-zinc-500 text-sm">
                            Nessun ticket trovato
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {tickets.map((ticket) => (
                                <div
                                    key={ticket.id}
                                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-start justify-between"
                                >
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-zinc-500 text-xs">
                                                #{ticket.id}
                                            </span>
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-full border ${statusColor[ticket.status]}`}
                                            >
                                                {ticket.status.replace(
                                                    "_",
                                                    " ",
                                                )}
                                            </span>
                                        </div>
                                        <h3 className="text-zinc-100 font-medium">
                                            {ticket.titolo}
                                        </h3>
                                        <p className="text-zinc-500 text-sm mt-1">
                                            {ticket.client?.nome} —{" "}
                                            {ticket.categoria ??
                                                "nessuna categoria"}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p
                                            className={`text-sm font-medium ${prioritaColor[ticket.priorita]}`}
                                        >
                                            {ticket.priorita}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
};

export default Tickets;
