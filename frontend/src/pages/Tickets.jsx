import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowUpRight, SlidersHorizontal } from "lucide-react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";

const statusBadge = {
    aperto: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    in_lavorazione: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    chiuso: "bg-zinc-700/40 text-zinc-500 border-zinc-700/60",
};

const prioritaColor = {
    alta: "text-red-400",
    media: "text-amber-400",
    bassa: "text-zinc-500",
};

const prioritaDot = {
    alta: "bg-red-400",
    media: "bg-amber-400",
    bassa: "bg-zinc-500",
};

export default function Tickets() {
    const [tickets, setTickets] = useState([]);
    const [filtrati, setFiltrati] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("tutti");
    const [showForm, setShowForm] = useState(false);
    const [clients, setClients] = useState([]);
    const [form, setForm] = useState({
        client_id: "",
        titolo: "",
        descrizione: "",
    });
    const [errore, setErrore] = useState("");
    const [creating, setCreating] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([api.get("/tickets"), api.get("/clients")])
            .then(([ticketsRes, clientsRes]) => {
                setTickets(ticketsRes.data);
                setFiltrati(ticketsRes.data);
                setClients(clientsRes.data);
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

    const filtri = [
        { value: "tutti", label: "Tutti", count: tickets.length },
        {
            value: "aperto",
            label: "Aperti",
            count: tickets.filter((t) => t.status === "aperto").length,
        },
        {
            value: "in_lavorazione",
            label: "In lavorazione",
            count: tickets.filter((t) => t.status === "in_lavorazione").length,
        },
        {
            value: "chiuso",
            label: "Chiusi",
            count: tickets.filter((t) => t.status === "chiuso").length,
        },
    ];

    const handleCrea = async (e) => {
        e.preventDefault();
        setErrore("");
        setCreating(true);
        try {
            await api.post("/tickets", form);
            setForm({ client_id: "", titolo: "", descrizione: "" });
            setShowForm(false);
            // ricarica i ticket
            const res = await api.get("/tickets");
            setTickets(res.data);
            setFiltrati(res.data);
        } catch (err) {
            setErrore(
                err.response?.data?.message ?? "Errore durante la creazione",
            );
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex">
            <Sidebar />

            <main className="flex-1 overflow-auto">
                {/* Top bar */}
                <div className="border-b border-zinc-800/80 px-8 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-base font-semibold text-zinc-100">
                            Ticket
                        </h1>
                        <p className="text-xs text-zinc-500 mt-0.5">
                            {tickets.length} ticket totali
                        </p>
                    </div>
                </div>

                <div className="px-8 py-6 space-y-4">
                    {/* Filtri + Ricerca */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-1 bg-zinc-900/50 border border-zinc-800/80 rounded-lg p-1">
                            {filtri.map(({ value, label, count }) => (
                                <button
                                    key={value}
                                    onClick={() => setFiltroStatus(value)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                                        filtroStatus === value
                                            ? "bg-zinc-800 text-zinc-100 shadow-sm"
                                            : "text-zinc-500 hover:text-zinc-300"
                                    }`}
                                >
                                    {label}
                                    <span
                                        className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                            filtroStatus === value
                                                ? "bg-zinc-700 text-zinc-300"
                                                : "bg-zinc-800 text-zinc-600"
                                        }`}
                                    >
                                        {count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="relative">
                            <Search
                                size={13}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                            />
                            <input
                                type="text"
                                placeholder="Cerca ticket o cliente..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-8 pr-4 py-2 bg-zinc-900/50 border border-zinc-800/80 rounded-lg text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-400/50 focus:border-amber-400/50 w-64"
                            />
                        </div>
                    </div>

                    {/* Tabella */}
                    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-zinc-800/60">
                                    <th className="text-left text-[11px] font-medium text-zinc-600 px-5 py-3 uppercase tracking-wide">
                                        Ticket
                                    </th>
                                    <th className="text-left text-[11px] font-medium text-zinc-600 px-5 py-3 uppercase tracking-wide">
                                        Cliente
                                    </th>
                                    <th className="text-left text-[11px] font-medium text-zinc-600 px-5 py-3 uppercase tracking-wide">
                                        Categoria
                                    </th>
                                    <th className="text-left text-[11px] font-medium text-zinc-600 px-5 py-3 uppercase tracking-wide">
                                        Status
                                    </th>
                                    <th className="text-left text-[11px] font-medium text-zinc-600 px-5 py-3 uppercase tracking-wide">
                                        Priorità
                                    </th>
                                    <th className="px-5 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/60">
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-5 py-10 text-center text-zinc-600 text-sm"
                                        >
                                            Caricamento...
                                        </td>
                                    </tr>
                                ) : filtrati.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-5 py-10 text-center"
                                        >
                                            <p className="text-zinc-500 text-sm">
                                                Nessun ticket trovato
                                            </p>
                                            <p className="text-zinc-700 text-xs mt-1">
                                                Prova a cambiare i filtri
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    filtrati.map((ticket) => (
                                        <tr
                                            key={ticket.id}
                                            onClick={() =>
                                                navigate(
                                                    `/tickets/${ticket.id}`,
                                                )
                                            }
                                            className="cursor-pointer hover:bg-zinc-800/30 transition-colors group"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2.5">
                                                    <span className="text-[11px] text-zinc-600 font-mono w-6">
                                                        #{ticket.id}
                                                    </span>
                                                    <span className="text-sm text-zinc-200 font-medium group-hover:text-white transition-colors">
                                                        {ticket.titolo}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-zinc-400 whitespace-nowrap">
                                                {ticket.client?.nome}
                                            </td>
                                            <td className="px-5 py-4">
                                                {ticket.categoria ? (
                                                    <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-md">
                                                        {ticket.categoria}
                                                    </span>
                                                ) : (
                                                    <span className="text-zinc-700 text-xs">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex items-center text-[11px] px-2 py-0.5 rounded-md border font-medium ${statusBadge[ticket.status]}`}
                                                >
                                                    {ticket.status.replace(
                                                        "_",
                                                        " ",
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className={`w-1.5 h-1.5 rounded-full ${prioritaDot[ticket.priorita]}`}
                                                    />
                                                    <span
                                                        className={`text-sm font-medium ${prioritaColor[ticket.priorita]}`}
                                                    >
                                                        {ticket.priorita}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <ArrowUpRight
                                                    size={13}
                                                    className="text-zinc-700 group-hover:text-zinc-400 transition-colors ml-auto"
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
