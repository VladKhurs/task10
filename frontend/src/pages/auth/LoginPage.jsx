import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function LoginPage({ onLogin }) {
    const { register, handleSubmit } = useForm();

    return (
        <div className="flex flex-col items-center mt-10">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-theme">Вход</h2>
                <form onSubmit={handleSubmit(onLogin)} className="flex flex-col gap-4">
                    <Input register={register} name="email" placeholder="Email" options={{ required: true }} />
                    <Input register={register} name="password" type="password" placeholder="Пароль" options={{ required: true }} />
                    <Button type="submit">Войти</Button>
                </form>
            </div>
        </div>
    );
}