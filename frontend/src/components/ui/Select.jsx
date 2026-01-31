export default function Select({ options = [], placeholder, className = "", error, ...props }) {
    return (
        <select
            className={`
                border-[2px] rounded-md px-2 py-1 w-full bg-white cursor-pointer
                ${error
                    ? "border-red-500 text-red-400"
                    : "border-gray-light"
                } 
                ${className}
            `}
            {...props}
        >
            {placeholder && <option value="">{placeholder}</option>}

            {options.map((option) => (
                <option
                    key={option.value} value={option.value}
                    className="hover:text-theme hover:bg-black"
                >
                    {option.label}
                </option>
            ))}
        </select>
    );
}
