const svgNS = "http://www.w3.org/2000/svg";
const svg = document.getElementById("grid");
const slider = document.getElementById('gridSize');
const resetButton = document.getElementById('resetButton');
const gridContainer = document.getElementById('gridContainer');
const gridValue = document.getElementById('gridValue');
const gridValue2 = document.getElementById('gridValue2');
const GRID_DIM = 8;
const GRID_PX_DIM = 600;
const SCALE = GRID_PX_DIM / GRID_DIM;
const DOT_RADIUS = 8;
const PREVIEW_COLOR = "lightgrey";
const LEFT_BORDER = svg.getBoundingClientRect().left;
const TOP_BORDER = svg.getBoundingClientRect().top;


let points = [];

let gridDensity = slider.value;
let cellSize = GRID_PX_DIM / gridDensity;
let previewDot;
let previewArrow;
let polygonComplete = false;
let pointElements = []; // circles
let lineElements = [];  // lines
let permutation = [];


class TranslationSurface {
    static defaultEdgeColors = [
        "rgb(255, 0, 0)",
        "rgb(0, 0, 255)",
        "rgb(255, 166, 0)",
        "rgb(0, 255, 0)",
        "rgb(212, 0, 255)",
        "rgb(255, 255, 0)"
    ];
    constructor() {
        this.surfaceEdges = [];
        this.surfaceVertices = [];
        this.displayEdges = [];
        this.displayVertices = [];
        this.previewArrow = null;
        this.isComplete = false;
    }
    draw() {
        this.previewArrow?.draw();
        this.displayEdges.forEach(edge => edge.draw());
        this.displayVertices.forEach(vertex => vertex.draw());
        this.isComplete && this.shadePolygon();
    }

}

class SurfaceVertex {
    static id = 0;
    constructor() {
        this.id = SurfaceVertex.id++;
        this.color = "black";
        this.active = "true";
    }
}

class SurfaceEdge {
    static id = 0;
    constructor(dir) {
        this.id = SurfaceEdge.id++;
        this.head = null;
        this.tail = null;
        this.dir = dir;
        this.color = "grey";
        this.paired = "false";
    }
}

class PreviewArrow {
    constructor() {
        this.head = null;
        this.tail = null;
        this.linkedEdge = null;
    }
    setHead(p) {

        this.head = p;
    }
    setTail(p) {
        this.tail = p;
        this.linkedEdge = new DisplayEdge(this.tail, this.head);
    }
    draw(svgClass="preview") {
        this.head?.draw(svgClass="preview");
        console.log(this.linkedEdge?.string());
    }
    undraw() {
        console.log(this.tail)
        this.linkedEdge?.undraw();
        this.linkedEdge = null;
        this.head?.undraw();
    }
    output() {
        console.log(this.linkedEdge);
        this.linkedEdge?.output();
    }
}

class DisplayVertex {
    constructor([x, y]) {
        this.x = x;
        this.y = y;
        this.linkedVertex = null;
        this.svgVertex = null;
    }
    get coords() {
        return [this.x, this.y];
    }
    draw(color=this.linkedVertex?.color||PREVIEW_COLOR, svgClass="drawn") {
        const dot = document.createElementNS(svgNS, "circle");
        this.svgVertex = dot;
        dot.setAttribute("cx", this.x * SCALE);
        dot.setAttribute("cy", this.y * SCALE);
        dot.setAttribute("r", DOT_RADIUS);
        dot.setAttribute("fill", color);
        dot.classList.add(svgClass);
        svg.appendChild(dot);
    }
    undraw() {
        this.svgVertex?.remove();
        this.svgVertex = null;
    }
}

class DisplayEdge {
    // From two DisplayVertex
    constructor(tail, head) {
        this.tail = tail;
        this.head = head;
        this.linkedEdge = null;
        this.svgEdge = null;
    }
    get tailCoords() {
        return [this.tail.x, this.tail.y];
    }
    get headCoords() {
        return [this.head.x, this.head.y];
    }
    draw(color=this.linkedEdge?.color||PREVIEW_COLOR, svgClass="drawn") {
        const line = document.createElementNS(svgNS, "line");
        this.svgEdge = line
        line.setAttribute("x1", this.tail.x * SCALE);
        line.setAttribute("y1", this.tail.y * SCALE);
        line.setAttribute("x2", this.head.x * SCALE);
        line.setAttribute("y2", this.head.y * SCALE);
        line.setAttribute("stroke", color);
        line.classList.add(svgClass);
        svg.appendChild(line);
    }
    undraw() {
        this.svgEdge?.remove();
        this.svgEdge = null;
    }
    string() {
        return String([this.tail.x, this.tail.y, this.head.x, this.tail.y]);
    }
    output() {
        console.log(this.string());
    }
}


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
    drawPolygon()
}

function clearAll(svgClass) {
    [...svg.querySelectorAll("."+svgClass)].forEach(el => el.remove());
    pointElements = [];
    lineElements = [];
}

function drawPolygon() {
    clearAll();
    pointElements = [];
    lineElements = [];
    if (polygonComplete) {

        const pointString = points.map(p => `${p[0]*SCALE},${p[1]*SCALE}`).join(" ");
        const polygon = document.createElementNS(svgNS, "polygon");
        polygon.setAttribute("points", pointString);
        polygon.classList.add("drawn");
        polygon.setAttribute("fill", "lightgrey"); // or any color
        svg.appendChild(polygon);
    }

    // First, create and append all lines
    for (let i = 1; i < points.length; i++) {
        const [x0, y0] = points[i - 1];
        const [x1, y1] = points[i];
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", x0 * SCALE);
        line.setAttribute("y1", y0 * SCALE);
        line.setAttribute("x2", x1 * SCALE);
        line.setAttribute("y2", y1 * SCALE);
        line.setAttribute("stroke", "blue");
        line.classList.add("arrow", "drawn");
        svg.appendChild(line);
        lineElements.push(line);
    }

    // Then, create and append all dots
    for (let i = 0; i < points.length; i++) {
        const [x, y] = points[i];
        const dot = document.createElementNS(svgNS, "circle");
        dot.setAttribute("cx", x * SCALE);
        dot.setAttribute("cy", y * SCALE);
        dot.setAttribute("r", DOT_RADIUS);
        dot.setAttribute("fill", "black");
        dot.classList.add("drawn");
        svg.appendChild(dot);
        pointElements.push(dot);
    }
}


slider.addEventListener('input', () => {
    gridDensity = 2**(slider.value-1);
    cellSize = GRID_PX_DIM / gridDensity;
    gridValue.textContent = gridDensity;
    createGrid(GRID_DIM * gridDensity);
});

resetButton.addEventListener("click", () => {
    previewDot?.remove();
    previewArrow?.remove();
    previewDot = null;
    previewArrow = null;
    points = [];
    polygonComplete = false;
    clearAll();
})

function getCoords(e) {
    return [e.clientX - LEFT_BORDER, e.clientY - TOP_BORDER].map(
        p => Math.round(p * GRID_DIM / cellSize) / gridDensity
    );
}

// Click to add new point
svg.addEventListener("click", e => {
    if (surface.isComplete) return;
    const [x, y] = getCoords(e);
    points.push([x,y]);
    surface.displayVertices.push(new DisplayVertex([x, y]));
    if (JSON.stringify(points.at(0)) == JSON.stringify(points.at(-1)) && points.length > 1) {
        polygonComplete = true;
    }
    drawPolygon();
    console.log(polygonComplete);
});

svg.addEventListener("mousemove", e => {
    clearAll("preview");
    if (surface.isComplete) return;
    const [x, y] = getCoords(e);

    // const firstDrawn = svg.querySelector(".drawn");
    if (!surface.previewArrow) {
        surface.previewArrow = new PreviewArrow();
    }
    if (surface.displayVertices.length > 0) {
        surface.previewArrow.setTail(surface.displayVertices.at(-1));
    }
    if (!surface.previewArrow.head) {
        surface.previewArrow.setHead(new DisplayVertex([x, y]));
    }
    surface.previewArrow.output();
    surface.previewArrow.draw();
});

// Initial grid
createGrid(GRID_DIM * gridDensity);
const surface = new TranslationSurface();
