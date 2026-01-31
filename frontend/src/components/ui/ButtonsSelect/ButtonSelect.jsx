export default function ButtonSelect({ onClick, children, className = "", currentButton,  selectOptions, setSelectOptions}) {
    return (
        <button
            className={`px-3 py-2 text-sm sm:w-44 rounded-lg transition ${className} border border-gray-light
            ${selectOptions.includes(currentButton) ? "bg-green-200 hover:bg-green-200" : "bg-accent/20 hover:bg-accent/20" } 
            `}
            onClick={(e) => {
                onClick(e)
                if (selectOptions.includes(currentButton)) {
                    const newSelectOptions = selectOptions.filter((option) => option !== currentButton)
                    setSelectOptions(newSelectOptions)
                } else {
                    setSelectOptions([...selectOptions, currentButton])
                }
            }}
        >
            {children}
        </button>
    );
}
