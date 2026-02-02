import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function RegisterPage({ onRegister }) {
    const { register, handleSubmit } = useForm();

    return (
        <div className="flex flex-col items-center mt-10">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-theme">Регистрация</h2>
                <form onSubmit={handleSubmit(onRegister)} className="flex flex-col gap-4">
                    <Input register={register} name="email" placeholder="Email" options={{ required: true }} />
                    <Input register={register} name="password" type="password" placeholder="Пароль" options={{ required: true }} />
                    <Input register={register} name="name" placeholder="Имя" />
                    <Input register={register} name="surname" placeholder="Фамилия" />
                    <Input register={register} name="patronymic" placeholder="Отчество" />
                    <Input register={register} name="phone" placeholder="Телефон" />
                    <Button type="submit">Зарегистрироваться</Button>
                </form>
            </div>
        </div>
    );
}