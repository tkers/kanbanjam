import { makeBugFlavour, makeFeatFlavour } from './flavour'
import { rand } from './utils'
import { addWorker } from './workers'
import {
  hasAssi,
  addAssi,
  remAssi,
  hasComp,
  addComp,
  remComp,
  hasType,
  addType,
  remType,
} from './rewards'

const getSpecialBugs = () => {
  const bugs = []
  if (hasAssi()) {
    bugs.push({
      description:
        'The tickets are no longer showing the assigned dev on them, luckily an update is available!',
      onDone: addAssi,
      spawn: remAssi,
    })
  }
  if (document.body.classList.contains('show-complexity')) {
    bugs.push({
      description:
        'The complexity estimations are no longer visible, please upgrade our tracker!',
      onDone: addComp,
      spawn: remComp,
    })
  }
  if (document.body.classList.contains('show-type')) {
    bugs.push({
      description:
        'The tickets are suddenly missing the type icons. Support told us to upgrade to the latest version.',
      onDone: addType,
      spawn: remType,
    })
  }
  return bugs
}

const specialTickets = [
  {
    description: 'Upgrade your tracker software to add complexity estimations',
    onDone: addComp,
    at: 10,
  },
  {
    description: 'Hire a new developer to your team',
    onDone: addWorker,
    at: 12,
  },
  {
    description: 'Upgrade your tracker software to upload avatars',
    onDone: addAssi,
    at: 14,
  },
  {
    description: 'Hire a new developer to your team',
    onDone: addWorker,
    at: 16,
  },
  {
    description: 'Upgrade your ticket tracker to visualise bugs more easily',
    onDone: addType,
    at: 16,
  },
  {
    description: 'Hire a new developer to your team',
    onDone: addWorker,
    at: 20,
  },
  {
    description: 'Hire a new developer to your team',
    onDone: addWorker,
    at: 25,
  },
]

let n = 0
export const getRandomChallenge = () => {
  const task = {}

  const timeForSpecial =
    specialTickets.length > 0 && ++n >= specialTickets[0].at

  if (timeForSpecial && Math.random() < 0.9) {
    const st = specialTickets.shift()
    task.type = 'task'
    task.description = st.description
    task.size = rand([8, 8, 16, 16, 32])
    task.onDone = st.onDone
  } else if (Math.random() < 0.4) {
    task.size = rand([1, 1, 2, 2, 4, 4, 8, 8, 16, 32])
    const specialBugs = getSpecialBugs()
    if (Math.random() < 0.5 || specialBugs.length == 0) {
      task.type = 'Bug'
      task.description = makeBugFlavour()
    } else {
      const spbu = rand(specialBugs)
      task.type = 'Task'
      task.description = spbu.description
      task.onDone = spbu.onDone
      spbu.spawn && spbu.spawn()
    }
  } else {
    task.type = 'Feature'
    task.description = makeFeatFlavour()
    task.size = rand([1, 2, 4, 8, 8, 8, 8, 16, 16, 32])
  }

  return task
}
