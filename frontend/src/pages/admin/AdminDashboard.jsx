import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Layout from '../../components/Layout';
import StatCard from '../../components/StatCard';
import { ShoppingBag, Users, Wrench, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
    // Mock stats for visualization (you can connect to API later)
    const [stats, setStats] = useState({
        total_complaints: 124,
        pending_complaints: 12,
        technicians: 5,
        inventory_count: 340
    });

    return (
        <Layout>
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Admin Overview</h1>
                <p className="text-slate-500 mt-1">Welcome back! Here is what is happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Complaints"
                    value={stats.total_complaints}
                    icon={ShoppingBag}
                    color="blue"
                />
                <StatCard
                    title="Pending Action"
                    value={stats.pending_complaints}
                    icon={AlertCircle}
                    color="orange"
                />
                <StatCard
                    title="Active Technicians"
                    value={stats.technicians}
                    icon={Users}
                    color="purple"
                />
                <StatCard
                    title="Low Stock Items"
                    value={5}
                    icon={Wrench}
                    color="red"
                />
            </div>

            {/* Content Section Placeholder */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Complaint List</h2>
                <div className="p-10 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400">
                    Your Table Component will go here.
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;