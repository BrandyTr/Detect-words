interface ButtonProps {
    name: string
    colorClass: string
    onClick?: () => void
}

export default function Button({name, colorClass, onClick}: ButtonProps) {
    return(
        <button 
            className={`${colorClass} text-beggie font-semibold px-[18px] py-[5px] rounded-[5px] border-[1.5px] border-white shadow-btn-shadow`}
            onClick={onClick}
        >
            {name}
        </button>
    )
}