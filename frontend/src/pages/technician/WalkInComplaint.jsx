import { useState } from 'react';
import api from '../../api/axios';
import Layout from '../../components/Layout';

const WalkInComplaint = () => {
    const [formData, setFormData] = useState({
        customer_phone: '',
        customer_name: '',
        device_type: 'INVERTER',
        description: '',
        service_mode: 'STORE' // Walk-ins are usually In-Store
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post('/complaints/tickets/', formData);
            alert(`Success! Ticket #${res.data.ticket_id} created for ${formData.customer_name}.`);
            // Reset form for the next customer
            setFormData({
                customer_phone: '',
                customer_name: '',
                device_type: 'INVERTER',
                description: '',
                service_mode: 'STORE'
            });
        } catch (err) {
            alert(err.response?.data?.error || "Failed to register complaint.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-xl mx-auto bg-white p-6 rounded shadow-lg border-t-4 border-indigo-600">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span>🏪</span> New Walk-In Registration
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Customer Info Section */}
                    <div className="bg-gray-50 p-4 rounded border">
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Customer Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Phone Number</label>
                                <input
                                    type="tel" required
                                    className="w-full border p-2 rounded"
                                    value={formData.customer_phone}
                                    onChange={e => setFormData({...formData, customer_phone: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Name</label>
                                <input
                                    type="text" required
                                    className="w-full border p-2 rounded"
                                    value={formData.customer_name}
                                    onChange={e => setFormData({...formData, customer_name: e.target.value})}
                                />
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">* If this is a new customer, an account will be auto-created.</p>
                    </div>

                    {/* Item Details */}
                    <div>
                        <label className="block text-sm font-bold mb-1">Item Type</label>
                        <select
                            className="w-full border p-2 rounded"
                            value={formData.device_type}
                            onChange={e => setFormData({...formData, device_type: e.target.value})}
                        >
                            <option value="INVERTER">Inverter</option>
                            <option value="BATTERY">Battery</option>
                            <option value="UPS">UPS / Online UPS</option>
                            <option value="STABILIZER">Stabilizer</option>
                            <option value="GEYSER">Geyser</option>
                            <option value="RO_SYSTEM">RO System</option>
                            <option value="SOLAR">Solar System</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1">Issue Description</label>
                        <textarea
                            required rows="3"
                            className="w-full border p-2 rounded"
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white font-bold py-3 rounded hover:bg-indigo-700 transition"
                    >
                        {loading ? 'Creating Ticket...' : 'Create Ticket'}
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default WalkInComplaint;