import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Layout from '../../components/Layout';

const AdminDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [filter, setFilter] = useState('ALL'); // Filter by status

    // Fetch all complaints on load
    const fetchComplaints = async () => {
        try {
            const res = await api.get('/complaints/tickets/');
            setComplaints(res.data);
        } catch (err) {
            console.error("Failed to fetch complaints", err);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    // Function to update status (e.g., Assigning a technician)
    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.patch(`/complaints/tickets/${id}/`, { status: newStatus });
            fetchComplaints(); // Refresh list to show new status
        } catch (err) {
            alert("Failed to update status");
        }
    };

    // Filter Logic
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

                {/* Filter Dropdown */}
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

            {/* Complaints Table */}
            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Ticket ID
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Customer / Phone
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Issue
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Status & Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredComplaints.map((ticket) => (
                            <tr key={ticket.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap font-bold">{ticket.ticket_id}</p>
                                    <p className="text-gray-500 text-xs">{new Date(ticket.created_at).toLocaleDateString()}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{ticket.customer_phone}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{ticket.description}</p>
                                    {ticket.address && <p className="text-xs text-gray-500">📍 {ticket.address}</p>}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <span className="px-2 py-1 font-semibold leading-tight text-gray-700 bg-gray-100 rounded-full">
                                        {ticket.type}
                                    </span>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <div className="flex flex-col gap-2">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full w-fit ${getStatusColor(ticket.status)}`}>
                                            {ticket.status}
                                        </span>

                                        {/* Status Changer */}
                                        <select
                                            className="text-xs border rounded p-1"
                                            value={ticket.status}
                                            onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                                        >
                                            <option value="REGISTERED">Registered</option>
                                            <option value="ASSIGNED">Assign to Tech</option>
                                            <option value="IN_PROGRESS">In Progress</option>
                                            <option value="COMPLETED">Completed</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default AdminDashboard;