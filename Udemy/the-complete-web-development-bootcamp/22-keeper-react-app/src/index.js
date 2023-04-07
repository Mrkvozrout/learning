import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import defaultNotes from './notes'

ReactDOM.render(<App defaultNotes={defaultNotes} />, document.getElementById('root'))
