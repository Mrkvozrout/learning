import React from 'react'
import Header from './Header'
import Footer from './Footer'
import Note from './Note'

export default App


function App(props) {
  return (
    <div>
      <Header />
      {props.defaultNotes.map(note => (
        <Note
          key={note.key}
          title={note.title}
          content={note.content} />
      ))}
      <Footer />
    </div>
  )
}
