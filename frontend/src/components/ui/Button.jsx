export default function Button({ onClick, children, className="" }) {
    return (
        <button
            className={`px-3 py-2 bg-accent hover:bg-accent-hover rounded-lg transition text-white ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
