import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Layout from '../../components/Layout';

const TechnicianDashboard = () => {
    const [jobs, setJobs] = useState([]);

    // Fetch jobs assigned to *this* technician
    const fetchJobs = async () => {
        try {
            const res = await api.get('/complaints/tickets/');
            setJobs(res.data);
        } catch (err) {
            console.error("Failed to fetch jobs", err);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const updateStatus = async (id, newStatus) => {
        if(!window.confirm(`Mark job as ${newStatus}?`)) return;
        try {
            await api.patch(`/complaints/tickets/${id}/`, { status: newStatus });
            fetchJobs(); // Refresh
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'ASSIGNED': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Layout>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">My Assigned Jobs</h1>

            {jobs.length === 0 ? (
                <div className="bg-white p-6 rounded shadow text-center text-gray-500">
                    No jobs assigned to you yet. Good time for a break! ☕
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {jobs.map((job) => (
                        <div key={job.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                            {/* Card Header */}
                            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                                <span className="font-bold text-gray-700">{job.ticket_id}</span>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(job.status)}`}>
                                    {job.status}
                                </span>
                            </div>

                            {/* Card Body */}
                            <div className="p-4 space-y-3">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Issue</p>
                                    <p className="text-gray-800">{job.description}</p>
                                </div>

                                {job.type === 'OUTDOOR' && (
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Location</p>
                                        <p className="text-gray-800">{job.address || "No address provided"}</p>
                                        <a
                                            href={`https://maps.google.com/?q=${job.address}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-indigo-600 text-sm hover:underline"
                                        >
                                            View on Map ↗
                                        </a>
                                    </div>
                                )}

                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Customer</p>
                                    <p className="text-gray-800">{job.customer_phone}</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="p-4 bg-gray-50 border-t grid grid-cols-2 gap-2">
                                {job.status === 'ASSIGNED' && (
                                    <button
                                        onClick={() => updateStatus(job.id, 'IN_PROGRESS')}
                                        className="col-span-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium"
                                    >
                                        Start Job
                                    </button>
                                )}

                                {job.status === 'IN_PROGRESS' && (
                                    <>
                                        {/* Placeholder for "Add Parts" (We will build this next) */}
                                        <button className="bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 font-medium">
                                            + Parts
                                        </button>
                                        <button
                                            onClick={() => updateStatus(job.id, 'COMPLETED')}
                                            className="bg-green-600 text-white py-2 rounded hover:bg-green-700 font-medium"
                                        >
                                            Complete
                                        </button>
                                    </>
                                )}

                                {job.status === 'COMPLETED' && (
                                    <div className="col-span-2 text-center text-green-600 font-bold py-2">
                                        ✓ Job Done
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    );
};

export default TechnicianDashboard;