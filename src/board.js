import 'web-animations-js'
import Muuri from 'muuri'

const elems = {
  backlog: '#col-backlog',
  todo: '#col-todo',
  progress: '#col-progress',
  done: '#col-done',
}

const allBoards = []
export const board = {
  backlog: null,
  todo: null,
  progress: null,
  done: null,
}

const dragSorts = {
  backlog: () => [board.backlog, board.todo], // reorder backlog, move to todo
  todo: () => [board.todo, board.backlog], // reorder todo, back to backlog
  progress: () => [board.progress], // reorder doing, no moving
  done: false,
}

let itemBeingDragged
export const getItemBeingDragged = () => itemBeingDragged

export const refreshBoard = () => {
  allBoards.forEach((grid) => {
    grid.refreshItems()
    grid.layout()
  })
}

export const firstAvailableItem = (col) => {
  const firstTicket = col.getItem(0)
  return firstTicket !== getItemBeingDragged() ? firstTicket : col.getItem(1)
}

const createDragContainer = () => {
  const dragContainer = document.createElement('div')
  dragContainer.style.position = 'fixed'
  dragContainer.style.left = '0px'
  dragContainer.style.top = '0px'
  dragContainer.style.zIndex = 1000
  document.body.appendChild(dragContainer)
  return dragContainer
}

export const setupBoard = () => {
  Object.entries(elems).forEach(([name, query], ix) => {
    const elem = document.querySelector(query)
    const grid = new Muuri(elem, {
      dragEnabled: query !== elems.done,
      dragContainer: createDragContainer(),
      dragSort: dragSorts[name],
      dragAutoScroll: {
        targets: [
          {
            element: window,
            priority: 0,
          },
          {
            element: elem.parentNode,
            priority: 1,
            axis: Muuri.AutoScroller.AXIS_Y,
          },
        ],
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
    board[name] = grid
    allBoards.push(grid)

    grid.on('dragStart', (item) => {
      itemBeingDragged = item
    })
    grid.on('dragEnd', () => {
      itemBeingDragged = null
    })
  })
}
