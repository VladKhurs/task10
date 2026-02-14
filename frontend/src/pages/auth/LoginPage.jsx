import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function LoginPage({ onLogin }) {
    const { register, handleSubmit } = useForm();

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2 className="page-title" style={{textAlign: 'center'}}>Вход</h2>
                <form onSubmit={handleSubmit(onLogin)} className="form-group">
                    <Input register={register} name="email" placeholder="Email" options={{ required: true }} />
                    <Input register={register} name="password" type="password" placeholder="Пароль" options={{ required: true }} />
                    <Button type="submit">Войти</Button>
                </form>
            </div>
        </div>
    );
}