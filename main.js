window.addEventListener('load', () => {
  const cols = [].slice.call(document.querySelectorAll('.column'))
  const allGrids = []
  cols.forEach((col, ix) => {
    const grid = new Muuri(col, { dragEnabled: true, dragSort: () => allGrids })
    allGrids.push(grid)
  })

  setInterval(() => {
    if (Math.random() < 0.75) return

    const todoCol = allGrids[0]
    const item = document.createElement('div')
    item.className = 'item'
    item.dataset.creationDate = Date.now()
    const itemContent = document.createElement('div')
    itemContent.className = 'item-content'
    itemContent.textContent = `Hello world! ${Date.now()}`
    item.appendChild(itemContent)

    const newItem = todoCol.add(item, { index: -1, active: false })
    todoCol.show([todoCol.getItem(-1)])
  }, 1000)

  setInterval(() => {
    if (Math.random() < 0.8) return

    const workCol = allGrids[1]
    const doneCol = allGrids[2]
    workCol.send(0, doneCol, 0)
  }, 500)
})
