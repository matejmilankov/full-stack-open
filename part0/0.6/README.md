```mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: The browser creates new note, adds it to the notes array and redraws UI
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: {"message":"note created"}
    deactivate server
```