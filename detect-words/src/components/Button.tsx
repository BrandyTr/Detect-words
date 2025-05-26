interface ButtonProps {
    name: string
    colorClass: string
    onClick?: () => void
    id?:string
}

export default function Button({name, colorClass, onClick,id}: ButtonProps) {
    return(
        <button 
            id={id}
            className={`${colorClass} text-beggie font-semibold px-[18px] py-[5px] rounded-[5px] border-[1.5px] border-white shadow-btn-shadow`}
            onClick={onClick}
        >
            {name}
        </button>
    )
}