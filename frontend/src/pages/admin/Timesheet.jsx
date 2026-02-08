import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Layout from '../../components/Layout';

const Timesheet = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        api.get('/attendance/timesheet/')
           .then(res => setData(res.data))
           .catch(err => console.error(err));
    }, []);

    return (
        <Layout>
            <h1 className="text-3xl font-bold mb-6">Weekly Timesheet</h1>
            <div className="bg-white shadow overflow-x-auto rounded-lg">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase font-medium">
                        <tr>
                            <th className="px-4 py-3">Employee</th>
                            <th className="px-4 py-3">Monday</th>
                            <th className="px-4 py-3">Tuesday</th>
                            <th className="px-4 py-3">Wednesday</th>
                            <th className="px-4 py-3">Thursday</th>
                            <th className="px-4 py-3">Friday</th>
                            <th className="px-4 py-3">Saturday</th>
                            <th className="px-4 py-3 text-red-600">Sunday</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {data.map((user, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-4 py-4 font-medium">{user.name}</td>
                                <td className="px-4 py-4">{user.week_status.Monday}</td>
                                <td className="px-4 py-4">{user.week_status.Tuesday}</td>
                                <td className="px-4 py-4">{user.week_status.Wednesday}</td>
                                <td className="px-4 py-4">{user.week_status.Thursday}</td>
                                <td className="px-4 py-4">{user.week_status.Friday}</td>
                                <td className="px-4 py-4">{user.week_status.Saturday}</td>
                                <td className={`px-4 py-4 font-bold ${user.week_status.Sunday.includes('ABSENT') ? 'text-red-600' : 'text-green-600'}`}>
                                    {user.week_status.Sunday}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default Timesheet;