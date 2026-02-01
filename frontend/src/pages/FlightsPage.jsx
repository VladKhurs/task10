import { useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import { formatDate } from "../utils/formatters";
import { parseDateTime, combineDateTime } from "../utils/helpers";

const TimeInput = ({ value, onChange, max }) => {
    const updateValue = (newVal) => {
        let val = parseInt(newVal);
        if (isNaN(val)) val = 0;
        
        if (val > max) val = 0;
        if (val < 0) val = max;

        onChange({ target: { value: val.toString().padStart(2, "0") } });
    };

    return (
        <div className="relative w-14 md:w-16 mb-2 shrink-0">
            <input
                type="text"
                className="p-2 pr-5 border border-gray-300 rounded focus:outline-none focus:border-accent w-full text-center text-sm md:text-base"
                value={value}
                onChange={(e) => {
                    if (/^\d*$/.test(e.target.value)) {
                         let val = parseInt(e.target.value || "0");
                         if (val > max) return; 
                         onChange(e);
                    }
                }}
                maxLength={2}
                required
            />
            <div className="absolute right-1 top-0 bottom-0 flex flex-col justify-center h-full gap-1 py-1">
                <button 
                    type="button" 
                    onClick={() => updateValue(parseInt(value || "0") + 1)} 
                    className="text-[8px] leading-[8px] cursor-pointer text-gray-500 hover:text-accent font-bold h-3 flex items-center justify-center bg-gray-100 w-4 rounded-t"
                >
                    ▲
                </button>
                <button 
                    type="button" 
                    onClick={() => updateValue(parseInt(value || "0") - 1)} 
                    className="text-[8px] leading-[8px] cursor-pointer text-gray-500 hover:text-accent font-bold h-3 flex items-center justify-center bg-gray-100 w-4 rounded-b"
                >
                    ▼
                </button>
            </div>
        </div>
    );
};

export default function FlightsPage({
    flights,
    user,
    onAddFlight,
    onUpdateFlight,
    onDeleteFlight,
    onAddCrew,
    onUpdateCrew,
    onDeleteCrew
}) {
    const [newFlight, setNewFlight] = useState({
        flightNumber: "", departurePlace: "", arrivalPlace: "",
        depDate: "", depHour: "12", depMin: "00",
        arrDate: "", arrHour: "12", arrMin: "00"
    });

    const [editingFlight, setEditingFlight] = useState(null);

    const [newCrew, setNewCrew] = useState({ firstName: "", lastName: "", profession: "", flightId: null });
    const [editingCrew, setEditingCrew] = useState(null);

    const professions = [
        { value: "Pilot", label: "Пилот" },
        { value: "Navigator", label: "Штурман" },
        { value: "Radioman", label: "Радист" },
        { value: "Stewardess", label: "Стюардесса" }
    ];

    const handleCreateFlight = (e) => {
        e.preventDefault();
        const finalData = {
            flightNumber: newFlight.flightNumber,
            departurePlace: newFlight.departurePlace,
            arrivalPlace: newFlight.arrivalPlace,
            departureTime: combineDateTime(newFlight.depDate, newFlight.depHour, newFlight.depMin),
            arrivalTime: combineDateTime(newFlight.arrDate, newFlight.arrHour, newFlight.arrMin)
        };
        onAddFlight(finalData);
        setNewFlight({
            flightNumber: "", departurePlace: "", arrivalPlace: "",
            depDate: "", depHour: "12", depMin: "00",
            arrDate: "", arrHour: "12", arrMin: "00"
        });
    };

    const startEditFlight = (flight) => {
        const dep = parseDateTime(flight.departureTime);
        const arr = parseDateTime(flight.arrivalTime);
        setEditingFlight({
            id: flight.id,
            flightNumber: flight.flightNumber,
            departurePlace: flight.departurePlace,
            arrivalPlace: flight.arrivalPlace,
            depDate: dep.date, depHour: dep.hour, depMin: dep.minute,
            arrDate: arr.date, arrHour: arr.hour, arrMin: arr.minute
        });
    };

    const saveEditFlight = (e) => {
        e.preventDefault();
        const finalData = {
            flightNumber: editingFlight.flightNumber,
            departurePlace: editingFlight.departurePlace,
            arrivalPlace: editingFlight.arrivalPlace,
            departureTime: combineDateTime(editingFlight.depDate, editingFlight.depHour, editingFlight.depMin),
            arrivalTime: combineDateTime(editingFlight.arrDate, editingFlight.arrHour, editingFlight.arrMin)
        };
        onUpdateFlight(editingFlight.id, finalData);
        setEditingFlight(null);
    };

    const handleAddCrew = (e, flightId) => {
        e.preventDefault();
        onAddCrew({ ...newCrew, flightId });
        setNewCrew({ firstName: "", lastName: "", profession: "", flightId: null });
    };

    const startEditCrew = (member) => {
        setEditingCrew({ ...member });
    };

    const saveEditCrew = (e) => {
        e.preventDefault();
        onUpdateCrew(editingCrew.id, {
            firstName: editingCrew.firstName,
            lastName: editingCrew.lastName,
            profession: editingCrew.profession
        });
        setEditingCrew(null);
    };


    return (
        <div className="max-w-6xl mx-auto mt-4 md:mt-8 p-3 md:p-4 relative">
            <h1 className="text-2xl md:text-3xl font-bold text-theme mb-6 text-center md:text-left">Авиарейсы</h1>

            {user?.roleName === "admin" && (
                <div className="bg-white p-4 md:p-6 rounded shadow mb-8 text-left border-l-4 border-accent">
                    <h3 className="text-xl font-bold mb-4">Новый рейс</h3>
                    <form onSubmit={handleCreateFlight} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Номер рейса" value={newFlight.flightNumber} onChange={e => setNewFlight({ ...newFlight, flightNumber: e.target.value })} required />
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Input label="Откуда" value={newFlight.departurePlace} onChange={e => setNewFlight({ ...newFlight, departurePlace: e.target.value })} required />
                            <Input label="Куда" value={newFlight.arrivalPlace} onChange={e => setNewFlight({ ...newFlight, arrivalPlace: e.target.value })} required />
                        </div>

                        <div className="bg-gray-50 p-2 rounded">
                            <label className="text-xs font-bold text-gray-500 block mb-1">Время вылета</label>
                            <div className="flex gap-2 items-end flex-wrap sm:flex-nowrap">
                                <div className="flex-grow min-w-[120px] w-full sm:w-auto"><Input type="date" value={newFlight.depDate} onChange={e => setNewFlight({ ...newFlight, depDate: e.target.value })} required /></div>
                                <div className="flex gap-2 items-end ml-auto sm:ml-0">
                                    <TimeInput max={23} value={newFlight.depHour} onChange={e => setNewFlight({ ...newFlight, depHour: e.target.value })} />
                                    <div className="self-center pb-2">:</div>
                                    <TimeInput max={59} value={newFlight.depMin} onChange={e => setNewFlight({ ...newFlight, depMin: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-2 rounded">
                            <label className="text-xs font-bold text-gray-500 block mb-1">Время прилета</label>
                            <div className="flex gap-2 items-end flex-wrap sm:flex-nowrap">
                                <div className="flex-grow min-w-[120px] w-full sm:w-auto"><Input type="date" value={newFlight.arrDate} onChange={e => setNewFlight({ ...newFlight, arrDate: e.target.value })} required /></div>
                                <div className="flex gap-2 items-end ml-auto sm:ml-0">
                                    <TimeInput max={23} value={newFlight.arrHour} onChange={e => setNewFlight({ ...newFlight, arrHour: e.target.value })} />
                                    <div className="self-center pb-2">:</div>
                                    <TimeInput max={59} value={newFlight.arrMin} onChange={e => setNewFlight({ ...newFlight, arrMin: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="col-span-1 md:col-span-2 mt-2 w-full md:w-auto">Создать рейс</Button>
                    </form>
                </div>
            )}

            <div className="grid gap-6">
                {flights.map(flight => (
                    <div key={flight.id} className="bg-white border rounded-lg shadow-sm p-4 md:p-6 text-left relative flex flex-col">
                        {user?.roleName === "admin" && (
                            <div className="flex gap-2 justify-end mb-2 md:absolute md:top-4 md:right-4 order-first md:order-none w-full md:w-auto">
                                <button onClick={() => startEditFlight(flight)} className="flex-1 md:flex-none bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Изменить</button>
                                <button onClick={() => onDeleteFlight(flight.id)} className="flex-1 md:flex-none bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Удалить</button>
                            </div>
                        )}
                        
                        <div className="mb-4 border-b pb-4 md:pr-32">
                            <h2 className="text-2xl font-bold text-accent mb-2">{flight.flightNumber}</h2>
                            <div className="flex flex-col sm:flex-row gap-4 mt-2">
                                <div className="flex-1">
                                    <span className="text-gray-500 text-sm block">Отправление</span>
                                    <span className="font-semibold text-lg">{flight.departurePlace}</span>
                                    <div className="text-sm text-theme">{formatDate(flight.departureTime)}</div>
                                </div>
                                <div className="flex items-center justify-center text-gray-300 text-2xl rotate-90 sm:rotate-0">➝</div>
                                <div className="flex-1 text-right sm:text-left">
                                    <span className="text-gray-500 text-sm block">Прибытие</span>
                                    <span className="font-semibold text-lg">{flight.arrivalPlace}</span>
                                    <div className="text-sm text-theme">{formatDate(flight.arrivalTime)}</div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                                Летная бригада
                            </h4>
                            {flight.CrewMembers && flight.CrewMembers.length > 0 ? (
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                                    {flight.CrewMembers.map(member => (
                                        <li key={member.id} className="flex justify-between items-center bg-gray-50 p-2 rounded border hover:border-accent/50 transition">
                                            <div>
                                                <div className="font-bold text-sm md:text-base">{member.firstName} {member.lastName}</div>
                                                <div className="text-xs text-gray-500 uppercase">{member.profession}</div>
                                            </div>
                                            {user?.roleName === "dispatcher" && (
                                                <div className="flex gap-2">
                                                    <button onClick={() => startEditCrew(member)} className="text-blue-500 text-xs font-bold hover:underline">ИЗМ.</button>
                                                    <button onClick={() => onDeleteCrew(member.id)} className="text-red-500 text-xs font-bold hover:underline">УДЛ.</button>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-400 italic mb-4 text-sm">Бригада не назначена</p>
                            )}

                            {user?.roleName === "dispatcher" && (
                                <div className="mt-4 bg-gray-100 p-3 rounded">
                                    <h5 className="font-bold text-xs mb-2 text-gray-500 uppercase">Добавить сотрудника</h5>
                                    <form onSubmit={(e) => handleAddCrew(e, flight.id)} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-end">
                                        <div className="flex-1 w-full"><Input placeholder="Имя" value={newCrew.flightId === flight.id ? newCrew.firstName : ""} onChange={e => setNewCrew({ ...newCrew, flightId: flight.id, firstName: e.target.value })} required /></div>
                                        <div className="flex-1 w-full"><Input placeholder="Фамилия" value={newCrew.flightId === flight.id ? newCrew.lastName : ""} onChange={e => setNewCrew({ ...newCrew, flightId: flight.id, lastName: e.target.value })} required /></div>
                                        <div className="flex-1 w-full"><Select options={[{ value: "", label: "Профессия" }, ...professions]} value={newCrew.flightId === flight.id ? newCrew.profession : ""} onChange={e => setNewCrew({ ...newCrew, flightId: flight.id, profession: e.target.value })} required /></div>
                                        <Button type="submit" className="text-sm py-2 px-4 h-[42px] mb-2 w-full sm:w-auto">OK</Button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {editingFlight && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-4 md:p-6 rounded-lg w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl md:text-2xl font-bold mb-4">Редактирование рейса</h2>
                        <form onSubmit={saveEditFlight} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Номер" value={editingFlight.flightNumber} onChange={e => setEditingFlight({ ...editingFlight, flightNumber: e.target.value })} />
                            <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input label="Откуда" value={editingFlight.departurePlace} onChange={e => setEditingFlight({ ...editingFlight, departurePlace: e.target.value })} />
                                <Input label="Куда" value={editingFlight.arrivalPlace} onChange={e => setEditingFlight({ ...editingFlight, arrivalPlace: e.target.value })} />
                            </div>

                            <div className="col-span-1 bg-gray-50 p-2 rounded">
                                <label className="text-xs font-bold mb-1 block">Вылет</label>
                                <div className="flex gap-1 items-end flex-wrap">
                                    <div className="flex-grow w-full sm:w-auto"><Input type="date" value={editingFlight.depDate} onChange={e => setEditingFlight({ ...editingFlight, depDate: e.target.value })} /></div>
                                    <div className="flex gap-1 items-end ml-auto sm:ml-0">
                                        <TimeInput max={23} value={editingFlight.depHour} onChange={e => setEditingFlight({ ...editingFlight, depHour: e.target.value })} />
                                        <div className="self-center pb-2">:</div>
                                        <TimeInput max={59} value={editingFlight.depMin} onChange={e => setEditingFlight({ ...editingFlight, depMin: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-1 bg-gray-50 p-2 rounded">
                                <label className="text-xs font-bold mb-1 block">Прилет</label>
                                <div className="flex gap-1 items-end flex-wrap">
                                    <div className="flex-grow w-full sm:w-auto"><Input type="date" value={editingFlight.arrDate} onChange={e => setEditingFlight({ ...editingFlight, arrDate: e.target.value })} /></div>
                                    <div className="flex gap-1 items-end ml-auto sm:ml-0">
                                        <TimeInput max={23} value={editingFlight.arrHour} onChange={e => setEditingFlight({ ...editingFlight, arrHour: e.target.value })} />
                                        <div className="self-center pb-2">:</div>
                                        <TimeInput max={59} value={editingFlight.arrMin} onChange={e => setEditingFlight({ ...editingFlight, arrMin: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-2 flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setEditingFlight(null)} className="px-4 py-2 text-gray-500 hover:text-gray-800">Отмена</button>
                                <Button type="submit">Сохранить</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {editingCrew && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold mb-4">Изменить сотрудника</h2>
                        <form onSubmit={saveEditCrew} className="flex flex-col gap-3">
                            <Input label="Имя" value={editingCrew.firstName} onChange={e => setEditingCrew({ ...editingCrew, firstName: e.target.value })} />
                            <Input label="Фамилия" value={editingCrew.lastName} onChange={e => setEditingCrew({ ...editingCrew, lastName: e.target.value })} />
                            <Select label="Профессия" options={professions} value={editingCrew.profession} onChange={e => setEditingCrew({ ...editingCrew, profession: e.target.value })} />
                            
                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setEditingCrew(null)} className="px-4 py-2 text-gray-500 hover:text-gray-800">Отмена</button>
                                <Button type="submit">Сохранить</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}