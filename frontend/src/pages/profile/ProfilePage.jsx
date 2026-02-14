import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { formatDate } from '../../utils/formatters';

export default function ProfilePage({ userToken }) {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/profile', {
                    headers: { Authorization: userToken }
                });
                setProfileData(res.data);
            } catch (e) {
                console.error("Ошибка загрузки профиля", e);
            } finally {
                setLoading(false);
            }
        };

        if (userToken) {
            fetchProfile();
        }
    }, [userToken]);

    if (loading) return <div className="p-10 text-center">Загрузка...</div>;
    if (!profileData) return <div className="p-10 text-center">Не удалось загрузить данные</div>;

    const { user, orders } = profileData;

    return (
        <div className="max-w-4xl mx-auto mt-8 p-4">
            <h1 className="text-3xl font-bold text-theme mb-6">Личный кабинет</h1>

            {/* Карточка пользователя */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h2 className="text-2xl font-semibold mb-2">{user.surname} {user.name} {user.patronymic}</h2>
                    <p className="text-gray-600">Email: {user.email}</p>
                    <p className="text-gray-600">Телефон: {user.phone || 'Не указан'}</p>
                </div>
                <div className="mt-4 md:mt-0 text-right bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Ваш баланс</p>
                    <p className="text-3xl font-bold text-accent text-theme">{user.balance} ₽</p>
                </div>
            </div>

            {/* История заказов (Только для клиентов, или для агентов, если они тоже покупают) */}
            <h2 className="text-xl font-bold text-theme mb-4">Мои путешествия</h2>
            
            {orders.length === 0 ? (
                <div className="bg-white p-8 rounded shadow text-center text-gray-500">
                    У вас пока нет купленных туров.
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="p-4">Название тура</th>
                                <th className="p-4">Направление</th>
                                <th className="p-4">Даты</th>
                                <th className="p-4 text-right">Стоимость</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium text-theme">
                                        {order.tour?.name}
                                        {order.tour?.isHot && <span className="ml-2 text-red-500 text-xs font-bold">горящий</span>}
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {order.tour?.origin} &rarr; {order.tour?.destination}
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {formatDate(order.tour?.dateStart)} - {formatDate(order.tour?.dateEnd)}
                                    </td>
                                    <td className="p-4 text-right font-bold text-gray-700">
                                        {(order.tour?.discountPrice || order.tour?.price)} ₽
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}