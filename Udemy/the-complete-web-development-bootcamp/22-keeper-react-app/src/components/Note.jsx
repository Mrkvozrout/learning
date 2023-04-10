import React from 'react'

export default Note


function Note(props) {
  return (
    <div className='note'>
      <h1>{props.title}</h1>
      <p>{props.content}</p>
      <button type='button' onClick={() => props.onDeleteNote(props.id)}>DELETE</button>
    </div>
  )
}
