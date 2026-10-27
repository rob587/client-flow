import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
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

const TicketDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [messaggio, setMessaggio] = useState("");
    const [invio, setInvio] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        api.get(`/tickets/${id}`)
            .then((res) => setTicket(res.data))
            .catch(() => navigate("/tickets"))
            .finally(() => setLoading(false));
    }, [id]);

    const handleStatus = async (nuovoStatus) => {
        try {
            const res = await api.put(`/tickets/${id}`, {
                status: nuovoStatus,
            });
            setTicket((prev) => ({ ...prev, status: res.data.status }));
        } catch (err) {
            console.error(err);
        }
    };

    const handleMessage = async (e) => {
        e.preventDefault();
        if (!messaggio.trim()) return;
        setInvio(true);
        try {
            await api.post(`/tickets/${id}/messages`, {
                messaggio,
                user_id: user.id,
            });
            setMessaggio("");
            const res = await api.get(`/tickets/${id}`);
            setTicket(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setInvio(false);
        }
    };

    if (loading || !ticket)
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <p className="text-zinc-500 text-sm">Caricamento...</p>
            </div>
        );

    return (
        <>
            <div className="min-h-screen bg-zinc-950 flex">
                <Sidebar />

                <main className="flex-1 p-8 overflow-auto">
                    {/* Back */}
                    <button
                        onClick={() => navigate("/tickets")}
                        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm mb-6 transition-colors"
                    >
                        <ArrowLeft size={14} />
                        Torna ai ticket
                    </button>

                    <div className="max-w-3xl">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-zinc-500 text-xs">
                                        #{ticket.id}
                                    </span>
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-full border ${statusBadge[ticket.status]}`}
                                    >
                                        {ticket.status.replace("_", " ")}
                                    </span>
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-full border ${prioritaColor[ticket.priorita]}`}
                                    >
                                        {ticket.priorita}
                                    </span>
                                    {ticket.categoria && (
                                        <span className="text-xs px-2 py-0.5 rounded-full border border-zinc-700 text-zinc-400">
                                            {ticket.categoria}
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-2xl font-semibold text-zinc-100">
                                    {ticket.titolo}
                                </h2>
                                <p className="text-zinc-500 text-sm mt-1">
                                    {ticket.client?.nome} ·{" "}
                                    {ticket.client?.email}
                                </p>
                            </div>

                            <select
                                value={ticket.status}
                                onChange={(e) => handleStatus(e.target.value)}
                                className="bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            >
                                <option value="aperto">Aperto</option>
                                <option value="in_lavorazione">
                                    In lavorazione
                                </option>
                                <option value="chiuso">Chiuso</option>
                            </select>
                        </div>

                        {/* Descrizione */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6">
                            <p className="text-xs text-zinc-500 mb-2 font-medium">
                                Descrizione
                            </p>
                            <p className="text-zinc-300 text-sm leading-relaxed">
                                {ticket.descrizione}
                            </p>
                        </div>

                        {/* Messaggi */}
                        <div className="mb-4">
                            <p className="text-xs text-zinc-500 font-medium mb-3">
                                Messaggi ({ticket.messages?.length ?? 0})
                            </p>
                            {ticket.messages?.length === 0 ? (
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
                                    <p className="text-zinc-600 text-sm">
                                        Nessun messaggio ancora
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3 mb-4">
                                    {ticket.messages?.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400 text-xs font-semibold">
                                                        {msg.user?.name
                                                            ?.charAt(0)
                                                            .toUpperCase()}
                                                    </div>
                                                    <span className="text-xs font-medium text-zinc-300">
                                                        {msg.user?.name}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-zinc-600">
                                                    {new Date(
                                                        msg.created_at,
                                                    ).toLocaleString("it-IT")}
                                                </span>
                                            </div>
                                            <p className="text-zinc-300 text-sm leading-relaxed pl-8">
                                                {msg.messaggio}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Form messaggio */}
                        <form
                            onSubmit={handleMessage}
                            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
                        >
                            <textarea
                                value={messaggio}
                                onChange={(e) => setMessaggio(e.target.value)}
                                placeholder="Scrivi un messaggio..."
                                rows={3}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none mb-3"
                            />
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={invio || !messaggio.trim()}
                                    className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-900 text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    <Send size={13} />
                                    {invio ? "Invio..." : "Invia"}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </>
    );
};

export default TicketDetail;
