import React, { useState } from 'react'

const Notes = ({ websocket }) => {
  const [data, setData] = useState('')
  const [input, setInput] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    websocket.send('set', input)
  }

  const handleReset = (e) => {
    e.preventDefault()
    setInput(data)
  }

  websocket.on('state', (newInput) => {
    if (input === null) setInput(newInput)
    setData(newInput)
  })

  return (
    <div>
      {data === input ? 'Up to date' : 'There are changes'}
      <form onSubmit={handleSubmit}>
        <textarea
          value={input || ''}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="reset" onClick={handleReset}>
          Reset
        </button>
        <button type="submit">Set</button>
      </form>
    </div>
  )
}

export default Notes
