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
        <div className="p-4">
            {user?.role === 'agent' && (
                <div className="mb-6 flex justify-center">
                    <Button onClick={onOpenCreate}>+ Добавить тур</Button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tours.map(tour => {
                    const isPurchased = user?.purchasedTourIds?.includes(tour.id);
                    const finalPrice = tour.discountPrice || tour.price;

                    return (
                        <div key={tour.id} className="bg-white border rounded-lg shadow hover:shadow-lg transition p-5 relative flex flex-col h-full">
                            {tour.isHot && (
                                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                    ГОРЯЩИЙ
                                </span>
                            )}
                            
                            <h3 className="text-xl font-bold text-theme mb-2">{tour.name}</h3>
                            <div className="text-sm text-gray-600 mb-4">
                                <p>{tour.origin} &rarr; {tour.destination}</p>
                                <p>{formatDate(tour.dateStart)} - {formatDate(tour.dateEnd)}</p>
                                <p className="italic text-gray-400">{tour.tour_type}</p>
                            </div>

                            <div className="mt-auto">
                                <div className="flex items-end gap-2 mb-4">
                                    <span className="text-2xl font-bold text-theme">{finalPrice} ₽</span>
                                    {tour.discountPrice && (
                                        <span className="text-sm text-gray-400 line-through mb-1">{tour.price} ₽</span>
                                    )}
                                </div>

                                {user?.role === 'customer' && (
                                    <Button 
                                        className={`w-full ${isPurchased ? 'bg-green-600 hover:bg-green-700' : ''}`}
                                        onClick={() => onBuy(tour.id)}
                                        disabled={isPurchased}
                                    >
                                        {isPurchased ? 'Куплено' : 'Купить'}
                                    </Button>
                                )}

                                {user?.role === 'agent' && (
                                    <div className="flex gap-2">
                                        <Button className="w-1/2 bg-blue-600 hover:bg-blue-700" onClick={() => onEdit(tour)}>
                                            Изменить
                                        </Button>
                                        <Button className="w-1/2 bg-red-600 hover:bg-red-700" onClick={() => onDelete(tour.id)}>
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