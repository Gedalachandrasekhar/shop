import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Layout from '../../components/Layout';

const NewComplaint = () => {
    const [formData, setFormData] = useState({
        description: '',
        device_type: 'INVERTER',
        service_mode: 'STORE', // Default to In-Store
        customer_phone: '',
        customer_name: '',
        address: '' // New Address field
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validation: If Outdoor, Address is required
        if (formData.service_mode === 'OUTDOOR' && !formData.address.trim()) {
            alert("Please provide an address for Home Visit.");
            setLoading(false);
            return;
        }

        try {
            await api.post('/complaints/tickets/', {
                description: formData.description,
                type: formData.device_type,
                service_mode: formData.service_mode, // Sending mode
                customer_phone: formData.customer_phone,
                customer_name: formData.customer_name,
                address: formData.address
            });

            alert("Complaint Registered Successfully!");
            navigate('/customer');
        } catch (err) {
            alert(err.response?.data?.error || "Failed to submit complaint.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md mt-10 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Register New Complaint</h2>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* 1. Complaint Type (Item) */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Item to Repair</label>
                        <select
                            className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={formData.device_type}
                            onChange={(e) => setFormData({...formData, device_type: e.target.value})}
                        >
                            <option value="INVERTER">Inverter</option>
                            <option value="BATTERY">Battery</option>
                            <option value="UPS">UPS / Online UPS</option>
                            <option value="STABILIZER">Stabilizer</option>
                            <option value="GEYSER">Geyser (Gas/Electric)</option>
                            <option value="RO_SYSTEM">Water Purifier / R.O.</option>
                            <option value="SOLAR">Solar System</option>
                            <option value="OTHER">Other Service</option>
                        </select>
                    </div>

                    {/* 2. Service Mode (In-Store vs Outdoor) */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Service Type</label>
                        <div className="flex gap-4">
                            <label className="flex items-center space-x-2 border p-3 rounded w-full cursor-pointer hover:bg-gray-50">
                                <input
                                    type="radio"
                                    value="STORE"
                                    checked={formData.service_mode === 'STORE'}
                                    onChange={(e) => setFormData({...formData, service_mode: e.target.value})}
                                />
                                <span>🏪 Bring to Shop</span>
                            </label>
                            <label className="flex items-center space-x-2 border p-3 rounded w-full cursor-pointer hover:bg-gray-50">
                                <input
                                    type="radio"
                                    value="OUTDOOR"
                                    checked={formData.service_mode === 'OUTDOOR'}
                                    onChange={(e) => setFormData({...formData, service_mode: e.target.value})}
                                />
                                <span>🏠 Home Visit</span>
                            </label>
                        </div>
                    </div>

                    {/* 3. Customer Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Your Name</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Chandu"
                                className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.customer_name}
                                onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                            <input
                                type="tel"
                                required
                                placeholder="e.g. 9052863333"
                                className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.customer_phone}
                                onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* 4. Address (Only if Outdoor) */}
                    {formData.service_mode === 'OUTDOOR' && (
                        <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Home Address</label>
                            <textarea
                                required
                                rows="3"
                                placeholder="Enter full address for the technician..."
                                className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                            />
                        </div>
                    )}

                    {/* 5. Issue Description */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Describe the Issue</label>
                        <textarea
                            required
                            rows="3"
                            placeholder="e.g. System is not turning on..."
                            className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded text-white font-bold text-lg transition shadow-md ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        {loading ? 'Submitting...' : 'Submit Complaint'}
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default NewComplaint;