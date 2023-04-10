import React from 'react'
import Header from './Header'
import Footer from './Footer'
import Note from './Note'
import CreateArea from './CreateArea';

export default App


function App(props) {
  const [notes, setNotes] = React.useState([...props.defaultNotes])

  function onAddNote(newNote) {
    if (!newNote) {
      return
    }
    setNotes([...notes, newNote])
  }

  function onDeleteNote(id) {
    if (id < 0) {
      return
    }
    setNotes(notes.filter((n, i) => i !== id))
  }

  return (
    <div>
      <Header />
      <CreateArea onAddNote={onAddNote} />
      {notes.map((note, i) => (
        <Note
          key={i}
          id={i}
          title={note.title}
          content={note.content}
          onDeleteNote={onDeleteNote} />
      ))}
      <Footer />
    </div>
  )
}
