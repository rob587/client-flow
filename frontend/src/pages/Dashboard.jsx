import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Ticket,
    Users,
    Clock,
    CheckCircle,
    ArrowUpRight,
    MessageSquare,
} from "lucide-react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";

const prioritaColor = {
    alta: "text-red-400",
    media: "text-amber-400",
    bassa: "text-zinc-500",
};

const statusBadge = {
    aperto: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    in_lavorazione: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    chiuso: "bg-zinc-700/40 text-zinc-500 border-zinc-700/60",
};

const categoriaColor = {
    tecnico: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    fatturazione: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    accesso: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    generale: "bg-zinc-700/40 text-zinc-400 border-zinc-700/60",
};

export default function Dashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const [stats, setStats] = useState({
        aperti: 0,
        inLavorazione: 0,
        clienti: 0,
        chiusi: 0,
    });
    const [ticketsRecenti, setTicketsRecenti] = useState([]);
    const [categorie, setCategorie] = useState([]);

    useEffect(() => {
        Promise.all([api.get("/tickets"), api.get("/clients")])
            .then(([ticketsRes, clientsRes]) => {
                const tickets = ticketsRes.data;
                setStats({
                    aperti: tickets.filter((t) => t.status === "aperto").length,
                    inLavorazione: tickets.filter(
                        (t) => t.status === "in_lavorazione",
                    ).length,
                    chiusi: tickets.filter((t) => t.status === "chiuso").length,
                    clienti: clientsRes.data.length,
                });
                setTicketsRecenti(tickets.slice(0, 5));

                // Raggruppa per categoria
                const catCount = {};
                tickets.forEach((t) => {
                    const cat = t.categoria ?? "generale";
                    catCount[cat] = (catCount[cat] || 0) + 1;
                });
                setCategorie(
                    Object.entries(catCount).map(([nome, count]) => ({
                        nome,
                        count,
                    })),
                );
            })
            .catch(() => navigate("/login"));
    }, []);

    const cards = [
        {
            label: "Ticket aperti",
            value: stats.aperti,
            icon: Ticket,
            color: "text-emerald-400",
            ring: "ring-emerald-500/20",
            bg: "bg-emerald-500/10",
        },
        {
            label: "In lavorazione",
            value: stats.inLavorazione,
            icon: Clock,
            color: "text-amber-400",
            ring: "ring-amber-500/20",
            bg: "bg-amber-500/10",
        },
        {
            label: "Clienti totali",
            value: stats.clienti,
            icon: Users,
            color: "text-blue-400",
            ring: "ring-blue-500/20",
            bg: "bg-blue-500/10",
        },
        {
            label: "Ticket chiusi",
            value: stats.chiusi,
            icon: CheckCircle,
            color: "text-zinc-400",
            ring: "ring-zinc-700",
            bg: "bg-zinc-800",
        },
    ];

    const totaleTicket = ticketsRecenti.length || 1;

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex">
            <Sidebar />

            <main className="flex-1 overflow-auto">
                {/* Top bar */}
                <div className="border-b border-zinc-800/80 px-8 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-base font-semibold text-zinc-100">
                            Dashboard
                        </h1>
                        <p className="text-xs text-zinc-500 mt-0.5">
                            Bentornato, {user?.name}
                        </p>
                    </div>
                    <div className="text-xs text-zinc-600">
                        {new Date().toLocaleDateString("it-IT", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                        })}
                    </div>
                </div>

                <div className="px-8 py-6 space-y-5">
                    {/* Stat cards */}
                    <div className="grid grid-cols-4 gap-3">
                        {cards.map(
                            ({ label, value, icon: Icon, color, ring, bg }) => (
                                <div
                                    key={label}
                                    className={`rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-5 ring-1 ${ring}`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs text-zinc-500 font-medium">
                                            {label}
                                        </span>
                                        <div
                                            className={`${bg} p-1.5 rounded-lg`}
                                        >
                                            <Icon size={13} className={color} />
                                        </div>
                                    </div>
                                    <p
                                        className={`text-3xl font-semibold tracking-tight ${color}`}
                                    >
                                        {value}
                                    </p>
                                </div>
                            ),
                        )}
                    </div>

                    {/* Ticket recenti + Categorie */}
                    <div className="grid grid-cols-3 gap-5">
                        {/* Ticket recenti — 2/3 */}
                        <div className="col-span-2 rounded-xl border border-zinc-800/80 bg-zinc-900/50 overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/80">
                                <h2 className="text-sm font-medium text-zinc-100">
                                    Ticket recenti
                                </h2>
                                <button
                                    onClick={() => navigate("/tickets")}
                                    className="flex items-center gap-1 text-xs text-zinc-500 hover:text-amber-400 transition-colors"
                                >
                                    Vedi tutti <ArrowUpRight size={12} />
                                </button>
                            </div>
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-zinc-800/60">
                                        <th className="text-left text-[11px] font-medium text-zinc-600 px-5 py-3 uppercase tracking-wide">
                                            Ticket
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
                                    {ticketsRecenti.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-5 py-8 text-center text-zinc-600 text-sm"
                                            >
                                                Nessun ticket
                                            </td>
                                        </tr>
                                    ) : (
                                        ticketsRecenti.map((ticket) => (
                                            <tr
                                                key={ticket.id}
                                                onClick={() =>
                                                    navigate(
                                                        `/tickets/${ticket.id}`,
                                                    )
                                                }
                                                className="cursor-pointer hover:bg-zinc-800/30 transition-colors group"
                                            >
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-2.5">
                                                        <span className="text-[11px] text-zinc-600 font-mono">
                                                            #{ticket.id}
                                                        </span>
                                                        <span className="text-sm text-zinc-200 font-medium group-hover:text-white transition-colors">
                                                            {ticket.titolo}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span
                                                        className={`inline-flex items-center text-[11px] px-2 py-0.5 rounded-md border font-medium ${statusBadge[ticket.status]}`}
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
                                                <td className="px-5 py-3.5">
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

                        {/* Categorie — 1/3 */}
                        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 overflow-hidden">
                            <div className="px-5 py-4 border-b border-zinc-800/80">
                                <h2 className="text-sm font-medium text-zinc-100">
                                    Per categoria
                                </h2>
                            </div>
                            <div className="p-5 space-y-4">
                                {categorie.length === 0 ? (
                                    <p className="text-zinc-600 text-sm">
                                        Nessun dato
                                    </p>
                                ) : (
                                    categorie.map(({ nome, count }) => (
                                        <div key={nome}>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span
                                                    className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${categoriaColor[nome] ?? "bg-zinc-700/40 text-zinc-400 border-zinc-700/60"}`}
                                                >
                                                    {nome}
                                                </span>
                                                <span className="text-xs text-zinc-500">
                                                    {count}
                                                </span>
                                            </div>
                                            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-amber-400/60 rounded-full transition-all"
                                                    style={{
                                                        width: `${(count / totaleTicket) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Distribuzione status */}
                            <div className="px-5 pb-5 pt-2 border-t border-zinc-800/80 mt-2">
                                <p className="text-xs text-zinc-500 mb-3 font-medium">
                                    Distribuzione status
                                </p>
                                <div className="space-y-2">
                                    {[
                                        {
                                            label: "Aperti",
                                            value: stats.aperti,
                                            color: "bg-emerald-500",
                                        },
                                        {
                                            label: "In lavorazione",
                                            value: stats.inLavorazione,
                                            color: "bg-amber-500",
                                        },
                                        {
                                            label: "Chiusi",
                                            value: stats.chiusi,
                                            color: "bg-zinc-600",
                                        },
                                    ].map(({ label, value, color }) => (
                                        <div
                                            key={label}
                                            className="flex items-center gap-3"
                                        >
                                            <div
                                                className={`w-2 h-2 rounded-full ${color}`}
                                            />
                                            <span className="text-xs text-zinc-400 flex-1">
                                                {label}
                                            </span>
                                            <span className="text-xs text-zinc-500">
                                                {value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
