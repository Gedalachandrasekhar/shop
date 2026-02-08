import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Sidebar = () => {
    const { user, logoutUser } = useContext(AuthContext);
    const location = useLocation();

    const adminLinks = [
        { name: 'Dashboard', path: '/admin' },
        { name: 'Inventory', path: '/admin/inventory' },
        { name: 'All Complaints', path: '/admin/complaints' },
        { name: 'Manage Team', path: '/admin/users' },
        { name: 'Timesheet', path: '/admin/timesheet' },
        // { name: 'Technicians', path: '/admin/users' }, // Enable if you build user management later
    ];

    const customerLinks = [
        { name: 'My Dashboard', path: '/customer' },
        { name: 'New Complaint', path: '/customer/create' },
        // { name: 'History', path: '/customer/history' }, // Optional
    ];

    const techLinks = [
        { name: 'My Jobs', path: '/technician' },
    ];
const managerLinks = [
        { name: 'Dashboard', path: '/manager' },       // His own dashboard (Attendance + Complaints)
        { name: 'Inventory', path: '/admin/inventory' }, // Shared with Admin
        { name: 'Timesheet', path: '/admin/timesheet' }, // Read-Only View
        { name: 'Manage Team', path: '/admin/users' },   // Can add/remove employees
    ];

    // --- FIX IS HERE ---
    // We use 'let' to allow reassignment based on role
    let links = customerLinks;

        if (user?.role === 'ADMIN') links = adminLinks;
        else if (user?.role === 'MANAGER') links = managerLinks; // <--- Use the new list
        else if (user?.role === 'TECHNICIAN') links = techLinks;
    // -------------------

    return (
        <div className="flex flex-col w-64 h-screen px-4 py-8 bg-gray-800 border-r">
            <h2 className="text-3xl font-semibold text-white text-center">ShopSys</h2>

            <div className="flex flex-col justify-between flex-1 mt-6">
                <nav>
                    {links.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center px-4 py-2 mt-5 transition-colors transform rounded-md ${
                                location.pathname === link.path
                                ? 'bg-gray-600 text-gray-200'
                                : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                            }`}
                        >
                            <span className="mx-4 font-medium">{link.name}</span>
                        </Link>
                    ))}
                </nav>

                <div>
                    <div className="flex items-center px-4 -mx-2">
                        <h4 className="mx-2 font-medium text-gray-200">{user?.name || 'User'}</h4>
                    </div>
                    <button
                        onClick={logoutUser}
                        className="w-full mt-4 px-4 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-red-600 rounded-md hover:bg-red-500 focus:outline-none focus:bg-red-500"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;