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

const ClientDashboard = () => {
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

    return <div>ClientDashboard</div>;
};

export default ClientDashboard;
