window.addEventListener('load', () => {
  const cols = [].slice.call(document.querySelectorAll('.column'))
  const allGrids = []
  cols.forEach((col) => {
    const grid = new Muuri(col, { dragEnabled: true, dragSort: () => allGrids })
    allGrids.push(grid)
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
