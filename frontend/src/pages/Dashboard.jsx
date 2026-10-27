import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Ticket, Users, Clock, TrendingUp } from "lucide-react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";

const statCards = (stats) => [
    {
        label: "Ticket aperti",
        value: stats.aperti,
        icon: Ticket,
        color: "text-emerald-400",
        bg: "bg-emerald-400/10",
        border: "border-emerald-400/20",
    },
    {
        label: "In lavorazione",
        value: stats.inLavorazione,
        icon: Clock,
        color: "text-amber-400",
        bg: "bg-amber-400/10",
        border: "border-amber-400/20",
    },
    {
        label: "Clienti totali",
        value: stats.clienti,
        icon: Users,
        color: "text-blue-400",
        bg: "bg-blue-400/10",
        border: "border-blue-400/20",
    },
    {
        label: "Ticket chiusi",
        value: stats.chiusi,
        icon: TrendingUp,
        color: "text-zinc-400",
        bg: "bg-zinc-700/30",
        border: "border-zinc-700",
    },
];

const Dashboard = () => {
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

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const prioritaColor = {
        alta: "text-red-400",
        media: "text-amber-400",
        bassa: "text-zinc-500",
    };

    const statusBadge = {
        aperto: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
        in_lavorazione: "bg-amber-400/10 text-amber-400 border-amber-400/20",
        chiuso: "bg-zinc-700/50 text-zinc-400 border-zinc-700",
    };

    return (
        <>
            <div className="min-h-screen bg-zinc-950 flex">
                <Sidebar />

                <main className="flex-1 p-8 overflow-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-zinc-100">
                            Dashboard
                        </h2>
                        <p className="text-zinc-500 text-sm mt-1">
                            Bentornato, {user?.name} — ecco cosa sta succedendo
                        </p>
                    </div>

                    {/* Stat cards */}
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        {statCards(stats).map(
                            ({
                                label,
                                value,
                                icon: Icon,
                                color,
                                bg,
                                border,
                            }) => (
                                <div
                                    key={label}
                                    className={`bg-zinc-900 border ${border} rounded-xl p-5`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-zinc-500 text-sm">
                                            {label}
                                        </p>
                                        <div className={`${bg} p-2 rounded-lg`}>
                                            <Icon size={15} className={color} />
                                        </div>
                                    </div>
                                    <p
                                        className={`text-3xl font-bold ${color}`}
                                    >
                                        {value}
                                    </p>
                                </div>
                            ),
                        )}
                    </div>

                    {/* Ticket recenti */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-zinc-100 font-medium">
                                Ticket recenti
                            </h3>
                            <button
                                onClick={() => navigate("/tickets")}
                                className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
                            >
                                Vedi tutti →
                            </button>
                        </div>

                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                            {ticketsRecenti.length === 0 ? (
                                <p className="text-zinc-500 text-sm p-5">
                                    Nessun ticket
                                </p>
                            ) : (
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
                                                Status
                                            </th>
                                            <th className="text-left text-xs text-zinc-500 font-medium px-5 py-3">
                                                Priorità
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ticketsRecenti.map((ticket, i) => (
                                            <tr
                                                key={ticket.id}
                                                onClick={() =>
                                                    navigate(
                                                        `/tickets/${ticket.id}`,
                                                    )
                                                }
                                                className={`cursor-pointer hover:bg-zinc-800/50 transition-colors ${i < ticketsRecenti.length - 1 ? "border-b border-zinc-800" : ""}`}
                                            >
                                                <td className="px-5 py-3">
                                                    <span className="text-zinc-500 text-xs mr-2">
                                                        #{ticket.id}
                                                    </span>
                                                    <span className="text-zinc-100 text-sm">
                                                        {ticket.titolo}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3 text-zinc-400 text-sm">
                                                    {ticket.client?.nome}
                                                </td>
                                                <td className="px-5 py-3">
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
                                                    className={`px-5 py-3 text-sm font-medium ${prioritaColor[ticket.priorita]}`}
                                                >
                                                    {ticket.priorita}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Dashboard;
