import { setupBoard } from './board'
import { setupTasks } from './task'
import { setupWorkers, addWorker } from './workers'
import { setupStats } from './stats'
import { startGame } from './story'

window.addEventListener('load', () => {
  // setup board and start loops
  setupBoard()
  setupTasks()
  setupWorkers()
  setupStats()

  // add the first worker
  addWorker()

  // start the game logic
  startGame()
})
