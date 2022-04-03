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
