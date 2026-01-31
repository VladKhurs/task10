export default function Select({ label, value, onChange, options, name, required = false }) {
    return (
        <div className="flex flex-col text-left mb-2 w-full">
            {label && <label className="text-sm font-semibold text-gray-700">{label}</label>}
            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="p-[10px] border border-gray-300 rounded focus:outline-none focus:border-accent bg-white"
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
