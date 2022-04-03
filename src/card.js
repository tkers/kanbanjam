export const createCard = ({ id, type, description, size }) => {
  const itemContent = document.createElement('div')
  itemContent.className = 'item-content'

  const typeIcon = type === 'Bug' ? '!' : type === 'Feature' ? '+' : '•'
  const typeCN = type === 'Bug' ? 'bug' : type === 'Feature' ? 'feat' : 'task'
  itemContent.innerHTML = `
    <p>
      <strong>LDJ-${id}</strong><br/>${description}
    </p>
    <div class="item-assignment"></div>
    <!-- <div class="item-number">tick-0000</div> -->
    <div class="item-type item-type-${typeCN}">${typeIcon}</div>
    <div class="item-complexity">${size}</div>`

  const item = document.createElement('div')
  item.className = 'item'
  item.dataset.ticketId = id
  item.appendChild(itemContent)

  return item
}

export const assignWorkerToCard = (card, worker) => {
  const as = card.querySelector('.item-assignment')
  as.textContent = worker.name
  as.style.backgroundColor = `hsl(${(worker.id * 80) % 360}, 78%, 42%)`
}
