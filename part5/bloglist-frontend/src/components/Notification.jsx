import { Alert } from "@mui/material"

export function Notification({ message }) {

  return (
    <Alert severity={message.type} sx={{ marginBlock: 2 }}>
      {message.text}
    </Alert>
  )
}