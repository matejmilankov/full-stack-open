import { Alert } from "@mui/material"

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
    <Alert severity={message.type} sx={{ marginBlock: 2 }}>
      {message.text}
    </Alert>
  )
}