import { Link } from "react-router-dom";

export default function LinkCustom({ to, children, onClick }) {
    return (
        <Link 
            to={to} 
            onClick={onClick}
            className="text-gray-light hover:text-white mx-4 font-medium transition"
        >
            {children}
        </Link>
    );
}