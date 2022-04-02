window.addEventListener('load', () => {
  const cols = [].slice.call(document.querySelectorAll('.column'))
  cols.forEach((col) => new Muuri(col, { dragEnabled: true }))
})
