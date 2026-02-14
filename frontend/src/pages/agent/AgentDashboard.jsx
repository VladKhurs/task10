import React, { useEffect, useState } from 'react';
import Button from '../../components/ui/Button';
import api from '../../api/axiosConfig';

export default function AgentDashboard({ onAddBalance }) {
    const [users, setUsers] = useState([]);
    const [topUpAmounts, setTopUpAmounts] = useState({});

    // Загрузка пользователей
    const fetchUsers = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('user_data'))?.token;
            const res = await api.get('/users', {
                headers: { Authorization: token }
            });
            
            // --- ИЗМЕНЕНО: Фильтруем, оставляем только role === 'customer' ---
            const customersOnly = res.data.filter(u => u.role === 'customer');
            setUsers(customersOnly);
            
        } catch (e) {
            console.error("Не удалось загрузить пользователей", e);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAmountChange = (userId, value) => {
        setTopUpAmounts(prev => ({ ...prev, [userId]: value }));
    };

    const handleTopUpClick = async (user) => {
        const amount = topUpAmounts[user.id];
        if (!amount || amount <= 0) return alert("Введите корректную сумму");

        await onAddBalance({ userId: user.id, amount: parseFloat(amount) });
        
        setTopUpAmounts(prev => ({ ...prev, [user.id]: "" }));
        fetchUsers(); // Обновляем баланс в таблице
    };

    return (
        <div className="p-4 max-w-7xl mx-auto space-y-10">
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-2xl font-bold mb-6 text-theme">Управление пользователями</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead className="bg-theme text-white uppercase">
                            <tr>
                                <th className="p-3 rounded-tl-lg">ID</th>
                                <th className="p-3">ФИО</th>
                                <th className="p-3">Email / Телефон</th>
                                <th className="p-3">Текущий баланс</th>
                                <th className="p-3 rounded-tr-lg">Пополнить</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50 transition">
                                    <td className="p-3 font-bold text-gray-500">#{user.id}</td>
                                    <td className="p-3">
                                        <div className="font-semibold">{user.surname} {user.name} {user.patronymic}</div>
                                    </td>
                                    <td className="p-3">
                                        <div>{user.email}</div>
                                        <div className="text-xs text-gray-500">{user.phone || "Нет телефона"}</div>
                                    </td>
                                    <td className="p-3 text-lg font-bold text-theme">
                                        {user.balance} ₽
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="number" 
                                                placeholder="Сумма" 
                                                className="border border-gray-300 rounded px-2 py-1 w-24 focus:outline-theme"
                                                value={topUpAmounts[user.id] || ""}
                                                onChange={(e) => {
                                                    const value  = e.target.value
                                                    if (value > 0) {
                                                        handleAmountChange(user.id, value)
                                                    } else {
                                                        handleAmountChange(user.id, 1)
                                                    }
                                                    
                                                }}
                                            />
                                            <Button 
                                                onClick={() => handleTopUpClick(user)}
                                                className="py-1 px-3 text-xs bg-green-600 hover:bg-green-700"
                                            >
                                                Пополнить
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-4 text-center text-gray-500">Нет пользователей</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}