export default function Button({ children, onClick, className = "", type = "button" }) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded transition ${className}`}
        >
            {children}
        </button>
    );
}