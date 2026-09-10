import { Part } from "./Part"

export function Content({ parts }) {
    return (
        <>
            {parts.map((part, index) => (
                <Part
                    key={index} 
                    part={part}
                />
            ))}
        </>
    )
}