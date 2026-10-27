import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";

const statusBadge = {
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
    const [filtrati, setFiltrati] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("tutti");
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/tickets")
            .then((res) => {
                setTickets(res.data);
                setFiltrati(res.data);
            })
            .catch(() => navigate("/login"))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        let risultati = tickets;
        if (filtroStatus !== "tutti") {
            risultati = risultati.filter((t) => t.status === filtroStatus);
        }
        if (search.trim()) {
            risultati = risultati.filter(
                (t) =>
                    t.titolo.toLowerCase().includes(search.toLowerCase()) ||
                    t.client?.nome.toLowerCase().includes(search.toLowerCase()),
            );
        }
        setFiltrati(risultati);
    }, [search, filtroStatus, tickets]);

    return (
        <>
            <div className="min-h-screen bg-zinc-950 flex">
                <Sidebar />

                <main className="flex-1 p-8 overflow-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-semibold text-zinc-100">
                                Ticket
                            </h2>
                            <p className="text-zinc-500 text-sm mt-1">
                                {tickets.length} ticket totali
                            </p>
                        </div>
                    </div>

                    {/* Filtri */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="relative flex-1 max-w-sm">
                            <Search
                                size={14}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                            />
                            <input
                                type="text"
                                placeholder="Cerca ticket o cliente..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            />
                        </div>
                        <div className="flex gap-2">
                            {[
                                "tutti",
                                "aperto",
                                "in_lavorazione",
                                "chiuso",
                            ].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setFiltroStatus(s)}
                                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                                        filtroStatus === s
                                            ? "bg-amber-400/10 text-amber-400 border border-amber-400/20"
                                            : "text-zinc-400 hover:text-zinc-100 border border-zinc-800 hover:border-zinc-700"
                                    }`}
                                >
                                    {s.replace("_", " ")}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Lista */}
                    {loading ? (
                        <p className="text-zinc-500 text-sm">Caricamento...</p>
                    ) : filtrati.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-zinc-500 text-sm">
                                Nessun ticket trovato
                            </p>
                        </div>
                    ) : (
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-zinc-800">
                                        <th className="text-left text-xs text-zinc-500 font-medium px-5 py-3">
                                            Ticket
                                        </th>
                                        <th className="text-left text-xs text-zinc-500 font-medium px-5 py-3">
                                            Cliente
                                        </th>
                                        <th className="text-left text-xs text-zinc-500 font-medium px-5 py-3">
                                            Categoria
                                        </th>
                                        <th className="text-left text-xs text-zinc-500 font-medium px-5 py-3">
                                            Status
                                        </th>
                                        <th className="text-left text-xs text-zinc-500 font-medium px-5 py-3">
                                            Priorità
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtrati.map((ticket, i) => (
                                        <tr
                                            key={ticket.id}
                                            onClick={() =>
                                                navigate(
                                                    `/tickets/${ticket.id}`,
                                                )
                                            }
                                            className={`cursor-pointer hover:bg-zinc-800/50 transition-colors ${
                                                i < filtrati.length - 1
                                                    ? "border-b border-zinc-800"
                                                    : ""
                                            }`}
                                        >
                                            <td className="px-5 py-3.5">
                                                <span className="text-zinc-500 text-xs mr-2">
                                                    #{ticket.id}
                                                </span>
                                                <span className="text-zinc-100 text-sm font-medium">
                                                    {ticket.titolo}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-zinc-400 text-sm">
                                                {ticket.client?.nome}
                                            </td>
                                            <td className="px-5 py-3.5 text-zinc-400 text-sm">
                                                {ticket.categoria ?? "—"}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span
                                                    className={`text-xs px-2 py-0.5 rounded-full border ${statusBadge[ticket.status]}`}
                                                >
                                                    {ticket.status.replace(
                                                        "_",
                                                        " ",
                                                    )}
                                                </span>
                                            </td>
                                            <td
                                                className={`px-5 py-3.5 text-sm font-medium ${prioritaColor[ticket.priorita]}`}
                                            >
                                                {ticket.priorita}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
};

export default Tickets;
