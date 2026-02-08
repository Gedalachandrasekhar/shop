import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Layout from '../../components/Layout';

const ManagerDashboard = () => {
    // --- STATE FOR COMPLAINTS (Admin Power) ---
    const [complaints, setComplaints] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [filter, setFilter] = useState('ALL');

    // --- FETCH DATA ---
    const fetchData = async () => {
        try {
            const [compRes, empRes] = await Promise.all([
                api.get('/complaints/tickets/'),
                api.get('/users/employees/')
            ]);
            setComplaints(compRes.data);
            setEmployees(empRes.data);
        } catch (err) {
            console.error("Data load failed", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- ATTENDANCE LOGIC (Technician Style) ---
    const handleAttendance = async (action) => {
        try {
            const res = await api.post('/attendance/mark/', { action });
            alert(res.data.message);
        } catch (err) {
            alert(err.response?.data?.error || "Action failed.");
        }
    };

    // --- COMPLAINT LOGIC (Admin Style) ---
    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.patch(`/complaints/tickets/${id}/`, { status: newStatus });
            fetchData();
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const handleAssign = async (ticketId, employeeId) => {
        if (!employeeId) return;
        setComplaints(prev => prev.map(t => t.id === ticketId ? { ...t, assigned_employee: parseInt(employeeId), status: 'ASSIGNED' } : t));

        try {
            await api.patch(`/complaints/tickets/${ticketId}/`, { assigned_employee: employeeId, status: 'ASSIGNED' });
        } catch (err) {
            fetchData();
            alert("Assign failed");
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'REGISTERED': return 'bg-red-100 text-red-800';
            case 'ASSIGNED': return 'bg-blue-100 text-blue-800';
            case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
            case 'COMPLETED': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredComplaints = filter === 'ALL' ? complaints : complaints.filter(c => c.status === filter);

    return (
        <Layout>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Manager Dashboard</h1>

            {/* --- SECTION 1: MY ATTENDANCE --- */}
            <div className="bg-white p-6 rounded shadow mb-8 border-l-4 border-indigo-500">
                <h2 className="text-xl font-bold mb-4">Daily Attendance</h2>
                <div className="flex gap-4">
                    <button
                        onClick={() => handleAttendance('IN')}
                        className="flex-1 bg-green-600 text-white py-3 rounded hover:bg-green-700 font-bold transition transform hover:scale-105"
                    >
                        ☀️ Punch In
                        <span className="block text-xs font-normal opacity-80">Opens 9:30 AM</span>
                    </button>

                    <button
                        onClick={() => handleAttendance('OUT')}
                        className="flex-1 bg-gray-700 text-white py-3 rounded hover:bg-gray-800 font-bold transition transform hover:scale-105"
                    >
                        🌙 Punch Out
                        <span className="block text-xs font-normal opacity-80">Allowed after 8:30 PM</span>
                    </button>
                </div>
            </div>

            {/* --- SECTION 2: COMPLAINT MANAGEMENT --- */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-700">Shop Complaints</h2>
                <select
                    className="border p-2 rounded shadow-sm"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="ALL">All Status</option>
                    <option value="REGISTERED">New</option>
                    <option value="ASSIGNED">Assigned</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                </select>
            </div>

            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ticket</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Issue</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Assign Tech</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredComplaints.map((ticket) => (
                            <tr key={ticket.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="font-bold text-gray-900">{ticket.ticket_id}</p>
                                    <p className="text-xs text-gray-500">{new Date(ticket.created_at).toLocaleDateString()}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900">{ticket.description}</p>
                                    <p className="text-xs text-gray-500">{ticket.type}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                        {ticket.status}
                                    </span>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <select
                                        className="border p-1 rounded text-sm w-full"
                                        value={ticket.assigned_employee || ""}
                                        onChange={(e) => handleAssign(ticket.id, e.target.value)}
                                    >
                                        <option value="">-- Select --</option>
                                        {employees.map(emp => (
                                            <option key={emp.id} value={emp.id}>{emp.first_name}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default ManagerDashboard;