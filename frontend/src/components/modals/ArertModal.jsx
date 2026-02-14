import Button from "../ui/Button";
import X from "../ui/X";

export default function AlertModal({ isVisible, setIsVisible, alertText }) {

    if (!isVisible) return null;

    return (
        <div
            onClick={() => {
                setIsVisible(false);
            }}
            className="modal-backdrop"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="modal-content"
                style={{textAlign: 'center', paddingTop: '2.5rem'}}
            >
                <X
                    onClick={() => {
                        setIsVisible(false);
                    }}
                />

                <h3 style={{marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600, color: 'var(--theme)'}}>{alertText}</h3>

                <Button
                    onClick={() => { setIsVisible(false); }}
                >
                    Закрыть
                </Button>
            </div>
        </div>
    );
}