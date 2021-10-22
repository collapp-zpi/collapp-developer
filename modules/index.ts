import test from './test'
import notes from './notes'

const modules = { test, notes }

export const getModule = (name: keyof typeof modules) => modules[name]
export default modules
