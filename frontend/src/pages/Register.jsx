import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Register = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [errore, setErrore] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    return <></>;
};

export default Register;
