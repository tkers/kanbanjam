import { setupBoard, board } from './board'
import { allTasks } from './task'
import { createTicket } from './tickets'
import { addWorker, updateWorkers } from './workers'
import { refreshStats } from './stats'
import { getRandomChallenge } from './levels'

const createRandomTicket = () => {
  const deets = getRandomChallenge()
  createTicket(deets)
}

const setupGame = () => {
  setupBoard()

  createRandomTicket()
  createRandomTicket()
  createRandomTicket()
  createRandomTicket()
  createRandomTicket()

  addWorker()
  addWorker()

  refreshStats()

  // create new tickets at random
  setInterval(() => {
    refreshStats()
    if (Math.random() < 0.9) return
    createRandomTicket()
  }, 400)

  // work
  setInterval(updateWorkers, 100)
}

window.addEventListener('load', setupGame)
