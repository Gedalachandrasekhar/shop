import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Layout from '../../components/Layout';

const TechnicianDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [inventory, setInventory] = useState([]); // Store spare parts

    // State for the "Add Part" popup
    const [activeJobId, setActiveJobId] = useState(null);
    const [selectedPart, setSelectedPart] = useState('');
    const [quantity, setQuantity] = useState(1);

    // 1. Fetch Jobs AND Inventory on load
    const fetchData = async () => {
        try {
            const [jobsRes, invRes] = await Promise.all([
                api.get('/complaints/tickets/'),
                api.get('/inventory/items/')
            ]);
            setJobs(jobsRes.data);
            setInventory(invRes.data);
        } catch (err) {
            console.error("Failed to fetch data", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 2. Update Job Status
    const updateStatus = async (id, newStatus) => {
        if(!window.confirm(`Mark job as ${newStatus}?`)) return;
        try {
            await api.patch(`/complaints/tickets/${id}/`, { status: newStatus });
            fetchData();
        } catch (err) {
            alert("Failed to update status");
        }
    };

    // 3. Handle Adding a Spare Part
    const handleAddPart = async (e) => {
        e.preventDefault();
        if (!selectedPart) return;

        try {
            await api.post(`/complaints/tickets/${activeJobId}/add_part/`, {
                part_id: selectedPart,
                quantity: parseInt(quantity)
            });
            alert("Part added successfully! Stock deducted.");
            setActiveJobId(null); // Close the form
            setQuantity(1);
            fetchData(); // Refresh to see updated stock/usage
        } catch (err) {
            alert(err.response?.data?.error || "Failed to add part. Check stock.");
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
const markAttendance = async () => {
        try {
            await api.post('/attendance/mark/');
            alert("Success! You are checked in.");
        } catch (err) {
            alert(err.response?.data?.error || "Failed to mark attendance.");
        }
    };

const handleAttendance = async (action) => {
        try {
            await api.post('/attendance/mark/', { action });
            alert(action === 'IN' ? "Checked In!" : "Checked Out!");
        } catch (err) {
            alert(err.response?.data?.error || "Action failed.");
        }
    };

    return (
        <Layout>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Technician Workspace</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => (
                    <div key={job.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                            <span className="font-bold text-gray-700">{job.ticket_id}</span>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(job.status)}`}>
                                {job.status}
                            </span>
                        </div>

                        {/* Body */}
                        <div className="p-4 flex-1 space-y-3">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Issue</p>
                                <p className="text-gray-800">{job.description}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Parts Used</p>
                                {job.parts_used && job.parts_used.length > 0 ? (
                                    <ul className="list-disc pl-4 text-sm text-gray-600">
                                        {job.parts_used.map((p, index) => (
                                            <li key={index}>{p.part_name} (x{p.quantity_used})</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">None</p>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-4 bg-gray-50 border-t">
                            {job.status === 'ASSIGNED' && (
                                <button
                                    onClick={() => updateStatus(job.id, 'IN_PROGRESS')}
                                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium"
                                >
                                    Start Job
                                </button>
                            )}

                            {job.status === 'IN_PROGRESS' && (
                                <div className="space-y-2">
                                    {/* Add Part Toggle */}
                                    {activeJobId === job.id ? (
                                        <form onSubmit={handleAddPart} className="bg-gray-100 p-2 rounded border">
                                            <select
                                                className="w-full text-sm p-1 border rounded mb-2"
                                                value={selectedPart}
                                                onChange={e => setSelectedPart(e.target.value)}
                                                required
                                            >
                                                <option value="">-- Select Part --</option>
                                                {inventory.map(item => (
                                                    <option key={item.id} value={item.id}>
                                                        {item.name} (Stock: {item.quantity})
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="flex gap-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    className="w-16 p-1 text-sm border rounded"
                                                    value={quantity}
                                                    onChange={e => setQuantity(e.target.value)}
                                                />
                                                <button type="submit" className="flex-1 bg-indigo-600 text-white text-xs rounded">Add</button>
                                                <button type="button" onClick={() => setActiveJobId(null)} className="px-2 text-gray-500 text-xs">Cancel</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <button
                                            onClick={() => setActiveJobId(job.id)}
                                            className="w-full bg-indigo-100 text-indigo-700 py-2 rounded hover:bg-indigo-200 font-medium"
                                        >
                                            + Add Spare Part
                                        </button>
                                    )}

                                    <button
                                        onClick={() => updateStatus(job.id, 'COMPLETED')}
                                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-medium"
                                    >
                                        Complete Job
                                    </button>
                                </div>
                            )}

                            {job.status === 'COMPLETED' && (
                                <div className="text-center text-green-600 font-bold py-2">
                                    ✓ Completed
                                </div>
                            )}
                        <div className="bg-white p-4 rounded shadow mb-6 flex justify-between items-center">
                                <h2 className="text-xl font-bold">Daily Attendance</h2>
                                <button
                                    onClick={markAttendance}
                                    className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 font-bold"
                                >
                                    🕒 Check In (After 9:30 AM)
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            <div className="bg-white p-6 rounded shadow mb-6">
                            <h2 className="text-xl font-bold mb-4">Daily Attendance</h2>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleAttendance('IN')}
                                    className="flex-1 bg-green-600 text-white py-3 rounded hover:bg-green-700 font-bold"
                                >
                                    ☀️ Check In
                                    <span className="block text-xs font-normal opacity-80">Opens 9:30 AM (Grace till 10:00)</span>
                                </button>

                                <button
                                    onClick={() => handleAttendance('OUT')}
                                    className="flex-1 bg-gray-700 text-white py-3 rounded hover:bg-gray-800 font-bold"
                                >
                                    🌙 Check Out
                                    <span className="block text-xs font-normal opacity-80">Allowed after 8:30 PM</span>
                                </button>
                            </div>
                        </div>
            </div>
        </Layout>
    );
};

export default TechnicianDashboard;