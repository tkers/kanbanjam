window.addEventListener('load', () => {
  const cols = [].slice.call(document.querySelectorAll('.column'))
  const allGrids = []
  let floatingItem
  cols.forEach((col, ix) => {
    const grid = new Muuri(col, { dragEnabled: true, dragSort: () => allGrids })
    allGrids.push(grid)

    grid.on('dragStart', (item) => {
      floatingItem = item
    })
    grid.on('dragEnd', () => {
      floatingItem = null
    })
  })

  setInterval(() => {
    if (Math.random() < 0.9) return

    const backCol = allGrids[0]
    const item = document.createElement('div')
    item.className = 'item'
    item.dataset.creationDate = Date.now()
    const itemContent = document.createElement('div')
    itemContent.className = 'item-content'
    itemContent.textContent = `Hello world! ${Date.now()}`
    item.appendChild(itemContent)

    const newItem = backCol.add(item, { index: -1, active: false })
    backCol.show([backCol.getItem(-1)])
  }, 350)

  setInterval(() => {
    if (Math.random() < 0.4) return

    const workCol = allGrids[2]
    const doneCol = allGrids[3]

    const ix = workCol.getItem(0) === floatingItem ? 1 : 0
    workCol.send(ix, doneCol, 0)

    setTimeout(() => {
      const todoCol = allGrids[1]

      const ixnext = todoCol.getItem(0) === floatingItem ? 1 : 0
      todoCol.send(ixnext, workCol, 0)
    }, 500)
  }, 2000)
})
