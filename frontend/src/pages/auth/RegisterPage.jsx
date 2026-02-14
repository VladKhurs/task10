import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function RegisterPage({ onRegister }) {
    const { register, handleSubmit } = useForm();

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2 className="page-title" style={{textAlign: 'center'}}>Регистрация</h2>
                <form onSubmit={handleSubmit(onRegister)} className="form-group">
                    <Input register={register} name="email" placeholder="Email" options={{ required: true }} />
                    <Input register={register} name="password" type="password" placeholder="Пароль" options={{ required: true }} />
                    <Input register={register} name="surname" placeholder="Фамилия" />
                    <Input register={register} name="name" placeholder="Имя" />
                    <Input register={register} name="patronymic" placeholder="Отчество" />
                    <Input register={register} name="phone" placeholder="Телефон" />
                    <Button type="submit">Зарегистрироваться</Button>
                </form>
            </div>
        </div>
    );
}