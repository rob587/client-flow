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

    return <div>Clients</div>;
};

export default Clients;
