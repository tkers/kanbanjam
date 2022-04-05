import { startTicket, getTicketSize, completeTicket } from './tickets'

let nextWorkerId = 0
const newWorker = () => ({
  name: String.fromCharCode(
    65 + (nextWorkerId % 26),
    Math.floor(65 + Math.random() * 26)
  ),
  id: nextWorkerId++,
  currentTask: null,
  speed: 1,
  workLeft: 0,
})
export const workers = []
export const addWorker = () => {
  workers.push(newWorker())
}

const updateWorkers = (dt) => {
  workers.forEach((worker) => {
    worker.workLeft -= worker.speed * dt
    if (worker.workLeft > 0) return
    if (worker.currentTicket) {
      completeTicket(worker.currentTicket)
      worker.currentTicket = null
      worker.workLeft = 0.5 + Math.random() * 0.5
    } else {
      const ticket = startTicket(worker)
      if (ticket) {
        worker.currentTicket = ticket
        worker.workLeft = 1.875 * getTicketSize(ticket) // 32 pts = 60 sec
      } else {
        worker.workLeft = 1 + Math.random()
      }
    }
  })
}

let workerInterval
export const setupWorkers = (dt = 100) => {
  workerInterval = setInterval(() => updateWorkers(dt / 1000), dt)
}

export const stopAllWorkers = () => clearInterval(workerInterval)
