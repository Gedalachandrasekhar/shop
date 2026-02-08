import { useState, useEffect, useContext } from 'react';
import api from '../../api/axios';
import Layout from '../../components/Layout';
import AuthContext from '../../context/AuthContext';

const Timesheet = () => {
    const [data, setData] = useState([]);
    const [weekDates, setWeekDates] = useState([]);
    const { user } = useContext(AuthContext); // Get current user to check role

    // Helper: Get dates for current Mon-Sun
    const getWeekDates = () => {
        const curr = new Date();
        const first = curr.getDate() - curr.getDay() + 1;
        const dates = [];
        for (let i = 0; i < 7; i++) {
            let day = new Date(curr.setDate(first + i));
            dates.push(day.toISOString().split('T')[0]);
        }
        return dates;
    };

    useEffect(() => {
        setWeekDates(getWeekDates());
        api.get('/attendance/timesheet/')
           .then(res => setData(res.data))
           .catch(err => console.error(err));
    }, []);

    const handleManualUpdate = async (userId, dateStr) => {
        // SECURITY CHECK: Block non-admins
        if (user?.role !== 'ADMIN') {
            alert("Only Admins can manually edit timesheets.");
            return;
        }

        const newStatus = prompt(`Update status for ${dateStr} (PRESENT, ABSENT, LATE):`, "PRESENT");
        if (!newStatus) return;

        try {
            await api.patch('/attendance/timesheet/', {
                user_id: userId,
                date: dateStr,
                status: newStatus.toUpperCase()
            });
            alert("Updated!");
            window.location.reload();
        } catch (err) {
            alert("Update failed");
        }
    };

    // Helper to determine cell classes based on role
    const getCellClass = (isAdmin) => {
        return `px-4 py-4 transition ${isAdmin ? 'cursor-pointer hover:bg-indigo-50 hover:text-indigo-600' : ''}`;
    };

    const isAdmin = user?.role === 'ADMIN';

    return (
        <Layout>
            <h1 className="text-3xl font-bold mb-6">Weekly Timesheet</h1>
            <div className="bg-white shadow overflow-x-auto rounded-lg">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase font-medium">
                        <tr>
                            <th className="px-4 py-3">Employee</th>
                            <th className="px-4 py-3">Monday <br/><span className="text-xs text-gray-400">{weekDates[0]}</span></th>
                            <th className="px-4 py-3">Tuesday <br/><span className="text-xs text-gray-400">{weekDates[1]}</span></th>
                            <th className="px-4 py-3">Wednesday <br/><span className="text-xs text-gray-400">{weekDates[2]}</span></th>
                            <th className="px-4 py-3">Thursday <br/><span className="text-xs text-gray-400">{weekDates[3]}</span></th>
                            <th className="px-4 py-3">Friday <br/><span className="text-xs text-gray-400">{weekDates[4]}</span></th>
                            <th className="px-4 py-3">Saturday <br/><span className="text-xs text-gray-400">{weekDates[5]}</span></th>
                            <th className="px-4 py-3 text-red-600">Sunday <br/><span className="text-xs text-red-300">{weekDates[6]}</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {data.map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-4 py-4 font-medium">{row.name}</td>

                                {/* Monday */}
                                <td
                                    onClick={() => handleManualUpdate(row.id, weekDates[0])}
                                    className={getCellClass(isAdmin)}
                                    title={isAdmin ? "Click to Edit" : ""}
                                >
                                    {row.week_status.Monday} {isAdmin && '✎'}
                                </td>

                                {/* Tuesday */}
                                <td
                                    onClick={() => handleManualUpdate(row.id, weekDates[1])}
                                    className={getCellClass(isAdmin)}
                                >
                                    {row.week_status.Tuesday} {isAdmin && '✎'}
                                </td>

                                {/* Wednesday */}
                                <td
                                    onClick={() => handleManualUpdate(row.id, weekDates[2])}
                                    className={getCellClass(isAdmin)}
                                >
                                    {row.week_status.Wednesday} {isAdmin && '✎'}
                                </td>

                                {/* Thursday */}
                                <td
                                    onClick={() => handleManualUpdate(row.id, weekDates[3])}
                                    className={getCellClass(isAdmin)}
                                >
                                    {row.week_status.Thursday} {isAdmin && '✎'}
                                </td>

                                {/* Friday */}
                                <td
                                    onClick={() => handleManualUpdate(row.id, weekDates[4])}
                                    className={getCellClass(isAdmin)}
                                >
                                    {row.week_status.Friday} {isAdmin && '✎'}
                                </td>

                                {/* Saturday */}
                                <td
                                    onClick={() => handleManualUpdate(row.id, weekDates[5])}
                                    className={getCellClass(isAdmin)}
                                >
                                    {row.week_status.Saturday} {isAdmin && '✎'}
                                </td>

                                {/* Sunday */}
                                <td
                                    onClick={() => handleManualUpdate(row.id, weekDates[6])}
                                    className={`px-4 py-4 font-bold ${isAdmin ? 'cursor-pointer hover:bg-gray-200' : ''} ${row.week_status.Sunday.includes('ABSENT') ? 'text-red-600' : 'text-green-600'}`}
                                >
                                    {row.week_status.Sunday}
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