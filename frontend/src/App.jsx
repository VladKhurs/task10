import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import api from "./api/axiosConfig";
import LinkCustom from "./components/ui/LinkCustom";
import AuthPage from "./pages/AuthPage";
import FlightsPage from "./pages/FlightsPage";

function App() {
    const [user, setUser] = useState(null);
    const [flights, setFlights] = useState([]);
    const navigate = useNavigate();
    
    const fetchFlights = async () => {
        try {
            const res = await api.get("/flights");
            setFlights(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedRole = localStorage.getItem("roleName");
        if (storedToken && storedRole) {
            setUser({ token: storedToken, roleName: storedRole });
        }
        fetchFlights();
    }, []);


    const handleLogin = async (login, password) => {
        try {
            const res = await api.post("/login", { login, password });
            const userData = res.data;
            setUser(userData);
            localStorage.setItem("token", userData.token);
            localStorage.setItem("roleName", userData.roleName);
            navigate("/");
        } catch (e) {
            alert("Ошибка входа");
        }
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("roleName");
        navigate("/login");
    };

    const getAuthHeader = () => {
        return { headers: { Authorization: user?.token } };
    };

    const createFlight = async (flightData) => {
        try {
            await api.post("/flights", flightData, getAuthHeader());
            fetchFlights();
        } catch (e) {
            alert("Ошибка создания рейса");
        }
    };

    const updateFlight = async (id, flightData) => {
        try {
            await api.put(`/flights/${id}`, flightData, getAuthHeader());
            fetchFlights();
        } catch (e) {
            alert("Ошибка обновления рейса");
        }
    };

    const deleteFlight = async (id) => {
        if (!confirm("Удалить рейс?")) return;
        try {
            await api.delete(`/flights/${id}`, getAuthHeader());
            fetchFlights();
        } catch (e) {
            alert("Ошибка удаления рейса");
        }
    };

    const addCrew = async (crewData) => {
        try {
            await api.post("/crew", crewData, getAuthHeader());
            fetchFlights();
        } catch (e) {
            alert("Ошибка добавления сотрудника");
        }
    };

    const updateCrew = async (id, crewData) => {
        try {
            await api.put(`/crew/${id}`, crewData, getAuthHeader());
            fetchFlights();
        } catch (e) {
            alert("Ошибка обновления сотрудника");
        }
    };

    const deleteCrew = async (id) => {
        if (!confirm("Удалить сотрудника?")) return;
        try {
            await api.delete(`/crew/${id}`, getAuthHeader());
            fetchFlights();
        } catch (e) {
            alert("Ошибка удаления сотрудника");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            <nav className="bg-theme min-h-16 py-3 md:py-0 flex flex-col md:flex-row items-center justify-between px-4 md:px-8 shadow-md gap-3 md:gap-0">
                <div className="text-white font-bold text-lg md:text-xl text-center md:text-left">Система авиакомпания</div>
                <div className="flex items-center flex-wrap justify-center gap-2">
                    <LinkCustom to="/">Рейсы</LinkCustom>
                    {!user ? (
                        <LinkCustom to="/login">Войти</LinkCustom>
                    ) : (
                        <div className="flex items-center gap-4">
                            <span className="text-gray-300 text-xs md:text-sm border p-1 rounded border-gray-600">{user.roleName}</span>
                            <button onClick={handleLogout} className="text-accent hover:text-white transition font-medium text-sm md:text-base">Выйти</button>
                        </div>
                    )}
                </div>
            </nav>

            <Routes>
                <Route path="/" element={
                    <FlightsPage 
                        flights={flights} 
                        user={user}
                        onAddFlight={createFlight}
                        onUpdateFlight={updateFlight}
                        onDeleteFlight={deleteFlight}
                        onAddCrew={addCrew}
                        onUpdateCrew={updateCrew}
                        onDeleteCrew={deleteCrew}
                    />
                } />
                <Route path="/login" element={<AuthPage onLogin={handleLogin} />} />
            </Routes>
        </div>
    );
}

export default App;