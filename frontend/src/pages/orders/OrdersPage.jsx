import React from 'react';
import { formatDateTime } from '../../utils/formatters';

export default function OrdersPage({ orders }) {
    return (
        <div className="container" style={{marginTop: '2rem'}}>
            <h2 className="page-title">Все заказы агентства</h2>
            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Тур</th>
                            <th>Клиент (ФИО)</th>
                            <th>Телефон</th>
                            <th>Стоимость</th>
                            <th>Дата и Время</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => {
                            const clientName = order.user 
                                ? `${order.user.surname || ''} ${order.user.name || ''} ${order.user.patronymic || ''}`.trim() 
                                : 'Удален';
                            const clientPhone = order.user?.phone || '—';
                            const price = order.tour?.discountPrice || order.tour?.price;

                            return (
                                <tr key={order.id}>
                                    <td style={{color: 'var(--text-light)'}}>#{order.id}</td>
                                    <td>
                                        <span style={{fontWeight: 600, display: 'block'}}>{order.tour?.name}</span>
                                        <span style={{fontSize: '0.75rem', color: 'var(--text-light)'}}>{order.tour?.origin} &rarr; {order.tour?.destination}</span>
                                    </td>
                                    <td style={{fontWeight: 500}}>
                                        {clientName || `ID: ${order.user?.id}`}
                                    </td>
                                    <td style={{whiteSpace: 'nowrap'}}>
                                        {clientPhone}
                                    </td>
                                    <td style={{fontWeight: 'bold', color: 'var(--theme)'}}>
                                        {price} ₽
                                    </td>
                                    <td style={{whiteSpace: 'nowrap'}}>
                                        {formatDateTime(order.createdAt)}
                                    </td>
                                </tr>
                            );
                        })}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{padding: '1.5rem', textAlign: 'center', color: 'var(--text-light)'}}>Заказов пока нет</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}