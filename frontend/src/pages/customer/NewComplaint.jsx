import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Layout from '../../components/Layout';

const NewComplaint = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        type: 'STORE', // Default to Store
        description: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/complaints/tickets/', formData);
            navigate('/customer'); // Redirect to dashboard after success
        } catch (error) {
            alert('Failed to register complaint. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
                <h2 className="text-2xl font-bold mb-6">Register New Complaint</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Complaint Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Service Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        >
                            <option value="STORE">In-Store Repair (I will bring the device)</option>
                            <option value="OUTDOOR">Outdoor Service (Technician visits me)</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Problem Description</label>
                        <textarea
                            required
                            rows="4"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="e.g., AC not cooling, Laptop screen broken..."
                        />
                    </div>

                    {/* Address (Only if Outdoor) */}
                    {formData.type === 'OUTDOOR' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Service Address</label>
                            <textarea
                                required
                                rows="2"
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                placeholder="Your full address..."
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    >
                        {loading ? 'Submitting...' : 'Submit Complaint'}
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default NewComplaint;