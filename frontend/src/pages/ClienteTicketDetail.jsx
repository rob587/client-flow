import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import api from "../api/axios";

const statusBadge = {
    aperto: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    in_lavorazione: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    chiuso: "bg-zinc-700/40 text-zinc-500 border-zinc-700/60",
};

const prioritaBadge = {
    alta: "bg-red-500/10 text-red-400 border-red-500/20",
    media: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    bassa: "bg-zinc-700/40 text-zinc-500 border-zinc-700/60",
};

const ClienteTicketDetail = () => {
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
            .catch(() => navigate("/miei-ticket"))
            .finally(() => setLoading(false));
    }, [id]);

    const handleMessaggio = async (e) => {
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
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <p className="text-zinc-600 text-sm">Caricamento...</p>
            </div>
        );

    return (
        <>
            <div className="min-h-screen bg-[#0a0a0a]">
                {/* Header */}
                <header className="border-b border-zinc-800/80 px-8 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate("/miei-ticket")}
                        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-xs transition-colors"
                    >
                        <ArrowLeft size={13} />
                        Torna alle richieste
                    </button>
                    <div className="text-right">
                        <p className="text-xs font-medium text-zinc-300">
                            {user?.name}
                        </p>
                        <p className="text-[11px] text-zinc-600">Cliente</p>
                    </div>
                </header>

                <div className="max-w-3xl mx-auto px-8 py-8 space-y-5">
                    {/* Header ticket */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[11px] text-zinc-600 font-mono">
                                #{ticket.id}
                            </span>
                            <span
                                className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${statusBadge[ticket.status]}`}
                            >
                                {ticket.status.replace("_", " ")}
                            </span>
                            <span
                                className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${prioritaBadge[ticket.priorita]}`}
                            >
                                {ticket.priorita}
                            </span>
                            {ticket.categoria && (
                                <span className="text-[11px] px-2 py-0.5 rounded-md border border-zinc-700/60 text-zinc-400 bg-zinc-800/40">
                                    {ticket.categoria}
                                </span>
                            )}
                        </div>
                        <h1 className="text-xl font-semibold text-zinc-100">
                            {ticket.titolo}
                        </h1>
                        <p className="text-xs text-zinc-500 mt-1">
                            Aperto il{" "}
                            {new Date(ticket.created_at).toLocaleDateString(
                                "it-IT",
                            )}
                        </p>
                    </div>

                    {/* Descrizione */}
                    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-5">
                        <p className="text-[11px] text-zinc-600 uppercase tracking-wide font-medium mb-3">
                            Descrizione
                        </p>
                        <p className="text-sm text-zinc-300 leading-relaxed">
                            {ticket.descrizione}
                        </p>
                    </div>

                    {/* Messaggi */}
                    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 overflow-hidden">
                        <div className="px-5 py-4 border-b border-zinc-800/80">
                            <h2 className="text-sm font-medium text-zinc-100">
                                Conversazione
                                <span className="ml-2 text-xs text-zinc-600">
                                    ({ticket.messages?.length ?? 0})
                                </span>
                            </h2>
                        </div>

                        <div className="divide-y divide-zinc-800/60">
                            {ticket.messages?.length === 0 ? (
                                <div className="px-5 py-8 text-center">
                                    <p className="text-zinc-600 text-sm">
                                        Nessun messaggio ancora
                                    </p>
                                    <p className="text-zinc-700 text-xs mt-1">
                                        Il team ti risponderà a breve
                                    </p>
                                </div>
                            ) : (
                                ticket.messages?.map((msg) => (
                                    <div key={msg.id} className="px-5 py-4">
                                        <div className="flex items-center justify-between mb-2.5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-amber-400/15 flex items-center justify-center text-amber-400 text-[11px] font-semibold">
                                                    {msg.user?.name
                                                        ?.charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                                <span className="text-xs font-medium text-zinc-300">
                                                    {msg.user?.name}
                                                </span>
                                            </div>
                                            <span className="text-[11px] text-zinc-600">
                                                {new Date(
                                                    msg.created_at,
                                                ).toLocaleString("it-IT")}
                                            </span>
                                        </div>
                                        <p className="text-sm text-zinc-400 leading-relaxed pl-8">
                                            {msg.messaggio}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Form messaggio */}
                        <div className="border-t border-zinc-800/80 p-5">
                            <form onSubmit={handleMessaggio}>
                                <textarea
                                    value={messaggio}
                                    onChange={(e) =>
                                        setMessaggio(e.target.value)
                                    }
                                    placeholder="Scrivi un messaggio al team di supporto..."
                                    rows={3}
                                    className="w-full bg-zinc-800/50 border border-zinc-700/80 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-amber-400/50 resize-none mb-3"
                                />
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={invio || !messaggio.trim()}
                                        className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-900 text-xs font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-40"
                                    >
                                        <Send size={12} />
                                        {invio ? "Invio..." : "Invia"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ClienteTicketDetail;
