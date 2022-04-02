window.addEventListener('load', () => {
  const cols = [].slice.call(document.querySelectorAll('.column'))
  const allGrids = []
  cols.forEach((col) => {
    const grid = new Muuri(col, { dragEnabled: true, dragSort: () => allGrids })
    allGrids.push(grid)
  })

  document.querySelector('#btn-todo').addEventListener('click', () => {
    const todoCol = allGrids[0]
    const item = document.createElement('div')
    item.className = 'item'
    const itemContent = document.createElement('div')
    itemContent.className = 'item-content'
    itemContent.textContent = `Hello world! ${Date.now()}`
    item.appendChild(itemContent)

    const newItem = todoCol.add(item, { index: -1, active: false })
    todoCol.show([todoCol.getItem(-1)])
  })

  document.querySelector('#btn-plan').addEventListener('click', () => {
    const todoCol = allGrids[0]
    const workCol = allGrids[1]

    todoCol.send(0, workCol, -1)
  })

  document.querySelector('#btn-work').addEventListener('click', () => {
    const workCol = allGrids[1]
    const doneCol = allGrids[2]

    workCol.send(0, doneCol, 0)
  })
})
