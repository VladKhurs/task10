import ButtonSelect from "./ButtonSelect";

export default function ButtonsSelect({ services, selectOptions, setSelectOptions }) {
    return (
        <div className="flex flex-wrap gap-2 overflow-y-auto max-h-48 justify-center">
            {services.map((service) =>
                <ButtonSelect
                    key={`servise-select-modal-${service.name}`}
                    className="bg-white border border-accent text-theme hover:bg-accent/10"
                    onClick={(e) => {
                        e.preventDefault();
                    }}
                    currentButton={service.id}
                    selectOptions={selectOptions}
                    setSelectOptions={setSelectOptions}
                >
                    {service.name}
                </ButtonSelect>
            )}
        </div>
    );
}
