export function Notification({ message }) {
    const style = {
        color: message.type === 'error' ? 'red' : 'green',
        backgroundColor: 'lightgrey',
        fontSize: '20px',
        borderStyle: 'solid',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px'
    }

    return (
        <div style={style}>
            {message.text}
        </div>
    )
}