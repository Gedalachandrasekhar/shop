import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import {
    LayoutDashboard,
    ClipboardList,
    Users,
    Clock,
    Package,
    LogOut,
    PlusCircle,
    Store
} from 'lucide-react';

const Sidebar = () => {
    const { user, logoutUser } = useContext(AuthContext);
    const location = useLocation();

    // Define Links with Icons
    const adminLinks = [
        { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
        { name: 'Inventory', path: '/admin/inventory', icon: <Package size={20} /> },
        { name: 'All Complaints', path: '/admin/complaints', icon: <ClipboardList size={20} /> },
        { name: 'Manage Team', path: '/admin/users', icon: <Users size={20} /> },
        { name: 'Timesheet', path: '/admin/timesheet', icon: <Clock size={20} /> },
    ];

    const managerLinks = [
        { name: 'Dashboard', path: '/manager', icon: <LayoutDashboard size={20} /> },
        { name: 'Inventory', path: '/admin/inventory', icon: <Package size={20} /> },
        { name: 'Timesheet', path: '/admin/timesheet', icon: <Clock size={20} /> },
        { name: 'Manage Team', path: '/admin/users', icon: <Users size={20} /> },
    ];

    const techLinks = [
        { name: 'Dashboard', path: '/technician', icon: <LayoutDashboard size={20} /> },
        { name: 'Walk-In Register', path: '/technician/walkin', icon: <Store size={20} /> },
    ];

    const customerLinks = [
        { name: 'Dashboard', path: '/customer', icon: <LayoutDashboard size={20} /> },
        { name: 'New Complaint', path: '/customer/create', icon: <PlusCircle size={20} /> },
    ];

    // Determine Links based on Role
    let links = customerLinks;
    if (user?.role === 'ADMIN') links = adminLinks;
    else if (user?.role === 'MANAGER') links = managerLinks;
    else if (user?.role === 'TECHNICIAN' || user?.role === 'EMPLOYEE') links = techLinks;

    return (
        <aside className="fixed left-0 top-0 h-screen w-72 bg-slate-900 text-white flex flex-col shadow-2xl z-50">
            {/* Logo Area */}
            <div className="h-20 flex items-center px-8 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/50">
                        CE
                    </div>
                    <div>
                        <h1 className="font-bold text-lg tracking-tight">Chandu Electricals</h1>
                        <p className="text-xs text-slate-400">Service Portal</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {links.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                                isActive
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}>
                                {link.icon}
                            </span>
                            <span className="font-medium">{link.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/50">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                        <p className="text-xs text-indigo-400 font-medium truncate">{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={logoutUser}
                    className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white py-2.5 rounded-lg transition-colors duration-300 text-sm font-medium"
                >
                    <LogOut size={16} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;