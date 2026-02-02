import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { formatDate } from '../../utils/formatters';

export default function AgentDashboard({ orders, onAddBalance }) {
    const { register, handleSubmit, reset } = useForm();

    const onSubmitBalance = (data) => {
        onAddBalance(data);
        reset();
    };

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <div className="mb-10 bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-4 text-theme">Пополнить баланс пользователя</h2>
                <form onSubmit={handleSubmit(onSubmitBalance)} className="flex gap-4 items-end">
                    <div className="w-1/3">
                        <label className="block text-sm mb-1">ID пользователя</label>
                        <Input register={register} name="userId" placeholder="ID" options={{ required: true }} />
                    </div>
                    <div className="w-1/3">
                        <label className="block text-sm mb-1">Сумма</label>
                        <Input register={register} type="number" name="amount" placeholder="0.00" options={{ required: true }} />
                    </div>
                    <Button type="submit">Пополнить</Button>
                </form>
            </div>

            <h2 className="text-2xl font-bold mb-4 text-theme">Все заказы</h2>
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100 uppercase text-gray-600">
                        <tr>
                            <th className="p-3">ID Заказа</th>
                            <th className="p-3">Тур</th>
                            <th className="p-3">Клиент (ID)</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Дата создания</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{order.id}</td>
                                <td className="p-3 font-medium">{order.Tour?.name}</td>
                                <td className="p-3">{order.User?.name} {order.User?.surname} ({order.UserId})</td>
                                <td className="p-3">{order.User?.email}</td>
                                <td className="p-3">{formatDate(order.createdAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {orders.length === 0 && <div className="p-4 text-center text-gray-500">Заказов пока нет</div>}
            </div>
        </div>
    );
}