import React, { useEffect, useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import Note from './Note'
import CreateArea from './CreateArea';
import { dkeeper_backend } from '../../../declarations/dkeeper_backend'

export default App


function App() {

  const [notes, setNotes] = useState([])

  useEffect(() => {
    reloadNotes()
  }, [])


  async function reloadNotes() {
    setNotes(await dkeeper_backend.getNotes())
  }

  function onAddNote(newNote) {
    if (!newNote) {
      return
    }
    setNotes([newNote, ...notes])

    dkeeper_backend.createNote(newNote.title, newNote.content)
  }

  function onDeleteNote(id) {
    if (id < 0) {
      return
    }
    setNotes(notes.filter((n, i) => i !== id))

    dkeeper_backend.removeNote(id)
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
