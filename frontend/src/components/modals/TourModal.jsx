import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import Input from '../ui/Input';
import X from '../ui/X';

// Список доступных типов туров
const TOUR_TYPES = [
    "Отдых",
    "Экскурсия",
    "Шоппинг",
];

export default function TourModal({ isVisible, setIsVisible, onSubmit, initialData }) {
    const { register, handleSubmit, reset, setValue } = useForm();

    useEffect(() => {
        if (isVisible) {
            if (initialData) {
                // Если редактирование — заполняем поля
                Object.keys(initialData).forEach(key => {
                    setValue(key, initialData[key]);
                });
            } else {
                // Если создание — сбрасываем форму
                reset({ 
                    isHot: false, 
                    tour_type: "" // Сбрасываем селект в дефолтное состояние
                });
            }
        }
    }, [isVisible, initialData, reset, setValue]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-medium/50 backdrop-blur-sm z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative max-h-[90vh] overflow-y-auto">
                <X className="absolute top-2 right-2" onClick={() => setIsVisible(false)} />
                <h3 className="text-xl font-bold mb-4">{initialData ? 'Редактировать тур' : 'Создать тур'}</h3>
                
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                    <Input register={register} name="name" placeholder="Название тура" options={{ required: true }} />
                    <Input register={register} name="origin" placeholder="Место отправления" options={{ required: true }} />
                    <Input register={register} name="destination" placeholder="Место назначения" options={{ required: true }} />
                    
                    {/* --- ВЫПАДАЮЩИЙ СПИСОК ВМЕСТО INPUT --- */}
                    <div>
                        <select
                            {...register("tour_type", { required: true })}
                            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-theme bg-white text-gray-700"
                            defaultValue=""
                        >
                            <option value="" disabled>Выберите тип тура</option>
                            {TOUR_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="flex gap-2">
                        <div className="w-1/2">
                            <label className="text-xs text-gray-500 ml-1">Дата начала</label>
                            <Input register={register} type="date" name="dateStart" options={{ required: true }} />
                        </div>
                        <div className="w-1/2">
                            <label className="text-xs text-gray-500 ml-1">Дата конца</label>
                            <Input register={register} type="date" name="dateEnd" options={{ required: true }} />
                        </div>
                    </div>

                    <div className="flex gap-2">
                         <Input register={register} type="number" name="price" placeholder="Цена" options={{ required: true }} />
                         <Input register={register} type="number" name="discountPrice" placeholder="Цена со скидкой" />
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                        <input type="checkbox" {...register('isHot')} id="isHot" className="w-4 h-4 accent-theme" />
                        <label htmlFor="isHot" className="select-none cursor-pointer">Горящий тур</label>
                    </div>

                    <Button type="submit" className="mt-4">Сохранить</Button>
                </form>
            </div>
        </div>
    );
}