import { getNewTask, completeTaskById } from './task'
import { createCard, assignWorkerToCard } from './card'
import { board, firstAvailableItem } from './board'

export const createTicket = () => {
  const task = getNewTask()
  const card = createCard(task)

  board.backlog.add(card, { index: -1, active: false })
  const item = board.backlog.getItem(-1)
  board.backlog.show([item])
}

export const startTicket = (worker) => {
  const item = firstAvailableItem(board.todo)
  if (!item) return
  assignWorkerToCard(item.getElement(), worker)
  board.todo.send(item, board.progress, -1)
  return item
}

export const completeTicket = (item) => {
  if (!item) return
  completeTaskById(item.getElement().dataset.ticketId)
  board.progress.send(item, board.done, 0)
}
