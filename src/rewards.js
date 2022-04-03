import { refreshBoard } from './board'

const enableFeature = (feat) => {
  document.body.classList.add(feat)
  refreshBoard()
}

const disableFeature = (feat) => {
  document.body.classList.remove(feat)
  refreshBoard()
}

export const hasAssi = () => document.body.classList.contains('show-assignment')
export const hasComp = () => document.body.classList.contains('show-complexity')
export const hasType = () => document.body.classList.contains('show-type')

export const addAssi = () => enableFeature('show-assignment')
export const addComp = () => enableFeature('show-complexity')
export const addType = () => enableFeature('show-type')

export const remAssi = () => disableFeature('show-assignment')
export const remComp = () => disableFeature('show-complexity')
export const remType = () => disableFeature('show-type')
