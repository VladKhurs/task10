import { Link } from "react-router-dom";

export default function LinkCustom({ to = "/", children, className=""}) {
    return (
        <Link to={to} className={`text-white hover:bg-theme-hover font-semibold text-lg h-full items-center px-5 flex ${className}`}>
            {children}
        </Link>
    );
}
