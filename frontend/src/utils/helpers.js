export const getHours = () => Array.from(
    { length: 24 },
    (_, i) => i.toString().padStart(2, "0")
);
export const getMinutes = () => Array.from(
    { length: 60 },
    (_, i) => i.toString().padStart(2, "0")
);

export const parseDateTime = (isoString) => {
    if (!isoString) return { date: "", hour: "12", minute: "00" };
    const dateObj = new Date(isoString);

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hour = String(dateObj.getHours()).padStart(2, '0');
    const minute = String(dateObj.getMinutes()).padStart(2, '0');

    return { date: `${year}-${month}-${day}`, hour, minute };
};

export const combineDateTime = (date, hour, minute) => {
    const d = new Date(`${date}T${hour}:${minute}:00`);
    return d.toISOString();
};
