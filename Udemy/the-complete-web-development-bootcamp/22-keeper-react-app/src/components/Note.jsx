import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete'

export default Note


function Note(props) {
  return (
    <div className='note'>
      <h1>{props.title}</h1>
      <p>{props.content}</p>
      <button type='button' onClick={() => props.onDeleteNote(props.id)}>
        <DeleteIcon />
      </button>
    </div>
  )
}
