export default function Input({ label, value, onChange, type = "text", placeholder = "", name, required = false }) {
    return (
        <div className="flex flex-col text-left mb-2 w-full">
            {label && <label className="mb-1 text-sm font-semibold text-gray-700">{label}</label>}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="p-2 border border-gray-300 rounded focus:outline-none focus:border-accent"
            />
        </div>
    );
}