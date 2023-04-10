import React from 'react'
import ReactDOMClient from 'react-dom/client'
import App from './components/App'
import defaultNotes from './notes'

ReactDOMClient
.createRoot(document.getElementById('root'))
.render(<App defaultNotes={defaultNotes} />)
