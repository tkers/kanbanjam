const activeBugs = new Set()
const addedFeatures = new Set()
let nextId = 1

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
        // Finally let's log some data when auto-scroll starts and stops.
        // onStart: function (item, scrollElement, direction) {
        //   console.log('AUTOSCROLL STARTED', item, scrollElement, direction)
        // },
        // onStop: function (item, scrollElement, direction) {
        //   console.log('AUTOSCROLL STOPPED', item, scrollElement, direction)
        // },
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

  const createTask = () => {
    const ticketId = `${nextId++}`
    const ticketType = Math.random() > 0.5 ? 'Bug' : 'Feature'

    const backCol = allGrids[0]
    const item = document.createElement('div')
    item.className = 'item'
    item.dataset.ticketId = ticketId
    item.dataset.ticketType = ticketType
    const itemContent = document.createElement('div')
    itemContent.className = 'item-content'
    const title = `TICK-${ticketId.padStart(4, '0')} [${
      ticketType === 'Bug' ? 'BUG' : 'FEAT'
    }]`
    const description =
      ticketType === 'Bug' ? makeBugFlavour() : makeFeatFlavour()
    itemContent.innerHTML = `<strong>${title}</strong><br>${description}`
    item.appendChild(itemContent)

    const newItem = backCol.add(item, { index: -1, active: false })
    const mitem = backCol.getItem(-1)
    backCol.show([mitem])

    if (ticketType === 'Bug') {
      activeBugs.add(ticketId)
    }
  }

  const startTask = () => {
    const todoCol = allGrids[1]
    const workCol = allGrids[2]
    const ix = todoCol.getItem(0) === floatingItem ? 1 : 0
    const item = todoCol.getItem(ix)
    if (!item) return
    todoCol.send(item, workCol, -1)
    return item
  }

  const completeMyTask = (mitem) => {
    const workCol = allGrids[2]
    const doneCol = allGrids[3]
    if (!mitem) return
    const ticketId = mitem.getElement().dataset.ticketId
    const ticketType = mitem.getElement().dataset.ticketType
    if (ticketType === 'Bug') {
      activeBugs.delete(ticketId)
    } else {
      addedFeatures.add(ticketId)
    }
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
  }, 250)

  const doWork = () => {
    const task = startTask()
    if (task) {
      setTimeout(() => {
        completeMyTask(task)
        setTimeout(doWork, 500 + Math.random() * 1000)
      }, 8000 + Math.random() * 4000)
    } else {
      // recheck
      setTimeout(doWork, 500 + Math.random() * 1000)
    }
  }

  doWork()
  doWork()

  const bugsCounter = document.querySelector('#num-bugs')
  const featCounter = document.querySelector('#num-feat')
  setInterval(() => {
    bugsCounter.textContent = `${activeBugs.size}`
    featCounter.textContent = `${addedFeatures.size}`
  }, 1000)

  createTask()
  createTask()
  createTask()
  createTask()
  createTask()
  bugsCounter.textContent = `${activeBugs.size}`
  featCounter.textContent = `${addedFeatures.size}`
})
