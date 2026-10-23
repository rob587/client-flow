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

    return (
        <>
            <aside className="w-60 bg-zinc-900 border-r border-zinc-800 flex flex-col">
                <div className="px-6 py-5 border-b border-zinc-800">
                    <h1 className="text-lg font-semibold text-zinc-100">
                        Client<span className="text-amber-400">Flow</span>
                    </h1>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                    {links.map((link) => (
                        <button
                            key={link.path}
                            onClick={() => navigate(link.path)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                location.pathname === link.path
                                    ? "text-amber-400 bg-amber-400/10 font-medium"
                                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                            }`}
                        >
                            {link.label}
                        </button>
                    ))}
                </nav>

                <div className="px-4 py-4 border-t border-zinc-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-zinc-100">
                                {user?.name}
                            </p>
                            <p className="text-xs text-zinc-500">
                                {user?.role}
                            </p>
                        </div>
                        <button
                            onClick={logout}
                            className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
                        >
                            Esci
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
