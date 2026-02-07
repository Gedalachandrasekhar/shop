import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Layout from '../../components/Layout';

const InventoryPage = () => {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', sku: '', quantity: 0, unit_price: 0 });

    const fetchInventory = async () => {
        try {
            const res = await api.get('/inventory/items/');
            setItems(res.data);
        } catch (err) {
            alert('Failed to fetch inventory');
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            await api.post('/inventory/items/', newItem);
            setNewItem({ name: '', sku: '', quantity: 0, unit_price: 0 });
            fetchInventory(); // Refresh list
        } catch (err) {
            alert('Error adding item');
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    return (
        <Layout>
            <h3 className="text-3xl font-medium text-gray-700">Inventory Management</h3>

            {/* Add Item Form */}
            <div className="mt-4">
                <form onSubmit={handleAddItem} className="flex gap-4 p-4 bg-white shadow rounded-lg">
                    <input placeholder="Item Name" className="border p-2 rounded" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} required />
                    <input placeholder="SKU" className="border p-2 rounded" value={newItem.sku} onChange={e => setNewItem({...newItem, sku: e.target.value})} required />
                    <input type="number" placeholder="Qty" className="border p-2 rounded w-20" value={newItem.quantity} onChange={e => setNewItem({...newItem, quantity: e.target.value})} required />
                    <input type="number" placeholder="Price" className="border p-2 rounded w-24" value={newItem.unit_price} onChange={e => setNewItem({...newItem, unit_price: e.target.value})} required />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">Add Item</button>
                </form>
            </div>

            {/* Inventory Table */}
            <div className="flex flex-col mt-8">
                <div className="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    <div className="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-50 border-b border-gray-200">Name</th>
                                    <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-50 border-b border-gray-200">SKU</th>
                                    <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-50 border-b border-gray-200">Quantity</th>
                                    <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-50 border-b border-gray-200">Price</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">{item.name}</td>
                                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">{item.sku}</td>
                                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.quantity < 5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                {item.quantity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">${item.unit_price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default InventoryPage;