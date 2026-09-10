export function Total({ parts }) {
    let total = 0;
    parts.forEach(part => total += part.exercises)
    return (
        <p>Number of exercises {total}</p>
    )
}