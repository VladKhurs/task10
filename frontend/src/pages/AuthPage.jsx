import { useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function AuthPage({ onLogin }) {
    const [formData, setFormData] = useState({ login: "", password: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(formData.login, formData.password);
    };

    return (
        <div className="flex justify-center mt-20">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-theme">Вход</h2>
                <Input
                    label="Логин"
                    value={formData.login}
                    onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                />
                <Input
                    label="Пароль"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <Button type="submit" className="w-full mt-4">Войти</Button>
            </form>
        </div>
    );
}