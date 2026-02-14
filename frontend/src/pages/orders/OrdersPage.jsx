import React from 'react';
import { formatDateTime } from '../../utils/formatters'; // <-- ИЗМЕНЕН ИМПОРТ

export default function OrdersPage({ orders }) {
    console.log('orders', orders);
    return (
        <div className="p-4 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-theme">Все заказы агентства</h2>
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100 uppercase text-gray-600 border-b-2 border-gray-200">
                        <tr>
                            <th className="p-3">ID</th>
                            <th className="p-3">Тур</th>
                            <th className="p-3">Клиент (ФИО)</th>
                            <th className="p-3">Телефон</th>
                            <th className="p-3">Стоимость</th>
                            <th className="p-3">Дата и Время</th> {/* <-- Заголовок */}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map(order => {
                            const clientName = order.user 
                                ? `${order.user.surname || ''} ${order.user.name || ''} ${order.user.patronymic || ''}`.trim() 
                                : 'Удален';
                            const clientPhone = order.user?.phone || '—';
                            const price = order.tour?.discountPrice || order.tour?.price;

                            return (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="p-3 text-gray-500">#{order.id}</td>
                                    <td className="p-3">
                                        <span className="font-semibold block">{order.tour?.name}</span>
                                        <span className="text-xs text-gray-500">{order.tour?.origin} &rarr; {order.tour?.destination}</span>
                                    </td>
                                    <td className="p-3 font-medium text-gray-800">
                                        {clientName || `ID: ${order.user?.id}`}
                                    </td>
                                    <td className="p-3 whitespace-nowrap">
                                        {clientPhone}
                                    </td>
                                    <td className="p-3 font-bold text-theme">
                                        {price} ₽
                                    </td>
                                    {/* --- ИСПОЛЬЗУЕМ formatDateTime --- */}
                                    <td className="p-3 text-gray-700 whitespace-nowrap">
                                        {formatDateTime(order.createdAt)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {orders.length === 0 && <div className="p-6 text-center text-gray-500">Заказов пока нет</div>}
            </div>
        </div>
    );
}