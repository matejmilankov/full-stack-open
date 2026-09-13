import { Part } from "./Part"

export function Content({ parts }) {
    const total = parts.reduce((sum, part) => sum + part.exercises, 0);

    return (
        <>
            {parts.map(part => (
                <Part
                    key={part.id} 
                    part={part}
                />
            ))}
            <p>total of {total} exercises</p>
        </>
    )
}