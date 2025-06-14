const slider = document.getElementById('gridSize');
const gridContainer = document.getElementById('gridContainer');
const gridValue = document.getElementById('gridValue');
const gridValue2 = document.getElementById('gridValue2');

function createGrid(size) {
  gridContainer.innerHTML = ''; // clear existing cells
  gridContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  gridContainer.style.gridTemplateRows = `repeat(${size}, 1fr)`;

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement('div');
    gridContainer.appendChild(cell);
  }
}

slider.addEventListener('input', () => {
  const size = slider.value;
  gridValue.textContent = size;
  gridValue2.textContent = size;
  createGrid(size);
});

// Initial grid
createGrid(slider.value);
