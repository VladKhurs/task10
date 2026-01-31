export default function Input({ type = "text", placeholder, className = "", error, ...props }) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            className={`
                border-[2px] rounded-md px-2 py-1 w-full
                ${error
                    ? "border-red-500 placeholder-red-400"
                    : "border-gray-light"
                } 
                ${className}
            `}
            {...props}
        />
    );
}