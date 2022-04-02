window.addEventListener('load', () => {
  const cols = [].slice.call(document.querySelectorAll('.column'))
  const allGrids = []
  let floatingItem
  cols.forEach((col, ix) => {
    const grid = new Muuri(col, {
      dragEnabled: true,
      dragContainer: document.body,
      dragSort: () => allGrids,
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
    const backCol = allGrids[0]
    const item = document.createElement('div')
    item.className = 'item'
    item.dataset.creationDate = Date.now()
    const itemContent = document.createElement('div')
    itemContent.className = 'item-content'
    itemContent.textContent = `Hello world! This is a task created on ${Date.now()}`
    item.appendChild(itemContent)

    const newItem = backCol.add(item, { index: -1, active: false })
    backCol.show([backCol.getItem(-1)])
  }

  const startTask = () => {
    const todoCol = allGrids[1]
    const workCol = allGrids[2]
    const ix = todoCol.getItem(0) === floatingItem ? 1 : 0
    todoCol.send(ix, workCol, 0)
  }

  const completeTask = () => {
    const workCol = allGrids[2]
    const doneCol = allGrids[3]
    const ix = workCol.getItem(0) === floatingItem ? 1 : 0
    workCol.send(ix, doneCol, 0)
  }

  setInterval(() => {
    if (Math.random() < 0.9) return
    createTask()
  }, 350)

  setInterval(() => {
    if (Math.random() < 0.4) return
    completeTask()

    setTimeout(() => {
      startTask()
    }, 500)
  }, 2000)
})
