const slider = document.getElementById('gridSize');
const resetButton = document.getElementById('resetButton');
const gridContainer = document.getElementById('gridContainer');
const gridValue = document.getElementById('gridValue');
const gridValue2 = document.getElementById('gridValue2');
const GRID_DIM = 8;
const GRID_PX_DIM = 600;
const SCALE = GRID_PX_DIM / GRID_DIM;

const svgNS = "http://www.w3.org/2000/svg";
const svg = document.getElementById("grid");
const points = [];

let gridDensity = slider.value;
let cellSize = GRID_PX_DIM / gridDensity;
let previewDot;
let previewArrow;
let polygonComplete = false;

function createGrid(gridSize) {
    svg.innerHTML = '';
    previewDot = null;
    let cellSize = GRID_PX_DIM / gridSize;
    for (let i = 0; i <= gridSize; i++) {
        const hLine = document.createElementNS(svgNS, "line");
        hLine.setAttribute("x1", 0);
        hLine.setAttribute("y1", i * cellSize);
        hLine.setAttribute("x2", gridSize * cellSize);
        hLine.setAttribute("y2", i * cellSize);
        hLine.setAttribute("stroke", "#ddd");

        svg.appendChild(hLine);

        const vLine = document.createElementNS(svgNS, "line");
        vLine.setAttribute("x1", i * cellSize);
        vLine.setAttribute("y1", 0);
        vLine.setAttribute("x2", i * cellSize);
        vLine.setAttribute("y2", gridSize * cellSize);
        vLine.setAttribute("stroke", "#ddd");
        svg.appendChild(vLine);
    }
    drawPoints()
}

function clearAll() {
    [...svg.querySelectorAll(".drawn")].forEach(el => el.remove());
}

function drawPoints() {
    clearAll();
    for (let i = 0; i < points.length; i++) {
        const [x, y] = points[i];
        const cx = x * SCALE;
        const cy = y * SCALE;

        const dot = document.createElementNS(svgNS, "circle");
        dot.setAttribute("cx", cx);
        dot.setAttribute("cy", cy);
        dot.setAttribute("r", 5);
        dot.setAttribute("fill", "black");
        dot.classList.add("drawn");
        svg.appendChild(dot);

        if (i > 0) {
            const [x0, y0] = points[i - 1];
            const line = document.createElementNS(svgNS, "line");
            line.setAttribute("x1", x0 * SCALE);
            line.setAttribute("y1", y0 * SCALE);
            line.setAttribute("x2", cx);
            line.setAttribute("y2", cy);
            line.setAttribute("stroke", "blue");
            line.setAttribute("stroke-width", 2);
            line.classList.add("drawn");
            svg.appendChild(line);
        }
    }
}

slider.addEventListener('input', () => {
    gridDensity = 2**(slider.value-1);
    cellSize = GRID_PX_DIM / gridDensity;
    gridValue.textContent = gridDensity;
    createGrid(GRID_DIM * gridDensity);
});

resetButton.addEventListener("click", () => {
    
    previewDot = null;
    points = [];
    clearAll();
})

svg.addEventListener("click", e => {
    if (polygonComplete) return;
    const rect = svg.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left) *GRID_DIM / cellSize) / gridDensity;
    const y = Math.round((e.clientY - rect.top) *GRID_DIM / cellSize) / gridDensity;
    points.push([x, y]);
    if (JSON.stringify(points.at(0)) == JSON.stringify(points.at(-1)) && points.length > 1) {
        polygonComplete = true;
    }
    drawPoints();
    console.log(polygonComplete);
});

svg.addEventListener("mousemove", e => {
    if (polygonComplete) return;
    const rect = svg.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left) * GRID_DIM / cellSize) / gridDensity;
    const y = Math.round((e.clientY - rect.top) * GRID_DIM / cellSize) / gridDensity;

    const cx = x * SCALE;
    const cy = y * SCALE;
    if (!previewDot) {
        previewDot = document.createElementNS(svgNS, "circle");
        previewDot.setAttribute("r", 4);
        previewDot.setAttribute("fill", "gray");
        previewDot.classList.add("preview-dot");  // <-- use a unique class
        svg.appendChild(previewDot);
    }

    previewDot.setAttribute("cx", cx);
    previewDot.setAttribute("cy", cy);

    if (points.length > 0) {
        if (!previewArrow) {
            previewArrow = document.createElementNS(svgNS, "line");
            previewArrow.classList.add("preview-dot");
            previewArrow.classList.add("arrow");
            previewArrow.setAttribute("id", "preview-arrow")
            svg.appendChild(previewArrow);
        }

        const [x0, y0] = points.at(-1); 
        previewArrow.setAttribute("x1", x0 * SCALE);
        previewArrow.setAttribute("y1", y0 * SCALE);
        previewArrow.setAttribute("x2", cx);
        previewArrow.setAttribute("y2", cy);
    } else if (previewArrow) {
        // Hide the arrow if there's no previous point
        previewArrow.remove();
        previewArrow = null;
    }
});

// Initial grid
createGrid(GRID_DIM * gridDensity);
