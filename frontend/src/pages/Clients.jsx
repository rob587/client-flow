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

    return <div>Clients</div>;
};

export default Clients;
