import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Layout from '../../components/Layout';

const CustomerDashboard = () => {
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const res = await api.get('/complaints/tickets/');
                setComplaints(res.data);
            } catch (err) {
                console.error("Error fetching data", err);
            }
        };
        fetchComplaints();
    }, []);

    // Helper for Status Colors
    const getStatusColor = (status) => {
        switch(status) {
            case 'REGISTERED': return 'bg-gray-100 text-gray-800';
            case 'ASSIGNED': return 'bg-blue-100 text-blue-800';
            case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
            case 'COMPLETED': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">My Complaints</h1>
                <Link to="/customer/create" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                    + New Complaint
                </Link>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {complaints.length === 0 ? (
                        <p className="p-4 text-center text-gray-500">No complaints found. Start by creating one!</p>
                    ) : (
                        complaints.map((ticket) => (
                            <li key={ticket.id}>
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-indigo-600 truncate">
                                            {ticket.ticket_id} - {ticket.type}
                                        </p>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                                {ticket.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500">
                                                {ticket.description}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                            <p>Submitted on {new Date(ticket.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </Layout>
    );
};

export default CustomerDashboard;