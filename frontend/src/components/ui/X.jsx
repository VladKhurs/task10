import closs from '../../assets/cross.svg';

export default function X({ onClick, className = "" }) {
    return (
        <button
            className={className}
            onClick={onClick}
        >
            <img src={closs} width="40px" alt="x" />
        </button>
    );
}
