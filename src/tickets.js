import { allTasks, createTask, completeTaskById } from './task'
import { createCard, assignWorkerToCard } from './card'
import { board, firstAvailableItem } from './board'

export const createTicket = (details) => {
  const task = createTask(details)
  const card = createCard(task)

  board.backlog.add(card, { index: 0, active: false })
  const item = board.backlog.getItem(0)
  board.backlog.show([item])
}

export const startTicket = (worker) => {
  const item = firstAvailableItem(board.todo)
  if (!item) return
  assignWorkerToCard(item.getElement(), worker)
  board.todo.send(item, board.progress, -1)
  return item
}

export const getTicketSize = (ticket) => {
  return allTasks.get(ticket.getElement().dataset.taskId).size
}

export const completeTicket = (item) => {
  if (!item) return
  completeTaskById(item.getElement().dataset.taskId)
  board.progress.send(item, board.done, 0)
}
