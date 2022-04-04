import { startTicket, getTicketSize, completeTicket } from './tickets'

let nextWorkerId = 0
const newWorker = (spd) => ({
  name: String.fromCharCode(
    65 + (nextWorkerId % 26),
    Math.floor(65 + Math.random() * 26)
  ),
  id: nextWorkerId++,
  currentTask: null,
  speed: spd || 1,
  workLeft: 0,
})
export const workers = []
export const addWorker = (spd) => {
  workers.push(newWorker(spd))
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
        worker.workLeft = getTicketSize(ticket)
      } else {
        worker.workLeft = 1 + Math.random()
      }
    }
  })
}

export const setupWorkers = (dt = 100) => {
  setInterval(() => updateWorkers(dt / 1000), dt)
}
