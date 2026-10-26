import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Ticket, Users, LogOut } from "lucide-react";

const links = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Ticket", path: "/tickets", icon: Ticket },
    { label: "Clienti", path: "/clients", icon: Users },
];

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"));

    const logout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col h-screen sticky top-0">
            {/* Logo */}
            <div className="px-6 py-6 border-b border-zinc-800">
                <h1 className="text-lg font-semibold tracking-tight text-zinc-100">
                    Client<span className="text-amber-400">Flow</span>
                </h1>
                <p className="text-xs text-zinc-500 mt-0.5">
                    Support Management
                </p>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-0.5">
                {links.map(({ label, path, icon: Icon }) => {
                    const active = location.pathname === path;
                    return (
                        <button
                            key={path}
                            onClick={() => navigate(path)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                                active
                                    ? "bg-amber-400/10 text-amber-400 font-medium"
                                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                            }`}
                        >
                            <Icon size={16} strokeWidth={active ? 2.5 : 1.8} />
                            {label}
                        </button>
                    );
                })}
            </nav>

            {/* User */}
            <div className="px-4 py-4 border-t border-zinc-800">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400 text-xs font-semibold">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-100 truncate">
                            {user?.name}
                        </p>
                        <p className="text-xs text-zinc-500 capitalize">
                            {user?.role}
                        </p>
                    </div>
                    <button
                        onClick={logout}
                        className="text-zinc-600 hover:text-red-400 transition-colors"
                        title="Esci"
                    >
                        <LogOut size={15} />
                    </button>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
