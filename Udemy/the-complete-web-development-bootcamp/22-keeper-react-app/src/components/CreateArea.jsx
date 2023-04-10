import React from 'react'

export default CreateArea


function CreateArea(props) {
  const [newNote, setNewNote] = React.useState(createEmptyNote())

  function handleChange(event) {
    const {name, value} = event.target
    setNewNote({...newNote, [name]: value})
  }

  function onAddNote() {
    if (!newNote.title && !newNote.content) {
      return
    }

    props.onAddNote(newNote)
    setNewNote(createEmptyNote())
  }

  return (
    <div>
      <form>
        <input name='title' placeholder='Title' value={newNote.title} onChange={handleChange} />
        <textarea name='content' placeholder='Take a note...' rows='3' value={newNote.content} onChange={handleChange} />
        <button type='button' onClick={onAddNote}>Add</button>
      </form>
    </div>
  )
}


function createEmptyNote() {
  return {
    title: '',
    content: ''
  }
}