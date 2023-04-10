import React, {useState} from 'react'
import AddIcon from '@mui/icons-material/Add'
import Fab from '@mui/material/Fab'
import Zoom from '@mui/material/Zoom'

export default CreateArea


function CreateArea(props) {
  const [newNote, setNewNote] = useState(createEmptyNote())
  const [active, setActive] = useState(false)

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
    setActive(false)
  }

  function onBlur() {
    if (!newNote.title && !newNote.content) {
      setActive(false)
    }
  }

  return (
    <div>
      <form className='create-note'>
        {active && <input name='title' placeholder='Title' value={newNote.title} onChange={handleChange} />}
        <textarea
          name='content'
          placeholder='Take a note...'
          rows={active ? 3 : 1}
          value={newNote.content}
          onChange={handleChange}
          onFocus={() => setActive(true)}
          onBlur={onBlur} />
        <Zoom in={active}>
          <Fab onClick={onAddNote}>
            <AddIcon />
          </Fab>
        </Zoom>
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