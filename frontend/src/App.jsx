import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import api from "./api/axiosConfig";
import LinkCustom from "./components/ui/LinkCustom";
import Button from "./components/ui/Button";
import TourModal from "./components/modals/TourModal";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ToursPage from "./pages/tours/ToursPage";
import AgentDashboard from "./pages/agent/AgentDashboard";
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
                purchasedTourIds: res.data.purchasedTourIds
            };
            setUser(userData);
            localStorage.setItem('user_data', JSON.stringify(userData));
            navigate('/');
        } catch (e) {
            showAlert(e.response?.data?.message || 'Ошибка входа');
        }
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user_data');
        navigate('/');
    };

    const handleBuyTour = async (tourId) => {
        try {
            await api.post('/buy', { tourId }, {
                headers: { Authorization: user.token }
            });
            showAlert('Тур успешно куплен!');
            
            const updatedUser = { ...user, purchasedTourIds: [...user.purchasedTourIds, tourId] };
            setUser(updatedUser);
            localStorage.setItem('user_data', JSON.stringify(updatedUser));
        } catch (e) {
            showAlert(e.response?.data?.message || 'Ошибка покупки');
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
            const res = await api.post('/balance', data, {
                headers: { Authorization: user.token }
            });
            showAlert(`Баланс пополнен. Текущий баланс пользователя: ${res.data.balance}`);
        } catch (e) {
            showAlert(e.response?.data?.message || 'Ошибка пополнения');
        }
    };

    return (
        <div className="p-3 min-h-screen bg-gray-50">
            <nav className="bg-theme h-16 rounded-md flex flex-row items-center justify-between px-6 shadow-md mb-4">
                <div className="flex items-center">
                    <div className="text-white font-bold text-lg mr-6">Travel Agency</div>
                    <LinkCustom to="/">Туры</LinkCustom>
                    {user?.role === 'agent' && <LinkCustom to="/orders">Управление</LinkCustom>}
                </div>
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <span className="text-white font-medium">{user.role === 'agent' ? 'Агент' : 'Клиент'}</span>
                            <Button onClick={handleLogout} className="bg-accent text-theme hover:bg-accent-hover py-1">Выйти</Button>
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
                <Route path="/" element={
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
                <Route path="/orders" element={
                    user?.role === 'agent' ? 
                    <AgentDashboard orders={orders} onAddBalance={handleAddBalance} /> : 
                    <div className="text-center mt-10">Доступ запрещен</div>
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