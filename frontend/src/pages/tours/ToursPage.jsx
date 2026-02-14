import React from 'react';
import { formatDate } from '../../utils/formatters';
import Button from '../../components/ui/Button';

export default function ToursPage({
    tours,
    user,
    onBuy,
    onDelete,
    onEdit,
    onOpenCreate
}) {
    return (
        <div className="container">
            {user?.role === 'agent' && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <Button onClick={onOpenCreate}>+ Добавить тур</Button>
                </div>
            )}

            <div className="tours-grid">
                {tours.map(tour => {
                    const isPurchased = user?.purchasedTourIds?.includes(tour.id);
                    const finalPrice = tour.discountPrice || tour.price;

                    return (
                        <div key={tour.id} className="tour-card">
                            {tour.isHot && (
                                <span className="hot-badge">
                                    ГОРЯЩИЙ
                                </span>
                            )}

                            <h3 className="tour-title">{tour.name}</h3>
                            <div className="tour-info">
                                <p>{tour.origin} &rarr; {tour.destination}</p>
                                <p>{formatDate(tour.dateStart)} - {formatDate(tour.dateEnd)}</p>
                                <p className="tour-type">{tour.tour_type}</p>
                            </div>

                            <div className="tour-price-block">
                                <div className="price-row">
                                    <span className="price-current">{finalPrice} BYN</span>
                                    {tour.discountPrice && (
                                        <span className="price-old">{tour.price} BYN</span>
                                    )}
                                </div>

                                {user?.role === 'customer' && (
                                    <Button
                                        className={isPurchased ? 'btn-success' : ''}
                                        style={{ width: '100%' }}
                                        onClick={() => onBuy(tour.id)}
                                        disabled={isPurchased}
                                    >
                                        {isPurchased ? 'Куплено' : 'Купить'}
                                    </Button>
                                )}

                                {user?.role === 'agent' && (
                                    <div className="btn-group">
                                        <Button className="btn-blue" style={{ width: '50%' }} onClick={() => onEdit(tour)}>
                                            Изменить
                                        </Button>
                                        <Button className="btn-danger" style={{ width: '50%' }} onClick={() => onDelete(tour.id)}>
                                            Удалить
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}