import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, LogOut, ArrowUpRight } from "lucide-react";
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

const ClienteDashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ titolo: "", descrizione: "" });
    const [errore, setErrore] = useState("");
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = () => {
        api.get("/miei-ticket")
            .then((res) => setTickets(res.data))
            .catch(() => navigate("/login"))
            .finally(() => setLoading(false));
    };

    const handleCrea = async (e) => {
        e.preventDefault();
        setErrore("");
        setCreating(true);
        try {
            await api.post("/miei-ticket", form);
            setForm({ titolo: "", descrizione: "" });
            setShowForm(false);
            fetchTickets();
        } catch (err) {
            setErrore(
                err.response?.data?.message ?? "Errore durante la creazione",
            );
        } finally {
            setCreating(false);
        }
    };

    const logout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            {/* Header */}
            <header className="border-b border-zinc-800/80 px-8 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-base font-semibold text-zinc-100">
                        Client<span className="text-amber-400">Flow</span>
                    </h1>
                    <p className="text-xs text-zinc-500 mt-0.5">
                        Portale clienti
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-xs font-medium text-zinc-300">
                            {user?.name}
                        </p>
                        <p className="text-[11px] text-zinc-600">Cliente</p>
                    </div>
                    <button
                        onClick={logout}
                        className="text-zinc-600 hover:text-red-400 transition-colors"
                        title="Esci"
                    >
                        <LogOut size={15} />
                    </button>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-8 py-8 space-y-6">
                {/* Benvenuto */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-zinc-100">
                            I tuoi ticket
                        </h2>
                        <p className="text-xs text-zinc-500 mt-0.5">
                            {tickets.length} richieste totali
                        </p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-900 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                    >
                        <Plus size={13} />
                        Nuova richiesta
                    </button>
                </div>

                {/* Form nuova richiesta */}
                {showForm && (
                    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 overflow-hidden">
                        <div className="px-5 py-4 border-b border-zinc-800/80">
                            <h3 className="text-sm font-medium text-zinc-100">
                                Nuova richiesta di supporto
                            </h3>
                            <p className="text-xs text-zinc-500 mt-0.5">
                                Il nostro team ti risponderà il prima possibile
                            </p>
                        </div>
                        <form onSubmit={handleCrea} className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs text-zinc-500 mb-1.5">
                                    Oggetto *
                                </label>
                                <input
                                    type="text"
                                    value={form.titolo}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            titolo: e.target.value,
                                        })
                                    }
                                    placeholder="Es. Non riesco ad accedere al portale"
                                    required
                                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700/80 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-400/50"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-zinc-500 mb-1.5">
                                    Descrizione *
                                </label>
                                <textarea
                                    value={form.descrizione}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            descrizione: e.target.value,
                                        })
                                    }
                                    placeholder="Descrivi il problema nel dettaglio..."
                                    rows={4}
                                    required
                                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700/80 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-400/50 resize-none"
                                />
                            </div>
                            {errore && (
                                <div className="bg-red-950/50 border border-red-900/50 text-red-400 text-xs px-3 py-2 rounded-lg">
                                    {errore}
                                </div>
                            )}
                            {creating && (
                                <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-400/5 border border-amber-400/20 px-3 py-2 rounded-lg">
                                    <div className="w-3 h-3 border border-amber-400 border-t-transparent rounded-full animate-spin" />
                                    Invio in corso...
                                </div>
                            )}
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="bg-amber-400 hover:bg-amber-300 text-zinc-900 text-xs font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    Invia richiesta
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="text-zinc-400 hover:text-zinc-100 text-xs px-4 py-2 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors"
                                >
                                    Annulla
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Lista ticket */}
                <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 overflow-hidden">
                    {loading ? (
                        <div className="px-5 py-10 text-center">
                            <p className="text-zinc-600 text-sm">
                                Caricamento...
                            </p>
                        </div>
                    ) : tickets.length === 0 ? (
                        <div className="px-5 py-12 text-center">
                            <p className="text-zinc-500 text-sm">
                                Nessuna richiesta ancora
                            </p>
                            <p className="text-zinc-700 text-xs mt-1">
                                Clicca "Nuova richiesta" per aprire il tuo primo
                                ticket
                            </p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-zinc-800/60">
                                    <th className="text-left text-[11px] font-medium text-zinc-600 px-5 py-3 uppercase tracking-wide">
                                        Richiesta
                                    </th>
                                    <th className="text-left text-[11px] font-medium text-zinc-600 px-5 py-3 uppercase tracking-wide">
                                        Status
                                    </th>
                                    <th className="text-left text-[11px] font-medium text-zinc-600 px-5 py-3 uppercase tracking-wide">
                                        Priorità
                                    </th>
                                    <th className="text-left text-[11px] font-medium text-zinc-600 px-5 py-3 uppercase tracking-wide">
                                        Data
                                    </th>
                                    <th className="px-5 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/60">
                                {tickets.map((ticket) => (
                                    <tr
                                        key={ticket.id}
                                        onClick={() =>
                                            navigate(
                                                `/miei-ticket/${ticket.id}`,
                                            )
                                        }
                                        className="cursor-pointer hover:bg-zinc-800/30 transition-colors group"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[11px] text-zinc-600 font-mono">
                                                    #{ticket.id}
                                                </span>
                                                <span className="text-sm text-zinc-200 font-medium group-hover:text-white transition-colors">
                                                    {ticket.titolo}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${statusBadge[ticket.status]}`}
                                            >
                                                {ticket.status.replace(
                                                    "_",
                                                    " ",
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${prioritaBadge[ticket.priorita]}`}
                                            >
                                                {ticket.priorita}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-xs text-zinc-500">
                                            {new Date(
                                                ticket.created_at,
                                            ).toLocaleDateString("it-IT")}
                                        </td>
                                        <td className="px-5 py-4">
                                            <ArrowUpRight
                                                size={13}
                                                className="text-zinc-700 group-hover:text-zinc-400 transition-colors ml-auto"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClienteDashboard;
