console.log('load notes?')

const set = ({ broadcast }, input) => {
  broadcast('state', input)
  return input
}

const open = ({ send, state }) => {
  send('state', state)
}

const todoEvents = {
  set,
  __OPEN: open,
}

export default todoEvents
