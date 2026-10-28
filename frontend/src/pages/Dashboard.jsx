import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Ticket, Users, Clock, CheckCircle, ArrowUpRight } from "lucide-react";
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

                <div className="px-8 py-6 space-y-6">
                    {/* Stat cards */}
                    <div className="grid grid-cols-4 gap-3">
                        {cards.map(
                            ({ label, value, icon: Icon, color, ring, bg }) => (
                                <div
                                    key={label}
                                    className={`rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-5 ring-1 ${ring} backdrop-blur-sm`}
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

                    {/* Ticket recenti */}
                    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 overflow-hidden">
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
                                        Cliente
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
                                            colSpan={5}
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
                                            <td className="px-5 py-3.5 text-sm text-zinc-400">
                                                {ticket.client?.nome}
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
                </div>
            </main>
        </div>
    );
}
