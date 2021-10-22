import test from 'test'
import notes from 'notes'

const modules = { test, notes }
export default modules

export const getModule = (name) => modules[name]
