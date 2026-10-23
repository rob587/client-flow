import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        nome: "",
        email: "",
        telefono: "",
        azienda: "",
    });
    const [errore, setErrore] = useState("");
    const navigate = useNavigate();

    const fetchClients = () => {
        api.get("/clients")
            .then((res) => setClients(res.data))
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

    useEffect(() => {
        fetchClients();
    }, []);

    return (
        <>
            <div className="min-h-screen bg-zinc-950 flex">
                {/* Sidebar */}
                <aside className="w-60 bg-zinc-900 border-r border-zinc-800 flex flex-col">
                    <div className="px-6 py-5 border-b border-zinc-800">
                        <h1 className="text-lg font-semibold text-zinc-100">
                            Client<span className="text-amber-400">Flow</span>
                        </h1>
                    </div>
                    <nav className="flex-1 px-3 py-4 space-y-1">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => navigate("/tickets")}
                            className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                        >
                            Ticket
                        </button>
                        <button
                            onClick={() => navigate("/clients")}
                            className="w-full text-left px-3 py-2 rounded-lg text-sm text-amber-400 bg-amber-400/10 font-medium"
                        >
                            Clienti
                        </button>
                    </nav>
                    <div className="px-4 py-4 border-t border-zinc-800">
                        <button
                            onClick={() => {
                                localStorage.clear();
                                navigate("/login");
                            }}
                            className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
                        >
                            Esci
                        </button>
                    </div>
                </aside>

                {/* Main */}
                <main className="flex-1 p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-zinc-100">
                            Clienti
                        </h2>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="bg-amber-400 hover:bg-amber-300 text-zinc-900 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                        >
                            {showForm ? "Annulla" : "+ Nuovo cliente"}
                        </button>
                    </div>

                    {/* Form nuovo cliente */}
                    {showForm && (
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
                            <h3 className="text-zinc-100 font-medium mb-4">
                                Nuovo cliente
                            </h3>
                            <form
                                onSubmit={handleSubmit}
                                className="grid grid-cols-2 gap-4"
                            >
                                <div>
                                    <label className="block text-xs text-zinc-400 mb-1">
                                        Nome *
                                    </label>
                                    <input
                                        type="text"
                                        value={form.nome}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                nome: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-zinc-400 mb-1">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                email: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-zinc-400 mb-1">
                                        Telefono
                                    </label>
                                    <input
                                        type="text"
                                        value={form.telefono}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                telefono: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-zinc-400 mb-1">
                                        Azienda
                                    </label>
                                    <input
                                        type="text"
                                        value={form.azienda}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                azienda: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                    />
                                </div>
                                {errore && (
                                    <div className="col-span-2 bg-red-950 border border-red-800 text-red-400 text-sm px-3 py-2 rounded-lg">
                                        {errore}
                                    </div>
                                )}
                                <div className="col-span-2">
                                    <button
                                        type="submit"
                                        className="bg-amber-400 hover:bg-amber-300 text-zinc-900 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Salva cliente
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Lista clienti */}
                    {loading ? (
                        <p className="text-zinc-500 text-sm">Caricamento...</p>
                    ) : clients.length === 0 ? (
                        <p className="text-zinc-500 text-sm">
                            Nessun cliente trovato
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {clients.map((client) => (
                                <div
                                    key={client.id}
                                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center justify-between"
                                >
                                    <div>
                                        <h3 className="text-zinc-100 font-medium">
                                            {client.nome}
                                        </h3>
                                        <p className="text-zinc-500 text-sm mt-0.5">
                                            {client.email}{" "}
                                            {client.azienda
                                                ? `— ${client.azienda}`
                                                : ""}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-zinc-500 text-xs">
                                            {client.telefono ?? "—"}
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

export default Clients;
