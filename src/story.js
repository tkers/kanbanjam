import { createTicket } from './tickets'
import { getRandomChallenge } from './levels'

export const startGame = () => {
  setInterval(() => {
    const deets = getRandomChallenge()
    createTicket(deets)
  }, 4000)
}
