import { Routes, Route } from "react-router-dom";
import ClientsPage from "./pages/clients/ClientsPage.jsx";
import ServicesPage from "./pages/services/ServicesPage";
import LinkCustom from "./components/ui/LinkCustom";

function App() {

    return (
        <div className="p-3">
            <nav className="bg-theme h-14 rounded-md flex flex-row items-center justify-center">
                <LinkCustom to="/">Клиенты</LinkCustom>
                <LinkCustom to="/services">Услуги</LinkCustom>
            </nav>

            <Routes>
                <Route path="/" element={<ClientsPage/>} />
                <Route path="/services" element={<ServicesPage/>} />
            </Routes>
        </div>
    );
}

export default App;
