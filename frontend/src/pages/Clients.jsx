import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Building2, Mail, Phone } from "lucide-react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";

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
                <Sidebar />

                <main className="flex-1 p-8 overflow-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-semibold text-zinc-100">
                                Clienti
                            </h2>
                            <p className="text-zinc-500 text-sm mt-1">
                                {clients.length} clienti registrati
                            </p>
                        </div>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-900 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                        >
                            <Plus size={15} />
                            {showForm ? "Annulla" : "Nuovo cliente"}
                        </button>
                    </div>

                    {/* Form */}
                    {showForm && (
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
                            <h3 className="text-zinc-100 font-medium mb-5">
                                Nuovo cliente
                            </h3>
                            <form
                                onSubmit={handleSubmit}
                                className="grid grid-cols-2 gap-4"
                            >
                                <div>
                                    <label className="block text-xs text-zinc-400 mb-1.5">
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
                                    <label className="block text-xs text-zinc-400 mb-1.5">
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
                                    <label className="block text-xs text-zinc-400 mb-1.5">
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
                                    <label className="block text-xs text-zinc-400 mb-1.5">
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
                                <div className="col-span-2 flex gap-3">
                                    <button
                                        type="submit"
                                        className="bg-amber-400 hover:bg-amber-300 text-zinc-900 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Salva cliente
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="text-zinc-400 hover:text-zinc-100 text-sm px-4 py-2 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
                                    >
                                        Annulla
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Lista */}
                    {loading ? (
                        <p className="text-zinc-500 text-sm">Caricamento...</p>
                    ) : clients.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-zinc-500 text-sm">
                                Nessun cliente registrato
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {clients.map((client) => (
                                <div
                                    key={client.id}
                                    className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 transition-colors"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400 font-semibold text-sm">
                                            {client.nome
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                        {client.azienda && (
                                            <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded-lg flex items-center gap-1">
                                                <Building2 size={11} />
                                                {client.azienda}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-zinc-100 font-medium mb-1">
                                        {client.nome}
                                    </h3>
                                    <div className="space-y-1">
                                        <p className="text-zinc-500 text-xs flex items-center gap-1.5">
                                            <Mail size={11} />
                                            {client.email}
                                        </p>
                                        {client.telefono && (
                                            <p className="text-zinc-500 text-xs flex items-center gap-1.5">
                                                <Phone size={11} />
                                                {client.telefono}
                                            </p>
                                        )}
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
