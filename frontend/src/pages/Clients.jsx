import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Building2, Mail, Phone, Search } from "lucide-react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";

export default function Clients() {
    const [clients, setClients] = useState([]);
    const [filtrati, setFiltrati] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState({
        nome: "",
        email: "",
        telefono: "",
        azienda: "",
    });
    const [errore, setErrore] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchClients();
    }, []);

    useEffect(() => {
        if (search.trim()) {
            setFiltrati(
                clients.filter(
                    (c) =>
                        c.nome.toLowerCase().includes(search.toLowerCase()) ||
                        c.email.toLowerCase().includes(search.toLowerCase()) ||
                        c.azienda?.toLowerCase().includes(search.toLowerCase()),
                ),
            );
        } else {
            setFiltrati(clients);
        }
    }, [search, clients]);

    const fetchClients = () => {
        api.get("/clients")
            .then((res) => {
                setClients(res.data);
                setFiltrati(res.data);
            })
            .catch(() => navigate("/login"))
            .finally(() => setLoading(false));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrore("");
        try {
            await api.post("/clients", form);
            setForm({ nome: "", email: "", telefono: "", azienda: "" });
            setShowForm(false);
            fetchClients();
        } catch (err) {
            setErrore(
                err.response?.data?.message ?? "Errore durante la creazione",
            );
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
                            Clienti
                        </h1>
                        <p className="text-xs text-zinc-500 mt-0.5">
                            {clients.length} clienti registrati
                        </p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-900 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                    >
                        <Plus size={13} />
                        Nuovo cliente
                    </button>
                </div>

                <div className="px-8 py-6 space-y-5">
                    {/* Form */}
                    {showForm && (
                        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 overflow-hidden">
                            <div className="px-5 py-4 border-b border-zinc-800/80">
                                <h2 className="text-sm font-medium text-zinc-100">
                                    Nuovo cliente
                                </h2>
                            </div>
                            <form
                                onSubmit={handleSubmit}
                                className="p-5 grid grid-cols-2 gap-4"
                            >
                                {[
                                    {
                                        key: "nome",
                                        label: "Nome *",
                                        type: "text",
                                        required: true,
                                    },
                                    {
                                        key: "email",
                                        label: "Email *",
                                        type: "email",
                                        required: true,
                                    },
                                    {
                                        key: "telefono",
                                        label: "Telefono",
                                        type: "text",
                                        required: false,
                                    },
                                    {
                                        key: "azienda",
                                        label: "Azienda",
                                        type: "text",
                                        required: false,
                                    },
                                ].map(({ key, label, type, required }) => (
                                    <div key={key}>
                                        <label className="block text-xs text-zinc-500 mb-1.5">
                                            {label}
                                        </label>
                                        <input
                                            type={type}
                                            value={form[key]}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    [key]: e.target.value,
                                                })
                                            }
                                            required={required}
                                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700/80 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-400/50 focus:border-amber-400/50"
                                        />
                                    </div>
                                ))}
                                {errore && (
                                    <div className="col-span-2 bg-red-950/50 border border-red-900/50 text-red-400 text-xs px-3 py-2 rounded-lg">
                                        {errore}
                                    </div>
                                )}
                                <div className="col-span-2 flex gap-2 pt-1">
                                    <button
                                        type="submit"
                                        className="bg-amber-400 hover:bg-amber-300 text-zinc-900 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Salva
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

                    {/* Ricerca */}
                    <div className="relative max-w-sm">
                        <Search
                            size={13}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                        />
                        <input
                            type="text"
                            placeholder="Cerca cliente o azienda..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8 pr-4 py-2 bg-zinc-900/50 border border-zinc-800/80 rounded-lg text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-400/50 w-full"
                        />
                    </div>

                    {/* Grid clienti */}
                    {loading ? (
                        <p className="text-zinc-600 text-sm">Caricamento...</p>
                    ) : filtrati.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-zinc-500 text-sm">
                                Nessun cliente trovato
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-4">
                            {filtrati.map((client) => (
                                <div
                                    key={client.id}
                                    className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-5 hover:border-zinc-700/80 transition-colors group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-9 h-9 rounded-full bg-amber-400/15 flex items-center justify-center text-amber-400 font-semibold text-sm">
                                            {client.nome
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                        {client.azienda && (
                                            <span className="flex items-center gap-1 text-[11px] text-zinc-500 bg-zinc-800 px-2 py-1 rounded-md">
                                                <Building2 size={10} />
                                                {client.azienda}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-sm font-medium text-zinc-100 mb-2 group-hover:text-white transition-colors">
                                        {client.nome}
                                    </h3>
                                    <div className="space-y-1.5">
                                        <p className="flex items-center gap-2 text-xs text-zinc-500">
                                            <Mail
                                                size={11}
                                                className="text-zinc-600"
                                            />
                                            {client.email}
                                        </p>
                                        {client.telefono && (
                                            <p className="flex items-center gap-2 text-xs text-zinc-500">
                                                <Phone
                                                    size={11}
                                                    className="text-zinc-600"
                                                />
                                                {client.telefono}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
