import { countActiveBugs, countCompletedFeatures } from './task'
import { workers } from './workers'

export const refreshStats = () => {
  const bugsCounter = document.querySelector('#num-bugs')
  const featCounter = document.querySelector('#num-feat')
  const teamMembers = document.querySelector('#team-members')

  bugsCounter.textContent = `${countActiveBugs()}`
  featCounter.textContent = `${countCompletedFeatures()}`
  teamMembers.innerHTML = workers
    .map(
      (worker) =>
        `<div class="item-assignment" style="background-color: hsl(${
          (worker.id * 80) % 360
        }, ${worker.currentTask ? 0 : 78}%, ${
          worker.currentTask ? 73 : 42
        }%)">${worker.name}</div>`
    )
    .join(' ')
}
