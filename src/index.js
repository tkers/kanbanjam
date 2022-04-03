import { workers, addWorker } from './workers'
import { rand } from './utils'
import { setupBoard, board, getItemBeingDragged } from './board'
import { createCard } from './card'
import { allTasks, getNewTask } from './task'
import { refreshStats } from './stats'

const createTicket = () => {
  const task = getNewTask()
  const card = createCard(task)

  board.backlog.add(card, { index: -1, active: false })
  const item = board.backlog.getItem(-1)
  board.backlog.show([item])
}

const firstAvailableItem = (col) => {
  const firstTicket = col.getItem(0)
  return firstTicket !== getItemBeingDragged() ? firstTicket : col.getItem(1)
}

const assignWorkerToCard = (card, worker) => {
  const as = card.querySelector('.item-assignment')
  as.textContent = worker.name
  as.style.backgroundColor = `hsl(${(worker.id * 80) % 360}, 78%, 42%)`
}
const startTicket = (worker) => {
  const item = firstAvailableItem(board.todo)
  if (!item) return
  assignWorkerToCard(item.getElement(), worker)
  board.todo.send(item, board.progress, -1)
  return item
}

const completeTaskById = (id) => {
  const task = allTasks.get(id)
  task.done = true
  task.reward && task.reward()
}

const completeTicket = (item) => {
  if (!item) return
  completeTaskById(item.getElement().dataset.ticketId)
  board.progress.send(item, board.done, 0)
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

window.addEventListener('load', () => {
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
})
