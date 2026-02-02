import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import Input from '../ui/Input';
import X from '../ui/X';

export default function TourModal({ isVisible, setIsVisible, onSubmit, initialData }) {
    const { register, handleSubmit, reset, setValue } = useForm();

    useEffect(() => {
        if (isVisible) {
            if (initialData) {
                Object.keys(initialData).forEach(key => {
                    setValue(key, initialData[key]);
                });
            } else {
                reset({ isHot: false });
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
                    <Input register={register} name="tour_type" placeholder="Тип тура (Отдых, Шоппинг...)" options={{ required: true }} />
                    
                    <div className="flex gap-2">
                        <div className="w-1/2">
                            <label className="text-xs">Дата начала</label>
                            <Input register={register} type="date" name="dateStart" options={{ required: true }} />
                        </div>
                        <div className="w-1/2">
                            <label className="text-xs">Дата конца</label>
                            <Input register={register} type="date" name="dateEnd" options={{ required: true }} />
                        </div>
                    </div>

                    <div className="flex gap-2">
                         <Input register={register} type="number" name="price" placeholder="Цена" options={{ required: true }} />
                         <Input register={register} type="number" name="discountPrice" placeholder="Цена со скидкой" />
                    </div>

                    <div className="flex items-center gap-2">
                        <input type="checkbox" {...register('isHot')} id="isHot" />
                        <label htmlFor="isHot">Горящий тур</label>
                    </div>

                    <Button type="submit" className="mt-2">Сохранить</Button>
                </form>
            </div>
        </div>
    );
}