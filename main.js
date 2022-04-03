const allTickets = new Map()
let nextId = 1

let completedFeatures = 0
let activeBugs = 0

let workerId = 0

const newWorker = (spd) => ({
  name: String.fromCharCode(
    65 + (workerId % 26),
    Math.floor(65 + Math.random() * 26)
  ),
  id: workerId++,
  currentTask: null,
  speed: spd || 100,
  workLeft: 0,
})
const workers = [newWorker(), newWorker()]

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)]
const makeBugFlavour = () =>
  rand([
    'Signup page is broken again',
    'Users are not able to log in',
    'Newsletter unsubscribe button is not working',
    'Your email verification regex missed an edge case',
    'People with a short lastname are unable to signup',
    'Payment API key has expired',
    'TLS certificates have expired',
    'Caches need to be purged after the last release',
    'DNS issues again',
  ])

const makeFeatFlavour = () =>
  rand([
    'Implement dark mode',
    'Make the application responsive',
    'IE6 support, please!',
    'Optimise loading times',
    'Optimise bundle size',
    'Expand CDN services',
    "Migrate to K8S, it's what the cool kids use",
    'Upgrade left-pad library',
  ])

window.addEventListener('load', () => {
  const dragContainer = document.createElement('div')
  dragContainer.style.position = 'fixed'
  dragContainer.style.left = '0px'
  dragContainer.style.top = '0px'
  dragContainer.style.zIndex = 1000
  document.body.appendChild(dragContainer)

  const cols = [].slice.call(document.querySelectorAll('.column'))
  const allGrids = []

  const dragSorts = [
    () => allGrids.slice(0, 2), // reorder backlog, move to todo
    () => allGrids.slice(0, 2), // reorder todo, back to backlog
    () => allGrids.slice(2, 3), // reorder doing, no moving
    false,
  ]

  let floatingItem
  cols.forEach((col, ix) => {
    const grid = new Muuri(col, {
      dragEnabled: ix !== 3,
      dragContainer: dragContainer,
      dragSort: dragSorts[ix],
      dragAutoScroll: {
        targets: [
          // Scroll window on both x-axis and y-axis.
          {
            element: window,
            priority: 0,
            axis: Muuri.AutoScroller.AXIS_X,
          },
          {
            element: col.parentNode,
            priority: 1,
            axis: Muuri.AutoScroller.AXIS_Y,
          },
          // Scroll scrollElement (can be any scrollable element) on y-axis only,
          // and prefer it over window in conflict scenarios.
          // { element: scrollElement, priority: 1, axis: Muuri.AutoScroller.AXIS_Y },
        ],
        // Let's use the dragged item element as the handle.
        handle: null,
        // Start auto-scroll when the distance from scroll target's edge to dragged
        // item is 40px or less.
        threshold: 40,
        // Make sure the inner 10% of the scroll target's area is always "safe zone"
        // which does not trigger auto-scroll.
        safeZone: 0.1,
        // Let's define smooth dynamic speed.
        // Max speed: 2000 pixels per second
        // Acceleration: 2700 pixels per second
        // Deceleration: 3200 pixels per second.
        speed: Muuri.AutoScroller.smoothSpeed(2000, 2700, 3200),
        // Let's not sort during scroll.
        sortDuringScroll: false,
        // Enable smooth stop.
        smoothStop: true,
      },
    })
    allGrids.push(grid)

    grid.on('dragStart', (item) => {
      floatingItem = item
    })
    grid.on('dragEnd', () => {
      floatingItem = null
    })
  })

  const addDevs = () => workers.push(newWorker(100))
  const addAssi = () => enableFeature('show-assignment')
  const addComp = () => enableFeature('show-complexity')
  const addType = () => enableFeature('show-type')

  const remAssi = () => disableFeature('show-assignment')
  const remComp = () => disableFeature('show-complexity')
  const remType = () => disableFeature('show-type')

  const getSpecialBugs = () => {
    const bugs = []
    if (document.body.classList.contains('show-assignment')) {
      bugs.push({
        description:
          'The tickets are no longer showing the assigned dev on them, luckily an update is available!',
        reward: addAssi,
        spawn: remAssi,
      })
    }
    if (document.body.classList.contains('show-complexity')) {
      bugs.push({
        description:
          'The complexity estimations are no longer visible, please upgrade our tracker!',
        reward: addComp,
        spawn: remComp,
      })
    }
    if (document.body.classList.contains('show-type')) {
      bugs.push({
        description:
          'The tickets are suddenly missing the type icons. Support told us to upgrade to the latest version.',
        reward: addType,
        spawn: remType,
      })
    }
    return bugs
  }

  const specialTickets = [
    {
      description:
        'Upgrade your tracker software to add complexity estimations',
      reward: addComp,
      at: 10,
    },
    {
      description: 'Hire a new developer to your team',
      reward: addDevs,
      at: 12,
    },
    {
      description: 'Upgrade your tracker software to upload avatars',
      reward: addAssi,
      at: 14,
    },
    {
      description: 'Hire a new developer to your team',
      reward: addDevs,
      at: 16,
    },
    {
      description: 'Upgrade your ticket tracker to visualise bugs more easily',
      reward: addType,
      at: 16,
    },
    {
      description: 'Hire a new developer to your team',
      reward: addDevs,
      at: 20,
    },
    {
      description: 'Hire a new developer to your team',
      reward: addDevs,
      at: 25,
    },
  ]

  const decBugs = () => {
    activeBugs--
  }
  const incFeat = () => {
    completedFeatures++
  }

  const getNextTicket = () => {
    const ticket = { id: `${nextId++}` }

    const timeForSpecial =
      specialTickets.length > 0 && nextId > specialTickets[0].at

    if (timeForSpecial && Math.random() < 0.9) {
      const st = specialTickets.shift()
      ticket.type = 'task'
      ticket.description = st.description
      ticket.size = rand([8, 8, 16, 16, 32])
      ticket.reward = st.reward
    } else if (Math.random() < 0.4) {
      ticket.size = rand([1, 1, 2, 2, 4, 4, 8, 8, 16, 32])
      const specialBugs = getSpecialBugs()
      if (Math.random() < 0.5 || specialBugs.length == 0) {
        ticket.type = 'Bug'
        ticket.description = makeBugFlavour()
        ticket.reward = decBugs
        activeBugs++
      } else {
        const spbu = rand(specialBugs)
        ticket.type = 'Task'
        ticket.description = spbu.description
        ticket.reward = spbu.reward
        spbu.spawn && spbu.spawn()
      }
    } else {
      ticket.type = 'Feature'
      ticket.description = makeFeatFlavour()
      ticket.size = rand([1, 2, 4, 8, 8, 8, 8, 16, 16, 32])
      ticket.reward = incFeat
    }

    allTickets.set(ticket.id, ticket)
    return ticket
  }

  const createTask = () => {
    const ticket = getNextTicket()

    const backCol = allGrids[0]
    const item = document.createElement('div')
    item.className = 'item'
    item.dataset.ticketId = ticket.id
    const itemContent = document.createElement('div')
    itemContent.className = 'item-content'
    const typeIcon =
      ticket.type === 'Bug' ? '!' : ticket.type === 'Feature' ? '+' : '•'
    const typeCN =
      ticket.type === 'Bug'
        ? 'bug'
        : ticket.type === 'Feature'
        ? 'feat'
        : 'task'
    itemContent.innerHTML = `
      <p>
        <strong>LDJ-${ticket.id}</strong><br/>${ticket.description}
      </p>
      <div class="item-assignment"></div>
      <!-- <div class="item-number">tick-0000</div> -->
      <div class="item-type item-type-${typeCN}">${typeIcon}</div>
      <div class="item-complexity">${ticket.size}</div>`

    item.appendChild(itemContent)

    const newItem = backCol.add(item, { index: -1, active: false })
    const mitem = backCol.getItem(-1)
    backCol.show([mitem])
  }

  const startTask = (worker) => {
    const todoCol = allGrids[1]
    const workCol = allGrids[2]
    const ix = todoCol.getItem(0) === floatingItem ? 1 : 0
    const item = todoCol.getItem(ix)
    if (!item) return
    const as = item.getElement().querySelector('.item-assignment')
    as.textContent = worker.name
    as.style.backgroundColor = `hsl(${(worker.id * 80) % 360}, 78%, 42%)`
    todoCol.send(item, workCol, -1)
    return item
  }

  const enableFeature = (feat) => {
    document.body.classList.add(feat)
    allGrids.forEach((grid) => {
      grid.refreshItems()
      grid.layout()
    })
  }

  const disableFeature = (feat) => {
    document.body.classList.remove(feat)
    allGrids.forEach((grid) => {
      grid.refreshItems()
      grid.layout()
    })
  }

  const completeMyTask = (mitem) => {
    const workCol = allGrids[2]
    const doneCol = allGrids[3]
    if (!mitem) return
    const ticket = allTickets.get(mitem.getElement().dataset.ticketId)
    ticket.done = true
    ticket.reward && ticket.reward()

    workCol.send(mitem, doneCol, 0)
  }

  const completeAnyTask = () => {
    const workCol = allGrids[2]
    const ix = workCol.getItem(0) === floatingItem ? 1 : 0
    const mitem = workCol.getItem(ix)
    completeMyTask(mitem)
  }

  setInterval(() => {
    if (Math.random() < 0.9) return
    createTask()
    refreshStats()
  }, 400)

  setInterval(() => {
    workers.forEach((worker) => {
      worker.workLeft -= worker.speed
      if (worker.workLeft > 0) return
      if (worker.currentTask) {
        completeMyTask(worker.currentTask)
        worker.currentTask = null
        refreshStats()
        worker.workLeft = 500 + Math.random() * 500
      } else {
        const task = startTask(worker)
        if (task) {
          const ticket = allTickets.get(task.getElement().dataset.ticketId)
          worker.currentTask = task
          refreshStats()
          worker.workLeft = 1000 * ticket.size
        } else {
          worker.workLeft = 1000 + Math.random() * 1000
        }
      }
    })
  }, 100)

  const bugsCounter = document.querySelector('#num-bugs')
  const featCounter = document.querySelector('#num-feat')
  const teamMembers = document.querySelector('#team-members')
  refreshStats = () => {
    // const activeBugs = allTickets
    //   .values()
    //   .filter((t) => t.type === 'Bug' && !t.done)
    // const addedFeatures = allTickets
    //   .values()
    //   .filter((t) => t.type === 'Feature' && t.done)
    bugsCounter.textContent = `${activeBugs}`
    featCounter.textContent = `${completedFeatures}`
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

  createTask()
  createTask()
  createTask()
  createTask()
  createTask()
  refreshStats()

  // setTimeout(() => {
  //   enableFeature('show-complexity')
  //   enableFeature('show-assignment')
  //   enableFeature('show-type')
  // }, 100)
})
