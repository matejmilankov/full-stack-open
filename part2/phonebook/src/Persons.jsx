export function Persons({ personsToShow, handleDelete }) {
    return (
        <>
            {personsToShow.map(person => (
                <div key={person.id}>
                    <span>
                        {person.name} {person.number}
                    </span>
                    <button onClick={() => handleDelete(person.id, person.name)}>Delete</button>
                </div>
            ))}
        </>
    )
}