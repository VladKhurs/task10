import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import Input from '../ui/Input';
import X from '../ui/X';

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
                // Заполняем форму данными при редактировании
                Object.keys(initialData).forEach(key => {
                    setValue(key, initialData[key]);
                });
            } else {
                // Сбрасываем форму при создании нового тура
                reset({ 
                    isHot: false, 
                    tour_type: "",
                    price: null,
                    discountPrice: null 
                });
            }
        }
    }, [isVisible, initialData, reset, setValue]);

    if (!isVisible) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <X onClick={() => setIsVisible(false)} />
                <h3 className="page-title" style={{fontSize: '1.25rem', marginBottom: '1rem'}}>
                    {initialData ? 'Редактировать тур' : 'Создать тур'}
                </h3>
                
                <form onSubmit={handleSubmit(onSubmit)} className="form-group">
                    <Input register={register} name="name" placeholder="Название тура" options={{ required: true }} />
                    <Input register={register} name="origin" placeholder="Место отправления" options={{ required: true }} />
                    <Input register={register} name="destination" placeholder="Место назначения" options={{ required: true }} />
                    
                    <div>
                        <select
                            {...register("tour_type", { required: true })}
                            className="select-field"
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
                    
                    <div className="input-row">
                        <div>
                            <label style={{fontSize: '0.75rem', color: 'var(--text-light)', marginLeft: '0.25rem'}}>Дата начала</label>
                            <Input register={register} type="date" name="dateStart" options={{ required: true }} />
                        </div>
                        <div>
                            <label style={{fontSize: '0.75rem', color: 'var(--text-light)', marginLeft: '0.25rem'}}>Дата конца</label>
                            <Input register={register} type="date" name="dateEnd" options={{ required: true }} />
                        </div>
                    </div>

                    <div className="input-row">
                         <Input register={register} type="number" name="price" placeholder="Цена" options={{ required: true, valueAsNumber: true }} />
                         <Input register={register} type="number" name="discountPrice" placeholder="Цена со скидкой" options={{ valueAsNumber: true }} />
                    </div>

                    <div className="checkbox-wrapper">
                        <input type="checkbox" {...register('isHot')} id="isHot" />
                        <label htmlFor="isHot">Горящий тур</label>
                    </div>

                    <Button type="submit" style={{marginTop: '1rem', width: '100%'}}>Сохранить</Button>
                </form>
            </div>
        </div>
    );
}