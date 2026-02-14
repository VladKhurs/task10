import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import api from "./api/axiosConfig";
import LinkCustom from "./components/ui/LinkCustom";
import Button from "./components/ui/Button";
import TourModal from "./components/modals/TourModal";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ToursPage from "./pages/tours/ToursPage";
import AgentDashboard from "./pages/agent/AgentDashboard";
import OrdersPage from "./pages/orders/OrdersPage";
import ProfilePage from "./pages/profile/ProfilePage";
import AlertModal from "./components/modals/ArertModal";

function App() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [tours, setTours] = useState([]);
    const [orders, setOrders] = useState([]);

    const [alertData, setAlertData] = useState({ isVisible: false, text: "" });
    const [tourModalData, setTourModalData] = useState({ isVisible: false, data: null });

    const showAlert = (text) => setAlertData({ isVisible: true, text });

    const fetchTours = async () => {
        try {
            const res = await api.get('/tours');
            setTours(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders', {
                headers: { Authorization: user.token }
            });
            setOrders(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user_data');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchTours();
    }, []);

    useEffect(() => {
        if (user?.role === 'agent') {
            fetchOrders();
        }
    }, [user]);

    const handleRegister = async (data) => {
        try {
            await api.post('/register', data);
            showAlert('Регистрация успешна! Теперь войдите.');
            navigate('/login');
        } catch (e) {
            showAlert(e.response?.data?.message || 'Ошибка регистрации');
        }
    };

    const handleLogin = async (data) => {
        try {
            const res = await api.post('/login', data);
            const userData = {
                token: res.data.token,
                role: res.data.roleName,
                purchasedTourIds: res.data.purchasedTourIds,
                name: res.data.name,
                balance: res.data.balance
            };
            setUser(userData);
            localStorage.setItem('user_data', JSON.stringify(userData));
            navigate('/tours');
        } catch (e) {
            showAlert(e.response?.data?.message || 'Ошибка входа');
        }
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user_data');
        navigate('/login');
    };

    const handleBuyTour = async (tourId) => {
        try {
            const res = await api.post('/buy', { tourId }, {
                headers: { Authorization: user.token }
            });
            showAlert('Тур успешно куплен!');

            const updatedUser = {
                ...user,
                purchasedTourIds: [...user.purchasedTourIds, tourId],
                balance: res.data.newBalance
            };
            setUser(updatedUser);
            localStorage.setItem('user_data', JSON.stringify(updatedUser));
        } catch (e) {
            const errorMsg = e.response?.data?.message || e.response?.data || 'Ошибка покупки';
            showAlert(errorMsg);
        }
    };

    const handleCreateTour = async (data) => {
        try {
            await api.post('/tours', data, {
                headers: { Authorization: user.token }
            });
            setTourModalData({ isVisible: false, data: null });
            fetchTours();
        } catch (e) {
            showAlert(e.response?.data?.message || 'Ошибка создания');
        }
    };

    const handleUpdateTour = async (data) => {
        try {
            await api.put(`/tours/${tourModalData.data.id}`, data, {
                headers: { Authorization: user.token }
            });
            setTourModalData({ isVisible: false, data: null });
            fetchTours();
        } catch (e) {
            showAlert(e.response?.data?.message || 'Ошибка обновления');
        }
    };

    const handleDeleteTour = async (id) => {
        if (!confirm('Удалить тур?')) return;
        try {
            await api.delete(`/tours/${id}`, {
                headers: { Authorization: user.token }
            });
            fetchTours();
        } catch (e) {
            showAlert(e.response?.data?.message || 'Ошибка удаления');
        }
    };

    const handleAddBalance = async (data) => {
        try {
            await api.post('/balance', data, {
                headers: { Authorization: user.token }
            });
            showAlert(`Баланс пополнен`);
        } catch (e) {
            showAlert(e.response?.data?.message || 'Ошибка пополнения');
        }
    };

    return (
        <div className="app-container">
            <nav className="navbar">
                <div className="nav-left">
                    <div className="nav-logo">Travel Agency</div>
                    <LinkCustom to="/tours">Туры</LinkCustom>

                    {user?.role === 'agent' && (
                        <>
                            <LinkCustom to="/users">Пользователи</LinkCustom>
                            <LinkCustom to="/orders">Заказы</LinkCustom>
                        </>
                    )}
                </div>
                <div className="nav-right">
                    {user ? (
                        <>
                            {user.role === 'customer' && (
                                <>
                                    <div className="nav-balance">
                                        {user.balance} ₽
                                    </div>
                                    <LinkCustom to="/profile">Кабинет</LinkCustom>
                                </>
                            )}
                            <Button onClick={handleLogout} className="btn-logout">Выйти</Button>
                        </>
                    ) : (
                        <>
                            <LinkCustom to="/login">Вход</LinkCustom>
                            <LinkCustom to="/register">Регистрация</LinkCustom>
                        </>
                    )}
                </div>
            </nav>

            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/tours" element={
                    <ToursPage
                        tours={tours}
                        user={user}
                        onBuy={handleBuyTour}
                        onDelete={handleDeleteTour}
                        onEdit={(tour) => setTourModalData({ isVisible: true, data: tour })}
                        onOpenCreate={() => setTourModalData({ isVisible: true, data: null })}
                    />
                } />
                <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                <Route path="/register" element={<RegisterPage onRegister={handleRegister} />} />

                <Route path="/profile" element={
                    user ? <ProfilePage userToken={user.token} /> : <div style={{textAlign: 'center', marginTop: '2.5rem'}}>Пожалуйста, войдите в систему</div>
                } />

                <Route path="/users" element={
                    user?.role === 'agent' ?
                        <AgentDashboard onAddBalance={handleAddBalance} /> :
                        <div style={{textAlign: 'center', marginTop: '2.5rem'}}>Доступ запрещен</div>
                } />

                <Route path="/orders" element={
                    user?.role === 'agent' ?
                        <OrdersPage orders={orders} /> :
                        <div style={{textAlign: 'center', marginTop: '2.5rem'}}>Доступ запрещен</div>
                } />
            </Routes>

            <AlertModal
                isVisible={alertData.isVisible}
                setIsVisible={(v) => setAlertData(p => ({ ...p, isVisible: v }))}
                alertText={alertData.text}
            />

            <TourModal
                isVisible={tourModalData.isVisible}
                setIsVisible={(v) => setTourModalData(p => ({ ...p, isVisible: v }))}
                initialData={tourModalData.data}
                onSubmit={tourModalData.data ? handleUpdateTour : handleCreateTour}
            />
        </div>
    );
}

export default App;