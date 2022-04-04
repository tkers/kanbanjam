import { board } from './board'
export const allTasks = new Map()
let nextTaskId = 1

export const createTask = ({
  type,
  description,
  size,
  onPlan,
  onStart,
  onDone,
}) => {
  const task = {
    id: `${nextTaskId++}`,
    type,
    description,
    size,
    onPlan,
    onStart,
    onDone,
  }
  allTasks.set(task.id, task)
  return task
}

export const completeTaskById = (id) => {
  const task = allTasks.get(id)
  task.done = true
}

export const countCompletedFeatures = () => {
  let n = 0
  allTasks.forEach((task, id) => {
    if (task.type === 'Feature' && task.done) {
      n++
    }
  })
  return n
}

export const countActiveBugs = () => {
  let n = 0
  allTasks.forEach((task, id) => {
    if (task.type === 'Bug' && !task.done) {
      n++
    }
  })
  return n
}

export const setupTasks = () => {
  board.todo.on('receive', (e) => {
    const task = allTasks.get(e.item.getElement().dataset.taskId)
    if (task.onPlan) task.onPlan(task)
    task.onPlan = null
  })

  board.progress.on('receive', (e) => {
    const task = allTasks.get(e.item.getElement().dataset.taskId)
    if (task.onStart) task.onStart(task)
    task.onStart = null
  })

  board.done.on('receive', (e) => {
    const task = allTasks.get(e.item.getElement().dataset.taskId)
    if (task.onDone) task.onDone(task)
    task.onDone = null
  })
}
