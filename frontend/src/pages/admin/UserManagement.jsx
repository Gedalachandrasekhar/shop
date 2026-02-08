import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Layout from '../../components/Layout';

const UserManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({
        phone: '',
        password: '',
        first_name: '',
        last_name: '',
        role: 'Employee(staff)'
    });

    // Fetch List
    const fetchEmployees = async () => {
        try {
            const res = await api.get('/users/employees/');
            setEmployees(res.data);
        } catch (err) {
            alert("Failed to load employees");
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    // Handle Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to remove this employee?")) return;
        try {
            await api.delete(`/users/employees/${id}/`);
            setEmployees(employees.filter(emp => emp.id !== id));
        } catch (err) {
            alert("Failed to delete employee");
        }
    };

    // Handle Add
    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users/employees/add/', formData);
            alert("Employee added successfully!");
            setFormData({ phone: '', password: '', first_name: '', last_name: '', role: 'TECHNICIAN' }); // Reset form
            fetchEmployees(); // Refresh list
        } catch (err) {
            alert(err.response?.data?.error || "Failed to create user. Phone might be taken.");
        }
    };

    return (
        <Layout>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Team</h1>

            {/* Add Employee Form */}
            <div className="bg-white p-6 rounded shadow mb-8">
                <h2 className="text-xl font-semibold mb-4">Add New Member</h2>
                <form onSubmit={handleAdd} className="grid gap-4 md:grid-cols-3">
                    <input
                        placeholder="Phone Number (Login ID)"
                        className="border p-2 rounded"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        required
                    />
                    <input
                        placeholder="First Name"
                        className="border p-2 rounded"
                        value={formData.first_name}
                        onChange={e => setFormData({...formData, first_name: e.target.value})}
                        required
                    />
                    <input
                        placeholder="Last Name"
                        className="border p-2 rounded"
                        value={formData.last_name}
                        onChange={e => setFormData({...formData, last_name: e.target.value})}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="border p-2 rounded"
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        required
                    />
                    <select
                        className="border p-2 rounded"
                        value={formData.role}
                        onChange={e => setFormData({...formData, role: e.target.value})}
                    >
                        <option value="TECHNICIAN">Technician</option>
                        <option value="EMPLOYEE">Employee (Staff)</option>
                    </select>
                    <button type="submit" className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
                        + Create User
                    </button>
                </form>
            </div>

            {/* Employee List */}
            <div className="bg-white rounded shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {employees.map(emp => (
                            <tr key={emp.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{emp.first_name} {emp.last_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{emp.phone}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {emp.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleDelete(emp.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default UserManagement;