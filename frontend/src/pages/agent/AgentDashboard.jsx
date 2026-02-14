import React, { useEffect, useState } from 'react';
import Button from '../../components/ui/Button';
import api from '../../api/axiosConfig';

export default function AgentDashboard({ onAddBalance }) {
    const [users, setUsers] = useState([]);
    const [topUpAmounts, setTopUpAmounts] = useState({});

    const fetchUsers = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('user_data'))?.token;
            const res = await api.get('/users', {
                headers: { Authorization: token }
            });
            
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
        fetchUsers();
    };

    return (
        <div className="container" style={{marginTop: '2rem'}}>
            <div style={{backgroundColor: 'var(--white)', padding: '1.5rem', borderRadius: '8px', boxShadow: 'var(--shadow)'}}>
                <h2 className="page-title">Управление пользователями</h2>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>ФИО</th>
                                <th>Email / Телефон</th>
                                <th>Текущий баланс</th>
                                <th>Пополнить</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td style={{fontWeight: 'bold', color: 'var(--text-light)'}}>#{user.id}</td>
                                    <td>
                                        <div style={{fontWeight: 600}}>{user.surname} {user.name} {user.patronymic}</div>
                                    </td>
                                    <td>
                                        <div>{user.email}</div>
                                        <div style={{fontSize: '0.75rem', color: 'var(--text-light)'}}>{user.phone || "Нет телефона"}</div>
                                    </td>
                                    <td style={{fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--theme)'}}>
                                        {user.balance} ₽
                                    </td>
                                    <td>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                            <input 
                                                type="number" 
                                                placeholder="Сумма" 
                                                className="input-field"
                                                style={{width: '100px', padding: '0.25rem 0.5rem'}}
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
                                                className="btn-success"
                                                style={{padding: '0.25rem 0.75rem', fontSize: '0.75rem'}}
                                            >
                                                Пополнить
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{padding: '1rem', textAlign: 'center', color: 'var(--text-light)'}}>Нет пользователей</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}