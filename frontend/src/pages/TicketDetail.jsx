import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";

const statusColor = {
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
            setTicket(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    return <div>TicketDetail</div>;
};

export default TicketDetail;
