export const allTasks = new Map()
let nextTaskId = 1

export const createTask = ({ type, description, size, reward }) => {
  const task = {
    id: `${nextTaskId++}`,
    type,
    description,
    size,
    reward,
  }
  allTasks.set(task.id, task)
  return task
}

export const completeTaskById = (id) => {
  const task = allTasks.get(id)
  task.done = true
  task.reward && task.reward()
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
