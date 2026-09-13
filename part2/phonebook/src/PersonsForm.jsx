export function PersonsForm(props) {
    return (
        <form onSubmit={props.handleNameSubmit}>
            <div>
                name: <input onChange={props.handleNameChange} value={props.newName} />
            </div>
            <div>number: <input onChange={props.handlePhoneChange} value={props.newNumber} /></div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}