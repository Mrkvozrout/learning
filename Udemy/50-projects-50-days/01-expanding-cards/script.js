const panels = document.querySelectorAll('.panel')

panels.forEach(panel => {
  panel.addEventListener('click', () => {
    removeClass(panels, 'active')
    panel.classList.add('active')
  })
});

function removeClass(nodes, clazz) {
  nodes.forEach(node => {
    node.classList.remove(clazz)
  })
}
