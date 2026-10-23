import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const logout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const user = JSON.parse(localStorage.getItem("user"));

    const links = [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Ticket", path: "/tickets" },
        { label: "Clienti", path: "/clients" },
    ];

    return <div>Sidebar</div>;
};

export default Sidebar;
