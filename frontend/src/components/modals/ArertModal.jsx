import Button from "../ui/Button";
import X from "../ui/X";

export default function AlertModal({ isVisible, setIsVisible, alertText }) {

    if (!isVisible) return null;

    return (
        <div
            onClick={() => {
                setIsVisible(false);
            }}
            className="fixed transition inset-0 flex backdrop-blur-sm items-center justify-center bg-gray-medium/50 z-50"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white p-6 rounded-lg shadow-xl relative pt-9 flex flex-col"
            >
                <X
                    className={"absolute top-2 right-2"}
                    onClick={() => {
                        setIsVisible(false);
                    }}
                />

                <h3 className="text-xl font-semibold mb-6 text-center mt-6">{alertText}</h3>

                <Button
                    className="mt-2"
                    onClick={() => { setIsVisible(false); }}
                >
                    Закрыть
                </Button>
            </div>
        </div>
    );
}
