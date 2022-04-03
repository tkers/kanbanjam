import { setupBoard, board } from './board'
import { allTasks } from './task'
import { createTicket, startTicket, completeTicket } from './tickets'
import { workers, addWorker } from './workers'
import { refreshStats } from './stats'

const setupGame = () => {
  setupBoard()

  createTicket()
  createTicket()
  createTicket()
  createTicket()
  createTicket()

  addWorker()
  addWorker()

  refreshStats()

  // create new tasks at random
  setInterval(() => {
    refreshStats()
    if (Math.random() < 0.9) return
    createTicket()
  }, 400)

  // work
  setInterval(updateWorkers, 100)
}

const updateWorkers = () => {
  workers.forEach((worker) => {
    worker.workLeft -= worker.speed
    if (worker.workLeft > 0) return
    if (worker.currentTask) {
      completeTicket(worker.currentTask)
      worker.currentTask = null
      worker.workLeft = 500 + Math.random() * 500
    } else {
      const task = startTicket(worker)
      if (task) {
        const ticket = allTasks.get(task.getElement().dataset.ticketId)
        worker.currentTask = task
        worker.workLeft = 1000 * ticket.size
      } else {
        worker.workLeft = 1000 + Math.random() * 1000
      }
    }
  })
}

window.addEventListener('load', setupGame)
