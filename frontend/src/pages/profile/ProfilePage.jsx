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
        </div>
    );
}