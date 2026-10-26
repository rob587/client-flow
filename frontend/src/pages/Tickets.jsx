import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";

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
                <Sidebar />

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
                                    onClick={() =>
                                        navigate(`/tickets/${ticket.id}`)
                                    }
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
