import { createContext, useContext } from 'react'

export const PluginContext = createContext({ id: '', isPending: false })

export const usePluginContext = () => useContext(PluginContext)
