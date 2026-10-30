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

    return;
};

export default ClienteTicketDetail;
