import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Layout from '../../components/Layout';

const AdminDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [filter, setFilter] = useState('ALL');

    // --- FIX IS HERE: Split the calls so one failure doesn't break everything ---
    const fetchData = async () => {
        // 1. Fetch Complaints (Critical)
        try {
            const res = await api.get('/complaints/tickets/');
            setComplaints(res.data);
        } catch (err) {
            console.error("Failed to fetch complaints", err);
        }

        // 2. Fetch Employees (Secondary)
        try {
            const res = await api.get('/users/employees/');
            setEmployees(res.data);
        } catch (err) {
            console.error("Failed to fetch employees. Check backend/users/urls.py", err);
        }
    };
    // ---------------------------------------------------------------------------

    useEffect(() => {
        fetchData();
    }, []);

    // Handle Status Change
    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.patch(`/complaints/tickets/${id}/`, { status: newStatus });
            fetchData();
        } catch (err) {
            alert("Failed to update status");
        }
    };

    // Handle Assigning a Technician
    const handleAssign = async (ticketId, employeeId) => {
        if (!employeeId) return;

        // Optimistic UI Update
        setComplaints(prevComplaints =>
            prevComplaints.map(ticket =>
                ticket.id === ticketId
                    ? { ...ticket, assigned_employee: parseInt(employeeId), status: 'ASSIGNED' }
                    : ticket
            )
        );

        // Backend Request
        try {
            await api.patch(`/complaints/tickets/${ticketId}/`, {
                assigned_employee: employeeId,
                status: 'ASSIGNED'
            });
        } catch (err) {
            console.error("Assign Failed:", err.response?.data);
            alert("Failed to assign technician.");
            fetchData(); // Revert on error
        }
    };

    const filteredComplaints = filter === 'ALL'
        ? complaints
        : complaints.filter(c => c.status === filter);

    const getStatusColor = (status) => {
        switch(status) {
            case 'REGISTERED': return 'bg-red-100 text-red-800';
            case 'ASSIGNED': return 'bg-blue-100 text-blue-800';
            case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
            case 'COMPLETED': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                <select
                    className="border p-2 rounded shadow-sm"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="ALL">All Complaints</option>
                    <option value="REGISTERED">New (Registered)</option>
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
                        {filteredComplaints.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-4 text-gray-500">
                                    No complaints found (or loading...)
                                </td>
                            </tr>
                        ) : (
                            filteredComplaints.map((ticket) => (
                                <tr key={ticket.id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="font-bold text-gray-900">{ticket.ticket_id}</p>
                                        <p className="text-xs text-gray-500">{new Date(ticket.created_at).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900">{ticket.description}</p>
                                        <p className="text-xs text-gray-500">{ticket.type} • {ticket.customer_phone}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                            {ticket.status}
                                        </span>
                                        <select
                                            className="block mt-1 text-xs border rounded"
                                            value={ticket.status}
                                            onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                                        >
                                            <option value="REGISTERED">Registered</option>
                                            <option value="ASSIGNED">Assigned</option>
                                            <option value="IN_PROGRESS">In Progress</option>
                                            <option value="COMPLETED">Completed</option>
                                        </select>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <select
                                            className="border p-1 rounded text-sm w-full"
                                            value={ticket.assigned_employee || ""}
                                            onChange={(e) => handleAssign(ticket.id, e.target.value)}
                                        >
                                            <option value="">-- Select Tech --</option>
                                            {employees.length > 0 ? employees.map(emp => (
                                                <option key={emp.id} value={emp.id}>
                                                    {emp.first_name || emp.phone} ({emp.role})
                                                </option>
                                            )) : <option disabled>No Techs Found</option>}
                                        </select>
                                        {ticket.assigned_employee && (
                                            <p className="text-xs text-green-600 mt-1">✓ Assigned</p>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default AdminDashboard;