import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';

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

    if (loading) return <div style={{ padding: '2.5rem', textAlign: 'center' }}>Загрузка...</div>;
    if (!profileData) return <div style={{ padding: '2.5rem', textAlign: 'center' }}>Не удалось загрузить данные</div>;

    const { user } = profileData;

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <h1 className="page-title">Личный кабинет</h1>

            <div className="profile-card">
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>{user.surname} {user.name} {user.patronymic}</h2>
                    <p style={{ color: 'var(--text-light)', marginBottom: '0.25rem' }}>Email: {user.email}</p>
                    <p style={{ color: 'var(--text-light)' }}>Телефон: {user.phone || 'Не указан'}</p>
                </div>
                <div className="balance-box">
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Ваш баланс</p>
                    <p className="balance-amount">{user.balance} BYN</p>
                </div>
            </div>
        </div>
    );
}