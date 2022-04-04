import { startTicket, getTicketSize, completeTicket } from './tickets'

let nextWorkerId = 0
const newWorker = (spd = 1) => ({
  name: String.fromCharCode(
    65 + (nextWorkerId % 26),
    Math.floor(65 + Math.random() * 26)
  ),
  id: nextWorkerId++,
  currentTask: null,
  speed: 100 * spd,
  workLeft: 0,
})
export const workers = []
export const addWorker = (spd) => {
  workers.push(newWorker(spd))
}

export const updateWorkers = () => {
  workers.forEach((worker) => {
    worker.workLeft -= worker.speed
    if (worker.workLeft > 0) return
    if (worker.currentTicket) {
      completeTicket(worker.currentTicket)
      worker.currentTicket = null
      worker.workLeft = 500 + Math.random() * 500
    } else {
      const ticket = startTicket(worker)
      if (ticket) {
        worker.currentTicket = ticket
        worker.workLeft = 1000 * getTicketSize(ticket)
      } else {
        worker.workLeft = 1000 + Math.random() * 1000
      }
    }
  })
}
